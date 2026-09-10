import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const sendMessageSchema = z.object({
  recipient_id: z.string().uuid(),
  content: z.string().min(1),
  subject: z.string().optional(),
});

// GET /api/messages
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { messages: [] });
  }

  const userId = req.user.id;
  const { data, error } = await admin
    .from('messages')
    .select(`
      *,
      sender:sender_id (id, full_name, role, avatar_url),
      recipient:recipient_id (id, full_name, role, avatar_url)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'MESSAGES_FETCH_ERROR');
  }

  return sendSuccess(res, { messages: data || [] }, 'Messages retrieved');
});

// POST /api/messages
router.post('/', authenticate, validateBody(sendMessageSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { recipient_id, content, subject } = req.body;

  const { data, error } = await admin
    .from('messages')
    .insert({
      sender_id: req.user.id,
      recipient_id,
      content,
      subject: subject || null,
      read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'MESSAGE_SEND_FAILED');
  }

  return sendSuccess(res, { message: data }, 'Message sent successfully', 201);
});

export default router;
