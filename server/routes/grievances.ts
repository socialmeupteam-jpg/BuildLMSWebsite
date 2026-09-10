import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const grievanceSchema = z.object({
  category: z.enum(['academic', 'technical', 'financial', 'administrative', 'other']),
  subject: z.string().min(3),
  description: z.string().min(10),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

const updateGrievanceSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  assigned_to: z.string().uuid().optional(),
  resolution_notes: z.string().optional(),
});

// GET /api/grievances
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { grievances: [] });
  }

  let query = admin.from('grievances').select(`
    *,
    user:user_id (id, full_name, email, role)
  `);

  // Students and parents only see tickets they created
  if (req.user.role === 'student' || req.user.role === 'parent') {
    query = query.eq('user_id', req.user.id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'GRIEVANCES_FETCH_ERROR');
  }

  return sendSuccess(res, { grievances: data || [] }, 'Grievances retrieved');
});

// POST /api/grievances
router.post('/', authenticate, validateBody(grievanceSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;

  const { data, error } = await admin
    .from('grievances')
    .insert({
      ticket_number: ticketNumber,
      user_id: req.user.id,
      ...req.body,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'GRIEVANCE_CREATE_FAILED');
  }

  return sendSuccess(res, { grievance: data }, 'Grievance ticket created successfully', 201);
});

// PUT /api/grievances/:id (Admin only)
router.put('/:id', authenticate, authorizeRoles('admin'), validateBody(updateGrievanceSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { data, error } = await admin
    .from('grievances')
    .update({
      ...req.body,
      updated_at: new Date().toISOString(),
      resolved_at: req.body.status === 'resolved' ? new Date().toISOString() : undefined,
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'GRIEVANCE_UPDATE_FAILED');
  }

  return sendSuccess(res, { grievance: data }, 'Grievance updated successfully');
});

export default router;
