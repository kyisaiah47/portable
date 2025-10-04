import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateWeeklyEarningsEmail, generateWeeklyEarningsTextEmail } from '@/lib/email-templates';

// Initialize Supabase Admin client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or authorized
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users who have email reports enabled
    const { data: users, error: usersError } = await supabaseAdmin
      .from('portable_users')
      .select('id, email, first_name, last_name')
      .eq('email_reports_enabled', true); // You'll need to add this column

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'No users with email reports enabled' });
    }

    const results = await Promise.allSettled(
      users.map(async (user) => {
        try {
          // Calculate date range (last 7 days)
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);

          const prevStartDate = new Date(startDate);
          prevStartDate.setDate(prevStartDate.getDate() - 7);

          // Fetch this week's transactions
          const { data: thisWeekTx, error: txError } = await supabaseAdmin
            .from('portable_transactions')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', endDate.toISOString().split('T')[0])
            .gt('amount', 0); // Only income (positive amounts)

          if (txError) throw txError;

          // Fetch last week's transactions for comparison
          const { data: lastWeekTx } = await supabaseAdmin
            .from('portable_transactions')
            .select('amount')
            .eq('user_id', user.id)
            .gte('date', prevStartDate.toISOString().split('T')[0])
            .lt('date', startDate.toISOString().split('T')[0])
            .gt('amount', 0);

          // Calculate totals
          const thisWeekTotal = thisWeekTx?.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) || 0;
          const lastWeekTotal = lastWeekTx?.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) || 0;

          // Skip if no earnings this week
          if (thisWeekTotal === 0) {
            return { userId: user.id, status: 'skipped', reason: 'no earnings' };
          }

          // Calculate earnings change
          const earningsChange = lastWeekTotal > 0
            ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
            : 0;

          // Parse platform breakdown
          const platformMap = new Map<string, number>();
          thisWeekTx?.forEach((tx) => {
            // Extract platform from merchant name or category
            const platform = extractPlatform(tx.merchant_name || tx.name || 'Other');
            platformMap.set(platform, (platformMap.get(platform) || 0) + parseFloat(tx.amount));
          });

          const platformBreakdown = Array.from(platformMap.entries())
            .map(([platform, amount]) => ({
              platform,
              amount,
              percentage: Math.round((amount / thisWeekTotal) * 100),
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); // Top 5 platforms

          const topPlatform = platformBreakdown[0]?.platform || 'N/A';

          // Calculate taxes set aside (30% rule)
          const taxesSetAside = thisWeekTotal * 0.30;

          // Get savings goal (you'll need to add this to user settings)
          const savingsGoal = 5000; // Default goal
          const currentSavings = 1250; // Fetch from savings table
          const savingsProgress = Math.min((currentSavings / savingsGoal) * 100, 100);

          // Generate insights
          const insights = generateInsights({
            thisWeekTotal,
            lastWeekTotal,
            earningsChange,
            platformBreakdown,
            topPlatform,
          });

          // Prepare email data
          const emailData = {
            userName: user.first_name,
            weekStart: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weekEnd: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            totalEarnings: thisWeekTotal,
            earningsChange: Math.round(earningsChange),
            platformBreakdown,
            topPlatform,
            taxesSetAside: Math.round(taxesSetAside),
            savingsGoal,
            savingsProgress: Math.round(savingsProgress),
            insights,
          };

          // Generate email HTML and text
          const htmlContent = generateWeeklyEarningsEmail(emailData);
          const textContent = generateWeeklyEarningsTextEmail(emailData);

          // Send email using your email service (Resend, SendGrid, etc.)
          await sendEmail({
            to: user.email,
            subject: `Your weekly earnings: $${thisWeekTotal.toLocaleString()} 📊`,
            html: htmlContent,
            text: textContent,
          });

          return { userId: user.id, status: 'sent', amount: thisWeekTotal };
        } catch (error) {
          console.error(`Error sending report to user ${user.id}:`, error);
          return { userId: user.id, status: 'failed', error: String(error) };
        }
      })
    );

    const summary = {
      total: users.length,
      sent: results.filter((r) => r.status === 'fulfilled' && (r.value as any).status === 'sent').length,
      skipped: results.filter((r) => r.status === 'fulfilled' && (r.value as any).status === 'skipped').length,
      failed: results.filter((r) => r.status === 'rejected' || (r.value as any).status === 'failed').length,
    };

    return NextResponse.json({
      message: 'Weekly reports processed',
      summary,
      results: results.map((r) => r.status === 'fulfilled' ? r.value : { status: 'failed' }),
    });
  } catch (error) {
    console.error('Error in weekly reports cron:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to extract platform from transaction name
function extractPlatform(name: string): string {
  const nameUpper = name.toUpperCase();

  const platforms = [
    { keywords: ['UBER', 'UBER TRIP'], name: 'Uber' },
    { keywords: ['LYFT'], name: 'Lyft' },
    { keywords: ['DOORDASH', 'DOOR DASH'], name: 'DoorDash' },
    { keywords: ['UBEREATS', 'UBER EATS'], name: 'Uber Eats' },
    { keywords: ['GRUBHUB'], name: 'Grubhub' },
    { keywords: ['INSTACART'], name: 'Instacart' },
    { keywords: ['UPWORK'], name: 'Upwork' },
    { keywords: ['FIVERR'], name: 'Fiverr' },
    { keywords: ['AIRBNB'], name: 'Airbnb' },
    { keywords: ['TURO'], name: 'Turo' },
  ];

  for (const platform of platforms) {
    if (platform.keywords.some((kw) => nameUpper.includes(kw))) {
      return platform.name;
    }
  }

  return 'Other';
}

// Helper function to generate personalized insights
function generateInsights(data: {
  thisWeekTotal: number;
  lastWeekTotal: number;
  earningsChange: number;
  platformBreakdown: { platform: string; amount: number }[];
  topPlatform: string;
}): string[] {
  const insights: string[] = [];

  // Earnings trend insight
  if (data.earningsChange > 10) {
    insights.push(`Great week! Your earnings are up ${Math.round(data.earningsChange)}% from last week. Keep up the momentum!`);
  } else if (data.earningsChange < -10) {
    insights.push(`Your earnings dipped ${Math.abs(Math.round(data.earningsChange))}% this week. Consider working peak hours or trying a new platform.`);
  } else {
    insights.push(`Your earnings are stable week-over-week. Consistency is key to building financial security.`);
  }

  // Platform diversification insight
  if (data.platformBreakdown.length === 1) {
    insights.push(`You're earning from only one platform. Diversifying across 2-3 platforms can increase stability by 40%.`);
  } else if (data.platformBreakdown.length >= 3) {
    insights.push(`You're working across ${data.platformBreakdown.length} platforms—excellent diversification for income stability!`);
  }

  // Top platform insight
  const topPlatformPercentage = Math.round((data.platformBreakdown[0]?.amount / data.thisWeekTotal) * 100);
  if (topPlatformPercentage > 70) {
    insights.push(`${data.topPlatform} makes up ${topPlatformPercentage}% of your income. Consider expanding to other platforms to reduce dependency.`);
  }

  return insights.slice(0, 3); // Max 3 insights
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  // Email service is optional - only send if RESEND_API_KEY is configured
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL] Skipping email (no RESEND_API_KEY configured): ${params.subject}`);
    return;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Portable <reports@portable.com>',
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    console.log(`[EMAIL] Sent to ${params.to}: ${params.subject}`);
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${params.to}:`, error);
    throw error;
  }
}
