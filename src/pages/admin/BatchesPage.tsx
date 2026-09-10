import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import { useApp } from '../../contexts/AppContext';
import { BATCHES, COURSES } from '../../data/mockData';
import type { Batch } from '../../types';
import {
  IconUsers, IconPlus, IconSearch, IconCalendar,
  IconCheckCircle, IconClock, IconBook, IconEye
} from '../../components/Icons';

export default function BatchesPage() {
  const { addToast } = useApp();
  const [batches, setBatches] = useState<Batch[]>(BATCHES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Create Batch Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    courseTitle: 'Digital Marketing Mastery',
    trainerName: 'Ankit Verma',
    startDate: '2025-02-01',
    endDate: '2025-08-01',
    schedule: 'Mon/Wed/Fri 6:00–8:00 PM',
    maxCapacity: 35,
    mode: 'online' as 'online' | 'offline' | 'hybrid',
  });

  const filteredBatches = batches.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.trainerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalStudents = batches.reduce((s, b) => s + b.studentsCount, 0);
  const totalCapacity = batches.reduce((s, b) => s + b.maxCapacity, 0);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newBatch: Batch = {
      id: `b-${Date.now()}`,
      name: form.name.trim(),
      courseId: 'course-1',
      courseTitle: form.courseTitle,
      startDate: form.startDate,
      endDate: form.endDate,
      schedule: form.schedule,
      trainerId: 'trainer-1',
      trainerName: form.trainerName,
      studentsCount: 0,
      maxCapacity: Number(form.maxCapacity),
      status: 'upcoming',
      mode: form.mode,
    };

    setBatches(prev => [newBatch, ...prev]);
    setIsCreateOpen(false);
    setForm({
      name: '',
      courseTitle: 'Digital Marketing Mastery',
      trainerName: 'Ankit Verma',
      startDate: '2025-02-01',
      endDate: '2025-08-01',
      schedule: 'Mon/Wed/Fri 6:00–8:00 PM',
      maxCapacity: 35,
      mode: 'online',
    });

    addToast({
      title: 'Batch Created',
      message: `Cohort ${newBatch.name} initialized with ${newBatch.maxCapacity} seats.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Batch & Cohort Management"
          subtitle="Configure training cohorts, schedule sessions, and allocate trainers"
        />
        <Button
          variant="primary"
          icon={<IconPlus size={16} />}
          onClick={() => setIsCreateOpen(true)}
        >
          Create New Batch
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Batches"
          value={batches.length}
          subtitle={`${batches.filter(b => b.status === 'active').length} active currently`}
          icon={<IconBook size={20} />}
          iconBg="#e0f6ff"
          iconColor="#007991"
        />
        <StatCard
          title="Active Enrollments"
          value={totalStudents}
          subtitle={`Across all cohorts`}
          icon={<IconUsers size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Seat Occupancy"
          value={`${Math.round((totalStudents / totalCapacity) * 100)}%`}
          subtitle={`${totalStudents}/${totalCapacity} total seats`}
          icon={<IconCheckCircle size={20} />}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
        />
        <StatCard
          title="Upcoming Batches"
          value={batches.filter(b => b.status === 'upcoming').length}
          subtitle="Launching soon"
          icon={<IconClock size={20} />}
          iconBg="#f0fbff"
          iconColor="#005f72"
        />
      </div>

      {/* Batches Table Card */}
      <SectionCard title="Academy Cohorts & Schedules">
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl text-xs overflow-x-auto">
            {(['all', 'active', 'upcoming', 'completed'] as const).map(tab => (
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
                {tab === 'all' ? `All (${batches.length})` : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
            <input
              type="text"
              placeholder="Search batch, course, or trainer..."
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
                <th>Batch Code</th>
                <th>Course Program</th>
                <th>Trainer</th>
                <th>Schedule</th>
                <th>Mode</th>
                <th>Capacity</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map(b => (
                <tr key={b.id} className="hover:bg-[#F7F9FA]">
                  <td className="font-mono text-xs font-bold text-[#007991]">
                    {b.name}
                  </td>
                  <td>
                    <p className="text-sm font-semibold text-[#1F2933]">{b.courseTitle}</p>
                    <p className="text-[11px] text-[#9BA3AF]">
                      {b.startDate} to {b.endDate}
                    </p>
                  </td>
                  <td className="text-xs font-medium text-[#4B5563]">
                    {b.trainerName}
                  </td>
                  <td className="text-xs text-[#667085]">
                    {b.schedule}
                  </td>
                  <td>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4F6] text-[#007991] capitalize">
                      {b.mode}
                    </span>
                  </td>
                  <td>
                    <div className="w-24">
                      <div className="flex justify-between text-[11px] font-semibold text-[#1F2933] mb-1">
                        <span>{b.studentsCount}/{b.maxCapacity}</span>
                        <span>{Math.round((b.studentsCount / b.maxCapacity) * 100)}%</span>
                      </div>
                      <ProgressBar value={(b.studentsCount / b.maxCapacity) * 100} height={4} />
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBatch(b)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Batch Details Drawer */}
      <Drawer
        isOpen={Boolean(selectedBatch)}
        onClose={() => setSelectedBatch(null)}
        title={selectedBatch ? `${selectedBatch.name} — Cohort Details` : 'Batch Details'}
        size="md"
      >
        {selectedBatch && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-[#F7F9FA] rounded-2xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-bold text-[#007991]">{selectedBatch.name}</span>
                <StatusBadge status={selectedBatch.status} />
              </div>
              <h4 className="text-base font-bold text-[#1F2933]">{selectedBatch.courseTitle}</h4>
              <p className="text-[#667085]">Lead Instructor: <strong className="text-[#1F2933]">{selectedBatch.trainerName}</strong></p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <span className="text-[#9BA3AF] text-[10px]">Start Date</span>
                <p className="font-bold text-[#1F2933]">{selectedBatch.startDate}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <span className="text-[#9BA3AF] text-[10px]">End Date</span>
                <p className="font-bold text-[#1F2933]">{selectedBatch.endDate}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Class Timing:</span>
                <span className="font-semibold text-[#1F2933]">{selectedBatch.schedule}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F2F4F6]">
                <span className="text-[#667085]">Instruction Mode:</span>
                <span className="font-semibold text-[#007991] capitalize">{selectedBatch.mode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#667085]">Seat Capacity:</span>
                <span className="font-semibold text-[#1F2933]">{selectedBatch.studentsCount} / {selectedBatch.maxCapacity}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
              <Button variant="outline" onClick={() => setSelectedBatch(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedBatch(null);
                  addToast({
                    title: 'Cohort Roster Exported',
                    message: `Student list for ${selectedBatch.name} downloaded as CSV.`,
                    type: 'success',
                  });
                }}
              >
                Export Student Roster
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Batch Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Training Batch"
        size="md"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Batch Code / Identifier *</label>
            <input
              type="text"
              placeholder="e.g., DMM-Mar-2025"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Associated Course</label>
              <select
                value={form.courseTitle}
                onChange={e => setForm(f => ({ ...f, courseTitle: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              >
                {COURSES.map(c => (
                  <option key={c.id} value={c.title}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Lead Trainer</label>
              <select
                value={form.trainerName}
                onChange={e => setForm(f => ({ ...f, trainerName: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              >
                <option value="Ankit Verma">Ankit Verma</option>
                <option value="Sneha Nair">Sneha Nair</option>
                <option value="Vikram Singh">Vikram Singh</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Session Schedule</label>
              <input
                type="text"
                placeholder="e.g., Tue/Thu 6:00–8:00 PM"
                value={form.schedule}
                onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Instruction Mode</label>
              <select
                value={form.mode}
                onChange={e => setForm(f => ({ ...f, mode: e.target.value as any }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              >
                <option value="online">Online (Live Interactive)</option>
                <option value="offline">Offline (Campus Classroom)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Maximum Student Capacity</label>
            <input
              type="number"
              value={form.maxCapacity}
              onChange={e => setForm(f => ({ ...f, maxCapacity: Number(e.target.value) }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit" disabled={!form.name.trim()}>
              Create Batch
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
