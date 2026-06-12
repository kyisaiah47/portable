'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ShiftMark } from '@/components/Logo';
import {
	SiUber,
	SiLyft,
	SiDoordash,
	SiInstacart,
	SiGrubhub,
	SiUpwork,
	SiFiverr,
	SiYoutube,
	SiTwitch,
	SiAirbnb,
} from 'react-icons/si';

const PLATFORMS = [
	{ icon: SiUber, name: 'Uber' },
	{ icon: SiLyft, name: 'Lyft' },
	{ icon: SiDoordash, name: 'DoorDash' },
	{ icon: SiInstacart, name: 'Instacart' },
	{ icon: SiGrubhub, name: 'Grubhub' },
	{ icon: SiUpwork, name: 'Upwork' },
	{ icon: SiFiverr, name: 'Fiverr' },
	{ icon: SiYoutube, name: 'YouTube' },
	{ icon: SiTwitch, name: 'Twitch' },
	{ icon: SiAirbnb, name: 'Airbnb' },
];

const PROOF = [
	{
		stat: '76 in 4s',
		title: 'Transactions sorted in seconds',
		body: 'Upload a statement, get every gig payment recognized and categorized — Uber vs. Uber Eats vs. your actual dinner.',
	},
	{
		stat: 'IRS-grade',
		title: 'Deductions with receipts-level reasons',
		body: 'Every write-off comes with the why: category, rate, and the rule behind it. Ready for your accountant — or an audit.',
	},
	{
		stat: 'No surprises',
		title: 'Know your quarterly bill early',
		body: 'Self-employment tax, federal estimate, and exactly what to set aside — computed from your real income, updated as you earn.',
	},
];

