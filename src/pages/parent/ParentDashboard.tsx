import { useState } from 'react';
import DashboardLayout, { SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProgressBar, { CircularProgress } from '../../components/ui/ProgressBar';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { STUDENT_ENROLLMENTS, ATTENDANCE_SUMMARY, STUDENT_ASSIGNMENTS, STUDENT_GRADES, STUDENT_PAYMENTS, ANNOUNCEMENTS } from '../../data/mockData';
import { IconCalendar, IconAward, IconCreditCard, IconChevronRight, IconAlertTriangle } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

const LINKED_STUDENTS = [
  { id: 's-1', name: 'Rahul Sharma', class: '10th Grade', school: 'Digital Marketing — Batch DMM-Feb-2024', avatar: 'RS' },
];

export default function ParentDashboard() {
  const { navigate } = useApp();
  const [selectedStudent] = useState(LINKED_STUDENTS[0]);

  const pendingFees = STUDENT_PAYMENTS.filter(p => p.status === 'pending');
  const pendingAssignments = STUDENT_ASSIGNMENTS.filter(a => a.status === 'pending');
  const avgGrade = Math.round(STUDENT_GRADES.reduce((s, g) => s + g.percentage, 0) / STUDENT_GRADES.length);

  return (
    <DashboardLayout>
      {/* Student selector */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-[#E5E7EB]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <p className="text-sm font-semibold text-[#667085]">Viewing:</p>
        {LINKED_STUDENTS.map(s => (
          <button key={s.id} className="flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 border-[#007991] bg-[#f0fbff]">
            <div className="w-8 h-8 rounded-full bg-[#007991] text-white flex items-center justify-center text-xs font-bold">{s.avatar}</div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#1F2933]">{s.name}</p>
              <p className="text-[10px] text-[#667085]">{s.class}</p>
            </div>
          </button>
        ))}
        <p className="ml-auto text-xs text-[#9BA3AF]">Parent view — monitoring only</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Courses Enrolled" value={STUDENT_ENROLLMENTS.length} subtitle={`${STUDENT_ENROLLMENTS.filter(e => e.status === 'completed').length} completed`}
          icon={<span className="text-xl">📚</span>} iconBg="#e0f6ff" />
        <StatCard title="Attendance" value={`${ATTENDANCE_SUMMARY.percentage}%`} subtitle={`${ATTENDANCE_SUMMARY.present}/${ATTENDANCE_SUMMARY.totalClasses} classes`}
          icon={<IconCalendar size={20} />} iconBg={ATTENDANCE_SUMMARY.percentage >= 75 ? '#D1FAE5' : '#FEE2E2'} iconColor={ATTENDANCE_SUMMARY.percentage >= 75 ? '#10B981' : '#EF4444'}
          onClick={() => navigate('parent-attendance')} />
        <StatCard title="Avg Grade" value={`${avgGrade}%`} subtitle={`${avgGrade >= 90 ? 'A+' : avgGrade >= 80 ? 'A' : avgGrade >= 70 ? 'B+' : 'B'} grade`}
          icon={<IconAward size={20} />} iconBg="#D1FAE5" iconColor="#10B981"
          onClick={() => navigate('parent-grades')} />
        <StatCard title="Pending Fees" value={`₹${pendingFees.reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}`}
          subtitle={`${pendingFees.length} invoice${pendingFees.length !== 1 ? 's' : ''}`}
          icon={<IconCreditCard size={20} />} iconBg={pendingFees.length > 0 ? '#FEF3C7' : '#D1FAE5'} iconColor={pendingFees.length > 0 ? '#F59E0B' : '#10B981'}
          onClick={() => navigate('parent-payments')} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <SectionCard title="Course Progress" subtitle={`${selectedStudent.name}'s learning status`}>
            <div className="divide-y divide-[#F2F4F6]">
              {STUDENT_ENROLLMENTS.map(enr => (
                <div key={enr.id} className="flex gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#E6F4F6]">
                    <img src={enr.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#1F2933] truncate">{enr.courseTitle}</p>
                      <StatusBadge status={enr.status} />
                    </div>
                    <p className="text-xs text-[#9BA3AF] mb-2">{enr.trainer} · {enr.batch}</p>
                    <ProgressBar value={enr.progress} showLabel label="Progress" height={6} />
                    <p className="text-xs text-[#9BA3AF] mt-1">{enr.lessonsCompleted}/{enr.totalLessons} lessons complete</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Grades */}
          <SectionCard
            title="Recent Grades"
            action={<Button variant="ghost" size="sm" iconRight={<IconChevronRight size={14} />} onClick={() => navigate('parent-grades')}>View All</Button>}
          >
            <table className="lms-table">
              <thead>
                <tr><th>Assessment</th><th>Course</th><th>Score</th><th>Grade</th></tr>
              </thead>
              <tbody>
                {STUDENT_GRADES.slice(0, 5).map(g => (
                  <tr key={g.id}>
                    <td className="font-medium text-[#1F2933]">{g.title}</td>
                    <td className="text-xs text-[#667085]">{g.course.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="font-semibold">{g.marksObtained}/{g.maxMarks}</td>
                    <td>
                      <span className={`font-bold ${g.percentage >= 90 ? 'text-[#10B981]' : g.percentage >= 75 ? 'text-[#007991]' : 'text-[#F59E0B]'}`}>
                        {g.grade} ({g.percentage}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          {/* Pending Assignments */}
          <SectionCard title="Upcoming Assignments">
            {pendingAssignments.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#9BA3AF]">🎉 No pending assignments!</div>
            ) : (
              pendingAssignments.map(a => (
                <div key={a.id} className="flex items-center gap-4 px-5 py-3 border-b border-[#F2F4F6] last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1F2933]">{a.title}</p>
                    <p className="text-xs text-[#9BA3AF]">{a.courseTitle} · {a.maxMarks} marks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#1F2933]">Due {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          {/* Attendance overview */}
          <SectionCard title="Attendance" action={<Button variant="ghost" size="sm" onClick={() => navigate('parent-attendance')}>Details</Button>}>
            <div className="flex items-center gap-4 px-5 py-4">
              <CircularProgress value={ATTENDANCE_SUMMARY.percentage} size={80} strokeWidth={8} />
              <div className="space-y-1">
                {[
                  { label: 'Present', v: ATTENDANCE_SUMMARY.present, c: '#10B981' },
                  { label: 'Absent', v: ATTENDANCE_SUMMARY.absent, c: '#EF4444' },
                  { label: 'Late', v: ATTENDANCE_SUMMARY.late, c: '#F59E0B' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.c }} />
                    <span className="text-[#667085]">{s.label}</span>
                    <span className="font-bold text-[#1F2933] ml-auto">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Fee status */}
          <SectionCard title="Fees & Payments" action={<Button variant="ghost" size="sm" onClick={() => navigate('parent-payments')}>View</Button>}>
            <div className="px-5 py-4 space-y-3">
              {pendingFees.map(p => (
                <div key={p.id} className="p-3 rounded-xl bg-[#FEF3C7] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#92400E]">{p.invoiceNumber}</p>
                    <p className="text-sm font-bold text-[#92400E]">₹{p.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <Button variant="cta" size="sm" onClick={() => navigate('parent-payments')}>Pay</Button>
                </div>
              ))}
              {pendingFees.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-2xl mb-1">✅</p>
                  <p className="text-xs text-[#667085]">All fees paid up to date</p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Announcements */}
          <SectionCard title="Announcements">
            {ANNOUNCEMENTS.slice(0, 2).map(a => (
              <div key={a.id} className="px-5 py-4 border-b border-[#F2F4F6] last:border-0">
                <p className="text-sm font-semibold text-[#1F2933] mb-1">{a.title}</p>
                <p className="text-xs text-[#667085] line-clamp-2">{a.message}</p>
                <p className="text-[10px] text-[#9BA3AF] mt-1.5">{a.author} · {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
