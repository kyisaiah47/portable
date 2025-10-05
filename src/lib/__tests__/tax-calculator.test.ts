import { calculateTaxes, calculateSelfEmploymentTax, getQuarterlyDeadlines } from '../tax-calculator';

describe('Tax Calculator', () => {
  describe('calculateTaxes', () => {
    test('Example 1: $50,000 gross income, $5,000 deductions', () => {
      const result = calculateTaxes(50000, 5000);

      // Net earnings: $45,000
      // SE tax on 92.35% of $45,000 = $41,557.50 @ 15.3% = $6,358.30
      // Deductible SE tax: $6,358.30 * 50% = $3,179.15
      // AGI: $45,000 - $3,179.15 = $41,820.85
      // Taxable income: $41,820.85 - $14,600 = $27,220.85
      // Federal income tax:
      //   - First $11,600 @ 10% = $1,160
      //   - Remaining $15,620.85 @ 12% = $1,874.50
      //   - Total: $3,034.50

      expect(result.grossIncome).toBe(50000);
      expect(result.selfEmploymentTax).toBeCloseTo(6358.30, 0);
      expect(result.federalIncomeTax).toBeCloseTo(3034.50, 0);
      expect(result.totalFederalTax).toBeCloseTo(9392.80, 0);

      // Quarterly payment should be ~25-30% of gross
      expect(result.quarterlyPayment).toBeGreaterThan(2000);
      expect(result.quarterlyPayment).toBeLessThan(4000);

      // Effective rate should be 25-35% for gig workers
      expect(result.effectiveTaxRate).toBeGreaterThan(0.25);
      expect(result.effectiveTaxRate).toBeLessThan(0.40);
    });

    test('Example 2: $100,000 gross income, $10,000 deductions', () => {
      const result = calculateTaxes(100000, 10000);

      // Net earnings: $90,000
      // SE tax: ~$12,716
      // Federal income tax: ~$10,000
      // Total federal: ~$22,716
      // With state (CA 9.3%): ~$29,000 total

      expect(result.grossIncome).toBe(100000);
      expect(result.selfEmploymentTax).toBeCloseTo(12716, 0);
      expect(result.totalTaxLiability).toBeGreaterThan(25000);
      expect(result.totalTaxLiability).toBeLessThan(32000);
    });

    test('Example 3: Low income $20,000, $2,000 deductions', () => {
      const result = calculateTaxes(20000, 2000);

      // Net earnings: $18,000
      // SE tax: ~$2,544
      // After standard deduction, very low federal income tax

      expect(result.selfEmploymentTax).toBeCloseTo(2544, 0);
      expect(result.federalIncomeTax).toBeLessThan(500); // Should be very low
    });

    test('Breakdown components sum to total SE tax', () => {
      const result = calculateTaxes(50000, 5000);

      const totalBreakdown =
        result.breakdown.socialSecurity +
        result.breakdown.medicare +
        result.breakdown.additionalMedicare;

      expect(totalBreakdown).toBeCloseTo(result.selfEmploymentTax, 1);
    });
  });

  describe('Quarterly deadlines', () => {
    test('2025 deadlines are correct dates', () => {
      const deadlines = getQuarterlyDeadlines(2025, 1000);

      expect(deadlines).toHaveLength(4);
      expect(deadlines[0].dueDate.getMonth()).toBe(3); // April (0-indexed)
      expect(deadlines[0].dueDate.getDate()).toBe(15);
      expect(deadlines[1].dueDate.getMonth()).toBe(5); // June
      expect(deadlines[2].dueDate.getMonth()).toBe(8); // September
      expect(deadlines[3].dueDate.getMonth()).toBe(0); // January next year
    });
  });
});