export default function Home() {
	return (
		<div className="min-h-screen bg-slate-950 font-inter text-white">
			{/* Nav */}
			<nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<ShiftMark className="h-5 w-auto text-[#00D632]" />
						<span className="text-lg font-bold font-space-grotesk tracking-tight">
							stub
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
						>
							Log in
						</Link>
						<Link
							href="/signup"
							className="px-4 py-2 rounded-full text-sm font-bold text-slate-950 bg-[#00D632] hover:opacity-90 transition-opacity"
						>
							Get started
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="px-6 pt-20 pb-16">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="font-space-grotesk font-bold text-4xl md:text-6xl leading-[1.04] mb-6">
						You&apos;re leaving{' '}
						<span className="text-[#00D632]">$3,000–$5,000</span> in
						deductions on the table.
					</h1>
					<p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto mb-8">
						Upload a bank statement. Stub finds your gig income, your
						write-offs, and what to set aside for taxes — before the IRS does
						the math for you.
					</p>
					<Link
						href="/signup"
						className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-slate-950 bg-[#00D632] hover:scale-[1.03] transition-transform"
					>
						Upload a statement — free
						<ArrowRight className="h-4 w-4" />
					</Link>
					<p className="mt-3 text-xs text-slate-500">
						No bank login. No card. One CSV.
					</p>
				</div>
			</section>

			{/* Product proof: parsed statement mock */}
			<section className="px-6 pb-16">
				<div className="max-w-3xl mx-auto">
					<div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
						<div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
							<span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
								statement_june.csv — parsed
							</span>
							<span className="text-xs font-bold tabular-nums text-[#00D632]">
								76 / 76 classified
							</span>
						</div>
						<div className="divide-y divide-white/5 text-sm">
							<MockRow
								icon={<SiUber className="h-4 w-4 text-slate-400 shrink-0" />}
								name="UBER *TRIP HELP.UBER.C"
								tag="Rideshare income"
								amount="+$842.10"
								green
							/>
							<MockRow
								icon={
									<SiDoordash className="h-4 w-4 text-slate-400 shrink-0" />
								}
								name="DOORDASH DASHER PAY"
								tag="Delivery income"
								amount="+$311.55"
								green
							/>
							<MockRow
								name="VERIZON WIRELESS PMT"
								tag="Phone — 50% deductible"
								amount="−$94.00"
							/>
							<MockRow
								name="SHELL OIL 5742199"
								tag="Fuel — deductible"
								amount="−$48.22"
							/>
						</div>
						<div className="px-5 py-4 bg-slate-950/60 flex flex-wrap gap-x-8 gap-y-2 items-center justify-between">
							<div>
								<p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
									Deductions found
								</p>
								<p className="font-space-grotesk font-bold text-xl tabular-nums text-[#00D632]">
									$2,593.74
								</p>
							</div>
							<div>
								<p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
									Set aside for Q3
								</p>
								<p className="font-space-grotesk font-bold text-xl tabular-nums text-white">
									$1,840
								</p>
							</div>
							<div>
								<p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
									Platforms detected
								</p>
								<p className="font-space-grotesk font-bold text-xl tabular-nums text-white">
									7
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Platform marquee */}
			<section className="pb-20">
				<p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
					Recognizes income from 50+ platforms
				</p>
				<div className="relative overflow-hidden">
					<div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
					<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />
					<div className="flex animate-marquee">
						{[...Array(2)].map((_, i) => (
							<div key={i} className="flex items-center gap-4 px-2">
								{PLATFORMS.map(({ icon: Icon, name }) => (
									<div
										key={name}
										className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-full px-4 py-2 whitespace-nowrap"
									>
										<Icon className="h-4 w-4 text-slate-400" />
										<span className="text-xs font-semibold text-slate-300">
											{name}
										</span>
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Three proof blocks */}
			<section className="px-6 pb-20">
				<div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
					{PROOF.map((p) => (
						<div
							key={p.title}
							className="rounded-2xl border border-white/10 bg-slate-900 p-6 hover:border-white/25 transition-colors"
						>
							<p className="font-space-grotesk font-bold text-2xl mb-3 text-[#00D632]">
								{p.stat}
							</p>
							<h3 className="font-semibold text-white mb-2">{p.title}</h3>
							<p className="text-sm text-slate-400 leading-relaxed">{p.body}</p>
						</div>
					))}
				</div>
			</section>

			{/* Final CTA */}
			<section className="px-6 pb-24">
				<div className="max-w-3xl mx-auto text-center rounded-2xl border border-white/10 bg-slate-900 px-8 py-12">
					<h2 className="font-space-grotesk font-bold text-2xl md:text-3xl mb-3">
						Your books, sorted before your coffee&apos;s cold.
					</h2>
					<p className="text-sm text-slate-400 mb-7">
						One statement is all it takes to see what you&apos;ve been missing.
					</p>
					<Link
						href="/signup"
						className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-slate-950 bg-[#00D632] hover:scale-[1.03] transition-transform"
					>
						Upload a statement — free
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-white/5 px-6 py-8">
				<div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
					<div className="flex items-center gap-2">
						<ShiftMark className="h-4 w-auto text-[#00D632]" />
						<span>© {new Date().getFullYear()} Stub</span>
					</div>
					<div className="flex items-center gap-5">
						<Link href="/privacy" className="hover:text-white transition-colors">
							Privacy
						</Link>
						<Link href="/terms" className="hover:text-white transition-colors">
							Terms
						</Link>
						<Link href="/blog" className="hover:text-white transition-colors">
							Blog
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}

function MockRow({
	icon,
	name,
	tag,
	amount,
	green,
}: {
	icon?: React.ReactNode;
	name: string;
	tag: string;
	amount: string;
	green?: boolean;
}) {
	return (
		<div className="px-5 py-3 flex items-center justify-between gap-3">
			<div className="flex items-center gap-3 min-w-0">
				{icon ?? <span className="h-4 w-4 rounded-full bg-slate-700 shrink-0" />}
				<span className="text-slate-300 font-mono text-xs truncate">{name}</span>
			</div>
			<div className="flex items-center gap-3 shrink-0">
				<span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
					{tag}
				</span>
				<span
					className={`tabular-nums text-sm font-semibold ${
						green ? 'text-[#00D632]' : 'text-slate-200'
					}`}
				>
					{amount}
				</span>
			</div>
		</div>
	);
}
