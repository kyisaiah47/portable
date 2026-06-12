'use client';

import { useState } from 'react';
import { Upload, Download, Check, X, Loader2 } from 'lucide-react';
import { calculateStabilityScore, type Transaction } from '@/lib/income-parser';
import { classifyTransactions, buildIncomeResults } from '@/lib/hybrid-classifier';
import { supabase } from '@/lib/supabase';
import { clearAllCaches } from '@/hooks/useSupabaseData';

interface CSVUploadProps {
  userId: string;
  onUploadComplete?: () => void;
}

export default function CSVUpload({ userId, onUploadComplete }: CSVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate sample CSV
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

  // Stable content hash so the same statement line always maps to the same
  // row — uploads accumulate and dedupe instead of overwriting each other.
  const contentId = (date: string, description: string, amount: string, type: string) => {
    const str = `${date}|${description}|${amount}|${type}`;
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return `csv-${userId}-${(h >>> 0).toString(36)}`;
  };

  // Parse and save CSV — supports selecting multiple statements at once.
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const parsedTransactions: Transaction[] = [];
      const seen = new Set<string>();
      for (const file of files) {
        const text = await file.text();
        const lines = text.split('\n');
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const [date, description, amount, type] = line.split(',');
          if (date && description && amount && type) {
            const id = contentId(date, description, amount, type.trim());
            if (seen.has(id)) continue;
            seen.add(id);
            parsedTransactions.push({
              id,
              date: new Date(date),
              description,
              amount: parseFloat(amount),
              type: type.trim() as 'credit' | 'debit',
            });
          }
        }
      }

      // Hybrid classification: regex first pass (free), Claude for the remainder
      const { classifications, aiError } = await classifyTransactions(parsedTransactions);
      if (aiError) {
        console.warn('AI classification unavailable, using pattern matching only:', aiError);
      }
      const parsed = buildIncomeResults(parsedTransactions, classifications);
      const stability = calculateStabilityScore(parsed.income);

      // Save transactions to database
      // Database expects: positive for income, negative for expenses
      const transactionsToInsert = parsedTransactions.map((tx) => ({
        user_id: userId,
        plaid_transaction_id: tx.id, // Use this field instead of id
        account_id: 'csv-upload',
        date: tx.date.toISOString().split('T')[0], // Format as date only
        name: tx.description,
        amount: tx.type === 'credit' ? Math.abs(tx.amount) : -Math.abs(tx.amount),
        category: null,
        pending: false,
        classification: classifications.get(tx.id) || null,
      }));

      const { error: txError } = await supabase
        .from('stub_transactions')
        .upsert(transactionsToInsert, { onConflict: 'plaid_transaction_id' });

      if (txError) throw txError;

      // Rebuild the summary from EVERY transaction this user has — statements
      // accumulate; the dashboard always reflects the union.
      const { data: allRows, error: allError } = await supabase
        .from('stub_transactions')
        .select('plaid_transaction_id, date, name, amount, classification')
        .eq('user_id', userId);
      if (allError) throw allError;

      const unionTx: Transaction[] = (allRows ?? []).map((r: any) => ({
        id: r.plaid_transaction_id,
        date: new Date(r.date),
        description: r.name,
        amount: Math.abs(r.amount),
        type: r.amount >= 0 ? ('credit' as const) : ('debit' as const),
      }));
      const unionCls = new Map(
        (allRows ?? [])
          .filter((r: any) => r.classification)
          .map((r: any) => [r.plaid_transaction_id, r.classification])
      );
      const parsedAll = buildIncomeResults(unionTx, unionCls as any);
      const stabilityAll = calculateStabilityScore(parsedAll.income);

      const byPlatformData = Object.fromEntries(
        Array.from(parsedAll.byPlatform.entries()).map(([platform, payments]) => [
          platform,
          (payments as any[]).reduce((sum, p) => sum + p.amount, 0),
        ])
      );

      // Weekly average over the real covered period (min 1 week)
      const spanMs =
        parsedAll.startDate && parsedAll.endDate
          ? parsedAll.endDate.getTime() - parsedAll.startDate.getTime()
          : 0;
      const weeks = Math.max(1, spanMs / (7 * 86_400_000));
      const weeklyAverage = parsedAll.totalIncome / weeks;
      const variability = Math.round((1 - stabilityAll.score / 100) * 100);

      const stabilityData = {
        score: stabilityAll.score,
        rating: stabilityAll.rating,
        weeklyAverage: weeklyAverage,
        variability: variability,
      };

      const { error: incomeError } = await supabase
        .from('stub_parsed_income')
        .upsert({
          user_id: userId,
          total_income: parsedAll.totalIncome,
          start_date: parsedAll.startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          end_date: parsedAll.endDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          by_platform: byPlatformData,
          stability: stabilityData,
        }, { onConflict: 'user_id' });

      if (incomeError) throw incomeError;

      // Results reflect the union, not just this upload
      const parsedForResults = parsedAll;
      const stabilityForResults = stabilityAll;

      // Clear all caches so data will be refetched
      clearAllCaches(userId);

      setResults({
        totalIncome: parsedForResults.totalIncome,
        platforms: parsedForResults.byPlatform.size,
        transactions: unionTx.length,
        stabilityScore: stabilityForResults.score,
        stabilityRating: stabilityForResults.rating,
      });

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload CSV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="bg-slate-900 rounded-lg border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Upload bank statement</h3>
            <p className="text-sm text-slate-400">CSV format: Date, Description, Amount, Type</p>
          </div>
          <button
            onClick={generateSampleCSV}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 text-sm font-medium text-slate-300 hover:border-white/40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Sample CSV</span>
          </button>
        </div>

        <label className="block cursor-pointer">
          <input
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className={`border border-dashed rounded-lg p-10 text-center transition-all ${
            uploading
              ? 'border-indigo-400/50 bg-indigo-500/10'
              : 'border-white/20 hover:border-indigo-400 hover:bg-slate-800/60'
          }`}>
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
                <p className="text-sm font-medium text-white">Processing your data…</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-white mb-1">Drop one or more CSVs here, or click to browse</p>
                <p className="text-sm text-slate-400">Supports standard bank export formats</p>
              </>
            )}
          </div>
        </label>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Success Results */}
      {results && (
        <div className="bg-slate-900 rounded-lg border border-white/10 p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Upload successful</h3>
              <p className="text-sm text-slate-400">Your transactions have been processed and saved.</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-700 rounded-md overflow-hidden border border-white/10">
            {[
              ['Total income', `$${results.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
              ['Platforms', String(results.platforms)],
              ['Transactions', String(results.transactions)],
              ['Stability', `${results.stabilityScore}/100`],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-900 p-3">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">{label}</dt>
                <dd className="text-lg font-semibold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
