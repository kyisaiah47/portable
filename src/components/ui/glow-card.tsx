import * as React from 'react';
import { cn } from '@/lib/utils';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

/* The one card surface used across the app: slate with an indigo wash. */
export const GLOW_SURFACE =
	'relative overflow-hidden border border-indigo-400/20 bg-gradient-to-br from-indigo-600/15 via-slate-900 to-slate-900';

export function GlowCard({
	className,
	...props
}: React.ComponentProps<typeof Card>) {
	return <Card className={cn(GLOW_SURFACE, className)} {...props} />;
}

/* AI-feature variant: purple border + signature gradient hairline on top. */
export function AICard({
	className,
	children,
	...props
}: React.ComponentProps<typeof Card>) {
	return (
		<Card
			className={cn(
				'relative overflow-hidden border-purple-400/25 bg-slate-900',
				className
			)}
			{...props}
		>
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
			{children}
		</Card>
	);
}

/* Standard stat tile: label, big numeral, optional sub line + corner action. */
export function StatCard({
	label,
	value,
	sub,
	footer,
	action,
	gradientValue = false,
	className,
}: {
	label: React.ReactNode;
	value: React.ReactNode;
	/** Muted context line (block-style second footer line). */
	sub?: React.ReactNode;
	/** Bold takeaway line (block-style first footer line). */
	footer?: React.ReactNode;
	action?: React.ReactNode;
	gradientValue?: boolean;
	className?: string;
}) {
	return (
		<GlowCard className={className}>
			<CardHeader>
				<CardDescription>{label}</CardDescription>
				<CardTitle
					className={cn(
						'text-3xl font-bold tabular-nums font-space-grotesk',
						gradientValue
							? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
							: 'text-white'
					)}
				>
					{value}
				</CardTitle>
				{action && <CardAction>{action}</CardAction>}
			</CardHeader>
			{(footer || sub) && (
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					{footer && (
						<div className="line-clamp-1 flex gap-2 font-medium text-white">
							{footer}
						</div>
					)}
					{sub && <div className="text-slate-400">{sub}</div>}
				</CardFooter>
			)}
		</GlowCard>
	);
}
