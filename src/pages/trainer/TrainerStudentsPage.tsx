import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { ADMIN_STUDENTS, BATCHES } from '../../data/mockData';
import {
  IconUsers, IconSearch, IconCalendar, IconAward,
  IconMail, IconEye, IconCheckCircle, IconAlertTriangle
} from '../../components/Icons';

export default function TrainerStudentsPage() {
  const { addToast } = useApp();
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof ADMIN_STUDENTS[0] | null>(null);

  const filteredStudents = ADMIN_STUDENTS.filter(s => {
    const matchBatch = selectedBatch === 'all' || s.batch === selectedBatch;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.batch && s.batch.toLowerCase().includes(search.toLowerCase()));
    return matchBatch && matchSearch;
  });

  const avgAttendance = Math.round(
    filteredStudents.reduce((s, st) => s + st.attendance, 0) / (filteredStudents.length || 1)
  );
  const avgGrade = Math.round(
    filteredStudents.reduce((s, st) => s + st.avgGrade, 0) / (filteredStudents.length || 1)
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Student Roster & Cohort Directory"
          subtitle="Monitor individual student attendance, grades, and academic engagement"
        />
        <Button
          variant="outline"
          icon={<IconMail size={16} />}
          onClick={() =>
            addToast({
              title: 'Batch Announcement Form',
              message: 'Preparing email notification for selected cohort...',
              type: 'info',
            })
          }
        >
          Email Batch
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Students"
          value={filteredStudents.length}
          subtitle="Enrolled in your cohorts"
          icon={<IconUsers size={20} />}
          iconBg="#e0f6ff"
          iconColor="#007991"
        />
        <StatCard
          title="Batch Attendance"
          value={`${avgAttendance}%`}
          subtitle="Cohort average"
          icon={<IconCalendar size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Cohort GPA / Score"
          value={`${avgGrade}%`}
          subtitle="Overall assessment average"
          icon={<IconAward size={20} />}
          iconBg="#fff3e6"
          iconColor="#FF9635"
        />
        <StatCard
          title="Attention Needed"
          value={filteredStudents.filter(s => s.attendance < 75 || s.avgGrade < 70).length}
          subtitle="Below 75% threshold"
          icon={<IconAlertTriangle size={20} />}
          iconBg="#FEE2E2"
          iconColor="#EF4444"
        />
      </div>

      {/* Table Card */}
      <SectionCard title="Enrolled Students Roster">
        {/* Filters and search */}
        <div className="p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#667085]">Filter Cohort:</span>
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              <option value="all">All My Batches ({ADMIN_STUDENTS.length})</option>
              {BATCHES.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Cohort / Batch</th>
                <th>Attendance</th>
                <th>Avg Grade</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-[#F7F9FA]">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center font-bold text-xs">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2933]">{s.name}</p>
                        <p className="text-xs text-[#667085]">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-[#007991] font-semibold">
                      {s.batch || 'DMM-Feb-2024'}
                    </span>
                  </td>
                  <td>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-bold ${s.attendance >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {s.attendance}%
                        </span>
                      </div>
                      <ProgressBar value={s.attendance} height={4} />
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-xs text-[#1F2933]">
                      {s.gradeLabel} ({s.avgGrade}%)
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStudent(s)}
                    >
                      View Dossier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Student Dossier Drawer */}
      <Drawer
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? `${selectedStudent.name} — Student Profile` : 'Student Details'}
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-[#F7F9FA] rounded-2xl border border-[#E5E7EB] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-lg font-bold">
                {selectedStudent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-base font-bold text-[#1F2933]">{selectedStudent.name}</h4>
                <p className="text-[#667085]">{selectedStudent.email} • {selectedStudent.phone}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={selectedStudent.status} />
                  <span className="text-[11px] text-[#007991] font-bold">Batch: {selectedStudent.batch}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <p className="text-[#9BA3AF] text-[10px]">Session Attendance</p>
                <p className={`text-xl font-bold ${selectedStudent.attendance >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {selectedStudent.attendance}%
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB]">
                <p className="text-[#9BA3AF] text-[10px]">Evaluation Grade</p>
                <p className="text-xl font-bold text-[#007991]">
                  {selectedStudent.gradeLabel} ({selectedStudent.avgGrade}%)
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] space-y-2">
              <h5 className="font-bold text-[#1F2933]">Trainer Notes & Recommendations</h5>
              <p className="text-[#4B5563] leading-relaxed">
                Active in weekly lab assignments. Has completed the capstone campaign draft with high scores in targeting and budget segmentation.
              </p>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={<IconMail size={14} />}
                onClick={() => {
                  setSelectedStudent(null);
                  addToast({
                    title: 'Message Opened',
                    message: `Initiating direct message thread with ${selectedStudent.name}`,
                    type: 'info',
                  });
                }}
              >
                Send Message
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
