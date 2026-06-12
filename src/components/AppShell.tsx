'use client';

import { ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface ShellUser {
	firstName: string;
	email: string;
}

interface AppShellProps {
	user: ShellUser;
	onLogout: () => void;
	children: ReactNode;
}

/* The dashboard-01 shell (same block remi uses), themed dark. */
export default function AppShell({ user, onLogout, children }: AppShellProps) {
	return (
		<div className="bg-background text-foreground">
			<SidebarProvider
				style={
					{
						'--sidebar-width': 'calc(var(--spacing) * 72)',
						'--header-height': 'calc(var(--spacing) * 12)',
					} as React.CSSProperties
				}
			>
				<AppSidebar
					variant="inset"
					user={{ name: user.firstName, email: user.email }}
					onLogout={onLogout}
				/>
				<SidebarInset>
					<SiteHeader />
					<div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
