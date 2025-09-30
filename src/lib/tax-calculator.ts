/**
 * Tax Calculator for Gig Workers
 *
 * Calculates federal income tax, self-employment tax, and state tax estimates
 * for independent contractors and gig workers.
 */

export interface TaxCalculation {
  // Income
  grossIncome: number;
  adjustedGrossIncome: number; // After deductions

  // Federal taxes
  federalIncomeTax: number;
  selfEmploymentTax: number;
  totalFederalTax: number;

  // State tax (estimate)
  stateTax: number;

  // Total
  totalTaxLiability: number;
  effectiveTaxRate: number;

  // Quarterly breakdown
  quarterlyPayment: number;

  // Breakdown by component
  breakdown: {
    socialSecurity: number; // 12.4%
    medicare: number; // 2.9%
    additionalMedicare: number; // 0.9% over $200k
    federalIncome: number;
    state: number;
  };
}

export interface QuarterlyDeadline {
  quarter: string;
  period: string;
  dueDate: Date;
  amount: number;
  isPast: boolean;
  isPaid: boolean;
}

/**
 * 2024 Tax Brackets (Single Filer)
 */
const FEDERAL_TAX_BRACKETS_2024 = [
  { rate: 0.10, min: 0, max: 11600 },
  { rate: 0.12, min: 11600, max: 47150 },
  { rate: 0.22, min: 47150, max: 100525 },
  { rate: 0.24, min: 100525, max: 191950 },
  { rate: 0.32, min: 191950, max: 243725 },
  { rate: 0.35, min: 243725, max: 609350 },
  { rate: 0.37, min: 609350, max: Infinity },
];

const STANDARD_DEDUCTION_2024 = 14600;
const SE_TAX_RATE = 0.153; // 15.3% (12.4% Social Security + 2.9% Medicare)
const SE_DEDUCTION_RATE = 0.9235; // 92.35% of net earnings subject to SE tax
const SE_DEDUCTION_FROM_AGI = 0.5; // Can deduct 50% of SE tax from AGI

/**
 * Calculate federal income tax using progressive brackets
 */
function calculateFederalIncomeTax(taxableIncome: number): number {
  let tax = 0;
  let previousMax = 0;

  for (const bracket of FEDERAL_TAX_BRACKETS_2024) {
    if (taxableIncome <= previousMax) break;

    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }

    previousMax = bracket.max;
  }

  return tax;
}

/**
 * Calculate self-employment tax
 */
function calculateSelfEmploymentTax(netEarnings: number): {
  total: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
} {
  // Only 92.35% of net earnings subject to SE tax
  const subjectToSETax = netEarnings * SE_DEDUCTION_RATE;

  // Social Security (12.4% up to $168,600 in 2024)
  const socialSecurityWageBase = 168600;
  const socialSecurityEarnings = Math.min(subjectToSETax, socialSecurityWageBase);
  const socialSecurity = socialSecurityEarnings * 0.124;

  // Medicare (2.9% on all earnings)
  const medicare = subjectToSETax * 0.029;

  // Additional Medicare (0.9% over $200,000)
  const additionalMedicareThreshold = 200000;
  const additionalMedicare = Math.max(0, subjectToSETax - additionalMedicareThreshold) * 0.009;

  return {
    total: socialSecurity + medicare + additionalMedicare,
    socialSecurity,
    medicare,
    additionalMedicare,
  };
}

/**
 * Calculate state tax (rough estimate, varies by state)
 * Using California's ~9.3% average as default
 */
function calculateStateTax(taxableIncome: number, stateRate: number = 0.093): number {
  return Math.max(0, taxableIncome - STANDARD_DEDUCTION_2024) * stateRate;
}

/**
 * Main tax calculation function
 */
