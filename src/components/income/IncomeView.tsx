'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PLATFORM_ICONS } from '@/lib/platform-icons';
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
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart';

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

// Vivid brand-family palette — one strong hue per platform.
export const VIVID_PLATFORM_COLORS: Record<string, string> = {
	Uber: '#6366f1',
	Lyft: '#ec4899',
	DoorDash: '#ef4444',
	Instacart: '#22c55e',
	Grubhub: '#f59e0b',
	'Uber Eats': '#84cc16',
	UberEats: '#84cc16',
	Upwork: '#14b8a6',
	Fiverr: '#a3e635',
	Freelancer: '#8b5cf6',
	YouTube: '#f43f5e',
	Twitch: '#a855f7',
	Airbnb: '#fb7185',
	Stripe: '#818cf8',
	Square: '#38bdf8',
	Venmo: '#60a5fa',
	Zelle: '#c084fc',
	PayPal: '#3b82f6',
	Other: '#94a3b8',
};

const colorFor = (p: string) => VIVID_PLATFORM_COLORS[p] ?? VIVID_PLATFORM_COLORS.Other;

export default function IncomeView({ parsedIncome }: { parsedIncome: any }) {
	const c = React.useMemo(() => {
		const income: Array<{ date: Date | string; amount: number; platform: string }> =
			parsedIncome.parsed.income || [];
		const totalIncome: number = parsedIncome.parsed.totalIncome || 0;
		const byPlatform: Map<string, any> = parsedIncome.parsed.byPlatform || new Map();

		const platforms = Array.from(byPlatform.entries())
			.map(([platform, d]: [string, any]) => ({
				platform,
				total: d.total || 0,
				count: d.count || 0,
				share: totalIncome ? ((d.total || 0) / totalIncome) * 100 : 0,
			}))
			.sort((a, b) => b.total - a.total);

		const top = platforms[0] ?? null;

		// Weekly stacked series, anchored to the newest data point
		const maxT = income.length
			? Math.max(...income.map((i) => new Date(i.date).getTime()))
			: Date.now();
		const wk = 7 * 86_400_000;
		const weeks: Array<Record<string, number | string>> = [];
		for (let w = 11; w >= 0; w--) {
			const end = maxT - w * wk;
			const start = end - wk;
			const bucket: Record<string, number | string> = {
				week: new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
			};
			for (const i of income) {
				const t = new Date(i.date).getTime();
				if (t > start && t <= end) {
					bucket[i.platform] = ((bucket[i.platform] as number) ?? 0) + i.amount;
				}
			}
			weeks.push(bucket);
		}

		// Momentum: each platform's last-4-weeks vs the 4 before, data-relative
		const sumIn = (p: string, a: number, b: number) =>
			income
				.filter((i) => i.platform === p)
				.filter((i) => {
					const t = new Date(i.date).getTime();
					return t > a && t <= b;
				})
				.reduce((s, i) => s + i.amount, 0);
		const momentum = platforms
			.map(({ platform }) => {
				const recent = sumIn(platform, maxT - 4 * wk, maxT);
				const prior = sumIn(platform, maxT - 8 * wk, maxT - 4 * wk);
				const delta = prior > 0 ? ((recent - prior) / prior) * 100 : null;
				return { platform, recent, prior, delta };
			})
			.filter((m) => m.delta !== null && Math.abs(m.delta!) >= 10)
			.sort((a, b) => Math.abs(b.delta!) - Math.abs(a.delta!))
			.slice(0, 3);

		const stability = parsedIncome.stability || {};

		return { platforms, top, weeks, momentum, totalIncome, stability };
	}, [parsedIncome]);

	const chartConfig = React.useMemo(() => {
		const cfg: ChartConfig = {};
		for (const p of c.platforms) {
			cfg[p.platform] = { label: p.platform, color: colorFor(p.platform) };
		}
		return cfg;
	}, [c.platforms]);

	return (
		<div className="space-y-6">
			{/* Stat cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<GlowCard>
					<CardHeader>
						<CardDescription>Total income</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							{money(c.totalIncome)}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-300">
						{parsedIncome.parsed.income?.length ?? 0} payments across {c.platforms.length}{' '}
						platforms
					</CardContent>
				</GlowCard>
				<GlowCard>
					<CardHeader>
						<CardDescription>Top platform</CardDescription>
						<CardTitle className="text-3xl font-bold font-space-grotesk text-white">
							{c.top?.platform ?? '—'}
						</CardTitle>
						{c.top && (
							<CardAction>
								<Badge variant="outline" className="border-white/15 text-slate-300 tabular-nums">
									{c.top.share.toFixed(0)}%
								</Badge>
							</CardAction>
						)}
					</CardHeader>
					<CardContent className="text-sm text-slate-300">
						{c.top && c.top.share > 60
							? 'Heavy concentration — one deactivation hurts. Worth diversifying.'
							: 'Healthy mix — no single platform owns your income.'}
					</CardContent>
				</GlowCard>
				<GlowCard>
					<CardHeader>
						<CardDescription>Stability score</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk text-white">
							{c.stability.score ?? '—'}/100
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-300">
						{money(c.stability.weeklyAverage ?? 0)}/week average ·{' '}
						{c.stability.variability}% variability — the number landlords understand
					</CardContent>
				</GlowCard>
			</div>

			{/* Momentum callouts */}
			{c.momentum.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{c.momentum.map((m) => (
						<GlowCard key={m.platform}>
							<CardContent>
								<div className="flex items-start justify-between mb-3">
									{(() => {
										const I = PLATFORM_ICONS[m.platform];
										return (
											<span
												className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
												style={{ background: `${colorFor(m.platform)}1f` }}
											>
												{I ? (
													<I className="h-5 w-5" style={{ color: colorFor(m.platform) } as React.CSSProperties} />
												) : (
													<span
														className="h-3 w-3 rounded-full"
														style={{ background: colorFor(m.platform) }}
													/>
												)}
											</span>
										);
									})()}
									<Badge
										variant="outline"
										className={
											m.delta! >= 0
												? 'border-emerald-400/40 text-emerald-300'
												: 'border-red-400/40 text-red-300'
										}
									>
										{m.delta! >= 0 ? (
											<TrendingUp className="w-3 h-3" />
										) : (
											<TrendingDown className="w-3 h-3" />
										)}
										{m.delta! >= 0 ? '+' : ''}
										{m.delta!.toFixed(0)}%
									</Badge>
								</div>
								<p className="text-sm font-semibold text-white">{m.platform}</p>
								<p className="text-xs text-slate-300 mt-1">
									{money(m.recent)} last 4 weeks vs {money(m.prior)} the 4 before
								</p>
							</CardContent>
						</GlowCard>
					))}
				</div>
			)}

			{/* Weekly stacked chart */}
			<GlowCard>
				<CardHeader>
					<CardTitle className="text-white">Weekly earnings by platform</CardTitle>
					<CardDescription>Last 12 weeks of your statement</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
						<BarChart data={c.weeks}>
							<CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
							<XAxis
								dataKey="week"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tick={{ fill: '#94a3b8', fontSize: 11 }}
							/>
							<ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
							{c.platforms.map((p) => (
								<Bar
									key={p.platform}
									dataKey={p.platform}
									stackId="a"
									fill={colorFor(p.platform)}
									radius={[0, 0, 0, 0]}
								/>
							))}
						</BarChart>
					</ChartContainer>
				</CardContent>
			</GlowCard>

			{/* Platform breakdown */}
			<GlowCard>
				<CardHeader>
					<CardTitle className="text-white">Platform mix</CardTitle>
					<CardDescription>Where the money actually comes from</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{c.platforms.map((p) => (
						<div key={p.platform}>
							<div className="flex items-baseline justify-between mb-1.5">
								<span className="text-sm font-medium text-white inline-flex items-center gap-2">
									<span
										className="h-2.5 w-2.5 rounded-full"
										style={{ background: colorFor(p.platform) }}
									/>
									{(() => {
										const I = PLATFORM_ICONS[p.platform];
										return I ? <I className="h-3.5 w-3.5 text-slate-400" /> : null;
									})()}
									{p.platform}
									<span className="text-xs text-slate-500">{p.count} payments</span>
								</span>
								<span className="text-sm tabular-nums text-slate-300">
									{money(p.total)}{' '}
									<span className="text-slate-500">· {p.share.toFixed(1)}%</span>
								</span>
							</div>
							<div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
								<div
									className="h-full rounded-full"
									style={{ width: `${p.share}%`, background: colorFor(p.platform) }}
								/>
							</div>
						</div>
					))}
				</CardContent>
			</GlowCard>
		</div>
	);
}
