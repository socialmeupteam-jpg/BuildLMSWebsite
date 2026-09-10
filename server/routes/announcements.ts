import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(5),
  target_role: z.enum(['all', 'student', 'parent', 'trainer']).default('all'),
  batch_id: z.string().uuid().optional(),
});

// GET /api/announcements
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { announcements: [] });
  }

  const { data, error } = await admin
    .from('announcements')
    .select(`
      *,
      creator:created_by (id, full_name, role)
    `)
    .or(`target_role.eq.all,target_role.eq.${req.user.role}`)
    .order('created_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'ANNOUNCEMENTS_FETCH_ERROR');
  }

  return sendSuccess(res, { announcements: data || [] }, 'Announcements retrieved');
});

// POST /api/announcements (Trainers or Admins)
router.post('/', authenticate, authorizeRoles('trainer', 'admin'), validateBody(announcementSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { data, error } = await admin
    .from('announcements')
    .insert({
      ...req.body,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'ANNOUNCEMENT_CREATE_FAILED');
  }

  return sendSuccess(res, { announcement: data }, 'Announcement published', 201);
});

export default router;
