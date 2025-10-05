'use client';

import ReferralDashboard from '@/components/ReferralDashboard';

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Refer & Earn</h1>
        <p className="text-slate-400">
          Invite friends to Portable and earn $10 for each successful referral
        </p>
      </div>
      <ReferralDashboard />
    </div>
  );
}
