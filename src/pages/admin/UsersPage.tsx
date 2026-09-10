import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import { ADMIN_STUDENTS } from '../../data/mockData';
import { IconSearch, IconPlus, IconFilter, IconEdit, IconEye, IconDownload, IconCheck, IconTrash } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'trainer' | 'parent' | 'admin';
  enrollmentDate: string;
  coursesCount: number;
  attendance: number;
  avgGrade: number;
  gradeLabel: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  batch?: string;
}

const INITIAL_USERS: ManagedUser[] = [
  ...ADMIN_STUDENTS.map(s => ({
    ...s,
    role: 'student' as const,
  })),
  {
    id: 'tr-1',
    name: 'Ankit Verma',
    email: 'ankit.verma@socialmeup.in',
    phone: '+91 99887 76655',
    role: 'trainer',
    enrollmentDate: '2023-06-01',
    coursesCount: 2,
    attendance: 98,
    avgGrade: 92,
    gradeLabel: 'Lead',
    status: 'active',
    batch: 'DMM-Feb-2024',
  },
  {
    id: 'tr-2',
    name: 'Vikram Singh',
    email: 'vikram.singh@socialmeup.in',
    phone: '+91 98112 33445',
    role: 'trainer',
    enrollmentDate: '2023-09-15',
    coursesCount: 1,
    attendance: 95,
    avgGrade: 88,
    gradeLabel: 'Senior',
    status: 'active',
    batch: 'SEO-Sep-2024',
  },
  {
    id: 'pr-1',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@email.com',
    phone: '+91 98765 43211',
    role: 'parent',
    enrollmentDate: '2024-02-15',
    coursesCount: 1,
    attendance: 83,
    avgGrade: 87,
    gradeLabel: 'Parent',
    status: 'active',
    batch: 'Ward: Rahul Sharma',
  },
  {
    id: 'ad-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@socialmeup.in',
    phone: '+91 98001 12233',
    role: 'admin',
    enrollmentDate: '2022-01-10',
    coursesCount: 18,
    attendance: 100,
    avgGrade: 98,
    gradeLabel: 'SuperAdmin',
    status: 'active',
    batch: 'Platform Ops',
  },
];

const ROLE_TABS = ['All Users', 'Students', 'Trainers', 'Parents', 'Admins'];

