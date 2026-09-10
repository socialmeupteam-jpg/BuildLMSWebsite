import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const enrollSchema = z.object({
  course_id: z.string().uuid(),
  batch_id: z.string().uuid().optional(),
});

// GET /api/enrollments
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { enrollments: [] });
  }

  let query = admin.from('enrollments').select(`
    *,
    course:course_id (*),
    batch:batch_id (*)
  `);

  if (req.user.role === 'student') {
    query = query.eq('student_id', req.user.id);
  } else if (req.user.role === 'parent') {
    // Linked student IDs
    const { data: links } = await admin
      .from('parent_students')
      .select('student_id')
      .eq('parent_id', req.user.id)
      .eq('status', 'active');
    const childIds = links?.map(l => l.student_id) || [];
    query = query.in('student_id', childIds);
  } else if (req.user.role === 'trainer') {
    // Only batches this trainer teaches
    const { data: batches } = await admin
      .from('batches')
      .select('id')
      .eq('trainer_id', req.user.id);
    const batchIds = batches?.map(b => b.id) || [];
    query = query.in('batch_id', batchIds);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'ENROLLMENTS_FETCH_ERROR');
  }

  return sendSuccess(res, { enrollments: data || [] }, 'Enrollments retrieved');
});

// POST /api/enrollments (Student self-enroll or Admin enroll)
router.post('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const parseResult = enrollSchema.safeParse(req.body);
  if (!parseResult.success) {
    return sendError(res, 'Invalid enrollment parameters', 422);
  }

  const { course_id, batch_id } = parseResult.data;
  const student_id = req.user.role === 'admin' && req.body.student_id ? req.body.student_id : req.user.id;

  const { data, error } = await admin
    .from('enrollments')
    .insert({
      student_id,
      course_id,
      batch_id: batch_id || null,
      status: 'active',
      progress_percentage: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'ENROLLMENT_FAILED');
  }

  return sendSuccess(res, { enrollment: data }, 'Enrolled successfully', 201);
});

export default router;
