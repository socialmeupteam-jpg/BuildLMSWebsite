import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { STUDENT_PAYMENTS } from '../../data/mockData';
import { IconCreditCard, IconDownload, IconCheck } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function PaymentsPage() {
  const { addToast } = useApp();
  const [paying, setPaying] = useState<string | null>(null);

  const pending = STUDENT_PAYMENTS.filter(p => p.status === 'pending' || p.status === 'overdue');
  const paid = STUDENT_PAYMENTS.filter(p => p.status === 'paid');
  const totalPaid = paid.reduce((s, p) => s + p.amount, 0);
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);

  const handlePay = (paymentId: string) => {
    setPaying(paymentId);
    setTimeout(() => {
      setPaying(null);
      addToast({ type: 'success', title: 'Payment Initiated', message: 'Razorpay checkout will open in production.' });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Fees & Payments" subtitle="Manage your course fees, invoices and payment history" />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-[#10B981]">₹{totalPaid.toLocaleString('en-IN')}</p>
          <p className="text-xs text-[#9BA3AF] mt-0.5">{paid.length} payments</p>
        </div>
        <div className={`bg-white rounded-2xl border p-5 ${totalPending > 0 ? 'border-l-4 border-l-[#F59E0B] border-[#E5E7EB]' : 'border-[#E5E7EB]'}`} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Pending Amount</p>
          <p className={`text-2xl font-bold ${totalPending > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>₹{totalPending.toLocaleString('en-IN')}</p>
          <p className="text-xs text-[#9BA3AF] mt-0.5">{pending.length} pending invoice{pending.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Next Due Date</p>
          <p className="text-2xl font-bold text-[#1F2933]">Dec 31</p>
          <p className="text-xs text-[#9BA3AF] mt-0.5">₹5,000 installment</p>
        </div>
      </div>

      {/* Pending payments */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#1F2933] mb-3">Pending Payments</h3>
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border-2 border-[#F59E0B]/40 p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                  <IconCreditCard size={18} className="text-[#F59E0B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1F2933]">{p.description}</p>
                  <p className="text-xs text-[#667085] mt-0.5">Invoice: {p.invoiceNumber} · Due: {new Date(p.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#1F2933]">₹{p.amount.toLocaleString('en-IN')}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <Button
                    variant="cta"
                    size="md"
                    loading={paying === p.id}
                    icon={<IconCreditCard size={14} />}
                    onClick={() => handlePay(p.id)}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      <SectionCard title="Payment History" subtitle={`${paid.length} transactions`}>
        <table className="lms-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Description</th>
              <th>Paid On</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {STUDENT_PAYMENTS.map(p => (
              <tr key={p.id}>
                <td className="font-mono text-xs text-[#007991] font-semibold">{p.invoiceNumber}</td>
                <td>
                  <p className="font-medium text-[#1F2933]">{p.description}</p>
                  {p.transactionId && <p className="text-[10px] text-[#9BA3AF] font-mono">{p.transactionId}</p>}
                </td>
                <td className="text-xs text-[#667085]">
                  {p.paidDate ? new Date(p.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="text-xs text-[#667085]">{p.method ?? '—'}</td>
                <td className="font-bold text-[#1F2933]">₹{p.amount.toLocaleString('en-IN')}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  {p.status === 'paid' ? (
                    <button
                      onClick={() => addToast({ type: 'info', title: 'Download Started', message: 'Receipt PDF downloading…' })}
                      className="flex items-center gap-1 text-xs text-[#007991] font-semibold hover:underline"
                    >
                      <IconDownload size={13} /> Receipt
                    </button>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </DashboardLayout>
  );
}
