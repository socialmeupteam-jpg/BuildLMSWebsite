import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const courseSchema = z.object({
  title: z.string().min(3),
  code: z.string().min(2),
  description: z.string().optional(),
  category: z.string().default('General'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  duration: z.string().default('8 weeks'),
  fee: z.number().nonnegative().default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

// GET /api/courses (Public or Authenticated)
router.get('/', async (req, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendSuccess(res, { courses: [] }, 'Database offline');
  }

  const { status, category } = req.query;
  let query = admin.from('courses').select('*, modules:course_modules(id, title, order_index, lessons(id, title, duration_minutes))');

  if (status) query = query.eq('status', status as string);
  if (category) query = query.eq('category', category as string);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'COURSES_FETCH_ERROR');
  }

  return sendSuccess(res, { courses: data || [] }, 'Courses retrieved');
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { data, error } = await admin
    .from('courses')
    .select('*, modules:course_modules(*, lessons(*))')
    .eq('id', req.params.id)
    .single();

  if (error || !data) {
    return sendError(res, 'Course not found', 404, 'COURSE_NOT_FOUND');
  }

  return sendSuccess(res, { course: data }, 'Course details retrieved');
});

// POST /api/courses (Admin only)
router.post('/', authenticate, authorizeRoles('admin'), validateBody(courseSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { data, error } = await admin
    .from('courses')
    .insert({
      ...req.body,
      created_by: req.user?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'COURSE_CREATE_FAILED');
  }

  return sendSuccess(res, { course: data }, 'Course created successfully', 201);
});

export default router;
