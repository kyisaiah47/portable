import { Metadata } from 'next';
import ReferralDashboard from '@/components/ReferralDashboard';

export const metadata: Metadata = {
  title: 'Referrals',
  description: 'Refer friends to Portable and earn $10 per referral',
};

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Refer & Earn</h1>
        <p className="text-slate-400">
          Invite friends to Portable and earn $10 for each successful referral
        </p>
      </div>

      <ReferralDashboard />
    </div>
  );
}
