'use client';

import { Download, Upload, Sparkles } from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

const STEPS = [
	{
		icon: Download,
		title: 'Grab a statement',
		body: 'Export a CSV from your bank — or use our sample to test-drive.',
	},
	{
		icon: Upload,
		title: 'Upload it below',
		body: 'Stub finds gig income and deductible expenses automatically.',
	},
	{
		icon: Sparkles,
		title: 'See your money',
		body: 'Income by platform, write-offs caught, and your quarterly tax number.',
	},
];

export default function FirstRunWizard({
	userId,
	firstName,
	onUploadComplete,
}: {
	userId: string;
	firstName: string;
	onUploadComplete: () => void;
}) {
	return (
		<div className="max-w-3xl mx-auto space-y-8">
			<div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-lg p-8">
				<h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
					Welcome, {firstName}. Let&apos;s set up your books.
				</h1>
				<p className="text-base text-slate-300">
					One upload is all it takes — about 30 seconds, start to finish.
				</p>
			</div>

			{/* Steps */}
			<div className="grid sm:grid-cols-3 gap-4">
				{STEPS.map((s, i) => (
					<div
						key={s.title}
						className="bg-slate-900 border border-white/10 rounded-lg p-5"
					>
						<div className="flex items-center gap-2.5 mb-3">
							<span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-bold text-white">
								{i + 1}
							</span>
							<s.icon className="h-4 w-4 text-indigo-400" />
						</div>
						<h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
						<p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
					</div>
				))}
			</div>

			{/* The actual upload — sample CSV button lives inside */}
			<CSVUpload userId={userId} onUploadComplete={onUploadComplete} />
		</div>
	);
}
