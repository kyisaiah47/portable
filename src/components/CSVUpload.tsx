'use client';

import { useState } from 'react';
import { Upload, Download, Check, X, Loader2 } from 'lucide-react';
import { parseTransactions, calculateStabilityScore, type Transaction } from '@/lib/income-parser';
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
  const generateSampleCSV = () => {
    const csv = `Date,Description,Amount,Type
2024-06-01,UBER DRIVER PARTNER PAYMENT,450.25,credit
2024-06-08,UBER BV WEEKLY EARNINGS,520.50,credit
2024-06-15,Uber Technologies Inc,480.75,credit
2024-06-22,UBER TRIP EARNINGS WEEKLY,495.00,credit
2024-06-03,DOORDASH DASHER PAYMENT,320.50,credit
2024-06-10,DoorDash Weekly Payment,285.75,credit
2024-06-17,DD DRIVER WEEKLY DEPOSIT,310.00,credit
2024-06-24,DOORDASH INC PAYMENT,295.50,credit
2024-06-05,UPWORK FREELANCE PAYMENT,850.00,credit
2024-06-19,Upwork Project Payment,1200.00,credit
2024-06-12,FIVERR INC WITHDRAWAL,450.00,credit
2024-06-21,GOOGLE ADSENSE PAYMENT,680.50,credit
2024-06-07,AIRBNB PAYOUT,750.00,credit
2024-06-20,Air BnB Host Payment,820.00,credit`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-bank-statement.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Parse and save CSV
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const parsedTransactions: Transaction[] = [];

      // Parse CSV (skip header)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [date, description, amount, type] = line.split(',');
        if (date && description && amount && type) {
          parsedTransactions.push({
            id: `csv-${userId}-${i}`,
            date: new Date(date),
            description,
            amount: parseFloat(amount),
            type: type.trim() as 'credit' | 'debit',
          });
        }
      }

      // Parse income from transactions
      const parsed = parseTransactions(parsedTransactions);
      const stability = calculateStabilityScore(parsed.income);

      // Save transactions to database
      const transactionsToInsert = parsedTransactions.map((tx) => ({
        id: tx.id,
        user_id: userId,
        account_id: 'csv-upload',
        date: tx.date.toISOString(),
        name: tx.description,
        amount: tx.type === 'credit' ? tx.amount : -tx.amount,
        category: null,
        pending: false,
        iso_currency_code: 'USD',
      }));

      const { error: txError } = await supabase
        .from('portable_transactions')
        .upsert(transactionsToInsert, { onConflict: 'id' });

      if (txError) throw txError;

      // Save parsed income to database
      const incomeData = parsed.income.map((item) => ({
        date: item.date.toISOString(),
        amount: item.amount,
        platform: item.platform,
      }));

      const platforms = Object.fromEntries(
        Array.from(parsed.byPlatform.entries()).map(([platform, payments]) => [
          platform,
          (payments as any[]).reduce((sum, p) => sum + p.amount, 0),
        ])
      );

      // Calculate weekly average and variability
      const weeklyAverage = parsed.totalIncome / 4; // Assuming 4 weeks
      const variability = Math.round((1 - stability.score / 100) * 100);

      const { error: incomeError } = await supabase
        .from('portable_parsed_income')
        .upsert({
          user_id: userId,
          total_income: parsed.totalIncome,
          start_date: parsed.startDate?.toISOString() || new Date().toISOString(),
          end_date: parsed.endDate?.toISOString() || new Date().toISOString(),
          platforms,
          stability_score: stability.score,
          stability_rating: stability.rating,
          weekly_average: weeklyAverage,
          variability: variability,
          income_data: incomeData,
        }, { onConflict: 'user_id' });

      if (incomeError) throw incomeError;

      // Clear all caches so data will be refetched
      clearAllCaches(userId);

      setResults({
        totalIncome: parsed.totalIncome,
        platforms: parsed.byPlatform.size,
        transactions: parsedTransactions.length,
        stabilityScore: stability.score,
        stabilityRating: stability.rating,
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
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-space-grotesk">Upload Bank Statement</h3>
            <p className="text-sm text-slate-400">CSV format: Date, Description, Amount, Type</p>
          </div>
          <button
            onClick={generateSampleCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Sample CSV</span>
          </button>
        </div>

        <label className="block cursor-pointer">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            uploading
              ? 'border-blue-500/50 bg-blue-500/5'
              : 'border-white/20 hover:border-blue-500/50 hover:bg-slate-800/50'
          }`}>
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
                <p className="text-lg font-semibold text-white">Processing your data...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-white mb-1">Drop CSV here or click to browse</p>
                <p className="text-sm text-slate-400">Supports standard bank export formats</p>
              </>
            )}
          </div>
        </label>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Success Results */}
      {results && (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-lg p-6 border border-green-500/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-space-grotesk mb-1">Upload Successful!</h3>
              <p className="text-sm text-slate-300">Your transactions have been processed and saved.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <div className="text-xs text-green-400 mb-1">Total Income</div>
              <div className="text-xl font-bold text-white">${results.totalIncome.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-green-400 mb-1">Platforms</div>
              <div className="text-xl font-bold text-white">{results.platforms}</div>
            </div>
            <div>
              <div className="text-xs text-green-400 mb-1">Transactions</div>
              <div className="text-xl font-bold text-white">{results.transactions}</div>
            </div>
            <div>
              <div className="text-xs text-green-400 mb-1">Stability</div>
              <div className="text-xl font-bold text-white">{results.stabilityScore}/100</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
