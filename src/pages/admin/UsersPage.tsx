import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ADMIN_STUDENTS } from '../../data/mockData';
import { IconSearch, IconPlus, IconFilter, IconEdit, IconEye, IconUsers } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

const ROLE_TABS = ['All Users', 'Students', 'Trainers', 'Parents', 'Admins'];

export default function UsersPage() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All Users');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = ADMIN_STUDENTS.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.name.toLowerCase().includes(q) || s.email.includes(q)) &&
      (statusFilter === 'all' || s.status === statusFilter);
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="User Management"
        subtitle={`${ADMIN_STUDENTS.length} total students registered`}
        action={
          <Button variant="cta" size="sm" icon={<IconPlus size={14} />} onClick={() => addToast({ type: 'info', title: 'Add User', message: 'User creation modal opening…' })}>
            Add User
          </Button>
        }
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active', value: ADMIN_STUDENTS.filter(s => s.status === 'active').length, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Pending', value: ADMIN_STUDENTS.filter(s => s.status === 'pending').length, color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Suspended', value: ADMIN_STUDENTS.filter(s => s.status === 'suspended').length, color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Total', value: ADMIN_STUDENTS.length, color: '#007991', bg: '#e0f6ff' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#667085] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Role tabs */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-5 overflow-x-auto">
        {ROLE_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === t ? 'bg-white text-[#007991] shadow-sm' : 'text-[#667085] hover:text-[#1F2933]'}`}>
            {t}
          </button>
        ))}
      </div>

      <SectionCard>
        {/* Table controls */}
        <div className="flex items-center gap-3 p-4 border-b border-[#F2F4F6] flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-0 bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 h-9">
            <IconSearch size={16} className="text-[#9BA3AF] flex-shrink-0" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="flex-1 bg-transparent text-sm text-[#1F2933] placeholder-[#9BA3AF] outline-none min-w-0"
            />
          </div>
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2933] bg-white focus:outline-none focus:border-[#007991]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <Button variant="outline" size="sm" icon={<IconFilter size={14} />} onClick={() => addToast({ type: 'info', title: 'Filters', message: 'Advanced filter panel opening…' })}>
            Filter
          </Button>
        </div>

        <table className="lms-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Phone</th>
              <th>Enrolled</th>
              <th>Courses</th>
              <th>Attendance</th>
              <th>Avg Grade</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F2933] text-sm">{s.name}</p>
                      <p className="text-[10px] text-[#9BA3AF]">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="text-xs text-[#667085]">{s.phone}</td>
                <td className="text-xs text-[#667085]">{new Date(s.enrollmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                <td className="text-center font-semibold text-sm text-[#1F2933]">{s.coursesCount}</td>
                <td>
                  <span className={`font-semibold text-sm ${s.attendance >= 75 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{s.attendance}%</span>
                </td>
                <td>
                  <span className={`font-bold text-sm ${s.avgGrade >= 90 ? 'text-[#10B981]' : s.avgGrade >= 75 ? 'text-[#007991]' : 'text-[#F59E0B]'}`}>
                    {s.gradeLabel}
                  </span>
                </td>
                <td className="text-xs text-[#667085]">{s.batch ?? '—'}</td>
                <td><StatusBadge status={s.status} /></td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-lg hover:bg-[#E6F4F6] flex items-center justify-center text-[#007991]" title="View">
                      <IconEye size={14} />
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-[#fff3e6] flex items-center justify-center text-[#FF9635]" title="Edit"
                      onClick={() => addToast({ type: 'info', title: 'Edit student', message: `Editing ${s.name}'s profile…` })}>
                      <IconEdit size={14} />
                    </button>
                    {s.status === 'active' && (
                      <button
                        className="w-7 h-7 rounded-lg hover:bg-[#FEE2E2] flex items-center justify-center text-[#EF4444]"
                        title="Suspend"
                        onClick={() => addToast({ type: 'warning', title: 'Suspend student', message: `Confirm suspension of ${s.name}?` })}
                      >
                        <span className="text-xs font-bold">⊘</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#F2F4F6]">
          <p className="text-xs text-[#667085]">Showing {filtered.length} of {ADMIN_STUDENTS.length} students</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] text-sm text-[#667085] flex items-center justify-center">‹</button>
            <button className="w-8 h-8 rounded-lg bg-[#007991] text-white text-sm font-bold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] text-sm text-[#667085] flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] text-sm text-[#667085] flex items-center justify-center">›</button>
          </div>
        </div>
      </SectionCard>
    </DashboardLayout>
  );
}
