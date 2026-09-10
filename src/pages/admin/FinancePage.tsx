import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { ADMIN_STATS, STUDENT_PAYMENTS } from '../../data/mockData';
import {
  IconCreditCard, IconSearch, IconPlus, IconDownload,
  IconCheckCircle, IconClock, IconAlertTriangle, IconFileText
} from '../../components/Icons';

interface FinanceTransaction {
  id: string;
  invoiceNumber: string;
  studentName: string;
  batchName: string;
  course: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  method?: string;
  transactionId?: string;
}

const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  { id: 'tx-1', invoiceNumber: 'SMA-INV-2024-001', studentName: 'Rahul Sharma', batchName: 'DMM-Feb-2024', course: 'Digital Marketing Mastery', amount: 5000, dueDate: '2024-02-20', paidDate: '2024-02-18', status: 'paid', method: 'UPI', transactionId: 'UPI-8921839210' },
  { id: 'tx-2', invoiceNumber: 'SMA-INV-2024-045', studentName: 'Priya Patel', batchName: 'DMM-Feb-2024', course: 'Digital Marketing Mastery', amount: 15000, dueDate: '2024-02-25', paidDate: '2024-02-24', status: 'paid', method: 'Net Banking', transactionId: 'HDFC-4920194829' },
  { id: 'tx-3', invoiceNumber: 'SMA-INV-2024-089', studentName: 'Rahul Sharma', batchName: 'DMM-Feb-2024', course: 'Digital Marketing Mastery', amount: 5000, dueDate: '2024-05-20', paidDate: '2024-05-19', status: 'paid', method: 'UPI', transactionId: 'UPI-9821471029' },
  { id: 'tx-4', invoiceNumber: 'SMA-INV-2024-112', studentName: 'Arjun Kumar', batchName: 'SMM-Mar-2024', course: 'Social Media Marketing', amount: 8000, dueDate: '2024-03-15', paidDate: '2024-03-15', status: 'paid', method: 'Credit Card', transactionId: 'CC-9210482019' },
  { id: 'tx-5', invoiceNumber: 'SMA-INV-2024-150', studentName: 'Rohan Verma', batchName: 'DMM-Jan-2024', course: 'Digital Marketing Mastery', amount: 5000, dueDate: '2024-10-15', status: 'overdue' },
  { id: 'tx-6', invoiceNumber: 'SMA-INV-2024-192', studentName: 'Rahul Sharma', batchName: 'DMM-Feb-2024', course: 'Digital Marketing Mastery', amount: 5000, dueDate: '2024-12-31', status: 'pending' },
  { id: 'tx-7', invoiceNumber: 'SMA-INV-2024-204', studentName: 'Neha Joshi', batchName: 'DMM-Sep-2024', course: 'Digital Marketing Mastery', amount: 7500, dueDate: '2024-12-25', status: 'pending' },
];