export default function UsersPage() {
  const { addToast } = useApp();
  const [userList, setUserList] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All Users');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals and Drawer state
  const [viewUser, setViewUser] = useState<ManagedUser | null>(null);
  const [editUser, setEditUser] = useState<ManagedUser | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [minAttendanceFilter, setMinAttendanceFilter] = useState(0);

  // New user form state
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student' as 'student' | 'trainer' | 'parent' | 'admin',
    batch: 'DMM-Feb-2024',
    status: 'active' as 'active' | 'pending' | 'suspended',
  });

  const filtered = userList.filter(u => {
    const q = search.toLowerCase();
    const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesAttendance = u.attendance >= minAttendanceFilter;
    
    let matchesRole = true;
    if (tab === 'Students') matchesRole = u.role === 'student';
    else if (tab === 'Trainers') matchesRole = u.role === 'trainer';
    else if (tab === 'Parents') matchesRole = u.role === 'parent';
    else if (tab === 'Admins') matchesRole = u.role === 'admin';

    return matchesSearch && matchesStatus && matchesAttendance && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    const created: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: newUserData.name,
      email: newUserData.email,
      phone: newUserData.phone || '+91 99999 00000',
      role: newUserData.role,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      coursesCount: 1,
      attendance: 100,
      avgGrade: 85,
      gradeLabel: 'A',
      status: newUserData.status,
      batch: newUserData.batch,
    };

    setUserList(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewUserData({
      name: '',
      email: '',
      phone: '',
      role: 'student',
      batch: 'DMM-Feb-2024',
      status: 'active',
    });
    addToast({
      type: 'success',
      title: 'User Registered',
      message: `${created.name} (${created.role}) has been added successfully.`,
    });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    setUserList(prev => prev.map(u => u.id === editUser.id ? editUser : u));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: `Updated credentials and details for ${editUser.name}.`,
    });
    setEditUser(null);
  };

  const handleToggleSuspend = (user: ManagedUser) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    addToast({
      type: newStatus === 'suspended' ? 'warning' : 'success',
      title: newStatus === 'suspended' ? 'User Suspended' : 'User Re-activated',
      message: `${user.name}'s account is now ${newStatus}.`,
    });
  };

  const handleExportCSV = () => {
    const header = 'Name,Email,Role,Phone,Enrollment Date,Batch,Attendance %,Status\n';
    const rows = filtered.map(u => `"${u.name}","${u.email}","${u.role}","${u.phone}","${u.enrollmentDate}","${u.batch ?? ''}",${u.attendance}%,"${u.status}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-directory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Export Generated',
      message: `Downloaded directory for ${filtered.length} users.`,
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="User Management"
        subtitle={`${userList.length} total members in the academy platform`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<IconDownload size={14} />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="cta"
              size="sm"
              icon={<IconPlus size={14} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add User
            </Button>
          </div>
        }
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active', value: userList.filter(s => s.status === 'active').length, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Pending', value: userList.filter(s => s.status === 'pending').length, color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Suspended', value: userList.filter(s => s.status === 'suspended').length, color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Total Users', value: userList.length, color: '#007991', bg: '#e0f6ff' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center shadow-xs">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#667085] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Role tabs */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-5 overflow-x-auto">
        {ROLE_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              tab === t ? 'bg-white text-[#007991] shadow-xs' : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <SectionCard>
        {/* Table controls */}
        <div className="flex items-center gap-3 p-4 border-b border-[#F2F4F6] flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 h-9">
            <IconSearch size={16} className="text-[#9BA3AF] shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or mobile..."
              className="flex-1 bg-transparent text-sm text-[#1F2933] placeholder-[#9BA3AF] outline-none min-w-0"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2933] bg-white focus:outline-none focus:border-[#007991]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            icon={<IconFilter size={14} />}
            onClick={() => setShowFilterDrawer(true)}
          >
            Filter
            {minAttendanceFilter > 0 && ` (${minAttendanceFilter}%+)`}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Batch / Group</th>
                <th>Attendance</th>
                <th>Avg Grade</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-xs text-slate-400">
                    No users match your current search and filter settings.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold shrink-0">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1F2933] text-sm">{s.name}</p>
                          <p className="text-[10px] text-[#9BA3AF]">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {s.role}
                      </span>
                    </td>
                    <td className="text-xs text-[#667085]">{s.phone}</td>
                    <td className="text-xs text-[#667085]">
                      {new Date(s.enrollmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="text-xs text-[#667085]">{s.batch ?? '—'}</td>
                    <td>
                      <span className={`font-semibold text-sm ${s.attendance >= 75 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td>
                      <span className={`font-bold text-sm ${s.avgGrade >= 90 ? 'text-[#10B981]' : s.avgGrade >= 75 ? 'text-[#007991]' : 'text-[#F59E0B]'}`}>
                        {s.gradeLabel}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewUser(s)}
                          className="w-7 h-7 rounded-lg hover:bg-[#E6F4F6] flex items-center justify-center text-[#007991] transition-colors"
                          title="View Details"
                        >
                          <IconEye size={14} />
                        </button>
                        <button
                          onClick={() => setEditUser(s)}
                          className="w-7 h-7 rounded-lg hover:bg-[#fff3e6] flex items-center justify-center text-[#FF9635] transition-colors"
                          title="Edit Profile"
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(s)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            s.status === 'suspended' ? 'hover:bg-emerald-50 text-emerald-600' : 'hover:bg-rose-50 text-rose-500'
                          }`}
                          title={s.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                        >
                          {s.status === 'suspended' ? <IconCheck size={14} /> : <span className="text-xs font-bold">⊘</span>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#F2F4F6] flex-wrap gap-2">
          <p className="text-xs text-[#667085]">Showing {filtered.length} of {userList.length} users</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] text-sm text-[#667085] flex items-center justify-center">‹</button>
            <button className="w-8 h-8 rounded-lg bg-[#007991] text-white text-sm font-bold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] text-sm text-[#667085] flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] text-sm text-[#667085] flex items-center justify-center">›</button>
          </div>
        </div>
      </SectionCard>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        description="Provision an account for a new student, trainer, parent or administrator"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="user-role-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Account Role
              </label>
              <select
                id="user-role-select"
                value={newUserData.role}
                onChange={e => setNewUserData(prev => ({ ...prev, role: e.target.value as any }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              >
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
                <option value="parent">Parent</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label htmlFor="user-status-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                id="user-status-select"
                value={newUserData.status}
                onChange={e => setNewUserData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              >
                <option value="active">Active</option>
                <option value="pending">Pending Verification</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="user-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              id="user-name"
              type="text"
              required
              value={newUserData.name}
              onChange={e => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Aditi Singhal"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="user-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="user-email"
                type="email"
                required
                value={newUserData.email}
                onChange={e => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="aditi@example.com"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label htmlFor="user-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                id="user-phone"
                type="tel"
                value={newUserData.phone}
                onChange={e => setNewUserData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 00000"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-batch" className="block text-xs font-semibold text-slate-700 mb-1">
              Batch Assignment / Designation
            </label>
            <input
              id="user-batch"
              type="text"
              value={newUserData.batch}
              onChange={e => setNewUserData(prev => ({ ...prev, batch: e.target.value }))}
              placeholder="e.g. DMM-Feb-2024 or Operations Team"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cta">
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User Profile"
        description="Update contact information and system privileges"
        size="md"
      >
        {editUser && (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="edit-name"
                type="text"
                required
                value={editUser.name}
                onChange={e => setEditUser(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  required
                  value={editUser.email}
                  onChange={e => setEditUser(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
                />
              </div>
              <div>
                <label htmlFor="edit-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  id="edit-phone"
                  type="tel"
                  value={editUser.phone}
                  onChange={e => setEditUser(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-batch" className="block text-xs font-semibold text-slate-700 mb-1">
                  Batch / Cohort
                </label>
                <input
                  id="edit-batch"
                  type="text"
                  value={editUser.batch ?? ''}
                  onChange={e => setEditUser(prev => prev ? ({ ...prev, batch: e.target.value }) : null)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Status
                </label>
                <select
                  id="edit-status"
                  value={editUser.status}
                  onChange={e => setEditUser(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* View User Profile Drawer */}
      <Drawer
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title={viewUser ? viewUser.name : 'User Profile'}
        description="Comprehensive profile details and activity record"
        size="md"
      >
        {viewUser && (
          <div className="space-y-5 text-xs text-slate-700">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-lg font-bold">
                {viewUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{viewUser.name}</h4>
                <p className="text-slate-500">{viewUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="capitalize px-2 py-0.5 rounded-md bg-slate-200 font-semibold text-slate-800 text-[10px]">
                    {viewUser.role}
                  </span>
                  <StatusBadge status={viewUser.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-400 text-[10px]">Attendance Record</p>
                <p className={`text-lg font-bold ${viewUser.attendance >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {viewUser.attendance}%
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-400 text-[10px]">Grade Standing</p>
                <p className="text-lg font-bold text-[#007991]">
                  {viewUser.gradeLabel} ({viewUser.avgGrade}%)
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 mb-2">Account Information</h5>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-semibold text-slate-800">{viewUser.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cohort / Batch:</span>
                <span className="font-semibold text-slate-800">{viewUser.batch ?? 'General'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Enrollment Date:</span>
                <span className="font-semibold text-slate-800">{viewUser.enrollmentDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Active Courses:</span>
                <span className="font-semibold text-slate-800">{viewUser.coursesCount} enrolled</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={() => setViewUser(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = viewUser;
                  setViewUser(null);
                  setEditUser(target);
                }}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Filter Drawer */}
      <Drawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        title="Advanced User Filtering"
        description="Filter by attendance thresholds and status conditions"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minimum Attendance ({minAttendanceFilter}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minAttendanceFilter}
              onChange={e => setMinAttendanceFilter(Number(e.target.value))}
              className="w-full accent-[#007991]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0%</span>
              <span>75% (Threshold)</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50"
            >
              <option value="all">All</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMinAttendanceFilter(0);
                setStatusFilter('all');
                setShowFilterDrawer(false);
              }}
            >
              Reset Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFilterDrawer(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>
    </DashboardLayout>
  );
}
