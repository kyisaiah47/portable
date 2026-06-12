'use client';

import * as React from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

/* The "what did the AI actually do" card. Makes Claude's work legible:
   how many rows rules handled, how many needed judgment, and the money
   those judgment calls found. */
export default function AIReviewCard({ transactions }: { transactions: any[] }) {
	const [open, setOpen] = React.useState(false);

	const stats = React.useMemo(() => {
		const classified = transactions.filter((t) => t.classification);
		const regex = classified.filter((t) => t.classification.source === 'regex');
		const ai = classified.filter((t) => t.classification.source === 'ai');
		const aiDeductions = ai
			.filter((t) => t.classification.kind === 'expense' && t.classification.deductible)
			.reduce(
				(s, t) =>
					s + Math.abs(t.amount) * ((t.classification.deductionRate ?? 100) / 100),
				0
			);
		const aiIncome = ai
			.filter((t) => t.classification.kind === 'income')
			.reduce((s, t) => s + t.amount, 0);
		const decisions = ai
			.filter((t) => t.classification.kind !== 'none')
			.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
			.slice(0, 12);
		return { total: classified.length, regex: regex.length, ai: ai.length, aiDeductions, aiIncome, decisions };
	}, [transactions]);

	if (stats.ai === 0) return null;

	return (
		<Card className="relative overflow-hidden border-purple-400/25 bg-slate-900">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
			<CardContent className="pt-5">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex items-start gap-3 min-w-0">
						<span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
							<Sparkles className="h-4 w-4 text-white" />
						</span>
						<div className="min-w-0">
							<p className="text-sm font-semibold text-white">
								Claude reviewed this statement
							</p>
							<p className="text-sm text-slate-400 mt-0.5">
								{stats.regex} of {stats.total} transactions matched known patterns
								instantly. <span className="text-slate-200 font-medium">{stats.ai} needed
								judgment</span> — ambiguous merchants, transfers, mixed-use bills.
								{stats.aiDeductions > 0 && (
									<>
										{' '}Those calls found{' '}
										<span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
											${Math.round(stats.aiDeductions).toLocaleString()} in deductions
										</span>
										{stats.aiIncome > 0 && (
											<> and confirmed ${Math.round(stats.aiIncome).toLocaleString()} of income</>
										)}{' '}
										rules alone would have missed.
									</>
								)}
							</p>
						</div>
					</div>
					<button
						onClick={() => setOpen(!open)}
						className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
					>
						{open ? 'Hide decisions' : `See the ${stats.ai} decisions`}
						{open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
					</button>
				</div>

				{open && (
					<div className="mt-4 divide-y divide-white/5 rounded-lg border border-white/10">
						{stats.decisions.map((t: any, i: number) => {
							const c = t.classification;
							return (
								<div key={i} className="px-4 py-3 flex flex-wrap items-start justify-between gap-2">
									<div className="min-w-0 flex-1">
										<p className="text-sm text-white font-mono truncate">{t.description}</p>
										{c.rationale && (
											<p className="text-xs text-slate-400 mt-1 leading-relaxed">
												“{c.rationale}”
											</p>
										)}
									</div>
									<div className="flex items-center gap-2 shrink-0">
										{c.kind === 'income' ? (
											<Badge variant="outline" className="border-blue-400/40 text-blue-300">
												{c.platform || 'Income'}
											</Badge>
										) : c.deductible ? (
											<Badge variant="outline" className="border-purple-400/40 text-purple-300">
												{c.deductionRate && c.deductionRate < 100
													? `${c.deductionRate}% deductible`
													: 'Deductible'}
											</Badge>
										) : (
											<Badge variant="outline" className="border-white/15 text-slate-400">
												Personal
											</Badge>
										)}
										<span className="text-sm tabular-nums text-slate-300">
											{c.kind === 'income' ? '+' : '−'}${Math.abs(t.amount).toFixed(2)}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