export default function FinancePage() {
  const { addToast } = useApp();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  // Record Offline Payment Modal state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [offlineForm, setOfflineForm] = useState({
    studentName: 'Rohan Verma',
    course: 'Digital Marketing Mastery',
    amount: 5000,
    method: 'Cash',
    receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
    notes: 'Paid at academy front desk',
  });

  // Receipt Modal state
  const [activeReceipt, setActiveReceipt] = useState<FinanceTransaction | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSearch =
      t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.course.toLowerCase().includes(search.toLowerCase()) ||
      (t.transactionId && t.transactionId.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const totalCollected = transactions
    .filter(t => t.status === 'paid')
    .reduce((s, t) => s + t.amount, 0);
  const totalPending = transactions
    .filter(t => t.status === 'pending')
    .reduce((s, t) => s + t.amount, 0);
  const totalOverdue = transactions
    .filter(t => t.status === 'overdue')
    .reduce((s, t) => s + t.amount, 0);

  const handleRecordOfflinePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const newTx: FinanceTransaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber: `SMA-INV-2024-${Math.floor(210 + Math.random() * 80)}`,
      studentName: offlineForm.studentName,
      batchName: 'DMM-Jan-2024',
      course: offlineForm.course,
      amount: Number(offlineForm.amount),
      dueDate: new Date().toISOString().slice(0, 10),
      paidDate: new Date().toISOString().slice(0, 10),
      status: 'paid',
      method: offlineForm.method,
      transactionId: offlineForm.receiptNumber,
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsRecordModalOpen(false);

    addToast({
      title: 'Payment Recorded',
      message: `₹${newTx.amount.toLocaleString('en-IN')} logged for ${newTx.studentName}. Receipt generated.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Academy Financial Management"
          subtitle="Revenue tracking, installment schedules, online collection & offline reconciliation"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<IconDownload size={16} />}
            onClick={() =>
              addToast({
                title: 'Exporting Financial Ledger',
                message: 'All reconciled invoices exported to CSV format.',
                type: 'success',
              })
            }
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon={<IconPlus size={16} />}
            onClick={() => setIsRecordModalOpen(true)}
          >
            Record Offline Payment
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={`₹${(totalCollected / 1000).toFixed(0)}k`}
          subtitle="Reconciled collections"
          icon={<IconCreditCard size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Pending Dues"
          value={`₹${(totalPending / 1000).toFixed(0)}k`}
          subtitle={`${transactions.filter(t => t.status === 'pending').length} unpaid invoices`}
          icon={<IconClock size={20} />}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
        />
        <StatCard
          title="Overdue Dues"
          value={`₹${(totalOverdue / 1000).toFixed(0)}k`}
          subtitle="Action required"
          icon={<IconAlertTriangle size={20} />}
          iconBg="#FEE2E2"
          iconColor="#EF4444"
        />
        <StatCard
          title="Collection Rate"
          value={`${Math.round((totalCollected / (totalCollected + totalPending + totalOverdue)) * 100)}%`}
          subtitle="Target 90% benchmark"
          icon={<IconCheckCircle size={20} />}
          iconBg="#e0f6ff"
          iconColor="#007991"
        />
      </div>

      {/* Transactions Table Card */}
      <SectionCard title="Billing Invoices & Receipts">
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl text-xs overflow-x-auto">
            {(['all', 'paid', 'pending', 'overdue'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-[#007991] shadow-xs'
                    : 'text-[#667085] hover:text-[#1F2933]'
                }`}
              >
                {tab === 'all' ? `All (${transactions.length})` : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
            <input
              type="text"
              placeholder="Search invoice, student, or txn ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th>Course Program</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Mode / Ref</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-[#F7F9FA]">
                  <td className="font-mono text-xs font-bold text-[#007991]">
                    {t.invoiceNumber}
                  </td>
                  <td>
                    <p className="text-sm font-semibold text-[#1F2933]">{t.studentName}</p>
                    <p className="text-[11px] text-[#9BA3AF]">{t.batchName}</p>
                  </td>
                  <td className="text-xs text-[#667085]">{t.course}</td>
                  <td className="font-bold text-sm text-[#1F2933]">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="text-xs text-[#667085]">
                    {new Date(t.dueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td>
                    {t.method ? (
                      <div>
                        <span className="text-xs font-bold text-[#1F2933]">{t.method}</span>
                        {t.transactionId && (
                          <p className="text-[10px] text-[#9BA3AF] font-mono">{t.transactionId}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#9BA3AF] text-xs">—</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveReceipt(t)}
                    >
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Record Offline Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Offline Fee Payment"
        size="md"
      >
        <form onSubmit={handleRecordOfflinePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Student Name *</label>
            <input
              type="text"
              value={offlineForm.studentName}
              onChange={e => setOfflineForm(f => ({ ...f, studentName: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Course Program</label>
              <input
                type="text"
                value={offlineForm.course}
                onChange={e => setOfflineForm(f => ({ ...f, course: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Amount Paid (₹) *</label>
              <input
                type="number"
                value={offlineForm.amount}
                onChange={e => setOfflineForm(f => ({ ...f, amount: Number(e.target.value) }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Payment Instrument</label>
              <select
                value={offlineForm.method}
                onChange={e => setOfflineForm(f => ({ ...f, method: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              >
                <option value="Cash">Cash (Counter Deposit)</option>
                <option value="Cheque / DD">Bank Cheque / DD</option>
                <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                <option value="POS Card Swipe">POS Card Swipe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Receipt / Chq #</label>
              <input
                type="text"
                value={offlineForm.receiptNumber}
                onChange={e => setOfflineForm(f => ({ ...f, receiptNumber: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Administrative Notes</label>
            <textarea
              rows={2}
              value={offlineForm.notes}
              onChange={e => setOfflineForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit">
              Post to Accounts
            </Button>
          </div>
        </form>
      </Modal>

      {/* Receipt Preview Modal */}
      <Modal
        isOpen={Boolean(activeReceipt)}
        onClose={() => setActiveReceipt(null)}
        title="Official Tax Invoice & Receipt"
        size="md"
      >
        {activeReceipt && (
          <div className="p-2 space-y-4 text-xs">
            <div className="p-4 bg-[#F7F9FA] rounded-2xl border border-[#E5E7EB] flex justify-between items-center">
              <div>
                <h4 className="font-bold text-[#007991] text-sm">SocialMeUp Academy Pvt. Ltd.</h4>
                <p className="text-[#667085]">GSTIN: 27AABCS1429R1Z4</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-[#1F2933]">{activeReceipt.invoiceNumber}</span>
                <p className="text-[10px] text-[#9BA3AF]">Issued: {activeReceipt.paidDate || activeReceipt.dueDate}</p>
              </div>
            </div>

            <div className="space-y-2 py-2">
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Student:</span>
                <span className="font-bold text-[#1F2933]">{activeReceipt.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Batch:</span>
                <span className="font-semibold text-[#1F2933]">{activeReceipt.batchName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Course Program:</span>
                <span className="text-[#1F2933]">{activeReceipt.course}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Payment Instrument:</span>
                <span className="font-bold text-[#007991]">{activeReceipt.method || 'Online'}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="font-bold text-[#1F2933]">Total Amount:</span>
                <span className="font-bold text-emerald-600">₹{activeReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
              <Button variant="outline" onClick={() => setActiveReceipt(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={<IconDownload size={14} />}
                onClick={() => {
                  addToast({
                    title: 'Receipt Downloaded',
                    message: `Official invoice ${activeReceipt.invoiceNumber} saved.`,
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
