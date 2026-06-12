'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md p-8 gap-6">
				<DialogHeader className="space-y-1.5">
					<div className="flex items-center gap-2 mb-4">
						<ShiftMark className="h-6 w-auto" />
						<span className="text-lg font-bold tracking-tight font-space-grotesk text-foreground">
							Stub
						</span>
					</div>
					<DialogTitle className="font-space-grotesk text-xl">
						{mode === 'signup' ? 'Create your account' : 'Welcome back'}
					</DialogTitle>
					<DialogDescription>
						{mode === 'signup'
							? 'Free to start. One CSV is all it takes.'
							: 'Log in to your books.'}
					</DialogDescription>
				</DialogHeader>

				<LoginForm
					isLogin={mode === 'login'}
					onSuccess={() =>
						router.push(mode === 'signup' ? '/onboarding' : '/dashboard')
					}
				/>

				<button
					onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
					className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
				>
					{mode === 'signup'
						? 'Already have an account? Log in'
						: 'New here? Create an account'}
				</button>
			</DialogContent>
		</Dialog>
	);
}
