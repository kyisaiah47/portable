import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
	generateTaxReminderEmail,
	generateTaxReminderTextEmail,
} from '@/lib/email-templates';
import { calculateTaxes, getQuarterlyDeadlines } from '@/lib/tax-calculator';

// Admin client — cron runs without a user session, RLS bypassed deliberately.
const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	{ auth: { autoRefreshToken: false, persistSession: false } }
);

// Send reminders this many days before each IRS quarterly deadline.
const REMINDER_DAYS = [30, 14, 7, 3, 1];

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const now = new Date();
	const year = now.getFullYear();

	const { data: users, error } = await supabaseAdmin
		.from('stub_users')
		.select('id, email, first_name, email_reports_enabled, email_preferences')
		.eq('email_reports_enabled', true);

	if (error) {
		return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
	}

	let sent = 0;
	for (const user of users ?? []) {
		try {
			const prefs = (user.email_preferences ?? {}) as { taxReminders?: boolean };
			if (prefs.taxReminders === false) continue;

			const { data: parsedIncome } = await supabaseAdmin
				.from('stub_parsed_income')
				.select('total_income')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(1)
				.single();
			if (!parsedIncome) continue;

			const taxCalc = calculateTaxes(parsedIncome.total_income * 4, 0);
			const deadlines = getQuarterlyDeadlines(year, Math.round(taxCalc.quarterlyPayment));
			const next = deadlines.find((d) => d.dueDate > now);
			if (!next) continue;

			const daysUntilDue = Math.ceil(
				(next.dueDate.getTime() - now.getTime()) / 86_400_000
			);
			if (!REMINDER_DAYS.includes(daysUntilDue)) continue;

			const data = {
				userName: user.first_name || 'there',
				quarterName: `${next.quarter} ${year}`,
				dueDate: next.dueDate.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				}),
				daysUntilDue,
				estimatedPayment: Math.round(taxCalc.quarterlyPayment),
				yearToDateIncome: Math.round(parsedIncome.total_income),
				lastQuarterIncome: Math.round(parsedIncome.total_income),
			};

			await sendEmail({
				to: user.email,
				subject: `${data.quarterName} estimated taxes due in ${daysUntilDue} day${
					daysUntilDue === 1 ? '' : 's'
				} — ~$${data.estimatedPayment.toLocaleString()}`,
				html: generateTaxReminderEmail(data),
				text: generateTaxReminderTextEmail(data),
			});
			sent++;
		} catch (err) {
			console.error(`[TAX-REMINDER] Failed for ${user.id}:`, err);
		}
	}

	return NextResponse.json({ ok: true, sent });
}

async function sendEmail(params: {
	to: string;
	subject: string;
	html: string;
	text: string;
}) {
	if (!process.env.RESEND_API_KEY) {
		console.log(`[EMAIL] Skipping (no RESEND_API_KEY): ${params.subject}`);
		return;
	}
	const { Resend } = await import('resend');
	const resend = new Resend(process.env.RESEND_API_KEY);
	await resend.emails.send({
		from: 'Stub <reminders@stub.app>',
		to: params.to,
		subject: params.subject,
		html: params.html,
		text: params.text,
	});
}
