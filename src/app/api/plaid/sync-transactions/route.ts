import { NextRequest, NextResponse } from 'next/server';
import { plaidClient, PLAID_ENABLED } from '@/lib/plaid';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Check if Plaid is enabled
    if (!PLAID_ENABLED || !plaidClient) {
      return NextResponse.json(
        { error: 'Plaid integration is not configured' },
        { status: 503 }
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get all Plaid items for user
    const { data: items, error: itemsError } = await supabase
      .from('portable_plaid_items')
      .select('*')
      .eq('user_id', userId);

    if (itemsError || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'No bank connections found' },
        { status: 404 }
      );
    }

    let totalAdded = 0;
    let totalModified = 0;
    let totalRemoved = 0;

    // Sync transactions for each connected bank
    for (const item of items) {
      try {
        // Use Plaid Sync API for incremental updates
        let hasMore = true;
        let cursor = item.cursor || undefined;

        while (hasMore) {
          const response = await plaidClient.transactionsSync({
            access_token: item.plaid_access_token,
            cursor: cursor,
          });

          const { added, modified, removed, next_cursor, has_more } = response.data;

          // Insert new transactions
          if (added.length > 0) {
            const transactionsToInsert = added.map((tx: any) => ({
              user_id: userId,
              plaid_transaction_id: tx.transaction_id,
              plaid_item_id: item.id,
              account_id: tx.account_id,
              date: tx.date,
              amount: tx.amount,
              name: tx.name,
              merchant_name: tx.merchant_name || null,
              category: tx.category || null,
              pending: tx.pending,
            }));

            const { error } = await supabase
              .from('portable_transactions')
              .upsert(transactionsToInsert, {
                onConflict: 'plaid_transaction_id',
                ignoreDuplicates: false,
              });

            if (error) {
              console.error('Error inserting transactions:', error);
            } else {
              totalAdded += added.length;
            }
          }

          // Update modified transactions
          if (modified.length > 0) {
            for (const tx of modified) {
              await supabase
                .from('portable_transactions')
                .update({
                  amount: tx.amount,
                  name: tx.name,
                  merchant_name: tx.merchant_name || null,
                  category: tx.category || null,
                  pending: tx.pending,
                })
                .eq('plaid_transaction_id', tx.transaction_id);
            }
            totalModified += modified.length;
          }

          // Delete removed transactions
          if (removed.length > 0) {
            const removedIds = removed.map((tx: any) => tx.transaction_id);
            await supabase
              .from('portable_transactions')
              .delete()
              .in('plaid_transaction_id', removedIds);
            totalRemoved += removed.length;
          }

          // Update cursor
          cursor = next_cursor;
          hasMore = has_more;

          // Update stored cursor
          await supabase
            .from('portable_plaid_items')
            .update({ cursor: next_cursor })
            .eq('id', item.id);
        }
      } catch (error: any) {
        console.error(`Error syncing transactions for item ${item.id}:`, error);
        // Continue with other items even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      added: totalAdded,
      modified: totalModified,
      removed: totalRemoved,
    });
  } catch (error: any) {
    console.error('Error syncing transactions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync transactions' },
      { status: 500 }
    );
  }
}
