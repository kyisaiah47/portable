'use client';

import { useState } from 'react';
import { calculateStabilityScore, type Transaction } from '@/lib/income-parser';
import { classifyTransactions, buildIncomeResults, buildExpenseResults } from '@/lib/hybrid-classifier';
import { Upload, Download, Check, X, Loader2, Sparkles } from 'lucide-react';

export default function TestParserPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [results, setResults] = useState<any>(null);
  const [classifying, setClassifying] = useState(false);

  // Sample CSV data generator
  const generateSampleCSV = async () => {
    const res = await fetch('/sample-bank-statement.csv');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-bank-statement.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Parse CSV file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const parsedTransactions: Transaction[] = [];

      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [date, description, amount, type] = line.split(',');
        if (date && description && amount && type) {
          parsedTransactions.push({
            id: `demo-${i}`,
            date: new Date(date),
            description,
            amount: parseFloat(amount),
            type: type.trim() as 'credit' | 'debit',
          });
        }
      }

      setTransactions(parsedTransactions);
      setResults(null);
      setClassifying(true);

      try {
        // Hybrid pipeline: regex first pass (free), Claude for the remainder
        const { classifications, aiUsed, aiError, aiTransactionCount } =
          await classifyTransactions(parsedTransactions);
        const parsed = buildIncomeResults(parsedTransactions, classifications);
        const expenses = buildExpenseResults(parsedTransactions, classifications);
        const stability = calculateStabilityScore(parsed.income);

        setResults({
          parsed,
          expenses,
          stability,
          classifications,
          aiUsed,
          aiError,
          aiTransactionCount,
        });

        console.log('Test Parser Results (Not saved to database):', {
          totalIncome: parsed.totalIncome,
          platforms: parsed.byPlatform.size,
          deductions: expenses.totalDeductions,
          aiUsed,
          aiError,
          aiTransactionCount,
          stabilityScore: stability.score,
          stabilityRating: stability.rating,
        });
      } finally {
        setClassifying(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Income parser test</h1>
          <p className="text-slate-400">Upload a CSV bank statement to test the income parsing regex engine
          </p>
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This page is for testing the parser only. Results are not saved to database.
              Use the dashboard CSV upload to save your real transactions.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-slate-900 rounded-lg p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold mb-1">Upload bank statement</h2>
              <p className="text-sm text-slate-400">CSV format: Date, Description, Amount, Type</p>
            </div>
            <button
              onClick={generateSampleCSV}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 text-sm font-medium text-slate-300 hover:border-white/40 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Sample CSV</span>
            </button>
          </div>

          <label className="block cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="border border-dashed border-white/20 rounded-lg p-12 text-center hover:border-indigo-400 hover:bg-slate-800/60 transition-all">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-4" />
              <p className="text-sm font-medium text-white mb-1">Drop your CSV file here</p>
              <p className="text-sm text-slate-400">or click to browse</p>
            </div>
          </label>
        </div>

        {/* Classifying state */}
        {classifying && (
          <div className="bg-slate-900 rounded-lg p-8 border border-white/10 mb-8 flex items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span className="text-sm">Regex pass done — asking Claude about the unmatched transactions...</span>
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            {/* AI status banner */}
            {results.aiError ? (
              <div className="mb-8 p-3 bg-amber-500/10 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  AI classification unavailable ({results.aiError}) — showing regex-only results.
                </p>
              </div>
            ) : results.aiUsed ? (
              <div className="mb-8 p-3 bg-indigo-500/10/60 border border-indigo-100 rounded-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <p className="text-sm text-indigo-900">
                  Hybrid classification: regex matched the obvious hits for free, Claude classified the remaining{' '}
                  {results.aiTransactionCount} transaction{results.aiTransactionCount === 1 ? '' : 's'}.
                </p>
              </div>
            ) : null}

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 rounded-lg p-5 border border-white/10">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">Total gig income</div>
                <div className="text-3xl font-semibold tracking-tight text-white">
                  ${results.parsed.totalIncome.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {results.parsed.income.length} payments detected
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-5 border border-white/10">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">Platforms detected</div>
                <div className="text-3xl font-semibold tracking-tight text-white">
                  {results.parsed.byPlatform.size}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {Array.from(results.parsed.byPlatform.keys()).join(', ')}
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-5 border border-white/10">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">Stability score</div>
                <div className="text-3xl font-semibold tracking-tight text-white">
                  {results.stability.score}/100
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {results.stability.rating}
                </div>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="bg-slate-900 rounded-lg p-6 border border-white/10 mb-8">
              <h2 className="text-sm font-semibold text-white mb-4">Income by platform</h2>
              <div className="space-y-4">
                {Array.from(results.parsed.byPlatform.entries())
                  .map((entry) => {
                    const [platform, payments] = entry as [string, any[]];
                    return {
                      platform,
                      payments,
                      total: payments.reduce((sum: number, p: any) => sum + p.amount, 0),
                      count: payments.length,
                    };
                  })
                  .sort((a, b) => b.total - a.total)
                  .map(({ platform, total, count }) => (
                    <div key={platform} className="flex items-center justify-between py-3 px-1 border-b border-white/5 last:border-0 hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div>
                        <div className="text-sm font-medium text-white">{platform}</div>
                          <div className="text-xs text-slate-400">{count} payments</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          ${total.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          ${(total / count).toFixed(2)}/payment
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* All Transactions */}
            <div className="bg-slate-900 rounded-lg p-6 border border-white/10">
              <h2 className="text-sm font-semibold text-white mb-4">All parsed transactions</h2>
              <div className="space-y-2">
                {transactions.map((transaction) => {
                  const c = results.classifications.get(transaction.id);
                  const matched = c && c.kind !== 'none';

                  return (
                    <div
                      key={transaction.id}
                      className="py-3 px-1 border-b border-white/5 last:border-0 hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            matched
                              ? c.kind === 'income' ? 'bg-emerald-50' : 'bg-indigo-500/10'
                              : 'bg-slate-800'
                          }`}>
                            {matched ? (
                              <Check className={`w-3.5 h-3.5 ${c.kind === 'income' ? 'text-emerald-600' : 'text-indigo-400'}`} />
                            ) : (
                              <X className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-slate-400">
                              {transaction.date.toLocaleDateString()} • {transaction.type}
                              {matched && c.kind === 'income' && (
                                <span className="ml-2 text-emerald-700">
                                  → {c.platform} ({c.incomeCategory})
                                </span>
                              )}
                              {matched && c.kind === 'expense' && (
                                <span className="ml-2 text-indigo-700" title={c.rationale}>
                                  → {c.subcategory} ({c.deductionRate}% deductible)
                                </span>
                              )}
                              {matched && (
                                <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                                  c.source === 'ai'
                                    ? 'bg-indigo-500/10 text-indigo-700'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {c.source === 'ai' ? 'AI' : 'Pattern'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${
                          transaction.type === 'credit' ? 'text-emerald-700' : 'text-red-400'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '−'}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!results && (
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-lg p-12 border border-white/5 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-slate-400">Upload a CSV to see the magic happen</p>
          </div>
        )}
      </div>
    </div>
  );
}