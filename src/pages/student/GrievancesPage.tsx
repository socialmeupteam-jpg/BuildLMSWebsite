import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import StatCard from '../../components/ui/StatCard';
import { useApp } from '../../contexts/AppContext';
import { GRIEVANCES } from '../../data/mockData';
import {
  IconHelp, IconSearch, IconPlus, IconCheckCircle,
  IconClock, IconAlertTriangle, IconFileText, IconChevronRight, IconX
} from '../../components/Icons';

export interface GrievanceItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: 'Academic' | 'Finance' | 'Technical' | 'Certification' | 'General';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  createdDate: string;
  updatedDate: string;
  description: string;
  replies?: {
    id: string;
    author: string;
    role: 'student' | 'support' | 'admin';
    message: string;
    timestamp: string;
  }[];
}

const INITIAL_GRIEVANCES: GrievanceItem[] = [
  {
    id: 'gv-1',
    ticketNumber: 'TKT-2024-0142',
    subject: 'Certificate not received after course completion',
    category: 'Certification',
    priority: 'high',
    status: 'in_progress',
    createdDate: '2024-12-05',
    updatedDate: '2024-12-10',
    description: 'I completed the Social Media Marketing course 3 weeks ago with 92% grade, but the certificate has not been generated on my portal yet.',
    replies: [
      {
        id: 'r-1',
        author: 'Rahul Sharma',
        role: 'student',
        message: 'I completed all 8 modules and passed the final evaluation. Could you please check my status?',
        timestamp: '2024-12-05 10:30 AM',
      },
      {
        id: 'r-2',
        author: 'Pooja Verma (Student Support)',
        role: 'support',
        message: 'Hello Rahul, we verified your exam score. The digital signature pipeline is currently batch-signing certificates for your cohort. You should see it within 48 hours.',
        timestamp: '2024-12-08 03:15 PM',
      },
    ],
  },
  {
    id: 'gv-2',
    ticketNumber: 'TKT-2024-0138',
    subject: 'Payment receipt not sent for October installment',
    category: 'Finance',
    priority: 'medium',
    status: 'resolved',
    createdDate: '2024-10-30',
    updatedDate: '2024-11-02',
    description: 'I made the October installment payment of ₹5,000 via UPI transaction ID 403928174829, but did not receive the official payment receipt on my email.',
    replies: [
      {
        id: 'r-3',
        author: 'Accounts Team',
        role: 'admin',
        message: 'Receipt SMA-INV-2024-089 has been reconciled and resent to rahul.sharma@email.com. You can also view it directly in the Fees & Payments tab.',
        timestamp: '2024-11-02 11:20 AM',
      },
    ],
  },
  {
    id: 'gv-3',
    ticketNumber: 'TKT-2024-0125',
    subject: 'Live class recording for Module 5 video playback issue',
    category: 'Technical',
    priority: 'low',
    status: 'resolved',
    createdDate: '2024-09-18',
    updatedDate: '2024-09-20',
    description: 'The recording for Module 5 lecture had audio out of sync in the first 15 minutes.',
    replies: [
      {
        id: 'r-4',
        author: 'Tech Support',
        role: 'support',
        message: 'The audio stream has been re-encoded and the clean playback file is now live.',
        timestamp: '2024-09-20 02:00 PM',
      },
    ],
  },
];

