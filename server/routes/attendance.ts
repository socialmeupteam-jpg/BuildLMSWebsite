import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const markAttendanceSchema = z.object({
  batch_id: z.string().uuid(),
  date: z.string(),
  records: z.array(z.object({
    student_id: z.string().uuid(),
    status: z.enum(['present', 'absent', 'late', 'excused']),
    notes: z.string().optional(),
  })),
});

// GET /api/attendance
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { attendance: [] });
  }

  const { student_id, batch_id, start_date, end_date } = req.query;
  let query = admin.from('attendance').select(`
    *,
    student:student_id (id, full_name, email),
    batch:batch_id (id, name)
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
  } else if (req.user.role === 'trainer') {
    const { data: batches } = await admin
      .from('batches')
      .select('id')
      .eq('trainer_id', req.user.id);
    const batchIds = batches?.map(b => b.id) || [];
    query = query.in('batch_id', batchIds);
  } else if (student_id && req.user.role === 'admin') {
    query = query.eq('student_id', student_id as string);
  }

  if (batch_id) query = query.eq('batch_id', batch_id as string);
  if (start_date) query = query.gte('date', start_date as string);
  if (end_date) query = query.lte('date', end_date as string);

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'ATTENDANCE_FETCH_ERROR');
  }

  return sendSuccess(res, { attendance: data || [] }, 'Attendance records retrieved');
});

// POST /api/attendance (Trainers or Admins only)
router.post('/', authenticate, authorizeRoles('trainer', 'admin'), validateBody(markAttendanceSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { batch_id, date, records } = req.body;

  // Verify trainer actually teaches this batch if role is trainer
  if (req.user.role === 'trainer') {
    const { data: batch } = await admin
      .from('batches')
      .select('trainer_id')
      .eq('id', batch_id)
      .single();

    if (!batch || batch.trainer_id !== req.user.id) {
      return sendError(res, 'You are not assigned to mark attendance for this batch', 403, 'FORBIDDEN');
    }
  }

  const rows = records.map((r: any) => ({
    batch_id,
    student_id: r.student_id,
    date,
    status: r.status,
    notes: r.notes || null,
    marked_by: req.user?.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await admin
    .from('attendance')
    .upsert(rows, { onConflict: 'batch_id,student_id,date' })
    .select();

  if (error) {
    return sendError(res, error.message, 400, 'ATTENDANCE_SAVE_FAILED');
  }

  return sendSuccess(res, { records: data }, 'Attendance marked successfully');
});

export default router;
