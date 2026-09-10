import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

// GET /api/notifications
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { notifications: [] });
  }

  const { data, error } = await admin
    .from('notifications')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return sendError(res, error.message, 500, 'NOTIFICATIONS_FETCH_ERROR');
  }

  return sendSuccess(res, { notifications: data || [] }, 'Notifications retrieved');
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { updated: true });
  }

  const { data, error } = await admin
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'NOTIFICATION_UPDATE_FAILED');
  }

  return sendSuccess(res, { notification: data }, 'Notification marked as read');
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { updated: true });
  }

  const { error } = await admin
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('user_id', req.user.id)
    .eq('read', false);

  if (error) {
    return sendError(res, error.message, 400, 'NOTIFICATION_UPDATE_FAILED');
  }

  return sendSuccess(res, { success: true }, 'All notifications marked as read');
});

export default router;
