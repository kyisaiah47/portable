'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share2, Mail, MessageCircle } from 'lucide-react';

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  referralEarnings: number;
  pendingReferrals: number;
  completedReferrals: number;
}

interface Referral {
  id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward_amount: number;
  referee_email: string | null;
  created_at: string;
  completed_at: string | null;
  rewarded_at: string | null;
}

export default function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchReferralData();
  }, []);

  async function fetchReferralData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user's referral stats
      let { data: userData, error: fetchError } = await supabase
        .from('stub_users')
        .select('referral_code, total_referrals, referral_earnings')
        .eq('id', user.id)
        .single();

      // Create user record if doesn't exist or generate code if missing
      if (!userData || !userData.referral_code) {
        const newReferralCode = generateReferralCode(user.id);

        if (!userData) {
          // Create new user record
          const { data: newData, error: createError } = await supabase
            .from('stub_users')
            .insert({
              id: user.id,
              email: user.email,
              first_name:
                (user.user_metadata?.first_name as string) ??
                user.email?.split('@')[0] ??
                'There',
              last_name: (user.user_metadata?.last_name as string) ?? '',
              referral_code: newReferralCode,
              total_referrals: 0,
              referral_earnings: 0,
            })
            .select('referral_code, total_referrals, referral_earnings')
            .single();

          if (newData) {
            userData = newData;
          } else {
            console.error('Error creating user:', createError);
          }
        } else {
          // Update existing record with referral code
          const { data: updatedData } = await supabase
            .from('stub_users')
            .update({ referral_code: newReferralCode })
            .eq('id', user.id)
            .select('referral_code, total_referrals, referral_earnings')
            .single();

          if (updatedData) {
            userData = updatedData;
          }
        }
      }

      // Fetch detailed referrals
      const { data: referralsData } = await supabase
        .from('stub_referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (userData) {
        const pending = (referralsData || []).filter(r => r.status === 'pending').length;
        const completed = (referralsData || []).filter(r => r.status === 'completed' || r.status === 'rewarded').length;

        setStats({
          referralCode: userData.referral_code || 'LOADING',
          totalReferrals: userData.total_referrals || 0,
          referralEarnings: parseFloat(userData.referral_earnings || '0'),
          pendingReferrals: pending,
          completedReferrals: completed,
        });

        setReferrals(referralsData || []);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  }

  function generateReferralCode(userId: string): string {
    // Generate a short, memorable referral code based on user ID
    const hash = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous characters
    let code = '';
    let hashValue = hash;

    for (let i = 0; i < 6; i++) {
      code += chars[hashValue % chars.length];
      hashValue = Math.floor(hashValue / chars.length) + (i * 17); // Add variation
    }

    return code;
  }

  // Show actual content immediately (data loads in background)
  const displayStats = stats || {
    referralCode: 'LOADING',
    totalReferrals: 0,
    referralEarnings: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
  };

  function copyReferralLink() {
    const referralUrl = `${window.location.origin}/?auth=signup&ref=${displayStats.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareViaEmail() {
    const subject = encodeURIComponent('Get $10 on Stub - Financial Platform for Gig Workers');
    const body = encodeURIComponent(
      `Hey! I've been using Stub to track my income from Uber, DoorDash, and other gig platforms - it's been a game changer.\n\nSign up with my link and we both get $10:\n${window.location.origin}/?auth=signup&ref=${displayStats.referralCode}\n\nIt's free to start and automatically tracks all your income in one place.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function shareViaText() {
    const message = encodeURIComponent(
      `Get $10 on Stub (financial tracking for gig workers): ${window.location.origin}/?auth=signup&ref=${displayStats.referralCode}`
    );
    window.location.href = `sms:?body=${message}`;
  }

  function shareViaSocial() {
    const text = encodeURIComponent(
      `Track your gig income automatically with Stub. Sign up and we both get $10!`
    );
    const url = encodeURIComponent(`${window.location.origin}/?auth=signup&ref=${displayStats.referralCode}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=550,height=420'
    );
  }

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?auth=signup&ref=${displayStats.referralCode}`;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-white/10 shadow-none">
          <CardHeader className="pb-3">
            <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Total Earnings</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              ${displayStats.referralEarnings.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">From {displayStats.completedReferrals} completed referrals</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 shadow-none">
          <CardHeader className="pb-3">
            <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Total Referrals</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">{displayStats.totalReferrals}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">{displayStats.pendingReferrals} pending</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 shadow-none">
          <CardHeader className="pb-3">
            <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Reward per Referral</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight text-white">$10</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">You and your friend both get $10</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Sharing */}
      <Card className="border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold">Share Your Referral Link</CardTitle>
          <CardDescription className="text-slate-400">Invite friends to Stub and earn $10 for each successful referral</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Copy Link */}
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 bg-slate-950 border border-white/10 rounded-md px-3 py-2 text-slate-300 text-sm"
            />
            <Button
              onClick={copyReferralLink}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={shareViaEmail}
              variant="outline"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              onClick={shareViaText}
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              onClick={shareViaSocial}
              variant="outline"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Twitter
            </Button>
          </div>

          {/* Referral Code Display */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">Your referral code</p>
            <div className="bg-slate-950 border border-white/10 rounded-md px-4 py-3">
              <code className="text-xl font-mono font-semibold text-indigo-300 tracking-widest">
                {displayStats.referralCode}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card className="border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold">Referral History</CardTitle>
          <CardDescription className="text-slate-400">Track the status of your referrals</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-slate-300 mb-1">No referrals yet</p>
              <p className="text-sm text-slate-400">When someone signs up using your link, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3.5 rounded-md border border-white/10 hover:bg-slate-800/60/75 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {referral.referee_email || 'Pending signup'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(referral.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        referral.status === 'rewarded'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : referral.status === 'completed'
                          ? 'bg-indigo-500/10 text-indigo-300'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {referral.status === 'rewarded'
                        ? 'Rewarded'
                        : referral.status === 'completed'
                        ? 'Completed'
                        : 'Pending'}
                    </span>
                    {referral.status === 'rewarded' && (
                      <p className="text-xs text-slate-400 mt-1">
                        +${referral.reward_amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold">How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-xs font-semibold">
                1
              </span>
              <span>Share your unique referral link or code with friends</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-xs font-semibold">
                2
              </span>
              <span>They sign up and connect their bank account</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-xs font-semibold">
                3
              </span>
              <span>You both receive $10 credit once they complete setup</span>
            </li>
          </ol>
          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-white/10">
            * Credits can be used towards premium features or withdrawn after accumulating $25
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
