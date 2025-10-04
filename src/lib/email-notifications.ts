import { supabase } from './supabase';
import { parseTransactions, calculateStabilityScore } from './income-parser';
import { calculateTaxes, getQuarterlyDeadlines } from './tax-calculator';
import {
  generateWeeklyEarningsEmail,
  generateWeeklyEarningsTextEmail,
  generateTaxReminderEmail,
  generateTaxReminderTextEmail
} from './email-templates';

// Note: This requires Supabase email configuration to be set up
// The user will need to configure SMTP settings in their Supabase project

/**
 * Generate and send weekly earnings report email
 */
export async function sendWeeklyEarningsReport(userId: string): Promise<boolean> {
  try {
    // Get user info
    const { data: user, error: userError } = await supabase
      .from('portable_users')
      .select('email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('Failed to fetch user:', userError);
      return false;
    }

    // Get transactions from last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const { data: thisWeekTransactions } = await supabase
      .from('portable_transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', oneWeekAgo.toISOString())
      .order('date', { ascending: false });

    const { data: lastWeekTransactions } = await supabase
      .from('portable_transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', twoWeeksAgo.toISOString())
      .lt('date', oneWeekAgo.toISOString())
      .order('date', { ascending: false });

    if (!thisWeekTransactions || thisWeekTransactions.length === 0) {
      console.log('No transactions this week for user:', userId);
      return false;
    }

    // Parse income data
    const thisWeekParsed = parseTransactions(thisWeekTransactions.map(tx => ({
      id: tx.id,
      date: new Date(tx.date),
      description: tx.name,
      amount: tx.amount,
      type: tx.amount > 0 ? 'credit' : 'debit' as 'credit' | 'debit',
    })));

    const lastWeekParsed = parseTransactions(lastWeekTransactions?.map(tx => ({
      id: tx.id,
      date: new Date(tx.date),
      description: tx.name,
      amount: tx.amount,
      type: tx.amount > 0 ? 'credit' : 'debit' as 'credit' | 'debit',
    })) || []);

    // Calculate week-over-week change
    const earningsChange = lastWeekParsed.totalIncome > 0
      ? ((thisWeekParsed.totalIncome - lastWeekParsed.totalIncome) / lastWeekParsed.totalIncome) * 100
      : 0;

    // Get platform breakdown
    const platformBreakdown = Array.from(thisWeekParsed.byPlatform.entries()).map(([platform, payments]) => {
      const total = (payments as any[]).reduce((sum, p) => sum + p.amount, 0);
      return {
        platform,
        amount: total,
        percentage: Math.round((total / thisWeekParsed.totalIncome) * 100),
      };
    }).sort((a, b) => b.amount - a.amount);

    const topPlatform = platformBreakdown[0]?.platform || 'Unknown';

    // Calculate estimated taxes (30% rule of thumb for self-employed)
    const taxesSetAside = Math.round(thisWeekParsed.totalIncome * 0.30);

    // Generate insights
    const insights = generateWeeklyInsights(thisWeekParsed.totalIncome, lastWeekParsed.totalIncome, platformBreakdown);

    // Sample savings goal (in production, this would come from user settings)
    const savingsGoal = 10000;
    const savingsProgress = Math.min(100, (thisWeekParsed.totalIncome / savingsGoal) * 100);

    const emailData = {
      userName: user.first_name,
      weekStart: oneWeekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekEnd: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalEarnings: Math.round(thisWeekParsed.totalIncome),
      earningsChange: Math.round(earningsChange),
      platformBreakdown,
      topPlatform,
      taxesSetAside,
      savingsGoal,
      savingsProgress: Math.round(savingsProgress),
      insights,
    };

    const htmlBody = generateWeeklyEarningsEmail(emailData);
    const textBody = generateWeeklyEarningsTextEmail(emailData);

    // Send email via Supabase (requires SMTP configuration)
    // Note: This is a placeholder - actual implementation requires Supabase Edge Function
    console.log('Would send weekly earnings email to:', user.email);
    console.log('Email data:', emailData);

    // TODO: Implement actual email sending via Supabase Edge Function
    // await supabase.functions.invoke('send-email', {
    //   body: {
    //     to: user.email,
    //     subject: `Your Weekly Earnings Report: $${emailData.totalEarnings.toLocaleString()}`,
    //     html: htmlBody,
    //     text: textBody,
    //   }
    // });

    return true;
  } catch (error) {
    console.error('Failed to send weekly earnings email:', error);
    return false;
  }
}

/**
 * Generate weekly insights based on earnings data
 */
