'use client';

import { useEffect, useState } from 'react';
import { Car, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// IRS standard mileage rate (2025: $0.70/mi). Update yearly.
export const IRS_MILEAGE_RATE = 0.7;

interface Trip {
	id: string;
	date: string;
	miles: number;
	purpose: string;
}

export default function MileageTracker({ userId }: { userId: string }) {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [miles, setMiles] = useState('');
	const [purpose, setPurpose] = useState('');
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			const { data, error } = await supabase
				.from('stub_mileage')
				.select('id, date, miles, purpose')
				.eq('user_id', userId)
				.order('date', { ascending: false })
				.limit(200);
			if (!error) setTrips(data ?? []);
			setLoading(false);
		};
		load();
	}, [userId]);

	const addTrip = async (e: React.FormEvent) => {
		e.preventDefault();
		const m = parseFloat(miles);
		if (!m || m <= 0) {
			setError('Enter miles driven.');
			return;
		}
		setSaving(true);
		setError(null);
		const { data, error } = await supabase
			.from('stub_mileage')
			.insert({ date, miles: m, purpose })
			.select('id, date, miles, purpose')
			.single();
		if (error) {
			setError(error.message);
		} else if (data) {
			setTrips((t) => [data, ...t]);
			setMiles('');
			setPurpose('');
		}
		setSaving(false);
	};

	const deleteTrip = async (id: string) => {
		setTrips((t) => t.filter((x) => x.id !== id));
		await supabase.from('stub_mileage').delete().eq('id', id);
	};

	const totalMiles = trips.reduce((a, t) => a + Number(t.miles), 0);
	const deduction = totalMiles * IRS_MILEAGE_RATE;

	return (
		<div className="space-y-6">
			{/* Totals */}
			<div className="grid sm:grid-cols-3 gap-4">
				<div className="bg-slate-900 border border-white/10 rounded-lg p-5">
					<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
						Miles logged
					</p>
					<p className="text-2xl font-bold text-white tabular-nums font-space-grotesk">
						{totalMiles.toLocaleString(undefined, { maximumFractionDigits: 1 })}
					</p>
				</div>
				<div className="bg-slate-900 border border-white/10 rounded-lg p-5">
					<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
						IRS rate
					</p>
					<p className="text-2xl font-bold text-white tabular-nums font-space-grotesk">
						${IRS_MILEAGE_RATE.toFixed(2)}/mi
					</p>
				</div>
				<div className="bg-slate-900 border border-white/10 rounded-lg p-5">
					<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
						Deduction
					</p>
					<p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tabular-nums font-space-grotesk">
						${deduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
					</p>
				</div>
			</div>

			{/* Add trip */}
			<form
				onSubmit={addTrip}
				className="bg-slate-900 border border-white/10 rounded-lg p-5 flex flex-wrap items-end gap-3"
			>
				<div>
					<label className="block text-xs font-medium text-slate-400 mb-1.5">
						Date
					</label>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="px-3 py-2"
					/>
				</div>
				<div>
					<label className="block text-xs font-medium text-slate-400 mb-1.5">
						Miles
					</label>
					<input
						type="number"
						step="0.1"
						min="0"
						placeholder="42.5"
						value={miles}
						onChange={(e) => setMiles(e.target.value)}
						className="w-28 px-3 py-2 rounded-md border border-white/10 bg-slate-950 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-400"
					/>
				</div>
				<div className="flex-1 min-w-[160px]">
					<label className="block text-xs font-medium text-slate-400 mb-1.5">
						Purpose (optional)
					</label>
					<input
						type="text"
						placeholder="Friday dinner rush"
						value={purpose}
						onChange={(e) => setPurpose(e.target.value)}
						className="w-full px-3 py-2 rounded-md border border-white/10 bg-slate-950 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-400"
					/>
				</div>
				<button
					type="submit"
					disabled={saving}
					className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium disabled:opacity-50"
				>
					<Plus className="w-3.5 h-3.5" />
					Log trip
				</button>
				{error && <p className="w-full text-xs text-red-400">{error}</p>}
			</form>

			{/* Trips */}
			<div className="bg-slate-900 border border-white/10 rounded-lg overflow-hidden">
				{loading ? (
					<p className="p-5 text-sm text-slate-400">Loading…</p>
				) : trips.length === 0 ? (
					<div className="p-10 text-center">
						<Car className="w-8 h-8 text-slate-600 mx-auto mb-3" strokeWidth={1.5} />
						<p className="text-sm font-medium text-white mb-1">No trips logged</p>
						<p className="text-sm text-slate-400">
							Log work miles — usually the biggest gig deduction there is.
						</p>
					</div>
				) : (
					<table className="w-full text-sm">
						<tbody className="divide-y divide-white/5">
							{trips.map((t) => (
								<tr key={t.id} className="hover:bg-slate-800/60">
									<td className="px-5 py-3 text-slate-300 tabular-nums">{t.date}</td>
									<td className="px-5 py-3 text-slate-400">{t.purpose || '—'}</td>
									<td className="px-5 py-3 text-right text-white tabular-nums font-medium">
										{Number(t.miles).toLocaleString(undefined, {
											maximumFractionDigits: 1,
										})}{' '}
										mi
									</td>
									<td className="px-5 py-3 text-right text-slate-400 tabular-nums">
										${(Number(t.miles) * IRS_MILEAGE_RATE).toFixed(2)}
									</td>
									<td className="px-3 py-3 text-right">
										<button
											onClick={() => deleteTrip(t.id)}
											className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
											aria-label="Delete trip"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
