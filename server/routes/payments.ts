import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateBody } from '../middleware/validate';
import { sendSuccess, sendError } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';
import type { AuthenticatedRequest } from '../types';

const router = Router();

const offlinePaymentSchema = z.object({
  student_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_method: z.enum(['cash', 'cheque', 'bank_transfer', 'pos']),
  course_id: z.string().uuid().optional(),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/payments (Invoices & payment records)
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendSuccess(res, { payments: [], invoices: [] });
  }

  let paymentQuery = admin.from('payments').select(`
    *,
    student:student_id (id, full_name, email)
  `);

  if (req.user.role === 'student') {
    paymentQuery = paymentQuery.eq('student_id', req.user.id);
  } else if (req.user.role === 'parent') {
    const { data: links } = await admin
      .from('parent_students')
      .select('student_id')
      .eq('parent_id', req.user.id)
      .eq('status', 'active');
    const childIds = links?.map(l => l.student_id) || [];
    paymentQuery = paymentQuery.in('student_id', childIds);
  }

  const { data: payments, error } = await paymentQuery.order('created_at', { ascending: false });

  if (error) {
    return sendError(res, error.message, 500, 'PAYMENTS_FETCH_ERROR');
  }

  return sendSuccess(res, { payments: payments || [] }, 'Payments retrieved');
});

// POST /api/payments/offline (Admin only: record manual cash/cheque fee)
router.post('/offline', authenticate, authorizeRoles('admin'), validateBody(offlinePaymentSchema), async (req: AuthenticatedRequest, res) => {
  const admin = getSupabaseAdmin();
  if (!admin || !req.user) {
    return sendError(res, 'Database unavailable', 503);
  }

  const { student_id, amount, payment_method, course_id, reference_number, notes } = req.body;

  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

  const { data, error } = await admin
    .from('payments')
    .insert({
      student_id,
      amount,
      currency: 'INR',
      status: 'completed',
      payment_method,
      course_id: course_id || null,
      invoice_number: invoiceNumber,
      receipt_number: receiptNumber,
      reference_number: reference_number || null,
      notes: notes || null,
      recorded_by: req.user.id,
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return sendError(res, error.message, 400, 'PAYMENT_RECORD_FAILED');
  }

  return sendSuccess(res, { payment: data }, 'Payment recorded successfully', 201);
});

export default router;