export default function GrievancesPage() {
  const { addToast } = useApp();
  const [tickets, setTickets] = useState<GrievanceItem[]>(INITIAL_GRIEVANCES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<GrievanceItem | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<GrievanceItem['category']>('Academic');
  const [priority, setPriority] = useState<GrievanceItem['priority']>('medium');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({});

  // Follow-up reply state in drawer
  const [replyText, setReplyText] = useState('');

  const filteredTickets = tickets.filter(t => {
    const matchSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'resolved') return t.status === 'resolved' || t.status === 'closed';
    return t.status === statusFilter;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { subject?: string; description?: string } = {};
    if (!subject.trim()) errs.subject = 'Please enter a ticket subject';
    if (!description.trim() || description.length < 15) {
      errs.description = 'Please describe your query in at least 15 characters';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newTicket: GrievanceItem = {
      id: `gv-${Date.now()}`,
      ticketNumber: `TKT-2024-0${Math.floor(150 + Math.random() * 850)}`,
      subject,
      category,
      priority,
      status: 'open',
      createdDate: new Date().toISOString().slice(0, 10),
      updatedDate: new Date().toISOString().slice(0, 10),
      description,
      replies: [
        {
          id: `r-${Date.now()}`,
          author: 'Rahul Sharma',
          role: 'student',
          message: description,
          timestamp: 'Just now',
        },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);
    setIsModalOpen(false);
    setSubject('');
    setDescription('');
    setAttachmentName('');
    setErrors({});

    addToast({
      title: 'Ticket Submitted',
      message: `Your grievance ${newTicket.ticketNumber} has been logged. Support team SLA is 24 hours.`,
      type: 'success',
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newReply = {
      id: `r-${Date.now()}`,
      author: 'Rahul Sharma',
      role: 'student' as const,
      message: replyText.trim(),
      timestamp: 'Just now',
    };

    const updated = {
      ...selectedTicket,
      updatedDate: new Date().toISOString().slice(0, 10),
      replies: [...(selectedTicket.replies || []), newReply],
    };

    setSelectedTicket(updated);
    setTickets(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    setReplyText('');

    addToast({
      title: 'Message Sent',
      message: 'Your update was added to ticket thread.',
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Support Tickets & Grievances"
          subtitle="Raise concerns, track administrative requests, and get assistance"
        />
        <Button
          variant="primary"
          icon={<IconPlus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Submit New Grievance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tickets"
          value={stats.total}
          subtitle="All-time queries"
          icon={<IconHelp size={20} />}
          iconBg="#E6F4F6"
          iconColor="#007991"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Under active review"
          icon={<IconClock size={20} />}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
        />
        <StatCard
          title="Open"
          value={stats.open}
          subtitle="Awaiting response"
          icon={<IconAlertTriangle size={20} />}
          iconBg="#FEE2E2"
          iconColor="#EF4444"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          subtitle="Successfully closed"
          icon={<IconCheckCircle size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
      </div>

      {/* Main Content Area */}
      <SectionCard
        title="My Support Requests"
        subtitle="Track tickets submitted to student affairs, billing, and technical teams"
      >
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Status Filter Tabs */}
          <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl overflow-x-auto">
            {(['all', 'in_progress', 'open', 'resolved'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-[#007991] shadow-xs'
                    : 'text-[#667085] hover:text-[#1F2933]'
                }`}
              >
                {tab === 'all' && 'All Tickets'}
                {tab === 'in_progress' && 'In Progress'}
                {tab === 'open' && 'Open'}
                {tab === 'resolved' && 'Resolved'}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
            <input
              type="text"
              placeholder="Search by ticket # or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>
        </div>

        {/* Tickets List / Table */}
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E6F4F6] flex items-center justify-center text-[#007991] mb-3">
              <IconHelp size={28} />
            </div>
            <p className="text-sm font-bold text-[#1F2933]">No grievances found</p>
            <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
              {search
                ? 'Try adjusting your search query or clear the filter.'
                : 'You have no tickets currently under this category.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(t => (
                  <tr key={t.id} className="hover:bg-[#F7F9FA]">
                    <td className="font-mono text-xs font-bold text-[#007991]">
                      {t.ticketNumber}
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2933]">{t.subject}</p>
                        <p className="text-xs text-[#667085] line-clamp-1 mt-0.5">{t.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-[#F2F4F6] text-[#4B5563]">
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          t.priority === 'high'
                            ? 'bg-rose-50 text-rose-600'
                            : t.priority === 'medium'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {t.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="text-xs text-[#667085]">
                      {new Date(t.updatedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicket(t)}
                      >
                        View Thread
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Ticket Details Drawer */}
      <Drawer
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? selectedTicket.ticketNumber : 'Ticket Details'}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="bg-[#F7F9FA] p-4 rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#007991] font-mono">
                  {selectedTicket.ticketNumber}
                </span>
                <StatusBadge status={selectedTicket.status} />
              </div>
              <h3 className="text-base font-bold text-[#1F2933]">{selectedTicket.subject}</h3>
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-[#667085]">
                <span>Category: <strong className="text-[#1F2933]">{selectedTicket.category}</strong></span>
                <span>•</span>
                <span>Priority: <strong className="text-[#1F2933]">{selectedTicket.priority}</strong></span>
                <span>•</span>
                <span>Created: {selectedTicket.createdDate}</span>
              </div>
            </div>

            {/* Conversation Thread */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-3">
                Ticket Activity & Responses
              </h4>
              <div className="space-y-3">
                {selectedTicket.replies?.map(r => (
                  <div
                    key={r.id}
                    className={`p-4 rounded-2xl border ${
                      r.role === 'student'
                        ? 'bg-white border-[#E5E7EB] ml-4'
                        : 'bg-[#f0fbff] border-[#b1ebff] mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#1F2933]">
                        {r.author} {r.role !== 'student' && <span className="text-[#007991] font-normal">(Staff)</span>}
                      </span>
                      <span className="text-[10px] text-[#9BA3AF]">{r.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#374151] whitespace-pre-wrap leading-relaxed">
                      {r.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add reply form */}
            {selectedTicket.status !== 'closed' ? (
              <form onSubmit={handleSendReply} className="pt-2 space-y-2 border-t border-[#E5E7EB]">
                <label className="block text-xs font-bold text-[#1F2933]">Add Reply or Additional Details</label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to support staff..."
                  className="w-full text-xs p-3 rounded-xl border border-[#E5E7EB] bg-white outline-none focus:border-[#007991]"
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" type="submit" disabled={!replyText.trim()}>
                    Send Message
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl text-center">
                This grievance has been resolved and closed.
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Submit Grievance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit New Support Grievance"
        size="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Department / Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              <option value="Academic">Academic (Curriculum, Doubt Resolution, Grades)</option>
              <option value="Certification">Certification (Issuance, Verification, Name Correction)</option>
              <option value="Finance">Finance (Fee Receipts, EMI, Refund, Invoices)</option>
              <option value="Technical">Technical (LMS Portal, Video Playback, Login)</option>
              <option value="General">General Inquiries</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Subject / Issue Summary *</label>
            <input
              type="text"
              placeholder="e.g., Certificate not generating for SMM course"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className={`w-full bg-[#F7F9FA] border rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none ${
                errors.subject ? 'border-rose-500' : 'border-[#E5E7EB] focus:border-[#007991]'
              }`}
            />
            {errors.subject && <p className="text-[11px] text-rose-500 mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    priority === p
                      ? 'border-[#007991] bg-[#e0f6ff] text-[#005f72]'
                      : 'border-[#E5E7EB] bg-white text-[#667085] hover:bg-[#F7F9FA]'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              placeholder="Provide context, batch name, dates, or error codes..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`w-full bg-[#F7F9FA] border rounded-xl p-3 text-xs text-[#1F2933] outline-none ${
                errors.description ? 'border-rose-500' : 'border-[#E5E7EB] focus:border-[#007991]'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Attach Supporting Screenshot or Doc</label>
            <div className="border border-dashed border-[#E5E7EB] rounded-xl p-3 text-center bg-[#F7F9FA]">
              <input
                type="file"
                id="ticket-file"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setAttachmentName(file.name);
                }}
              />
              <label
                htmlFor="ticket-file"
                className="cursor-pointer text-xs text-[#007991] font-semibold hover:underline inline-flex items-center gap-1.5"
              >
                <IconFileText size={14} />
                {attachmentName ? attachmentName : 'Choose file (PDF, PNG, JPG up to 5MB)'}
              </label>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
