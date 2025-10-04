import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

// Plaid configuration constants
export const PLAID_PRODUCTS = [Products.Transactions] as const;
export const PLAID_COUNTRY_CODES = [CountryCode.Us] as const;
export const PLAID_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL;
