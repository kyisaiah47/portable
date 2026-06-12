'use client';

import ReferralDashboard from '@/components/ReferralDashboard';

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Referrals</h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Invite friends to Stub and earn $10 for each successful referral.
        </p>
      </div>
      <ReferralDashboard />
    </div>
  );
}
