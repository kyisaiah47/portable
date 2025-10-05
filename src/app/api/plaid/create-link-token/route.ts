import { NextRequest, NextResponse } from 'next/server';
import { plaidClient, PLAID_PRODUCTS, PLAID_COUNTRY_CODES, PLAID_ENABLED } from '@/lib/plaid';
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

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('portable_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create Plaid Link token
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Portable',
      products: PLAID_PRODUCTS as any,
      country_codes: PLAID_COUNTRY_CODES as any,
      language: 'en',
    });

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error: any) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create link token' },
      { status: 500 }
    );
  }
}
