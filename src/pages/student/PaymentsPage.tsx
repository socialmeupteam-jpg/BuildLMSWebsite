import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { STUDENT_PAYMENTS } from '../../data/mockData';
import {
  IconCreditCard,
  IconDownload,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconFileText,
  IconShield,
} from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';
import type { Payment } from '../../types';

export default function PaymentsPage() {
  const { addToast } = useApp();
  const [payments, setPayments] = useState<Payment[]>(STUDENT_PAYMENTS);

  // Payment Checkout Modal State
  const [checkoutPayment, setCheckoutPayment] = useState<Payment | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Invoice / Receipt Preview Modal State
  const [viewingReceipt, setViewingReceipt] = useState<Payment | null>(null);

  const pending = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  const paid = payments.filter(p => p.status === 'paid');
  const totalPaid = paid.reduce((s, p) => s + p.amount, 0);
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);

  const handleOpenPay = (p: Payment) => {
    setCheckoutPayment(p);
    setSelectedMethod('upi');
    setUpiId('aarav.sharma@okaxis');
    setCardHolder('Aarav Sharma');
    setCardNumber('•••• •••• •••• 4242');
    setCardExpiry('08/28');
    setCardCvv('123');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPayment) return;

    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      const updatedList = payments.map(p =>
        p.id === checkoutPayment.id
          ? {
              ...p,
              status: 'paid' as const,
              paidDate: new Date().toISOString(),
              method: selectedMethod === 'upi' ? 'UPI' : selectedMethod === 'card' ? 'Credit Card' : 'Net Banking',
              transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            }
          : p
      );
      setPayments(updatedList);
      setCheckoutPayment(null);

      addToast({
        title: 'Payment Successful',
        message: `₹${checkoutPayment.amount.toLocaleString('en-IN')} paid successfully via ${selectedMethod.toUpperCase()}.`,
        type: 'success',
      });
    }, 1200);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Fees & Payments" subtitle="Manage your course fees, invoices and payment history" />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-[#10B981]">₹{totalPaid.toLocaleString('en-IN')}</p>
          <p className="text-xs text-[#9BA3AF] mt-0.5">{paid.length} payments completed</p>
        </div>
        <div className={`bg-white rounded-2xl border p-5 ${totalPending > 0 ? 'border-l-4 border-l-[#F59E0B] border-[#E5E7EB]' : 'border-[#E5E7EB]'}`} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Pending Amount</p>
          <p className={`text-2xl font-bold ${totalPending > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>₹{totalPending.toLocaleString('en-IN')}</p>
          <p className="text-xs text-[#9BA3AF] mt-0.5">{pending.length} pending invoice{pending.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Upcoming Due Date</p>
          <p className="text-2xl font-bold text-[#1F2933]">
            {pending[0] ? new Date(pending[0].dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'None'}
          </p>
          <p className="text-xs text-[#9BA3AF] mt-0.5">
            {pending[0] ? `₹${pending[0].amount.toLocaleString('en-IN')} pending` : 'All invoices settled'}
          </p>
        </div>
      </div>

      {/* Pending payments */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#1F2933] mb-3">Pending Payments</h3>
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border-2 border-[#F59E0B]/40 p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
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
                    icon={<IconCreditCard size={14} />}
                    onClick={() => handleOpenPay(p)}
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
        <div className="overflow-x-auto">
          <table className="lms-table w-full">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Description</th>
                <th>Paid On</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
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
                        type="button"
                        onClick={() => setViewingReceipt(p)}
                        className="flex items-center gap-1 text-xs text-[#007991] font-semibold hover:underline cursor-pointer"
                      >
                        <IconFileText size={13} /> View Receipt
                      </button>
                    ) : (
                      <Button
                        variant="cta"
                        size="sm"
                        onClick={() => handleOpenPay(p)}
                      >
                        Pay
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Checkout / Pay Modal */}
      <Modal
        isOpen={!!checkoutPayment}
        onClose={() => setCheckoutPayment(null)}
        title="Complete Payment"
        description={checkoutPayment ? `${checkoutPayment.description} · Invoice ${checkoutPayment.invoiceNumber}` : ''}
        size="md"
      >
        {checkoutPayment && (
          <form onSubmit={handleProcessPayment} className="space-y-4">
            {/* Amount Summary */}
            <div className="p-4 bg-[#E6F4F6] rounded-2xl flex items-center justify-between border border-[#007991]/20">
              <div>
                <p className="text-xs font-semibold text-[#007991]">Total Amount Payable</p>
                <p className="text-2xl font-bold text-slate-900">₹{checkoutPayment.amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] bg-white text-[#007991] px-2.5 py-1 rounded-full font-semibold shadow-xs">
                  Includes 18% GST
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: '⚡' },
                  { id: 'card', label: 'Card', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedMethod === m.id
                        ? 'border-[#007991] bg-[#007991]/5 font-semibold text-[#007991]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-lg mb-1">{m.icon}</div>
                    <p className="text-xs">{m.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Method Inputs */}
            {selectedMethod === 'upi' && (
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label htmlFor="upi-id" className="block text-xs font-semibold text-slate-700">UPI ID / VPA</label>
                <input
                  id="upi-id"
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#007991]"
                  required
                />
                <p className="text-[11px] text-slate-400">Supported: Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label htmlFor="card-name" className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    id="card-name"
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#007991]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="card-number" className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                  <input
                    id="card-number"
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#007991]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="card-exp" className="block text-xs font-semibold text-slate-700 mb-1">Expiry</label>
                    <input
                      id="card-exp"
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#007991]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvv" className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                    <input
                      id="card-cvv"
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      maxLength={4}
                      placeholder="•••"
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#007991]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label htmlFor="select-bank" className="block text-xs font-semibold text-slate-700">Choose Bank</label>
                <select
                  id="select-bank"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-[#007991]"
                >
                  <option>HDFC Bank</option>
                  <option>State Bank of India</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <IconShield size={14} className="text-emerald-600 shrink-0" />
              <span>256-bit encrypted transaction with RBI-compliant payment gateway.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCheckoutPayment(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="cta"
                loading={isProcessingPay}
                icon={<IconCheck size={14} />}
              >
                Authorize & Pay ₹{checkoutPayment.amount.toLocaleString('en-IN')}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Invoice Receipt Modal */}
      <Modal
        isOpen={!!viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        title="Payment Receipt"
        description="Official tax invoice and payment acknowledgement"
        size="md"
      >
        {viewingReceipt && (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4 text-xs">
              {/* Institution Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">BrightPath Learning Academy</h4>
                  <p className="text-slate-500">GSTIN: 29AABCB1234F1Z5</p>
                  <p className="text-slate-500">Bangalore, Karnataka, India</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase">
                    Paid
                  </span>
                  <p className="font-mono text-slate-600 mt-1 font-semibold">{viewingReceipt.invoiceNumber}</p>
                </div>
              </div>

              {/* Bill to */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Billed To</p>
                  <p className="font-semibold text-slate-900 mt-0.5">Aarav Sharma</p>
                  <p className="text-slate-500">Student ID: STD-2024-001</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Payment Details</p>
                  <p className="text-slate-700 mt-0.5">
                    Date: {viewingReceipt.paidDate ? new Date(viewingReceipt.paidDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                  <p className="text-slate-700">Method: {viewingReceipt.method || 'Online'}</p>
                  {viewingReceipt.transactionId && (
                    <p className="font-mono text-[11px] text-slate-500">{viewingReceipt.transactionId}</p>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left border-t border-slate-100 pt-2">
                <thead>
                  <tr className="text-slate-500 text-[11px] border-b border-slate-100">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="py-2.5">{viewingReceipt.description}</td>
                    <td className="py-2.5 text-right font-medium">
                      ₹{Math.round(viewingReceipt.amount / 1.18).toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-500">CGST (9%) + SGST (9%)</td>
                    <td className="py-2 text-right text-slate-500">
                      ₹{(viewingReceipt.amount - Math.round(viewingReceipt.amount / 1.18)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-2.5">Total Amount Paid</td>
                    <td className="py-2.5 text-right text-sm text-[#007991]">
                      ₹{viewingReceipt.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingReceipt(null)}
              >
                Close
              </Button>
              <Button
                variant="cta"
                size="sm"
                icon={<IconDownload size={14} />}
                onClick={() => {
                  addToast({
                    title: 'Receipt Downloaded',
                    message: `Receipt ${viewingReceipt.invoiceNumber}.pdf downloaded.`,
                    type: 'success',
                  });
                  setViewingReceipt(null);
                }}
              >
                Download Receipt (PDF)
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
