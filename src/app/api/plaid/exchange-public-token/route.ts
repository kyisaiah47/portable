import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { public_token, userId } = await request.json();

    if (!public_token || !userId) {
      return NextResponse.json(
        { error: 'Public token and user ID required' },
        { status: 400 }
      );
    }

    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = response.data;

    // Get institution info
    const itemResponse = await plaidClient.itemGet({
      access_token,
    });

    const institutionId = itemResponse.data.item.institution_id;
    let institutionName = null;

    if (institutionId) {
      const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: ['US'] as any,
      });
      institutionName = institutionResponse.data.institution.name;
    }

    // Store access token in Supabase
    const { data, error } = await supabase
      .from('plaid_items')
      .insert({
        user_id: userId,
        plaid_item_id: item_id,
        plaid_access_token: access_token,
        institution_name: institutionName,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing Plaid item:', error);
      return NextResponse.json(
        { error: 'Failed to store bank connection' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      item_id: data.id,
      institution_name: institutionName,
    });
  } catch (error: any) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to exchange token' },
      { status: 500 }
    );
  }
}
