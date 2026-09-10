import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const gradeSchema = z.object({
  submission_id: z.string().uuid(),
  score: z.number().min(0),
  feedback: z.string().optional(),
});

// GET /api/grades
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { grades: [] });
  }

  let query = admin.from('assignment_submissions').select(`
    id,
    score,
    feedback,
    status,
    submitted_at,
    graded_at,
    student:student_id (id, full_name, email),
    assignment:assignment_id (
      id,
      title,
      max_score,
      course:course_id (id, title, code)
    )
  `);

  if (req.user.role === 'student') {
    query = query.eq('student_id', req.user.id);
  } else if (req.user.role === 'parent') {
    const { data: links } = await admin
      .from('parent_students')
      .select('student_id')
      .eq('parent_id', req.user.id)
      .eq('status', 'active');
    const childIds = links?.map(l => l.student_id) || [];
    query = query.in('student_id', childIds);
  }

  const { data, error } = await query.order('submitted_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'GRADES_FETCH_ERROR');
  }

  return sendSuccess(res, { grades: data || [] }, 'Grades retrieved');
});

// POST /api/grades (Trainers and Admins only)
router.post('/', authenticate, authorizeRoles('trainer', 'admin'), validateBody(gradeSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { submission_id, score, feedback } = req.body;

  const { data, error } = await admin
    .from('assignment_submissions')
    .update({
      score,
      feedback,
      status: 'graded',
      graded_by: req.user.id,
      graded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', submission_id)
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'GRADING_FAILED');
  }

  return sendSuccess(res, { grade: data }, 'Submission graded successfully');
});

export default router;
