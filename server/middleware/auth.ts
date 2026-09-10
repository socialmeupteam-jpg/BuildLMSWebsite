import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest, UserRole } from '../types';
import { sendError } from '../utils/response';
import { getSupabasePublic, getSupabaseAdmin } from '../config/supabase';

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Invalid authorization token format.', 401, 'UNAUTHORIZED');
    }

    const supabase = getSupabasePublic() || getSupabaseAdmin();

    if (!supabase) {
      // In local dev without Supabase credentials, provide graceful warning
      return sendError(
        res,
        'Authentication service is not configured on the server.',
        503,
        'AUTH_SERVICE_UNAVAILABLE'
      );
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return sendError(res, 'Invalid or expired authentication session.', 401, 'UNAUTHORIZED');
    }

    // Fetch user profile from database to get official role
    const admin = getSupabaseAdmin();
    let role: UserRole = (user.user_metadata?.role as UserRole) || 'student';
    let name: string = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

    if (admin) {
      const { data: profile } = await admin
        .from('profiles')
        .select('role, full_name, status')
        .eq('id', user.id)
        .single();

      if (profile) {
        if (profile.role) role = profile.role as UserRole;
        if (profile.full_name) name = profile.full_name;
        if (profile.status === 'suspended') {
          return sendError(res, 'Account is suspended. Please contact the administrator.', 403, 'ACCOUNT_SUSPENDED');
        }
      }
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      role,
      name,
      metadata: user.user_metadata,
    };

    next();
  } catch (err: any) {
    console.error('[Auth Middleware Error]:', err);
    return sendError(res, 'Authentication validation failed.', 500, 'AUTH_INTERNAL_ERROR');
  }
}
