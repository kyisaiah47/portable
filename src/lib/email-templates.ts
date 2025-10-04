interface WeeklyReportData {
  userName: string;
  weekStart: string;
  weekEnd: string;
  totalEarnings: number;
  earningsChange: number; // Percentage change from last week
  platformBreakdown: {
    platform: string;
    amount: number;
    percentage: number;
  }[];
  topPlatform: string;
  taxesSetAside: number;
  savingsGoal: number;
  savingsProgress: number; // Percentage
  insights: string[];
}

export function generateWeeklyEarningsEmail(data: WeeklyReportData): string {
  const changeArrow = data.earningsChange >= 0 ? '📈' : '📉';
  const changeColor = data.earningsChange >= 0 ? '#10b981' : '#ef4444';
  const changeText = data.earningsChange >= 0 ? 'up' : 'down';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Earnings Report</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0f172a;
      color: #e2e8f0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .header-subtitle {
      color: #94a3b8;
      font-size: 14px;
    }
    .card {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .hero-stat {
      text-align: center;
      padding: 32px 24px;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
      margin-bottom: 32px;
    }
    .hero-amount {
      font-size: 48px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .hero-label {
      color: #94a3b8;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .change-indicator {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .platform-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .platform-row:last-child {
      border-bottom: none;
    }
    .platform-name {
      color: #e2e8f0;
      font-weight: 600;
    }
    .platform-amount {
      color: #ffffff;
      font-weight: 700;
    }
    .platform-percentage {
      color: #94a3b8;
      font-size: 12px;
      margin-left: 8px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-box {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;
    }
    .stat-label {
      color: #94a3b8;
      font-size: 12px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 8px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 4px;
    }
    .insight-item {
      padding: 12px;
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid #3b82f6;
      border-radius: 6px;
      margin-bottom: 12px;
      color: #e2e8f0;
      font-size: 14px;
    }
    .cta-button {
      display: block;
      width: 100%;
      padding: 16px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
      color: #ffffff;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 24px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #64748b;
      font-size: 12px;
    }
    .footer-link {
      color: #3b82f6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">Portable</div>
      <div class="header-subtitle">Your Weekly Earnings Report • ${data.weekStart} - ${data.weekEnd}</div>
    </div>

    <!-- Hero Stat -->
    <div class="hero-stat">
      <div class="hero-label">This Week You Earned</div>
      <div class="hero-amount">$${data.totalEarnings.toLocaleString()}</div>
      <div class="change-indicator" style="background-color: ${changeColor}20; color: ${changeColor};">
        ${changeArrow} ${Math.abs(data.earningsChange)}% ${changeText} from last week
      </div>
    </div>

    <!-- Key Stats -->
    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">Taxes Set Aside</div>
        <div class="stat-value">$${data.taxesSetAside.toLocaleString()}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Top Platform</div>
        <div class="stat-value" style="font-size: 18px;">${data.topPlatform}</div>
      </div>
    </div>

    <!-- Platform Breakdown -->
    <div class="card">
      <div class="section-title">Platform Breakdown</div>
      ${data.platformBreakdown.map(platform => `
        <div class="platform-row">
          <div class="platform-name">${platform.platform}</div>
          <div>
            <span class="platform-amount">$${platform.amount.toLocaleString()}</span>
            <span class="platform-percentage">${platform.percentage}%</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Savings Progress -->
    <div class="card">
      <div class="section-title">Savings Goal Progress</div>
      <div style="margin-bottom: 8px;">
        <span style="color: #ffffff; font-weight: 600;">$${(data.savingsGoal * data.savingsProgress / 100).toFixed(0)}</span>
        <span style="color: #94a3b8;"> of $${data.savingsGoal.toLocaleString()} goal</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${data.savingsProgress}%;"></div>
      </div>
    </div>

    <!-- Insights -->
    <div class="card">
      <div class="section-title">💡 Insights & Tips</div>
      ${data.insights.map(insight => `
        <div class="insight-item">${insight}</div>
      `).join('')}
    </div>

    <!-- CTA -->
    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://getportable.app'}/dashboard" class="cta-button">
      View Full Dashboard →
    </a>

    <!-- Footer -->
    <div class="footer">
      <p>You're receiving this because you enabled weekly earnings reports in Portable.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://getportable.app'}/settings" class="footer-link">Manage preferences</a> •
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://getportable.app'}/privacy" class="footer-link">Privacy</a>
      </p>
      <p style="margin-top: 16px;">© 2025 Portable. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Plain text version for email clients that don't support HTML
export function generateWeeklyEarningsTextEmail(data: WeeklyReportData): string {
  const changeArrow = data.earningsChange >= 0 ? '↑' : '↓';
  const changeText = data.earningsChange >= 0 ? 'up' : 'down';

  return `
PORTABLE - WEEKLY EARNINGS REPORT
${data.weekStart} - ${data.weekEnd}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THIS WEEK YOU EARNED: $${data.totalEarnings.toLocaleString()}
${changeArrow} ${Math.abs(data.earningsChange)}% ${changeText} from last week

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY STATS:
• Taxes Set Aside: $${data.taxesSetAside.toLocaleString()}
• Top Platform: ${data.topPlatform}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLATFORM BREAKDOWN:
${data.platformBreakdown.map(p =>
  `• ${p.platform}: $${p.amount.toLocaleString()} (${p.percentage}%)`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SAVINGS GOAL PROGRESS:
$${(data.savingsGoal * data.savingsProgress / 100).toFixed(0)} of $${data.savingsGoal.toLocaleString()} (${data.savingsProgress}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSIGHTS & TIPS:
${data.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View your full dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://getportable.app'}/dashboard

You're receiving this because you enabled weekly earnings reports in Portable.
Manage preferences: ${process.env.NEXT_PUBLIC_APP_URL || 'https://getportable.app'}/settings

© 2025 Portable. All rights reserved.
  `.trim();
}