export function calculateTaxes(
  grossIncome: number,
  businessDeductions: number,
  stateRate: number = 0.093 // Default to CA rate
): TaxCalculation {
  // Calculate net earnings (gross income - business deductions)
  const netEarnings = Math.max(0, grossIncome - businessDeductions);

  // Calculate self-employment tax
  const seTax = calculateSelfEmploymentTax(netEarnings);

  // Calculate AGI (net earnings - 50% of SE tax - standard deduction)
  const deductibleSETax = seTax.total * SE_DEDUCTION_FROM_AGI;
  const agi = netEarnings - deductibleSETax;
  const taxableIncome = Math.max(0, agi - STANDARD_DEDUCTION_2024);

  // Calculate federal income tax
  const federalIncomeTax = calculateFederalIncomeTax(taxableIncome);

  // Calculate state tax
  const stateTax = calculateStateTax(agi, stateRate);

  // Total tax liability
  const totalTaxLiability = federalIncomeTax + seTax.total + stateTax;

  // Effective tax rate
  const effectiveTaxRate = grossIncome > 0 ? totalTaxLiability / grossIncome : 0;

  // Quarterly payment (divide by 4)
  const quarterlyPayment = totalTaxLiability / 4;

  return {
    grossIncome,
    adjustedGrossIncome: agi,
    federalIncomeTax,
    selfEmploymentTax: seTax.total,
    totalFederalTax: federalIncomeTax + seTax.total,
    stateTax,
    totalTaxLiability,
    effectiveTaxRate,
    quarterlyPayment,
    breakdown: {
      socialSecurity: seTax.socialSecurity,
      medicare: seTax.medicare,
      additionalMedicare: seTax.additionalMedicare,
      federalIncome: federalIncomeTax,
      state: stateTax,
    },
  };
}

/**
 * Get quarterly tax deadlines for current year
 */
export function getQuarterlyDeadlines(year: number, estimatedQuarterlyPayment: number): QuarterlyDeadline[] {
  const now = new Date();

  return [
    {
      quarter: 'Q1',
      period: 'Jan 1 - Mar 31',
      dueDate: new Date(year, 3, 15), // April 15
      amount: estimatedQuarterlyPayment,
      isPast: now > new Date(year, 3, 15),
      isPaid: false, // TODO: Track payment status
    },
    {
      quarter: 'Q2',
      period: 'Apr 1 - May 31',
      dueDate: new Date(year, 5, 15), // June 15
      amount: estimatedQuarterlyPayment,
      isPast: now > new Date(year, 5, 15),
      isPaid: false,
    },
    {
      quarter: 'Q3',
      period: 'Jun 1 - Aug 31',
      dueDate: new Date(year, 8, 15), // Sept 15
      amount: estimatedQuarterlyPayment,
      isPast: now > new Date(year, 8, 15),
      isPaid: false,
    },
    {
      quarter: 'Q4',
      period: 'Sep 1 - Dec 31',
      dueDate: new Date(year + 1, 0, 15), // Jan 15 next year
      amount: estimatedQuarterlyPayment,
      isPast: now > new Date(year + 1, 0, 15),
      isPaid: false,
    },
  ];
}

/**
 * Generate IRS payment voucher text (Form 1040-ES)
 */
export function generatePaymentVoucher(
  quarter: string,
  amount: number,
  taxpayerName: string,
  ssn: string,
  address: string
): string {
  return `
ESTIMATED TAX PAYMENT VOUCHER
Form 1040-ES, ${quarter} ${new Date().getFullYear()}

Amount of Payment: $${amount.toFixed(2)}

Name: ${taxpayerName}
Social Security Number: ${ssn}
Address: ${address}

Make check payable to: United States Treasury
Write your SSN and "${quarter} ${new Date().getFullYear()}" on your check

Mail to:
Internal Revenue Service
P.O. Box 931000
Louisville, KY 40293-1000

Payment Due: See quarterly deadline
  `.trim();
}

/**
 * Calculate estimated annual tax from partial year data
 */
export function projectAnnualTax(
  incomeToDate: number,
  expensesToDate: number,
  startDate: Date,
  endDate: Date
): TaxCalculation {
  const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysInYear = 365;

  const annualizationFactor = daysInYear / daysInPeriod;

  const projectedAnnualIncome = incomeToDate * annualizationFactor;
  const projectedAnnualExpenses = expensesToDate * annualizationFactor;

  return calculateTaxes(projectedAnnualIncome, projectedAnnualExpenses);
}