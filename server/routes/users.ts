import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

// GET /api/users/profile
router.get('/profile', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { user: req.user });
  }

  const { data, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) {
    return sendSuccess(res, { user: req.user });
  }

  return sendSuccess(res, { profile: data });
});

// PUT /api/users/profile
router.put('/profile', authenticate, validateBody(updateProfileSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { updated: true, user: { ...req.user, ...req.body } });
  }

  const { name, phone, bio, avatarUrl } = req.body;
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  if (name) updateData.full_name = name;
  if (phone) updateData.phone = phone;
  if (bio) updateData.bio = bio;
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { data, error } = await admin
    .from('profiles')
    .update(updateData)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'PROFILE_UPDATE_FAILED');
  }

  return sendSuccess(res, { profile: data }, 'Profile updated successfully');
});

// GET /api/users (Admin only)
router.get('/', authenticate, authorizeRoles('admin'), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendSuccess(res, { users: [] }, 'Supabase unconfigured', 200, { total: 0 });
  }

  const { role, search, limit = '50', offset = '0' } = req.query;
  let query = admin.from('profiles').select('*', { count: 'exact' });

  if (role && typeof role === 'string') {
    query = query.eq('role', role);
  }
  if (search && typeof search === 'string') {
    query = query.ilike('full_name', `%${search}%`);
  }

  const { data, count, error } = await query
    .range(parseInt(offset as string, 10), parseInt(offset as string, 10) + parseInt(limit as string, 10) - 1)
    .order('created_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'USERS_FETCH_ERROR');
  }

  return sendSuccess(res, { users: data }, 'Users retrieved', 200, { total: count || 0 });
});

// GET /api/users/children (Parent only: list children linked to this parent)
router.get('/children', authenticate, authorizeRoles('parent', 'admin'), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { children: [] });
  }

  const parentId = req.user.id;
  const { data, error } = await admin
    .from('parent_students')
    .select(`
      id,
      relationship,
      student:student_id (
        id,
        full_name,
        email,
        phone,
        avatar_url,
        status
      )
    `)
    .eq('parent_id', parentId)
    .eq('status', 'active');

  if (error) {
    return sendError(res, error.message, 500, 'CHILDREN_FETCH_ERROR');
  }

  return sendSuccess(res, { children: data || [] }, 'Linked children retrieved');
});

export default router;
