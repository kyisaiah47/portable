'use client';

import { useState } from 'react';
import { parseTransactions, calculateStabilityScore, type Transaction } from '@/lib/income-parser';
import { Upload, Download, Check, X } from 'lucide-react';

export default function TestParserPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [results, setResults] = useState<any>(null);

  // Sample CSV data generator
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
2024-06-20,Air BnB Host Payment,820.00,credit
2024-06-02,SALARY DEPOSIT - ABC CORP,3500.00,credit
2024-06-05,GAS STATION PURCHASE,45.00,debit
2024-06-10,GROCERY STORE,120.50,debit`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-bank-statement.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Parse CSV file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
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
            id: `${i}`,
            date: new Date(date),
            description,
            amount: parseFloat(amount),
            type: type.trim() as 'credit' | 'debit',
          });
        }
      }

      setTransactions(parsedTransactions);

      // Parse transactions
      const parsed = parseTransactions(parsedTransactions);
      const stability = calculateStabilityScore(parsed.income);

      setResults({
        parsed,
        stability,
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-space-grotesk">
            Income Parser Test
          </h1>
          <p className="text-slate-400 text-lg">
            Upload a CSV bank statement to test the income parsing regex engine
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-8 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1 font-space-grotesk">Upload Bank Statement</h2>
              <p className="text-sm text-slate-400">CSV format: Date, Description, Amount, Type</p>
            </div>
            <button
              onClick={generateSampleCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
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
            <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-blue-500/50 hover:bg-slate-800/50 transition-all">
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Drop your CSV file here</p>
              <p className="text-sm text-slate-400">or click to browse</p>
            </div>
          </label>
        </div>

        {/* Results */}
        {results && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-lg p-6 border border-green-500/20">
                <div className="text-sm text-green-400 mb-2 font-semibold">Total Gig Income</div>
                <div className="text-4xl font-black text-white font-space-grotesk">
                  ${results.parsed.totalIncome.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {results.parsed.income.length} payments detected
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-lg p-6 border border-blue-500/20">
                <div className="text-sm text-blue-400 mb-2 font-semibold">Platforms Detected</div>
                <div className="text-4xl font-black text-white font-space-grotesk">
                  {results.parsed.byPlatform.size}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {Array.from(results.parsed.byPlatform.keys()).join(', ')}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-6 border border-purple-500/20">
                <div className="text-sm text-purple-400 mb-2 font-semibold">Stability Score</div>
                <div className="text-4xl font-black text-white font-space-grotesk">
                  {results.stability.score}/100
                </div>
                <div className="text-xs text-slate-400 mt-2 uppercase font-semibold">
                  {results.stability.rating}
                </div>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-8 border border-white/10 mb-8">
              <h2 className="text-xl font-bold mb-6 font-space-grotesk">Income by Platform</h2>
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
                    <div key={platform} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💰</span>
                        </div>
                        <div>
                          <div className="font-bold text-white">{platform}</div>
                          <div className="text-sm text-slate-400">{count} payments</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">
                          ${total.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400">
                          ${(total / count).toFixed(2)}/payment
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* All Transactions */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-8 border border-white/10">
              <h2 className="text-xl font-bold mb-6 font-space-grotesk">All Parsed Transactions</h2>
              <div className="space-y-2">
                {transactions.map((transaction) => {
                  const parsed = results.parsed.income.find((p: any) =>
                    p.date.getTime() === transaction.date.getTime() &&
                    p.amount === transaction.amount
                  );

                  return (
                    <div
                      key={transaction.id}
                      className={`p-4 rounded-lg border ${
                        parsed
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-slate-800/30 border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            parsed
                              ? 'bg-green-500/20'
                              : 'bg-slate-700/50'
                          }`}>
                            {parsed ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <X className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-slate-400">
                              {transaction.date.toLocaleDateString()} • {transaction.type}
                              {parsed && (
                                <span className="ml-2 text-green-400">
                                  → {parsed.platform} ({parsed.category})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${
                          transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
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