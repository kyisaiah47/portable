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
import { GlowCard, AICard } from '@/components/ui/glow-card';
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
import { buildExpensesFromTransactions } from '@/lib/hybrid-classifier';
import {
	calculateTaxes,
	getQuarterlyDeadlines,
	projectAnnualTax,
} from '@/lib/tax-calculator';

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export default function TaxesView({ parsedIncome }: { parsedIncome: any }) {
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
			{/* Hero cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<GlowCard>
					<CardHeader>
						<CardDescription>Set aside each quarter</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							{money(c.taxCalc.quarterlyPayment)}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-300">
						{(c.taxCalc.effectiveTaxRate * 100).toFixed(1)}% effective rate on
						projected income
					</CardContent>
				</GlowCard>
				<GlowCard>
					<CardHeader>
						<CardDescription>Next deadline</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk text-white">
							{c.daysUntil !== null ? `${c.daysUntil} days` : '—'}
						</CardTitle>
						{c.next && (
							<CardAction>
								<Badge variant="outline" className="border-white/15 text-slate-300">
									<CalendarClock className="w-3 h-3" />
									{c.next.quarter}
								</Badge>
							</CardAction>
						)}
					</CardHeader>
					<CardContent className="text-sm text-slate-300">
						{c.next
							? c.next.dueDate.toLocaleDateString('en-US', {
									month: 'long',
									day: 'numeric',
									year: 'numeric',
							  })
							: 'No upcoming deadline this year'}
					</CardContent>
				</GlowCard>
				<GlowCard>
					<CardHeader>
						<CardDescription>Deductions lowering your bill</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk text-white">
							{money(c.expenseResults.totalDeductions)}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-300">
						≈ {money(c.expenseResults.potentialTaxSavings ?? c.expenseResults.totalDeductions * 0.3)}{' '}
						in tax savings
					</CardContent>
				</GlowCard>
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
		</div>
	);
}
