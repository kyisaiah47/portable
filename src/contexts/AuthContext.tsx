'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage cache first (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('auth_user');
        if (cached) {
          setUser(JSON.parse(cached));
          setLoading(false);
        }
      } catch {
        // Invalid cache, ignore
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
        setUser(null);
        // Clear cached user if no session
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_user');
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      // Handle token expiration
      if (event === 'TOKEN_REFRESHED') {
        // Session token refreshed
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        // Clear cached user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_user');
        }
        router.push('/?auth=login');
        return;
      }

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      let { data: userProfile, error } = await supabase
        .from('stub_users')
        .select('*')
        .eq('id', userId)
        .single();

      // No profile row yet (account created in another app on the shared
      // auth pool, or signup didn't finish) — create one from auth metadata.
      if (error && error.code === 'PGRST116') {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) throw error;
        const meta = (authUser.user_metadata ?? {}) as Record<string, string>;
        const created = await supabase
          .from('stub_users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            first_name: meta.first_name ?? authUser.email?.split('@')[0] ?? 'There',
            last_name: meta.last_name ?? '',
          })
          .select('*')
          .single();
        userProfile = created.data;
        error = created.error;
      }

      if (error || !userProfile) throw error ?? new Error('No profile');

      const userData = {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
      };

      setUser(userData);

      // Cache user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Profile load failed:', error);
      setUser(null);
      // Clear cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');
      }
      await supabase.auth.signOut();
      router.push('/?auth=login');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Clear cached user
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');
      }
      router.push('/?auth=login');
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
