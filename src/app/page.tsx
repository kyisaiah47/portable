'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ShiftMark } from '@/components/Logo';
import AuthModal from '@/components/AuthModal';
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

function Home() {
	const [auth, setAuth] = useState<'login' | 'signup' | null>(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const q = searchParams.get('auth');
		if (q === 'login' || q === 'signup') setAuth(q);
	}, [searchParams]);

	return (
		<div className="min-h-screen bg-slate-950 font-inter text-white">
			{/* Navigation */}
			<nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center space-x-2.5">
						<ShiftMark className="h-5 w-auto" />
						<span className="text-lg font-bold text-white font-space-grotesk">
							Stub
						</span>
					</div>
					<div className="flex items-center space-x-4">
						<button
							onClick={() => setAuth('login')}
							className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
						>
							Log in
						</button>
						<button
							onClick={() => setAuth('signup')}
							className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
						>
							Get started
						</button>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="pt-16 pb-16 px-6 relative overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
					<div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
					<div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
				</div>

				<div className="max-w-6xl mx-auto relative z-10">
					<div className="text-center max-w-3xl mx-auto">
						<div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-white/10 mb-6">
							<ShiftMark className="h-3.5 w-auto" />
							<span className="text-xs font-semibold text-white">
								Built for 60M+ independent workers
							</span>
						</div>

						<h1 className="text-5xl md:text-6xl font-bold mb-6 leading-[1.02] font-space-grotesk">
							<span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
								Keep more
							</span>
							<br />
							<span className="text-white">of what you earn.</span>
						</h1>

						<p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto font-light">
							Upload a bank statement. Stub finds your gig income across 50+
							platforms, catches the deductions you&apos;re missing, and tells
							you exactly what to set aside for taxes.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
							<button
								onClick={() => setAuth('signup')}
								className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-7 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-2xl shadow-purple-600/50 inline-flex items-center gap-2"
							>
								<span>Get Stub — free</span>
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</button>
							<p className="text-xs text-slate-500">
								No bank login. No card. One CSV.
							</p>
						</div>
					</div>

					{/* Parsed statement mock */}
					<div className="max-w-3xl mx-auto relative group">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40 rounded-3xl blur-xl opacity-60" />
						<div className="relative rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur overflow-hidden">
							<div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
								<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
									statement_june.csv — parsed
								</span>
								<span className="text-xs font-bold tabular-nums bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
									76 / 76 classified
								</span>
							</div>
							<div className="divide-y divide-white/5 text-sm">
								<MockRow
									icon={<SiUber className="h-4 w-4 text-slate-400 shrink-0" />}
									name="UBER *TRIP HELP.UBER.C"
									tag="Rideshare income"
									amount="+$842.10"
									accent="text-blue-400"
								/>
								<MockRow
									icon={
										<SiDoordash className="h-4 w-4 text-slate-400 shrink-0" />
									}
									name="DOORDASH DASHER PAY"
									tag="Delivery income"
									amount="+$311.55"
									accent="text-blue-400"
								/>
								<MockRow
									name="VERIZON WIRELESS PMT"
									tag="Phone — 50% deductible"
									amount="−$94.00"
									accent="text-purple-400"
								/>
								<MockRow
									name="SHELL OIL 5742199"
									tag="Fuel — deductible"
									amount="−$48.22"
									accent="text-purple-400"
								/>
							</div>
							<div className="px-5 py-4 bg-slate-950/70 flex flex-wrap gap-x-10 gap-y-3 items-center justify-between">
								<MockStat label="Deductions found" value="$2,593.74" grad="from-purple-400 to-pink-400" />
								<MockStat label="Set aside for Q3" value="$1,840" grad="from-blue-400 to-purple-400" />
								<MockStat label="Platforms detected" value="7" grad="from-pink-400 to-blue-400" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Platform marquee */}
			<section className="pb-16">
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
										className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 whitespace-nowrap"
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

			{/* Three gradient feature cards */}
			<section className="px-6 pb-20">
				<div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
					<GlowCard
						from="from-blue-600"
						to="to-blue-700"
						glowFrom="from-blue-500"
						glowTo="to-blue-600"
						border="border-blue-400/50"
						eyebrow="Income"
						eyebrowColor="text-blue-200"
						title="Found"
						body="Every gig payment recognized — Uber vs. Uber Eats vs. your actual dinner. Hybrid AI sorts a full statement in seconds."
						bodyColor="text-blue-200"
					/>
					<GlowCard
						from="from-purple-600"
						to="to-purple-700"
						glowFrom="from-purple-500"
						glowTo="to-purple-600"
						border="border-purple-400/50"
						eyebrow="Deductions"
						eyebrowColor="text-purple-200"
						title="Caught"
						body="Phone, mileage, subscriptions — every write-off with the IRS-grade reason behind it. Ask “can I deduct this?” about anything."
						bodyColor="text-purple-200"
					/>
					<GlowCard
						from="from-pink-600"
						to="to-pink-700"
						glowFrom="from-pink-500"
						glowTo="to-pink-600"
						border="border-pink-400/50"
						eyebrow="Taxes"
						eyebrowColor="text-pink-200"
						title="Ready"
						body="Self-employment tax, federal estimate, quarterly deadlines — and a plain-English summary of what to set aside."
						bodyColor="text-pink-200"
					/>
				</div>
			</section>

			{/* Final CTA */}
			<section className="px-6 pb-24 relative overflow-hidden">
				<div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
				<div className="max-w-3xl mx-auto text-center relative z-10">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
						Your books, sorted before your{' '}
						<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							coffee&apos;s cold.
						</span>
					</h2>
					<p className="text-base text-slate-400 mb-8 max-w-xl mx-auto">
						One statement is all it takes to see what you&apos;ve been missing.
					</p>
					<button
						onClick={() => setAuth('signup')}
						className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-7 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-2xl shadow-purple-600/50"
					>
						Get Stub — free
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-white/10 px-6 py-8">
				<div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
					<div className="flex items-center gap-2">
						<ShiftMark className="h-4 w-auto" />
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

			{auth && (
				<AuthModal
					initialMode={auth}
					referralCode={searchParams.get('ref')}
					onClose={() => setAuth(null)}
				/>
			)}
		</div>
	);
}

