'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import { ShiftMark } from '@/components/Logo';

export default function AuthModal({
	initialMode,
	onClose,
}: {
	initialMode: 'login' | 'signup';
	onClose: () => void;
}) {
	const router = useRouter();
	const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

	return (
		<div
			className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-md rounded-2xl bg-white text-gray-900 p-8 shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>

				<div className="flex items-center gap-2 mb-6">
					<ShiftMark className="h-5 w-auto" />
					<span className="text-[17px] font-semibold tracking-tight font-space-grotesk">
						Stub
					</span>
				</div>

				<h2 className="text-xl font-bold mb-1 font-space-grotesk">
					{mode === 'signup' ? 'Create your account' : 'Welcome back'}
				</h2>
				<p className="text-sm text-gray-500 mb-6">
					{mode === 'signup'
						? 'Free to start. One CSV is all it takes.'
						: 'Log in to your books.'}
				</p>

				<LoginForm
					isLogin={mode === 'login'}
					onSuccess={() =>
						router.push(mode === 'signup' ? '/onboarding' : '/dashboard')
					}
				/>

				<button
					onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
					className="mt-5 w-full text-center text-xs text-gray-500 hover:text-gray-900 transition-colors"
				>
					{mode === 'signup'
						? 'Already have an account? Log in'
						: 'New here? Create an account'}
				</button>
			</div>
		</div>
	);
}
