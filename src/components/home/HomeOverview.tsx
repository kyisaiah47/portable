'use client';

import * as React from 'react';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles, CalendarClock } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { buildExpensesFromTransactions } from '@/lib/hybrid-classifier';
import AIReviewCard from '@/components/home/AIReviewCard';
import { calculateTaxes, getQuarterlyDeadlines, projectAnnualTax } from '@/lib/tax-calculator';

const money = (n: number) =>
	`$${Math.round(n).toLocaleString()}`;

const chartConfig = {
	income: { label: 'Income', color: '#a855f7' },
} satisfies ChartConfig;

export default function HomeOverview({ parsedIncome }: { parsedIncome: any }) {
	const [range, setRange] = React.useState<'90d' | '30d' | '7d'>('90d');

	const computed = React.useMemo(() => {
		const raw = parsedIncome.rawTransactions || [];
		const income: Array<{ date: Date; amount: number; platform: string; description?: string }> =
			parsedIncome.parsed.income || [];
		const totalIncome: number = parsedIncome.parsed.totalIncome || 0;

		const expenseResults = buildExpensesFromTransactions(raw);
		const totalDeductions = expenseResults.totalDeductions || 0;
		const deductibleCount =
			raw.filter((t: any) => t.classification?.kind === 'expense' && t.classification?.deductible)
				.length;

		const taxCalc =
			parsedIncome.parsed.startDate && parsedIncome.parsed.endDate
				? projectAnnualTax(totalIncome, totalDeductions, parsedIncome.parsed.startDate, parsedIncome.parsed.endDate)
				: calculateTaxes(totalIncome, totalDeductions);

		const setAside = totalIncome * 0.3;
		const buffer = totalIncome * 0.1;
		const safeToSpend = Math.max(0, totalIncome - setAside - buffer);

		const deadlines = getQuarterlyDeadlines(new Date().getFullYear(), Math.round(taxCalc.quarterlyPayment));
		const now = new Date();
		const nextDeadline = deadlines.find((d) => d.dueDate > now) ?? null;
		const daysUntil = nextDeadline
			? Math.ceil((nextDeadline.dueDate.getTime() - now.getTime()) / 86_400_000)
			: null;

		// Week-over-week, anchored to the newest transaction in the data
		// (sample statements live in the past — "this week" must be data-relative).
		const maxT = income.length
			? Math.max(...income.map((i) => new Date(i.date).getTime()))
			: Date.now();
		const wk = 7 * 86_400_000;
		const sumBetween = (a: number, b: number) =>
			income
				.filter((i) => {
					const t = new Date(i.date).getTime();
					return t > a && t <= b;
				})
				.reduce((s, i) => s + i.amount, 0);
		const thisWeek = sumBetween(maxT - wk, maxT);
		const lastWeek = sumBetween(maxT - 2 * wk, maxT - wk);
		const weekDelta = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : null;

		// Daily series for the area chart, anchored to data end
		const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
		const start = maxT - days * 86_400_000;
		const byDay = new Map<string, number>();
		for (const i of income) {
			const t = new Date(i.date).getTime();
			if (t < start) continue;
			const key = new Date(i.date).toISOString().slice(0, 10);
			byDay.set(key, (byDay.get(key) ?? 0) + i.amount);
		}
		const series = Array.from(byDay.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, amount]) => ({ date, income: Math.round(amount * 100) / 100 }));

		// Recent transactions with their AI tags
		const recent = [...raw]
			.filter((t: any) => t.classification && t.classification.kind !== 'none')
			.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 8);

		return {
			safeToSpend,
			setAside,
			totalIncome,
			totalDeductions,
			deductibleCount,
			taxCalc,
			nextDeadline,
			daysUntil,
			thisWeek,
			weekDelta,
			series,
			recent,
		};
	}, [parsedIncome, range]);

	const c = computed;

	return (
		<div className="space-y-6">
			<AIReviewCard transactions={parsedIncome.rawTransactions || []} />

			{/* Stat cards — dashboard-01 style */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<Card className="bg-slate-900 border-white/10">
					<CardHeader>
						<CardDescription>Safe to spend</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							{money(c.safeToSpend)}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-400">
						After 30% taxes + 10% buffer on {money(c.totalIncome)} earned
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-white/10">
					<CardHeader>
						<CardDescription>Stub found you</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk text-white">
							{money(c.totalDeductions)}
						</CardTitle>
						<CardAction>
							<Badge variant="outline" className="border-purple-400/40 text-purple-300">
								<Sparkles className="w-3 h-3" /> AI
							</Badge>
						</CardAction>
					</CardHeader>
					<CardContent className="text-sm text-slate-400">
						{c.deductibleCount} deductible expenses caught —{' '}
						<Link href="/dashboard/expenses" className="text-indigo-400 hover:text-indigo-300">
							see the reasons →
						</Link>
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-white/10">
					<CardHeader>
						<CardDescription>Next IRS deadline</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk text-white">
							{c.daysUntil !== null ? `${c.daysUntil}d` : '—'}
						</CardTitle>
						<CardAction>
							<Badge variant="outline" className="border-white/15 text-slate-300">
								<CalendarClock className="w-3 h-3" />
								{c.nextDeadline?.quarter ?? ''}
							</Badge>
						</CardAction>
					</CardHeader>
					<CardContent className="text-sm text-slate-400">
						{c.nextDeadline
							? `${c.nextDeadline.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · set aside ${money(c.taxCalc.quarterlyPayment)}`
							: 'No upcoming deadline'}
					</CardContent>
				</Card>

				<Card className="bg-slate-900 border-white/10">
					<CardHeader>
						<CardDescription>This week</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk text-white">
							{money(c.thisWeek)}
						</CardTitle>
						{c.weekDelta !== null && (
							<CardAction>
								<Badge
									variant="outline"
									className={
										c.weekDelta >= 0
											? 'border-emerald-400/40 text-emerald-300'
											: 'border-red-400/40 text-red-300'
									}
								>
									{c.weekDelta >= 0 ? (
										<TrendingUp className="w-3 h-3" />
									) : (
										<TrendingDown className="w-3 h-3" />
									)}
									{c.weekDelta >= 0 ? '+' : ''}
									{c.weekDelta.toFixed(0)}%
								</Badge>
							</CardAction>
						)}
						<CardContent className="px-0 pt-1 text-sm text-slate-400">
							vs. the week before
						</CardContent>
					</CardHeader>
				</Card>
			</div>

			{/* Income trend — interactive area chart */}
			<Card className="bg-slate-900 border-white/10">
				<CardHeader>
					<CardTitle className="text-white">Income</CardTitle>
					<CardDescription>Daily earnings across all platforms</CardDescription>
					<CardAction>
						<ToggleGroup
							type="single"
							value={range}
							onValueChange={(v) => v && setRange(v as typeof range)}
							variant="outline"
							size="sm"
						>
							<ToggleGroupItem value="90d">3 months</ToggleGroupItem>
							<ToggleGroupItem value="30d">30 days</ToggleGroupItem>
							<ToggleGroupItem value="7d">7 days</ToggleGroupItem>
						</ToggleGroup>
					</CardAction>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
						<AreaChart data={c.series}>
							<defs>
								<linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
									<stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
								</linearGradient>
							</defs>
							<CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tick={{ fill: '#94a3b8', fontSize: 11 }}
								tickFormatter={(value: string) =>
									new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
									})
								}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										labelFormatter={(value) =>
											new Date(String(value) + 'T00:00:00').toLocaleDateString('en-US', {
												month: 'long',
												day: 'numeric',
											})
										}
										indicator="dot"
									/>
								}
							/>
							<Area
								dataKey="income"
								type="natural"
								fill="url(#fillIncome)"
								stroke="#a855f7"
								strokeWidth={2}
							/>
						</AreaChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Recent activity with AI tags */}
			<Card className="bg-slate-900 border-white/10">
				<CardHeader>
					<CardTitle className="text-white">Recent activity</CardTitle>
					<CardDescription>What the AI saw in your latest statement</CardDescription>
					<CardAction>
						<Link
							href="/dashboard/income"
							className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
						>
							View all →
						</Link>
					</CardAction>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow className="border-white/10 hover:bg-transparent">
								<TableHead className="text-slate-500">Date</TableHead>
								<TableHead className="text-slate-500">Description</TableHead>
								<TableHead className="text-slate-500">AI tag</TableHead>
								<TableHead className="text-right text-slate-500">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{c.recent.map((t: any, i: number) => {
								const cls = t.classification;
								const isIncome = cls.kind === 'income';
								return (
									<TableRow key={i} className="border-white/5 hover:bg-slate-800/60">
										<TableCell className="text-slate-400 whitespace-nowrap">
											{new Date(t.date).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
											})}
										</TableCell>
										<TableCell className="text-white max-w-[280px] truncate">
											{t.description}
										</TableCell>
										<TableCell>
											{isIncome ? (
												<Badge variant="outline" className="border-blue-400/40 text-blue-300">
													{cls.platform || 'Income'}
												</Badge>
											) : cls.deductible ? (
												<Badge
													variant="outline"
													className="border-purple-400/40 text-purple-300"
													title={cls.rationale}
												>
													<Sparkles className="w-3 h-3" />
													{cls.deductionRate && cls.deductionRate < 100
														? `${cls.deductionRate}% deductible`
														: 'Deductible'}
												</Badge>
											) : (
												<Badge variant="outline" className="border-white/15 text-slate-400">
													{cls.expenseCategory || 'Expense'}
												</Badge>
											)}
										</TableCell>
										<TableCell
											className={`text-right tabular-nums font-medium ${
												isIncome ? 'text-emerald-400' : 'text-slate-300'
											}`}
										>
											{isIncome ? '+' : '−'}${Math.abs(t.amount).toFixed(2)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
