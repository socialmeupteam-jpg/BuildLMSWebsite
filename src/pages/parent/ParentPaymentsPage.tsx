import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { STUDENT_PAYMENTS } from '../../data/mockData';
import {
  IconCreditCard, IconCheckCircle, IconClock, IconFileText,
  IconDownload, IconShield, IconAlertTriangle
} from '../../components/Icons';

const LINKED_CHILDREN = [
  { id: 's-1', name: 'Rahul Sharma', cohort: 'Digital Marketing Mastery (DMM-Feb-2024)', roll: 'SMA-2024-0042' },
];

export default function ParentPaymentsPage() {
  const { addToast } = useApp();
  const [selectedChild] = useState(LINKED_CHILDREN[0]);
  const [payments, setPayments] = useState(STUDENT_PAYMENTS);

  // Pay Now Modal state
  const [activePayment, setActivePayment] = useState<typeof STUDENT_PAYMENTS[0] | null>(null);
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('parent@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Receipt Modal state
  const [viewReceipt, setViewReceipt] = useState<typeof STUDENT_PAYMENTS[0] | null>(null);

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const handleOpenPay = (p: typeof STUDENT_PAYMENTS[0]) => {
    setActivePayment(p);
    setPaySuccess(false);
    setIsProcessing(false);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayment) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaySuccess(true);

      setPayments(prev =>
        prev.map(item =>
          item.id === activePayment.id
            ? {
                ...item,
                status: 'paid' as const,
                paidDate: new Date().toISOString().slice(0, 10),
                method: payMethod.toUpperCase(),
                transactionId: `TXN-${Date.now().toString().slice(-8)}`,
              }
            : item
        )
      );

      addToast({
        title: 'Payment Successful',
        message: `₹${activePayment.amount.toLocaleString('en-IN')} paid for ${activePayment.invoiceNumber}. Receipt generated.`,
        type: 'success',
      });
    }, 900);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Tuition Fees & Payments"
          subtitle={`Installment schedules, online fee payment, and receipts for ${selectedChild.name}`}
        />
        {pendingPayments.length > 0 && (
          <Button
            variant="cta"
            icon={<IconCreditCard size={16} />}
            onClick={() => handleOpenPay(pendingPayments[0])}
          >
            Pay Next Due (₹{pendingPayments[0].amount.toLocaleString('en-IN')})
          </Button>
        )}
      </div>

      {/* Child selector header banner */}
      <div className="flex items-center gap-3 mb-6 p-3.5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
        <span className="text-xs font-semibold text-[#667085]">Student:</span>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#e0f6ff] text-[#005f72] text-xs font-bold border border-[#b1ebff]">
          <span className="w-2 h-2 rounded-full bg-[#007991]" />
          {selectedChild.name} ({selectedChild.roll})
        </div>
        <span className="text-xs text-[#9BA3AF] ml-auto hidden md:inline">
          {selectedChild.cohort}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Program Fee"
          value="₹20,000"
          subtitle="Annual tuition breakdown"
          icon={<IconCreditCard size={20} />}
          iconBg="#E6F4F6"
          iconColor="#007991"
        />
        <StatCard
          title="Total Paid"
          value={`₹${totalPaid.toLocaleString('en-IN')}`}
          subtitle="Reconciled & verified"
          icon={<IconCheckCircle size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Pending Due"
          value={`₹${totalPending.toLocaleString('en-IN')}`}
          subtitle={pendingPayments.length > 0 ? `Due on ${pendingPayments[0].dueDate}` : 'All dues settled'}
          icon={<IconClock size={20} />}
          iconBg={totalPending > 0 ? '#FEF3C7' : '#D1FAE5'}
          iconColor={totalPending > 0 ? '#F59E0B' : '#10B981'}
        />
        <StatCard
          title="Next Installment"
          value={pendingPayments.length > 0 ? `₹${pendingPayments[0].amount.toLocaleString('en-IN')}` : 'Nil'}
          subtitle={pendingPayments.length > 0 ? pendingPayments[0].invoiceNumber : 'Fully cleared'}
          icon={<IconFileText size={20} />}
          iconBg="#f0fbff"
          iconColor="#005f72"
        />
      </div>

      {/* Payment Table */}
      <SectionCard
        title="Fee Invoices & Receipts"
        subtitle="Complete record of course installments and online payment receipts"
      >
        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Description</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[#F7F9FA]">
                  <td className="font-mono text-xs font-bold text-[#007991]">
                    {p.invoiceNumber}
                  </td>
                  <td>
                    <p className="text-sm font-semibold text-[#1F2933]">{p.description}</p>
                    {p.transactionId && (
                      <p className="text-[10px] text-[#9BA3AF] font-mono">Ref: {p.transactionId}</p>
                    )}
                  </td>
                  <td className="text-xs text-[#667085]">{p.course || 'Digital Marketing'}</td>
                  <td className="font-bold text-sm text-[#1F2933]">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="text-xs text-[#667085]">
                    {new Date(p.dueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="text-right">
                    {p.status === 'paid' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<IconFileText size={14} />}
                        onClick={() => setViewReceipt(p)}
                      >
                        Receipt
                      </Button>
                    ) : (
                      <Button
                        variant="cta"
                        size="sm"
                        onClick={() => handleOpenPay(p)}
                      >
                        Pay Online
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Pay Online Modal */}
      <Modal
        isOpen={Boolean(activePayment)}
        onClose={() => setActivePayment(null)}
        title={paySuccess ? 'Payment Confirmation' : `Pay Fee — ${activePayment?.invoiceNumber}`}
        size="md"
      >
        {activePayment && !paySuccess && (
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div className="p-4 bg-[#F7F9FA] rounded-2xl border border-[#E5E7EB] flex justify-between items-center">
              <div>
                <p className="text-xs text-[#667085]">{activePayment.description}</p>
                <p className="text-xs font-semibold text-[#1F2933]">For: {selectedChild.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#007991]">
                  ₹{activePayment.amount.toLocaleString('en-IN')}
                </span>
                <p className="text-[10px] text-emerald-600 font-semibold">Zero Convenience Fee</p>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: '⚡' },
                  { id: 'card', label: 'Debit / Credit Card', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      payMethod === m.id
                        ? 'border-[#007991] bg-[#e0f6ff] text-[#005f72]'
                        : 'border-[#E5E7EB] bg-white text-[#667085] hover:bg-[#F7F9FA]'
                    }`}
                  >
                    <span className="text-base block mb-1">{m.icon}</span>
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Method Details */}
            {payMethod === 'upi' && (
              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Enter UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g., username@okhdfcbank"
                  className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
                <p className="text-[11px] text-[#9BA3AF] mt-1">Instant authorization via GPay, PhonePe, or Paytm</p>
              </div>
            )}

            {payMethod === 'card' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#1F2933] mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1F2933] mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                    />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'netbanking' && (
              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Select Bank</label>
                <select className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]">
                  <option>HDFC Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
              <Button variant="outline" type="button" onClick={() => setActivePayment(null)}>
                Cancel
              </Button>
              <Button variant="cta" type="submit" disabled={isProcessing}>
                {isProcessing ? 'Processing Secure Payment...' : `Authorize ₹${activePayment.amount.toLocaleString('en-IN')}`}
              </Button>
            </div>
          </form>
        )}

        {/* Success confirmation */}
        {activePayment && paySuccess && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2933]">Payment Authorized Successfully</h3>
              <p className="text-xs text-[#667085] mt-1">
                Transaction Ref: <strong className="font-mono text-[#007991]">TXN-29482910</strong>
              </p>
              <p className="text-xs text-[#667085]">
                Amount ₹{activePayment.amount.toLocaleString('en-IN')} has been posted to SocialMeUp Academy.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  const target = activePayment;
                  setActivePayment(null);
                  setViewReceipt(target);
                }}
              >
                View Official Receipt
              </Button>
              <Button variant="outline" onClick={() => setActivePayment(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={Boolean(viewReceipt)}
        onClose={() => setViewReceipt(null)}
        title="Official Payment Receipt"
        size="md"
      >
        {viewReceipt && (
          <div className="p-2 space-y-4 text-xs">
            <div className="p-4 bg-[#F7F9FA] rounded-2xl border border-[#E5E7EB] flex justify-between items-center">
              <div>
                <h4 className="font-bold text-[#007991] text-sm">SocialMeUp Academy Pvt. Ltd.</h4>
                <p className="text-[#667085]">GSTIN: 27AABCS1429R1Z4</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#1F2933]">{viewReceipt.invoiceNumber}</span>
                <p className="text-[10px] text-[#9BA3AF]">Date: {viewReceipt.paidDate || '2024-11-01'}</p>
              </div>
            </div>

            <div className="space-y-2 py-2">
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Student Name:</span>
                <span className="font-bold text-[#1F2933]">{selectedChild.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Roll Number:</span>
                <span className="font-mono text-[#1F2933]">{selectedChild.roll}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Course Program:</span>
                <span className="text-[#1F2933]">{viewReceipt.course || selectedChild.cohort}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Payment Mode:</span>
                <span className="font-bold text-[#007991]">{viewReceipt.method || 'UPI'}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="font-bold text-[#1F2933]">Total Amount Paid:</span>
                <span className="font-bold text-emerald-600">₹{viewReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
              <Button variant="outline" onClick={() => setViewReceipt(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={<IconDownload size={14} />}
                onClick={() => {
                  addToast({
                    title: 'Downloading Receipt',
                    message: `PDF receipt for ${viewReceipt.invoiceNumber} saved to downloads.`,
                    type: 'success',
                  });
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
