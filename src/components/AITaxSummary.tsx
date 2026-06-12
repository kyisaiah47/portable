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
    <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-lg p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white font-space-grotesk">
            Your taxes, in plain English
          </h2>
        </div>
        {summary && !loading && (
          <button
            onClick={generate}
            title="Regenerate"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {!summary && !loading && !error && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            Get an AI-written breakdown of what you owe, why, and exactly how much to set aside
            from every payout.
          </p>
          <button
            onClick={generate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate summary</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-4 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          <span className="text-sm">Writing your summary from the computed numbers...</span>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400 mb-3">{error}</p>
          <button
            onClick={generate}
            className="text-xs font-semibold text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {summary && !loading && (
        <div className="space-y-3">
          {summary.split(/\n\s*\n/).map((paragraph, idx) => (
            <p key={idx} className="text-sm text-slate-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
