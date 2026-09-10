import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const issueSchema = z.object({
  student_id: z.string().uuid(),
  course_id: z.string().uuid(),
  grade: z.string().default('A'),
  score: z.number().optional(),
});

// GET /api/certificates
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { certificates: [] });
  }

  let query = admin.from('certificates').select(`
    *,
    student:student_id (id, full_name, email),
    course:course_id (id, title, code)
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

  const { data, error } = await query.order('issued_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'CERTIFICATES_FETCH_ERROR');
  }

  return sendSuccess(res, { certificates: data || [] }, 'Certificates retrieved');
});

// GET /api/certificates/verify/:certificateNumber (PUBLIC verification)
router.get('/verify/:certificateNumber', async (req, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendError(res, 'Verification service unavailable', 503);
  }

  const { data, error } = await admin
    .from('certificates')
    .select(`
      certificate_number,
      issued_at,
      status,
      grade,
      course:course_id (title, code),
      student:student_id (full_name)
    `)
    .eq('certificate_number', req.params.certificateNumber)
    .single();

  if (error || !data) {
    return sendError(res, 'Certificate not found or invalid certificate number', 404, 'CERTIFICATE_INVALID');
  }

  return sendSuccess(res, {
    certificate: {
      certificateNumber: data.certificate_number,
      recipientName: (data.student as any)?.full_name || 'Verified Student',
      courseTitle: (data.course as any)?.title || 'Verified Program',
      issuedAt: data.issued_at,
      grade: data.grade,
      status: data.status,
      issuer: 'SocialMeUp Academy',
    },
  }, 'Certificate verified successfully');
});

// POST /api/certificates/issue (Admin only)
router.post('/issue', authenticate, authorizeRoles('admin'), validateBody(issueSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { student_id, course_id, grade, score } = req.body;
  const certificateNumber = `SMU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const { data, error } = await admin
    .from('certificates')
    .insert({
      certificate_number: certificateNumber,
      student_id,
      course_id,
      grade,
      score: score || null,
      status: 'issued',
      issued_at: new Date().toISOString(),
      issued_by: req.user?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'CERTIFICATE_ISSUE_FAILED');
  }

  return sendSuccess(res, { certificate: data }, 'Certificate issued successfully', 201);
});

export default router;
