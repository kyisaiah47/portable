'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, Mail, Lock, Trash2, Save, Loader2, Bell } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [weeklyReports, setWeeklyReports] = useState(true);
  const [taxReminders, setTaxReminders] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [notificationsMessage, setNotificationsMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);

      // Load notification preferences (stored in user metadata)
      const loadPreferences = async () => {
        const { data } = await supabase
          .from('portable_users')
          .select('email_preferences')
          .eq('id', user.id)
          .single();

        if (data?.email_preferences) {
          setWeeklyReports(data.email_preferences.weeklyReports ?? true);
          setTaxReminders(data.email_preferences.taxReminders ?? true);
        }
      };
      loadPreferences();
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('portable_users')
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfileMessage('✅ Profile updated successfully');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setSavingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setSavingPassword(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordMessage('✅ Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    setNotificationsMessage('');
    setError('');

    try {
      const { error } = await supabase
        .from('portable_users')
        .update({
          email_preferences: {
            weeklyReports,
            taxReminders,
          },
        })
        .eq('id', user.id);

      if (error) throw error;

      setNotificationsMessage('✅ Notification preferences updated');
      setTimeout(() => setNotificationsMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setDeleting(true);
    setError('');

    try {
      // Delete user data
      await supabase.from('portable_transactions').delete().eq('user_id', user.id);
      await supabase.from('portable_parsed_income').delete().eq('user_id', user.id);
      await supabase.from('portable_plaid_items').delete().eq('user_id', user.id);
      await supabase.from('portable_users').delete().eq('id', user.id);

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      if (authError) throw authError;

      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-space-grotesk">Settings</h1>
          <p className="text-slate-400">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white font-space-grotesk">Profile Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-800/30 border border-white/5 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              {profileMessage && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {profileMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Email Notifications */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white font-space-grotesk">Email Notifications</h2>
            </div>

            <form onSubmit={handleUpdateNotifications} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-white/5">
                  <input
                    type="checkbox"
                    id="weeklyReports"
                    checked={weeklyReports}
                    onChange={(e) => setWeeklyReports(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                  <div className="flex-1">
                    <label htmlFor="weeklyReports" className="block text-white font-semibold mb-1 cursor-pointer">
                      Weekly Earnings Reports
                    </label>
                    <p className="text-sm text-slate-400">
                      Get a summary of your weekly income, platform breakdown, and personalized insights every Monday morning.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-white/5">
                  <input
                    type="checkbox"
                    id="taxReminders"
                    checked={taxReminders}
                    onChange={(e) => setTaxReminders(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                  <div className="flex-1">
                    <label htmlFor="taxReminders" className="block text-white font-semibold mb-1 cursor-pointer">
                      Quarterly Tax Reminders
                    </label>
                    <p className="text-sm text-slate-400">
                      Receive reminders before quarterly tax deadlines (April 15, June 15, September 15, January 15) with estimated payment amounts.
                    </p>
                  </div>
                </div>
              </div>

              {notificationsMessage && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {notificationsMessage}
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <strong className="text-blue-400">Note:</strong> Email notifications require your Supabase project to have SMTP configured.
                  Until then, these preferences are saved but emails won't be sent.
                </p>
              </div>

              <button
                type="submit"
                disabled={savingNotifications}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {savingNotifications ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white font-space-grotesk">Change Password</h2>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="At least 8 characters"
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                  placeholder="Repeat password"
                />
              </div>

              {passwordMessage && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={savingPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white font-space-grotesk">Danger Zone</h2>
            </div>

            <p className="text-slate-300 mb-4">
              Once you delete your account, there is no going back. All your data will be permanently deleted.
            </p>

            {showDeleteConfirm && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-semibold mb-2">⚠️ Are you absolutely sure?</p>
                <p className="text-sm text-slate-300">This will permanently delete all your transactions, income data, and account settings.</p>
              </div>
            )}

            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  {showDeleteConfirm ? 'Yes, Delete My Account' : 'Delete Account'}
                </>
              )}
            </button>

            {showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="ml-3 text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
