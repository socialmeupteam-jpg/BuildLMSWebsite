import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const batchSchema = z.object({
  name: z.string().min(2),
  course_id: z.string().uuid(),
  trainer_id: z.string().uuid().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  capacity: z.number().int().positive().default(30),
  mode: z.enum(['online', 'offline', 'hybrid']).default('online'),
  status: z.enum(['upcoming', 'ongoing', 'completed']).default('ongoing'),
});

// GET /api/batches
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendSuccess(res, { batches: [] });
  }

  const { course_id, status } = req.query;
  let query = admin.from('batches').select(`
    *,
    course:course_id (id, title, code),
    trainer:trainer_id (id, full_name, email)
  `);

  // Trainers can only see batches they are assigned to (unless admin)
  if (req.user?.role === 'trainer') {
    query = query.eq('trainer_id', req.user.id);
  }

  if (course_id) query = query.eq('course_id', course_id as string);
  if (status) query = query.eq('status', status as string);

  const { data, error } = await query.order('start_date', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'BATCHES_FETCH_ERROR');
  }

  return sendSuccess(res, { batches: data || [] }, 'Batches retrieved');
});

// POST /api/batches (Admin only)
router.post('/', authenticate, authorizeRoles('admin'), validateBody(batchSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { data, error } = await admin
    .from('batches')
    .insert({
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'BATCH_CREATE_FAILED');
  }

  return sendSuccess(res, { batch: data }, 'Batch created successfully', 201);
});

export default router;
