import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhook_type, webhook_code, item_id } = body;

    console.log('Plaid webhook received:', { webhook_type, webhook_code, item_id });

    // Handle different webhook types
    switch (webhook_type) {
      case 'TRANSACTIONS':
        await handleTransactionsWebhook(webhook_code, item_id);
        break;

      case 'ITEM':
        await handleItemWebhook(webhook_code, item_id);
        break;

      default:
        console.log(`Unhandled webhook type: ${webhook_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Plaid webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleTransactionsWebhook(code: string, itemId: string) {
  switch (code) {
    case 'SYNC_UPDATES_AVAILABLE':
      // Trigger transaction sync
      console.log(`Transaction sync needed for item: ${itemId}`);

      // Get the plaid_item record
      const { data: plaidItem } = await supabase
        .from('portable_plaid_items')
        .select('user_id')
        .eq('plaid_item_id', itemId)
        .single();

      if (plaidItem) {
        // Could trigger a background job here to sync transactions
        console.log(`Sync needed for user: ${plaidItem.user_id}`);
      }
      break;

    default:
      console.log(`Unhandled TRANSACTIONS webhook: ${code}`);
  }
}

async function handleItemWebhook(code: string, itemId: string) {
  switch (code) {
    case 'ERROR':
      // Item needs to be re-linked
      console.log(`Item error for: ${itemId}`);

      await supabase
        .from('portable_plaid_items')
        .update({
          // Add an error flag or status column in future
        })
        .eq('plaid_item_id', itemId);
      break;

    case 'PENDING_EXPIRATION':
      // Access token will expire soon
      console.log(`Token expiring soon for: ${itemId}`);
      break;

    default:
      console.log(`Unhandled ITEM webhook: ${code}`);
  }
}