function MockRow({
	icon,
	name,
	tag,
	amount,
	accent,
}: {
	icon?: React.ReactNode;
	name: string;
	tag: string;
	amount: string;
	accent: string;
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
				<span className={`tabular-nums text-sm font-semibold ${accent}`}>
					{amount}
				</span>
			</div>
		</div>
	);
}

function MockStat({
	label,
	value,
	grad,
}: {
	label: string;
	value: string;
	grad: string;
}) {
	return (
		<div>
			<p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
				{label}
			</p>
			<p
				className={`font-space-grotesk font-bold text-xl tabular-nums bg-gradient-to-r ${grad} bg-clip-text text-transparent`}
			>
				{value}
			</p>
		</div>
	);
}

function GlowCard({
	from,
	to,
	glowFrom,
	glowTo,
	border,
	eyebrow,
	eyebrowColor,
	title,
	body,
	bodyColor,
}: {
	from: string;
	to: string;
	glowFrom: string;
	glowTo: string;
	border: string;
	eyebrow: string;
	eyebrowColor: string;
	title: string;
	body: string;
	bodyColor: string;
}) {
	return (
		<div className="group relative">
			<div
				className={`absolute inset-0 bg-gradient-to-br ${glowFrom} ${glowTo} rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity`}
			/>
			<div
				className={`relative bg-gradient-to-br ${from} ${to} rounded-2xl p-6 border ${border} transform group-hover:-translate-y-2 transition-transform h-full`}
			>
				<div
					className={`text-xs ${eyebrowColor} font-semibold mb-3 uppercase tracking-wider`}
				>
					{eyebrow}
				</div>
				<div className="text-2xl font-black text-white mb-2 font-space-grotesk">
					{title}
				</div>
				<div className={`${bodyColor} text-sm leading-relaxed`}>{body}</div>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
			<Home />
		</Suspense>
	);
}
