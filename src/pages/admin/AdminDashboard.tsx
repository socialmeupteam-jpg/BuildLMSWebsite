import { useState } from 'react';
import DashboardLayout, { SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import ProgressBar from '../../components/ui/ProgressBar';
import { ADMIN_STATS, ADMIN_STUDENTS, BATCHES, RECENT_ADMIN_ACTIVITIES } from '../../data/mockData';
import { IconUsers, IconBook, IconCreditCard, IconMedal, IconChevronRight, IconTrendingUp } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function AdminDashboard() {
  const { navigate, addToast } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<typeof ADMIN_STUDENTS[0] | null>(null);

  const ENROLLMENT_TREND = [28, 35, 42, 38, 55, 62, 58, 70, 65, 80, 72, 88];

  return (
    <DashboardLayout>
      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value={ADMIN_STATS.totalStudents}
          subtitle={`${ADMIN_STUDENTS.filter(s => s.status === 'active').length} active`}
          icon={<IconUsers size={20} />}
          iconBg="#e0f6ff"
          iconColor="#007991"
          trend={{ value: 12, label: 'vs last month', positive: true }}
          onClick={() => navigate('admin-users')}
        />
        <StatCard
          title="Active Courses"
          value={ADMIN_STATS.totalCourses}
          subtitle={`${BATCHES.filter(b => b.status === 'active').length} active batches`}
          icon={<IconBook size={20} />}
          iconBg="#fff3e6"
          iconColor="#FF9635"
          onClick={() => navigate('admin-courses')}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(ADMIN_STATS.revenue / 100000).toFixed(1)}L`}
          subtitle={`₹${(ADMIN_STATS.pendingPayments / 1000).toFixed(0)}k pending`}
          icon={<IconCreditCard size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
          trend={{ value: 8, label: 'vs last month', positive: true }}
          onClick={() => navigate('admin-finance')}
        />
        <StatCard
          title="Certificates Issued"
          value={ADMIN_STATS.certificatesIssued}
          subtitle="This academic year"
          icon={<IconMedal size={20} />}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
        />
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Avg Attendance</p>
          <p className="text-2xl font-bold text-[#007991]">{ADMIN_STATS.avgAttendance}%</p>
          <ProgressBar value={ADMIN_STATS.avgAttendance} height={4} className="mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-[#10B981]">{ADMIN_STATS.completionRate}%</p>
          <ProgressBar value={ADMIN_STATS.completionRate} height={4} color="#10B981" bgColor="#D1FAE5" className="mt-2" />
        </div>
        <div
          className="bg-white rounded-2xl border border-[#E5E7EB] p-5 cursor-pointer hover:border-[#007991] transition-colors shadow-xs"
          onClick={() => navigate('admin-grievances')}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Open Grievances</p>
          <p className={`text-2xl font-bold ${ADMIN_STATS.activeGrievances > 5 ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
            {ADMIN_STATS.activeGrievances}
          </p>
          <p className="text-xs text-[#9BA3AF] mt-1">Awaiting resolution</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">Total Trainers</p>
          <p className="text-2xl font-bold text-[#1F2933]">{ADMIN_STATS.totalTrainers}</p>
          <p className="text-xs text-[#9BA3AF] mt-1">{ADMIN_STATS.totalTrainers} active</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment trend */}
          <SectionCard
            title="Enrollment Trend"
            subtitle="Monthly new enrollments — last 12 months"
            action={
              <Button
                variant="ghost"
                size="sm"
                iconRight={<IconChevronRight size={14} />}
                onClick={() => navigate('admin-reports')}
              >
                Full Report
              </Button>
            }
          >
            <div className="p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-[#007991]">{ADMIN_STATS.totalEnrollments}</p>
                  <p className="text-xs text-[#667085] mt-0.5">Total enrollments across academy</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D1FAE5] rounded-full">
                  <IconTrendingUp size={14} className="text-[#10B981]" />
                  <span className="text-xs font-bold text-[#065F46]">+22% YoY</span>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto">
                <div className="flex items-end gap-2 min-w-max pt-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                    <div key={m} className="flex flex-col items-center gap-1">
                      <div
                        className="w-8 rounded-t-lg bg-[#007991] opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ height: `${(ENROLLMENT_TREND[i] / Math.max(...ENROLLMENT_TREND)) * 80}px` }}
                        title={`${m}: ${ENROLLMENT_TREND[i]} enrollments`}
                      />
                      <span className="text-[10px] text-[#9BA3AF]">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Students table */}
          <SectionCard
            title="Recent Students"
            action={
              <Button
                variant="ghost"
                size="sm"
                iconRight={<IconChevronRight size={14} />}
                onClick={() => navigate('admin-users')}
              >
                Manage All
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Courses</th>
                    <th>Attendance</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_STUDENTS.slice(0, 6).map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold shrink-0">
                            {s.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1F2933]">{s.name}</p>
                            <p className="text-[10px] text-[#9BA3AF]">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm text-center font-semibold text-[#667085]">{s.coursesCount}</td>
                      <td>
                        <span className={`text-sm font-bold ${s.attendance >= 75 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {s.attendance}%
                        </span>
                      </td>
                      <td className="font-bold text-[#007991]">{s.gradeLabel}</td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudent(s)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent activity */}
          <SectionCard
            title="Recent Academy Activity"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('admin-reports')}>
                All Logs
              </Button>
            }
          >
            <div className="divide-y divide-[#F2F4F6]">
              {RECENT_ADMIN_ACTIVITIES.map(a => {
                const icons: Record<string, string> = {
                  enrollment: '📋',
                  payment: '💰',
                  certificate: '🏆',
                  grievance: '⚠️',
                  course: '📚',
                };
                return (
                  <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="text-lg shrink-0">{icons[a.type] ?? '•'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1F2933]">{a.action}</p>
                      <p className="text-[10px] text-[#667085] truncate">{a.detail}</p>
                      <p className="text-[10px] text-[#9BA3AF] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Batches */}
          <SectionCard
            title="Active Batches"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('admin-batches')}>
                All
              </Button>
            }
          >
            <div className="divide-y divide-[#F2F4F6]">
              {BATCHES.filter(b => b.status !== 'upcoming').map(b => (
                <div key={b.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-[#1F2933]">{b.name}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-[10px] text-[#667085] truncate">{b.courseTitle}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <ProgressBar value={(b.studentsCount / b.maxCapacity) * 100} height={4} className="flex-1" />
                    <span className="text-[10px] text-[#9BA3AF]">
                      {b.studentsCount}/{b.maxCapacity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Quick actions */}
          <SectionCard title="Quick Actions">
            <div className="p-4 grid grid-cols-2 gap-2">
              {[
                { label: 'Add Student', icon: '👤', onClick: () => navigate('admin-users') },
                { label: 'New Course', icon: '📚', onClick: () => navigate('admin-courses') },
                { label: 'Create Batch', icon: '📋', onClick: () => navigate('admin-batches') },
                { label: 'View Reports', icon: '📊', onClick: () => navigate('admin-reports') },
                { label: 'Grievances', icon: '🎫', onClick: () => navigate('admin-grievances') },
                { label: 'Settings', icon: '⚙️', onClick: () => navigate('admin-settings') },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#007991] hover:bg-[#f0fbff] transition-all text-left"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-xs font-semibold text-[#374151]">{a.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Student Details Drawer */}
      <Drawer
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? selectedStudent.name : 'Student Details'}
        description="Quick student academic and enrollment profile"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-base font-bold">
                {selectedStudent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedStudent.name}</h4>
                <p className="text-slate-500">{selectedStudent.email}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedStudent.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-400 text-[10px]">Attendance</p>
                <p className={`text-lg font-bold ${selectedStudent.attendance >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {selectedStudent.attendance}%
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-400 text-[10px]">Average Grade</p>
                <p className="text-lg font-bold text-[#007991]">
                  {selectedStudent.gradeLabel} ({selectedStudent.avgGrade}%)
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Enrolled Batch:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.batch ?? 'DMM-Feb-2024'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.phone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Courses Enrolled:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.coursesCount} active courses</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedStudent(null);
                  navigate('admin-users');
                }}
              >
                Go to Full Directory
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
