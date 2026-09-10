import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import { StatusBadge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/AppContext';
import {
  IconAlertTriangle, IconCheckCircle, IconClock, IconSearch,
  IconEye, IconUser, IconPlus
} from '../../components/Icons';

export interface AdminGrievance {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'waiting' | 'closed';
  createdDate: string;
  description: string;
  studentName: string;
  batchName: string;
  resolutionNote?: string;
  resolvedAt?: string;
}

const INITIAL_ADMIN_GRIEVANCES: AdminGrievance[] = [
  {
    id: 'gv-1',
    ticketNumber: 'TKT-2024-0142',
    subject: 'Certificate not received after course completion',
    category: 'Certification',
    priority: 'high',
    status: 'in_progress',
    createdDate: '2024-12-05',
    description: 'I completed the Social Media Marketing course 3 weeks ago but have not received my certificate yet.',
    studentName: 'Rahul Sharma',
    batchName: 'SMM-Oct-2023',
    resolutionNote: 'Verification pending with Academic Registrar.',
  },
  {
    id: 'gv-2',
    ticketNumber: 'TKT-2024-0138',
    subject: 'Payment receipt not sent for October installment',
    category: 'Finance',
    priority: 'medium',
    status: 'resolved',
    createdDate: '2024-10-30',
    description: 'I made the October payment but did not receive the official payment receipt on email.',
    studentName: 'Priya Patel',
    batchName: 'DMM-Feb-2024',
    resolutionNote: 'Resent receipt PDF to registered email address.',
    resolvedAt: '2024-11-02',
  },
  {
    id: 'gv-3',
    ticketNumber: 'TKT-2024-0120',
    subject: 'LMS recorded absence during live session on Dec 04',
    category: 'Attendance',
    priority: 'medium',
    status: 'open',
    createdDate: '2024-12-06',
    description: 'I attended the entire 2 hour lecture on email marketing but attendance shows absent.',
    studentName: 'Arjun Kumar',
    batchName: 'DMM-Feb-2024',
  },
  {
    id: 'gv-4',
    ticketNumber: 'TKT-2024-0115',
    subject: 'Request for batch timing transfer to evening shift',
    category: 'Academic Operations',
    priority: 'low',
    status: 'in_progress',
    createdDate: '2024-12-02',
    description: 'College exams clash with morning batch. Kindly transfer me to the 6 PM cohort.',
    studentName: 'Meera Krishnan',
    batchName: 'PM-May-2024',
  },
];

export default function AdminGrievancesPage() {
  const { addToast } = useApp();
  const [tickets, setTickets] = useState<AdminGrievance[]>(INITIAL_ADMIN_GRIEVANCES);
  const [selectedTicket, setSelectedTicket] = useState<AdminGrievance | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Drawer update state
  const [responseNote, setResponseNote] = useState('');
  const [newStatus, setNewStatus] = useState<AdminGrievance['status']>('in_progress');

  const filteredTickets = tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.studentName.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const highPriorityCount = tickets.filter(t => t.priority === 'high' && t.status !== 'resolved').length;

  const handleUpdateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setTickets(prev =>
      prev.map(t => {
        if (t.id === selectedTicket.id) {
          const updated: AdminGrievance = {
            ...t,
            status: newStatus,
            resolutionNote: responseNote || t.resolutionNote,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined,
          };
          setSelectedTicket(updated);
          return updated;
        }
        return t;
      })
    );

    addToast({
      title: 'Grievance Updated',
      message: `Ticket ${selectedTicket.ticketNumber} marked as ${newStatus.replace('_', ' ')}.`,
      type: 'success',
    });
    setResponseNote('');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Grievance & Support Tickets"
        subtitle="Review, escalate, and resolve student & parent support requests"
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Open Tickets"
          value={openCount}
          subtitle="Awaiting administrative review"
          icon={<IconAlertTriangle size={20} />}
          iconBg="#FEF3C7"
          iconColor="#B45309"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Assigned to academy officer"
          icon={<IconClock size={20} />}
          iconBg="#E6F4F6"
          iconColor="#007991"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Closed within SLA target"
          icon={<IconCheckCircle size={20} />}
          iconBg="#ECFDF5"
          iconColor="#059669"
        />
        <StatCard
          title="High Priority"
          value={highPriorityCount}
          subtitle="Urgent escalations"
          icon={<IconAlertTriangle size={20} />}
          iconBg="#FEE2E2"
          iconColor="#DC2626"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
          <input
            type="text"
            placeholder="Search by ticket #, student name, subject, or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <SectionCard title="Tickets Queue" subtitle={`${filteredTickets.length} tickets matching current filters`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#667085] bg-[#F7F9FA]">
                <th className="p-3.5">Ticket #</th>
                <th className="p-3.5">Student / Parent</th>
                <th className="p-3.5">Issue Subject</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Date Raised</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F6]">
              {filteredTickets.map(t => (
                <tr key={t.id} className="hover:bg-[#F7F9FA]">
                  <td className="p-3.5 font-mono text-xs font-bold text-[#007991]">
                    {t.ticketNumber}
                  </td>
                  <td className="p-3.5">
                    <p className="text-sm font-semibold text-[#1F2933]">{t.studentName}</p>
                    <p className="text-[11px] text-[#9BA3AF]">{t.batchName}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="text-xs font-medium text-[#1F2933] max-w-xs truncate">{t.subject}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4F6] text-[#007991]">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'high'
                          ? 'bg-rose-50 text-rose-600'
                          : t.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-[#667085]">
                    {new Date(t.createdDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTicket(t);
                        setNewStatus(t.status);
                        setResponseNote(t.resolutionNote || '');
                      }}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Ticket Details & Resolution Drawer */}
      <Drawer
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket ? `Grievance #${selectedTicket.ticketNumber}` : 'Ticket'}
        size="md"
      >
        {selectedTicket && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-[#F7F9FA] rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-bold text-[#007991]">
                  {selectedTicket.ticketNumber}
                </span>
                <StatusBadge status={selectedTicket.status} />
              </div>
              <h4 className="text-base font-bold text-[#1F2933]">{selectedTicket.subject}</h4>
              <p className="text-[#667085]">
                Filed by <strong>{selectedTicket.studentName}</strong> ({selectedTicket.batchName}) on {new Date(selectedTicket.createdDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] space-y-1">
              <span className="text-[10px] text-[#9BA3AF] font-bold uppercase">Student Description</span>
              <p className="text-[#374151] leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>

            {selectedTicket.resolutionNote && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-[10px] text-emerald-800 font-bold uppercase">Official Resolution Note</span>
                <p className="text-emerald-900 leading-relaxed">{selectedTicket.resolutionNote}</p>
              </div>
            )}

            {/* Admin action form */}
            <form onSubmit={handleUpdateTicket} className="p-4 bg-[#F7F9FA] rounded-xl border border-[#E5E7EB] space-y-3">
              <h5 className="font-bold text-[#1F2933]">Administrative Resolution Form</h5>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as AdminGrievance['status'])}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Resolution / Officer Note</label>
                <textarea
                  rows={3}
                  value={responseNote}
                  onChange={e => setResponseNote(e.target.value)}
                  placeholder="Record internal investigation remarks or student resolution notice…"
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
              </div>

              <div className="pt-2">
                <Button variant="cta" fullWidth type="submit">
                  Save Ticket Update
                </Button>
              </div>
            </form>
          </div>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
