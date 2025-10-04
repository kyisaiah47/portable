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
      const { data: userData } = await supabase
        .from('users')
        .select('referral_code, total_referrals, referral_earnings')
        .eq('id', user.id)
        .single();

      // Fetch detailed referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (userData && referralsData) {
        const pending = referralsData.filter(r => r.status === 'pending').length;
        const completed = referralsData.filter(r => r.status === 'completed' || r.status === 'rewarded').length;

        setStats({
          referralCode: userData.referral_code,
          totalReferrals: userData.total_referrals,
          referralEarnings: parseFloat(userData.referral_earnings),
          pendingReferrals: pending,
          completedReferrals: completed,
        });

        setReferrals(referralsData);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyReferralLink() {
    const referralUrl = `${window.location.origin}/signup?ref=${stats?.referralCode}`;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareViaEmail() {
    const subject = encodeURIComponent('Get $10 on Portable - Financial Platform for Gig Workers');
    const body = encodeURIComponent(
      `Hey! I've been using Portable to track my income from Uber, DoorDash, and other gig platforms - it's been a game changer.\n\nSign up with my link and we both get $10:\n${window.location.origin}/signup?ref=${stats?.referralCode}\n\nIt's free to start and automatically tracks all your income in one place.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function shareViaText() {
    const message = encodeURIComponent(
      `Get $10 on Portable (financial tracking for gig workers): ${window.location.origin}/signup?ref=${stats?.referralCode}`
    );
    window.location.href = `sms:?body=${message}`;
  }

  function shareViaSocial() {
    const text = encodeURIComponent(
      `Track your gig income automatically with Portable. Sign up and we both get $10!`
    );
    const url = encodeURIComponent(`${window.location.origin}/signup?ref=${stats?.referralCode}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=550,height=420'
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-slate-800/50 rounded-lg animate-pulse"></div>
        <div className="h-48 bg-slate-800/50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-slate-900/50 border-white/10">
        <CardContent className="p-6">
          <p className="text-slate-400">Unable to load referral data.</p>
        </CardContent>
      </Card>
    );
  }

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${stats.referralCode}`;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Total Earnings</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">
              ${stats.referralEarnings.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">From {stats.completedReferrals} completed referrals</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Total Referrals</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">{stats.totalReferrals}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">{stats.pendingReferrals} pending</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardDescription className="text-slate-400">Reward per Referral</CardDescription>
            <CardTitle className="text-3xl font-bold text-white">$10</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400">You and your friend both get $10</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Sharing */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Share Your Referral Link</CardTitle>
          <CardDescription className="text-slate-400">
            Invite friends to Portable and earn $10 for each successful referral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Copy Link */}
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
            />
            <Button
              onClick={copyReferralLink}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              onClick={shareViaText}
              variant="outline"
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              onClick={shareViaSocial}
              variant="outline"
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Twitter
            </Button>
          </div>

          {/* Referral Code Display */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-slate-400 mb-2">Your unique referral code:</p>
            <div className="bg-slate-800 border border-white/10 rounded-lg px-4 py-3">
              <code className="text-2xl font-mono font-bold text-blue-400 tracking-wider">
                {stats.referralCode}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Referral History</CardTitle>
          <CardDescription className="text-slate-400">
            Track the status of your referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No referrals yet. Start sharing your link!</p>
              <p className="text-sm text-slate-500">
                When someone signs up using your link, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5"
                >
                  <div>
                    <p className="text-white font-medium">
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
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        referral.status === 'rewarded'
                          ? 'bg-green-500/20 text-green-400'
                          : referral.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
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
      <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">How Referrals Work</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>Share your unique referral link or code with friends</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>They sign up and connect their bank account</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>You both receive $10 credit once they complete setup</span>
            </li>
          </ol>
          <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-white/10">
            * Credits can be used towards premium features or withdrawn after accumulating $25
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
