import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin, getSupabasePublic } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Full name is required'),
  role: z.enum(['student', 'parent', 'trainer', 'admin']).default('student'),
  phone: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
});

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const { email, password, name, role, phone, metadata } = req.body;
    const admin = getSupabaseAdmin();

    if (!admin) {
      return sendError(res, 'Database service is currently unconfigured', 503, 'SERVICE_UNAVAILABLE');
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
        phone,
        ...metadata,
      },
    });

    if (authError || !authData.user) {
      return sendError(res, authError?.message || 'Failed to create user', 400, 'REGISTRATION_FAILED');
    }

    // Insert or update profile row in profiles table
    const { error: profileError } = await admin.from('profiles').upsert({
      id: authData.user.id,
      email,
      full_name: name,
      role,
      phone: phone || null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.warn('[Register Profile Warning]:', profileError.message);
    }

    return sendSuccess(res, {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        role,
      },
    }, 'User registered successfully', 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Registration failed', 500, 'REGISTRATION_ERROR');
  }
});

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const supabase = getSupabasePublic() || getSupabaseAdmin();

    if (!supabase) {
      return sendError(res, 'Database service is currently unconfigured', 503, 'SERVICE_UNAVAILABLE');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return sendError(res, error?.message || 'Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Get user official profile
    const admin = getSupabaseAdmin();
    let role = (data.user.user_metadata?.role as string) || 'student';
    let name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';

    if (admin) {
      const { data: profile } = await admin
        .from('profiles')
        .select('role, full_name, status')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        if (profile.role) role = profile.role;
        if (profile.full_name) name = profile.full_name;
        if (profile.status === 'suspended') {
          return sendError(res, 'Account is suspended. Please contact the administrator.', 403, 'ACCOUNT_SUSPENDED');
        }
      }
    }

    return sendSuccess(res, {
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
        name,
      },
    }, 'Signed in successfully');
  } catch (err: any) {
    return sendError(res, err.message || 'Login failed', 500, 'LOGIN_ERROR');
  }
});

// GET /api/auth/me (Get current authenticated user)
router.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  return sendSuccess(res, { user: req.user }, 'Current session retrieved');
});

// POST /api/auth/reset-password
router.post('/reset-password', validateBody(resetPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const supabase = getSupabasePublic() || getSupabaseAdmin();

    if (!supabase) {
      return sendError(res, 'Database service is unconfigured', 503, 'SERVICE_UNAVAILABLE');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return sendError(res, error.message, 400, 'PASSWORD_RESET_FAILED');
    }

    return sendSuccess(res, { sent: true }, 'Password reset instructions sent');
  } catch (err: any) {
    return sendError(res, err.message || 'Password reset request failed', 500, 'PASSWORD_RESET_ERROR');
  }
});

export default router;
