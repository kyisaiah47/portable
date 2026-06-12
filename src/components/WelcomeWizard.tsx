'use client';

import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { ShiftMark } from '@/components/Logo';
import CSVUpload from '@/components/CSVUpload';

const STORY: Array<{
	eyebrow: string;
	heading: string;
	body: React.ReactNode;
	cta: string;
}> = [
	{
		eyebrow: 'Welcome to Stub',
		heading: 'Gig income is messy. Your books shouldn’t be.',
		body: (
			<>
				You get paid by Uber on Mondays, DoorDash on Wednesdays, a client on
				the 15th. None of them withhold taxes. None of them track your
				write-offs. <span className="text-white font-semibold">Stub is the
				back office your gig work never came with.</span>
			</>
		),
		cta: 'How does it work? →',
	},
	{
		eyebrow: 'How it works',
		heading: 'One bank statement. Everything sorted.',
		body: (
			<>
				Upload a CSV from your bank. Stub recognizes income from{' '}
				<span className="text-white font-semibold">50+ platforms</span>,
				flags deductible expenses with the IRS-grade reason behind each one,
				and computes{' '}
				<span className="text-white font-semibold">
					exactly what to set aside
				</span>{' '}
				for quarterly taxes. Obvious transactions are sorted instantly; the
				weird ones go to AI. Seconds, not weekends.
			</>
		),
		cta: 'Let’s do it →',
	},
];

export default function WelcomeWizard({
	userId,
	onClose,
	onUploadComplete,
}: {
	userId: string;
	onClose: () => void;
	onUploadComplete: () => void;
}) {
	const [step, setStep] = useState(0);
	const story = step < STORY.length ? STORY[step] : null;

	return (
		<div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
			<div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl shadow-purple-900/30">
				{/* Gradient header band */}
				<div className="relative h-28 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
					<div className="absolute -top-10 -left-8 w-44 h-44 bg-white/15 rounded-full blur-2xl" />
					<div className="absolute -bottom-12 right-10 w-52 h-52 bg-white/10 rounded-full blur-2xl" />
					<div className="absolute inset-0 flex items-center px-8">
						<div className="flex items-center gap-2.5">
							<ShiftMark className="h-7 w-auto text-white" gradient={false} />
							<span className="text-xl font-bold text-white font-space-grotesk tracking-tight">
								Stub
							</span>
						</div>
					</div>
					<button
						onClick={onClose}
						className="absolute right-4 top-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
						aria-label="Close"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="p-8">
					{story ? (
						<>
							<p className="text-[11px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
								{story.eyebrow}
							</p>
							<h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4 font-space-grotesk">
								{story.heading}
							</h2>
							<p className="text-base text-slate-300 leading-relaxed mb-10">
								{story.body}
							</p>
							<div className="flex items-center justify-between">
								<div className="flex gap-1.5">
									{[...STORY, null].map((_, i) => (
										<span
											key={i}
											className={`h-1.5 rounded-full transition-all ${
												i === step
													? 'w-6 bg-gradient-to-r from-blue-500 to-purple-500'
													: 'w-1.5 bg-white/20'
											}`}
										/>
									))}
								</div>
								<button
									onClick={() => setStep(step + 1)}
									className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-600/40"
								>
									{story.cta}
								</button>
							</div>
						</>
					) : (
						<>
							<p className="text-[11px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
								Step 3 of 3
							</p>
							<h2 className="text-2xl font-bold text-white leading-snug mb-2 font-space-grotesk">
								Upload your first statement.
							</h2>
							<p className="text-sm text-slate-400 mb-6">
								No statement handy? Hit{' '}
								<span className="text-slate-200 font-semibold">Sample CSV</span>{' '}
								below, then drop the downloaded file right back in.
							</p>
							<CSVUpload userId={userId} onUploadComplete={onUploadComplete} />
							<div className="mt-5 flex items-center justify-between">
								<div className="flex gap-1.5">
									{[...STORY, null].map((_, i) => (
										<span
											key={i}
											className={`h-1.5 rounded-full ${
												i === step
													? 'w-6 bg-gradient-to-r from-blue-500 to-purple-500'
													: 'w-1.5 bg-white/20'
											}`}
										/>
									))}
								</div>
								<button
									onClick={onClose}
									className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
								>
									Skip for now
									<ArrowRight className="h-3.5 w-3.5" />
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
