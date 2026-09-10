import api from './api';
import { getSupabaseClient } from '../lib/supabase';
import type { UserRole, User } from '../types';

export const authService = {
  async register(data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
    metadata?: Record<string, any>;
  }) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            phone: data.phone,
            ...data.metadata,
          },
        },
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      return {
        success: true,
        data: {
          user: {
            id: authData.user?.id || '',
            email: authData.user?.email || data.email,
            name: data.name,
            role: data.role,
          },
        },
      };
    }

    // Call backend API
    return api.post('/auth/register', data);
  },

  async login(credentials: { email: string; password: string }) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !data.session) {
        return { success: false, message: error?.message || 'Login failed' };
      }

      localStorage.setItem('smu_auth_token', data.session.access_token);

      const userRole = (data.user.user_metadata?.role as UserRole) || 'student';
      const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';

      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email || credentials.email,
            name: userName,
            role: userRole,
          },
          session: data.session,
        },
      };
    }

    return api.post('/auth/login', credentials);
  },

  async logout() {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('smu_auth_token');
    return { success: true };
  },

  async getCurrentUser(): Promise<User | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          role: (user.user_metadata?.role as UserRole) || 'student',
          phone: user.user_metadata?.phone,
          avatar: user.user_metadata?.avatar_url,
          joinDate: user.created_at || new Date().toISOString(),
          status: 'active',
        };
      }
    }

    // Try backend /api/auth/me
    const res = await api.get<{ user: User }>('/auth/me');
    if (res.success && res.data?.user) {
      return res.data.user;
    }

    return null;
  },

  async resetPassword(email: string) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, message: error.message };
      return { success: true };
    }
    return api.post('/auth/reset-password', { email });
  },
};

export default authService;
