'use client';

import * as React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Eye, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buildExpensesFromTransactions } from '@/lib/hybrid-classifier';
import { calculateTaxes, projectAnnualTax } from '@/lib/tax-calculator';

interface Insight {
	kind: 'opportunity' | 'risk' | 'pattern';
	title: string;
	body: string;
}
interface Analysis {
	headline: string;
	insights: Insight[];
}

const KIND_META = {
	opportunity: { icon: TrendingUp, cls: 'border-emerald-400/40 text-emerald-300', label: 'Opportunity' },
	risk: { icon: AlertTriangle, cls: 'border-red-400/40 text-red-300', label: 'Risk' },
	pattern: { icon: Eye, cls: 'border-blue-400/40 text-blue-300', label: 'Pattern' },
} as const;

function buildStats(parsedIncome: any) {
	const income: Array<{ date: Date | string; amount: number; platform: string }> =
		parsedIncome.parsed.income || [];
	const raw = parsedIncome.rawTransactions || [];
	const totalIncome = parsedIncome.parsed.totalIncome || 0;
	const expenseResults = buildExpensesFromTransactions(raw);
	const taxCalc =
		parsedIncome.parsed.startDate && parsedIncome.parsed.endDate
			? projectAnnualTax(totalIncome, expenseResults.totalDeductions, parsedIncome.parsed.startDate, parsedIncome.parsed.endDate)
			: calculateTaxes(totalIncome, expenseResults.totalDeductions);

	const byPlatform: Record<string, { total: number; count: number; sharePct: number }> = {};
	for (const [p, d] of (parsedIncome.parsed.byPlatform ?? new Map()).entries()) {
		byPlatform[p] = {
			total: Math.round(d.total || 0),
			count: d.count || 0,
			sharePct: totalIncome ? Math.round(((d.total || 0) / totalIncome) * 100) : 0,
		};
	}

	const maxT = income.length ? Math.max(...income.map((i) => new Date(i.date).getTime())) : Date.now();
	const wk = 7 * 86_400_000;
	const momentum: Record<string, { last4w: number; prior4w: number }> = {};
	for (const p of Object.keys(byPlatform)) {
		const sum = (a: number, b: number) =>
			income
				.filter((i) => i.platform === p)
				.filter((i) => {
					const t = new Date(i.date).getTime();
					return t > a && t <= b;
				})
				.reduce((s, i) => s + i.amount, 0);
		momentum[p] = {
			last4w: Math.round(sum(maxT - 4 * wk, maxT)),
			prior4w: Math.round(sum(maxT - 8 * wk, maxT - 4 * wk)),
		};
	}

	const deductionsByCategory: Record<string, number> = {};
	for (const [cat, items] of expenseResults.byCategory.entries()) {
		deductionsByCategory[cat] = Math.round(
			items.reduce((s: number, e: any) => s + (e.deductibleAmount ?? 0), 0)
		);
	}

	return {
		statementPeriodDays: 90,
		totalIncome: Math.round(totalIncome),
		byPlatform,
		platformMomentumLast4WeeksVsPrior: momentum,
		weeklyAverage: Math.round(parsedIncome.stability?.weeklyAverage ?? 0),
		incomeVariabilityPct: parsedIncome.stability?.variability,
		totalDeductionsFound: Math.round(expenseResults.totalDeductions),
		deductionsByCategory,
		estimatedQuarterlyTaxPayment: Math.round(taxCalc.quarterlyPayment),
		effectiveTaxRatePct: Math.round((taxCalc.effectiveTaxRate ?? 0) * 100),
	};
}

export default function AIAnalysisPanel({ parsedIncome }: { parsedIncome: any }) {
	const [analysis, setAnalysis] = React.useState<Analysis | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const cacheKey = `stub-analysis-${parsedIncome?.id ?? 'latest'}`;

	const run = React.useCallback(
		async (force = false) => {
			if (!force) {
				try {
					const cached = localStorage.getItem(cacheKey);
					if (cached) {
						setAnalysis(JSON.parse(cached));
						return;
					}
				} catch {}
			}
			setLoading(true);
			setError(null);
			try {
				const res = await fetch('/api/insights', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ stats: buildStats(parsedIncome) }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Analysis failed');
				setAnalysis(data);
				localStorage.setItem(cacheKey, JSON.stringify(data));
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Analysis failed');
			} finally {
				setLoading(false);
			}
		},
		[parsedIncome, cacheKey]
	);

	React.useEffect(() => {
		run();
	}, [run]);

	return (
		<Card className="relative overflow-hidden border-purple-400/25 bg-slate-900">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
			<CardContent>
				<div className="flex items-start justify-between gap-4 mb-1">
					<div className="flex items-center gap-2.5">
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
							<Sparkles className="h-4 w-4 text-white" />
						</span>
						<p className="text-sm font-semibold text-white">Claude&apos;s read on your money</p>
					</div>
					<button
						onClick={() => run(true)}
						disabled={loading}
						className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white disabled:opacity-50"
						title="Re-run analysis"
					>
						<RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
						Refresh
					</button>
				</div>

				{loading && !analysis && (
					<div className="flex items-center gap-2.5 py-6 text-sm text-slate-400">
						<Loader2 className="h-4 w-4 animate-spin text-purple-400" />
						Reading your statement — platforms, momentum, deductions, tax exposure…
					</div>
				)}
				{error && <p className="py-4 text-sm text-red-400">{error}</p>}

				{analysis && (
					<>
						<p className="text-lg font-semibold text-white leading-snug mt-2 mb-4 font-space-grotesk">
							{analysis.headline}
						</p>
						<div className="grid gap-3 md:grid-cols-2">
							{analysis.insights.map((ins, i) => {
								const meta = KIND_META[ins.kind] ?? KIND_META.pattern;
								return (
									<div key={i} className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
										<div className="flex items-center gap-2 mb-1.5">
											<Badge variant="outline" className={meta.cls}>
												<meta.icon className="w-3 h-3" />
												{meta.label}
											</Badge>
											<p className="text-sm font-semibold text-white">{ins.title}</p>
										</div>
										<p className="text-sm text-slate-400 leading-relaxed">{ins.body}</p>
									</div>
								);
							})}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