function generateWeeklyInsights(thisWeek: number, lastWeek: number, platforms: any[]): string[] {
  const insights: string[] = [];

  // Earnings trend insight
  if (thisWeek > lastWeek * 1.1) {
    insights.push(`🎉 Great week! You earned ${Math.round(((thisWeek - lastWeek) / lastWeek) * 100)}% more than last week. Keep up the momentum!`);
  } else if (thisWeek < lastWeek * 0.9) {
    insights.push(`📉 Earnings dipped this week. Consider focusing on your highest-earning platform or exploring new opportunities.`);
  } else {
    insights.push(`📊 Your earnings are stable. Consistency is key for long-term financial security.`);
  }

  // Platform diversification insight
  if (platforms.length === 1) {
    insights.push(`⚠️ You're earning from only one platform. Consider diversifying your income sources to reduce risk.`);
  } else if (platforms.length >= 3) {
    insights.push(`✅ You're earning from ${platforms.length} platforms. Great diversification!`);
  }

  // Tax reminder
  const weeklyTaxEstimate = Math.round(thisWeek * 0.30);
  insights.push(`💰 Remember to set aside ~$${weeklyTaxEstimate} for taxes (30% of earnings).`);

  return insights;
}

/**
 * Send tax deadline reminder emails
 */
export async function sendTaxDeadlineReminders(): Promise<void> {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('portable_users')
      .select('id, email, first_name');

    if (usersError || !users) {
      console.error('Failed to fetch users:', usersError);
      return;
    }

    for (const user of users) {
      await sendTaxReminderForUser(user.id, user.email, user.first_name, currentYear);
    }
  } catch (error) {
    console.error('Failed to send tax deadline reminders:', error);
  }
}

/**
 * Send tax reminder for a specific user
 */
async function sendTaxReminderForUser(
  userId: string,
  email: string,
  firstName: string,
  year: number
): Promise<boolean> {
  try {
    // Get parsed income data
    const { data: parsedIncome } = await supabase
      .from('portable_parsed_income')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!parsedIncome) {
      console.log('No income data for user:', userId);
      return false;
    }

    // Calculate quarterly payment estimate
    const annualIncome = parsedIncome.total_income * 4; // Rough estimate
    const taxCalc = calculateTaxes(annualIncome, 0);
    const quarterlyPayment = Math.round(taxCalc.quarterlyPayment);

    // Get next quarterly deadline
    const deadlines = getQuarterlyDeadlines(year, quarterlyPayment);
    const now = new Date();
    const nextDeadline = deadlines.find(d => d.dueDate > now);

    if (!nextDeadline) {
      console.log('No upcoming deadline for user:', userId);
      return false;
    }

    // Calculate days until deadline
    const daysUntilDue = Math.ceil((nextDeadline.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Only send reminders at specific intervals (30, 14, 7, 3, 1 days before)
    const reminderDays = [30, 14, 7, 3, 1];
    if (!reminderDays.includes(daysUntilDue)) {
      console.log('Not a reminder day for user:', userId, 'days until due:', daysUntilDue);
      return false;
    }

    // Calculate YTD income
    const startOfYear = new Date(year, 0, 1);
    const { data: ytdTransactions } = await supabase
      .from('portable_transactions')
      .select('amount')
      .eq('user_id', userId)
      .gte('date', startOfYear.toISOString());

    const ytdIncome = ytdTransactions?.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0) || 0;

    // Generate email
    const emailData = {
      userName: firstName,
      quarterName: `Q${Math.ceil((nextDeadline.dueDate.getMonth() + 1) / 3)} ${year}`,
      dueDate: nextDeadline.dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      daysUntilDue,
      estimatedPayment: quarterlyPayment,
      yearToDateIncome: Math.round(ytdIncome),
      lastQuarterIncome: Math.round(parsedIncome.total_income),
    };

    const htmlBody = generateTaxReminderEmail(emailData);
    const textBody = generateTaxReminderTextEmail(emailData);

    console.log('Would send tax reminder to:', email);
    console.log('Email data:', emailData);

    // TODO: Implement actual email sending via Supabase Edge Function
    // await supabase.functions.invoke('send-email', {
    //   body: {
    //     to: email,
    //     subject: `${emailData.quarterName} Tax Deadline: ${daysUntilDue} Days Left`,
    //     html: htmlBody,
    //     text: textBody,
    //   }
    // });

    return true;
  } catch (error) {
    console.error('Failed to send tax reminder:', error);
    return false;
  }
}

/**
 * Schedule weekly reports to run every Monday
 * In production, this would be a cron job or Supabase scheduled function
 */
export async function scheduleWeeklyReports(): Promise<void> {
  const { data: users } = await supabase
    .from('portable_users')
    .select('id');

  if (!users) return;

  for (const user of users) {
    await sendWeeklyEarningsReport(user.id);
  }
}
