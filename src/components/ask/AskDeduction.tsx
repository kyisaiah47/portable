'use client';

import * as React from 'react';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AICard } from '@/components/ui/glow-card';
import { Badge } from '@/components/ui/badge';

interface Verdict {
	verdict: 'yes' | 'partially' | 'no' | 'depends';
	category: string;
	deductionRate: number;
	explanation: string;
	confidence: number;
}

export default function AskDeduction() {
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
		<AICard>
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
								<span className="text-xs text-slate-300">{result.deductionRate}% of the cost</span>
							)}
							{result.category && (
								<span className="text-xs text-slate-500">· {result.category}</span>
							)}
						</div>
						<p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
					</div>
				)}
			</CardContent>
		</AICard>
	);
}

