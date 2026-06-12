'use client';

/**
 * AI quarterly tax summary — plain-English narration of the tax calculator's
 * numbers (what you owe, why, what to set aside). All math is done by
 * tax-calculator.ts; Claude only writes the words.
 */

import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import type { TaxCalculation, QuarterlyDeadline } from '@/lib/tax-calculator';

interface AITaxSummaryProps {
  taxCalc: TaxCalculation;
  totalDeductions: number;
  deadlines: QuarterlyDeadline[];
  platforms: string[];
  deductionsByCategory: Record<string, number>;
}

export default function AITaxSummary({
  taxCalc,
  totalDeductions,
  deadlines,
  platforms,
  deductionsByCategory,
}: AITaxSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextDeadline = deadlines.find((d) => !d.isPast) || null;
      const res = await fetch('/api/tax-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grossIncome: taxCalc.grossIncome,
          totalDeductions,
          adjustedGrossIncome: taxCalc.adjustedGrossIncome,
          federalIncomeTax: taxCalc.federalIncomeTax,
          selfEmploymentTax: taxCalc.selfEmploymentTax,
          socialSecurity: taxCalc.breakdown.socialSecurity,
          medicare: taxCalc.breakdown.medicare,
          stateTax: taxCalc.stateTax,
          totalTaxLiability: taxCalc.totalTaxLiability,
          effectiveTaxRate: taxCalc.effectiveTaxRate,
          quarterlyPayment: taxCalc.quarterlyPayment,
          nextDeadline: nextDeadline
            ? {
                quarter: nextDeadline.quarter,
                dueDate: nextDeadline.dueDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }),
              }
            : null,
          platforms,
          deductionsByCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      // The component renders plain paragraphs; strip any markdown bold the
      // model sneaks in so literal asterisks never reach the UI.
      setSummary(typeof data.summary === 'string' ? data.summary.replace(/\*\*/g, '') : data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a summary right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">
            Your taxes, in plain English
          </h2>
        </div>
        {summary && !loading && (
          <button
            onClick={generate}
            title="Regenerate"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md text-gray-500 border border-gray-200 bg-white hover:text-gray-900 hover:border-gray-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {!summary && !loading && !error && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Get an AI-written breakdown of what you owe, why, and exactly how much to set aside
            from every payout.
          </p>
          <button
            onClick={generate}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate summary</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-3 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span className="text-sm">Writing your summary from the computed numbers…</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700 mb-2">{error}</p>
          <button
            onClick={generate}
            className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-md hover:border-gray-300 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {summary && !loading && (
        <div className="space-y-3">
          {summary.split(/\n\s*\n/).map((paragraph, idx) => (
            <p key={idx} className="text-sm text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
