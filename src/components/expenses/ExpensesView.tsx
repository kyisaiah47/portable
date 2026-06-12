'use client';

import * as React from 'react';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

interface Verdict {
	verdict: 'yes' | 'partially' | 'no' | 'depends';
	category: string;
	deductionRate: number;
	explanation: string;
	confidence: number;
}

function AskDeduction() {
	const [q, setQ] = React.useState('');
	const [busy, setBusy] = React.useState(false);
	const [result, setResult] = React.useState<Verdict | null>(null);
	const [error, setError] = React.useState<string | null>(null);

	const ask = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!q.trim()) return;
		setBusy(true);
		setError(null);
		setResult(null);
		try {
			const res = await fetch('/api/deduction-check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ description: q.trim() }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Something went wrong');
			setResult(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			setBusy(false);
		}
	};

	const verdictBadge = (v: Verdict['verdict']) =>
		v === 'yes' ? (
			<Badge variant="outline" className="border-emerald-400/40 text-emerald-300">Deductible</Badge>
		) : v === 'partially' ? (
			<Badge variant="outline" className="border-purple-400/40 text-purple-300">Partially deductible</Badge>
		) : v === 'no' ? (
			<Badge variant="outline" className="border-red-400/40 text-red-300">Not deductible</Badge>
		) : (
			<Badge variant="outline" className="border-amber-400/40 text-amber-300">It depends</Badge>
		);

	return (
		<Card className="relative overflow-hidden border-purple-400/25 bg-slate-900">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
			<CardHeader>
				<CardTitle className="text-white flex items-center gap-2">
					<Sparkles className="h-4 w-4 text-purple-400" />
					Can I deduct this?
				</CardTitle>
				<CardDescription>
					Ask about anything — a purchase, a bill, something you&apos;re considering buying.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={ask} className="flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder='Try “new phone I also use for personal stuff” or “car wash”'
							className="w-full pl-9 pr-3 py-2.5 rounded-md border border-white/10 bg-slate-950 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
						/>
					</div>
					<button
						type="submit"
						disabled={busy || !q.trim()}
						className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium disabled:opacity-50"
					>
						{busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ask'}
					</button>
				</form>

				{error && <p className="mt-3 text-sm text-red-400">{error}</p>}
				{result && (
					<div className="mt-4 rounded-lg border border-white/10 bg-slate-950/60 p-4">
						<div className="flex flex-wrap items-center gap-2 mb-2">
							{verdictBadge(result.verdict)}
							{result.deductionRate > 0 && result.deductionRate < 100 && (
								<span className="text-xs text-slate-400">{result.deductionRate}% of the cost</span>
							)}
							{result.category && (
								<span className="text-xs text-slate-500">· {result.category}</span>
							)}
						</div>
						<p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default function ExpensesView({ parsedIncome }: { parsedIncome: any }) {
	const c = React.useMemo(() => {
		const raw: any[] = parsedIncome?.rawTransactions || [];
		const deductible = raw
			.filter((t) => t.classification?.kind === 'expense' && t.classification?.deductible)
			.map((t) => ({
				...t,
				deductibleAmount:
					Math.abs(t.amount) * ((t.classification.deductionRate ?? 100) / 100),
			}))
			.sort((a, b) => b.deductibleAmount - a.deductibleAmount);

		const total = deductible.reduce((s, t) => s + t.deductibleAmount, 0);
		const byCategory = new Map<string, number>();
		for (const t of deductible) {
			const cat = t.classification.expenseCategory || 'other';
			byCategory.set(cat, (byCategory.get(cat) ?? 0) + t.deductibleAmount);
		}
		const topCategory = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;
		const aiFound = deductible.filter((t) => t.classification.source === 'ai');

		return { deductible, total, topCategory, aiFoundCount: aiFound.length };
	}, [parsedIncome]);

	return (
		<div className="space-y-6">
			<AskDeduction />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<Card className="bg-slate-900 border-white/10">
					<CardHeader>
						<CardDescription>Deductions found</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							{money(c.total)}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-400">
						≈ {money(c.total * 0.3)} less tax at a 30% rate
					</CardContent>
				</Card>
				<Card className="bg-slate-900 border-white/10">
					<CardHeader>
						<CardDescription>Write-offs caught</CardDescription>
						<CardTitle className="text-3xl font-bold tabular-nums font-space-grotesk text-white">
							{c.deductible.length}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-400">
						{c.aiFoundCount} needed AI judgment — rules alone would have missed them
					</CardContent>
				</Card>
				<Card className="bg-slate-900 border-white/10">
					<CardHeader>
						<CardDescription>Biggest category</CardDescription>
						<CardTitle className="text-3xl font-bold font-space-grotesk text-white capitalize">
							{c.topCategory?.[0] ?? '—'}
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-400">
						{c.topCategory ? `${money(c.topCategory[1])} deductible` : 'Upload a statement first'}
					</CardContent>
				</Card>
			</div>

			<Card className="bg-slate-900 border-white/10">
				<CardHeader>
					<CardTitle className="text-white">The ledger</CardTitle>
					<CardDescription>
						Every write-off with the reason on record — ready for your accountant (or an audit).
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow className="border-white/10 hover:bg-transparent">
								<TableHead className="text-slate-500">Date</TableHead>
								<TableHead className="text-slate-500">Merchant</TableHead>
								<TableHead className="text-slate-500">Deduction</TableHead>
								<TableHead className="text-slate-500 w-[40%]">Why</TableHead>
								<TableHead className="text-right text-slate-500">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{c.deductible.map((t: any, i: number) => {
								const cls = t.classification;
								return (
									<TableRow key={i} className="border-white/5 hover:bg-slate-800/60 align-top">
										<TableCell className="text-slate-400 whitespace-nowrap">
											{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										</TableCell>
										<TableCell className="text-white font-mono text-xs max-w-[200px] truncate">
											{t.description}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1.5">
												<Badge variant="outline" className="border-purple-400/40 text-purple-300 capitalize">
													{cls.expenseCategory || 'other'}
													{cls.deductionRate && cls.deductionRate < 100 ? ` · ${cls.deductionRate}%` : ''}
												</Badge>
												{cls.source === 'ai' && (
													<Badge variant="outline" className="border-white/15 text-slate-400">
														<Sparkles className="w-3 h-3" /> AI
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell className="text-xs text-slate-400 leading-relaxed">
											{cls.rationale || '—'}
										</TableCell>
										<TableCell className="text-right tabular-nums font-medium text-white whitespace-nowrap">
											${t.deductibleAmount.toFixed(2)}
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
