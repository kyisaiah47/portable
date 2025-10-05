import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

// Plaid is optional - only needed for bank connections
const plaidEnabled = !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

export const plaidClient = plaidEnabled ? new PlaidApi(configuration) : null;

// Plaid configuration constants
export const PLAID_PRODUCTS = [Products.Transactions] as const;
export const PLAID_COUNTRY_CODES = [CountryCode.Us] as const;
export const PLAID_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const PLAID_ENABLED = plaidEnabled;
