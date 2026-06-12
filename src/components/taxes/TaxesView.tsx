'use client';

import * as React from 'react';
import { CalendarClock, CheckCircle2 } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardAction,
} from '@/components/ui/card';
import { GlowCard, StatCard } from '@/components/ui/glow-card';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import AITaxSummary from '@/components/AITaxSummary';
import MileageTracker from '@/components/MileageTracker';
import { buildExpensesFromTransactions } from '@/lib/hybrid-classifier';
import {
	calculateTaxes,
	getQuarterlyDeadlines,
	projectAnnualTax,
} from '@/lib/tax-calculator';

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export default function TaxesView({ parsedIncome, userId }: { parsedIncome: any; userId: string }) {
	const c = React.useMemo(() => {
		const raw = parsedIncome.rawTransactions || [];
		const expenseResults = buildExpensesFromTransactions(raw);
		const totalIncome = parsedIncome.parsed.totalIncome || 0;
		const taxCalc =
			parsedIncome.parsed.startDate && parsedIncome.parsed.endDate
				? projectAnnualTax(
						totalIncome,
						expenseResults.totalDeductions,
						parsedIncome.parsed.startDate,
						parsedIncome.parsed.endDate
				  )
				: calculateTaxes(totalIncome, expenseResults.totalDeductions);
		const deadlines = getQuarterlyDeadlines(
			new Date().getFullYear(),
			Math.round(taxCalc.quarterlyPayment)
		);
		const now = new Date();
		const next = deadlines.find((d) => d.dueDate > now) ?? null;
		const daysUntil = next
			? Math.ceil((next.dueDate.getTime() - now.getTime()) / 86_400_000)
			: null;
		const platforms = Array.from(
			(parsedIncome.parsed.byPlatform ?? new Map()).keys()
		) as string[];
		const deductionsByCategory: Record<string, number> = {};
		for (const [cat, items] of expenseResults.byCategory.entries()) {
			deductionsByCategory[cat] = items.reduce(
				(s: number, e: any) => s + (e.deductibleAmount ?? 0),
				0
			);
		}
		return { expenseResults, taxCalc, deadlines, next, daysUntil, platforms, deductionsByCategory };
	}, [parsedIncome]);

	const now = new Date();

	return (
		<div className="space-y-6">
			{/* One line, not three cards */}
			<div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm text-slate-300">
				<span>
					Set aside{' '}
					<span className="font-space-grotesk font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tabular-nums">
						{money(c.taxCalc.quarterlyPayment)}
					</span>{' '}
					each quarter
				</span>
				<span className="text-slate-500">·</span>
				<span>
					{c.next ? (
						<>
							{c.next.quarter} due{' '}
							<span className="font-semibold text-white">
								{c.next.dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
							</span>{' '}
							({c.daysUntil}d)
						</>
					) : (
						'No upcoming deadline'
					)}
				</span>
				<span className="text-slate-500">·</span>
				<span>
					{(c.taxCalc.effectiveTaxRate * 100).toFixed(1)}% effective rate
				</span>
				<span className="text-slate-500">·</span>
				<span>
					<span className="font-semibold text-white">{money(c.expenseResults.totalDeductions)}</span>{' '}
					in deductions working for you
				</span>
			</div>

			{/* AI summary — the centerpiece */}
			<AITaxSummary
				taxCalc={c.taxCalc}
				totalDeductions={c.expenseResults.totalDeductions}
				deadlines={c.deadlines}
				platforms={c.platforms}
				deductionsByCategory={c.deductionsByCategory}
			/>

			{/* Payment schedule */}
			<GlowCard>
				<CardHeader>
					<CardTitle className="text-white">{now.getFullYear()} payment schedule</CardTitle>
					<CardDescription>
						IRS Form 1040-ES estimated payments — mark your calendar
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow className="border-white/10 hover:bg-transparent">
								<TableHead className="text-slate-500">Quarter</TableHead>
								<TableHead className="text-slate-500">Period</TableHead>
								<TableHead className="text-slate-500">Due date</TableHead>
								<TableHead className="text-slate-500">Status</TableHead>
								<TableHead className="text-right text-slate-500">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{c.deadlines.map((d) => {
								const past = d.dueDate <= now;
								const isNext = c.next?.quarter === d.quarter;
								return (
									<TableRow
										key={d.quarter}
										className={`border-white/5 hover:bg-slate-800/60 ${
											isNext ? 'bg-slate-800/40' : ''
										}`}
									>
										<TableCell className="font-medium text-white">{d.quarter}</TableCell>
										<TableCell className="text-slate-400">{d.period}</TableCell>
										<TableCell className="text-slate-300 tabular-nums">
											{d.dueDate.toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})}
										</TableCell>
										<TableCell>
											{past ? (
												<Badge variant="outline" className="border-white/15 text-slate-400">
													<CheckCircle2 className="w-3 h-3" /> Passed
												</Badge>
											) : isNext ? (
												<Badge variant="outline" className="border-purple-400/40 text-purple-300">
													Up next
												</Badge>
											) : (
												<Badge variant="outline" className="border-white/10 text-slate-500">
													Upcoming
												</Badge>
											)}
										</TableCell>
										<TableCell className="text-right tabular-nums font-medium text-white">
											{money(d.amount)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</GlowCard>

			{/* Mileage — it exists purely as a tax deduction, so it lives here */}
			<div>
				<h2 className="text-base font-semibold text-white mb-1">Mileage</h2>
				<p className="text-sm text-slate-400 mb-4">
					Log work miles — the IRS standard rate is usually the biggest write-off of all.
				</p>
				<MileageTracker userId={userId} />
			</div>
		</div>
	);
}
