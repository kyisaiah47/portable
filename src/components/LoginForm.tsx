'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface LoginFormProps {
  isLogin: boolean;
  onSuccess: (user: any) => void;
  referralCode?: string | null;
}

export default function LoginForm({ isLogin, onSuccess, referralCode }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login with Supabase Auth
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        // Fetch user profile from users table
        const { data: userProfile, error: profileError } = await supabase
          .from('portable_users')
          .select('*')
          .eq('id', data.user?.id)
          .single();

        if (profileError) throw profileError;

        onSuccess({
          id: userProfile.id,
          email: userProfile.email,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
        });
      } else {
        // If there's a referral code, validate it first
        let referrerId = null;
        if (referralCode) {
          const { data: referrer, error: referrerError } = await supabase
            .from('portable_users')
            .select('id')
            .eq('referral_code', referralCode.toUpperCase())
            .single();

          if (referrerError || !referrer) {
            setError('Invalid referral code. Continuing without referral.');
          } else {
            referrerId = referrer.id;
          }
        }

        // Sign up with Supabase Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Create user profile using service role to bypass RLS
        if (signUpData.user?.id) {
          // Use upsert to handle if trigger already created it
          const { error: upsertError } = await supabase
            .from('portable_users')
            .upsert({
              id: signUpData.user.id,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              referred_by: referrerId,
            }, {
              onConflict: 'id'
            });

          if (upsertError) {
            console.error('Error creating user profile:', upsertError);
            throw new Error(`Failed to create user profile: ${upsertError.message}`);
          }
        }

        // If there's a valid referrer, create referral record
        if (referrerId && signUpData.user?.id) {
          await supabase
            .from('portable_referrals')
            .insert({
              referrer_id: referrerId,
              referee_id: signUpData.user.id,
              referral_code: referralCode?.toUpperCase(),
              referee_email: formData.email,
              status: 'pending',
            });
        }

        onSuccess({
          id: signUpData.user?.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {!isLogin && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required={!isLogin}
              placeholder="First name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required={!isLogin}
              placeholder="Last name"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Password"
        />
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Please wait...</span>
          </div>
        ) : (
          isLogin ? 'Login' : 'Create Account'
        )}
      </Button>
    </form>
  );
}