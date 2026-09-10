import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const assignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  course_id: z.string().uuid(),
  batch_id: z.string().uuid().optional(),
  due_date: z.string(),
  max_score: z.number().positive().default(100),
  instructions: z.string().optional(),
});

const submitSchema = z.object({
  assignment_id: z.string().uuid(),
  content: z.string().optional(),
  file_url: z.string().optional(),
});

// GET /api/assignments
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { assignments: [] });
  }

  const { course_id, batch_id } = req.query;
  let query = admin.from('assignments').select(`
    *,
    course:course_id (id, title, code),
    submissions:assignment_submissions(id, student_id, status, score, submitted_at)
  `);

  if (course_id) query = query.eq('course_id', course_id as string);
  if (batch_id) query = query.eq('batch_id', batch_id as string);

  const { data, error } = await query.order('due_date', { ascending: true });

  if (error) {
    return sendError(res, error.message, 500, 'ASSIGNMENTS_FETCH_ERROR');
  }

  return sendSuccess(res, { assignments: data || [] }, 'Assignments retrieved');
});

// POST /api/assignments (Trainers / Admin)
router.post('/', authenticate, authorizeRoles('trainer', 'admin'), validateBody(assignmentSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { data, error } = await admin
    .from('assignments')
    .insert({
      ...req.body,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'ASSIGNMENT_CREATE_FAILED');
  }

  return sendSuccess(res, { assignment: data }, 'Assignment created successfully', 201);
});

// POST /api/assignments/submit (Student submission)
router.post('/submit', authenticate, authorizeRoles('student'), validateBody(submitSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { assignment_id, content, file_url } = req.body;

  const { data, error } = await admin
    .from('assignment_submissions')
    .upsert({
      assignment_id,
      student_id: req.user.id,
      content,
      file_url,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'assignment_id,student_id' })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'SUBMISSION_FAILED');
  }

  return sendSuccess(res, { submission: data }, 'Assignment submitted successfully');
});

export default router;
