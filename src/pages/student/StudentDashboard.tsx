import { useApp } from '../../contexts/AppContext';
import DashboardLayout, { SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProgressBar, { CircularProgress } from '../../components/ui/ProgressBar';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { STUDENT_ENROLLMENTS, STUDENT_ASSIGNMENTS, ATTENDANCE_SUMMARY, ANNOUNCEMENTS, STUDENT_GRADES } from '../../data/mockData';
import { IconBook, IconClipboard, IconCalendar, IconAward, IconPlay, IconChevronRight, IconAlertTriangle, IconClock, IconTrendingUp } from '../../components/Icons';

export default function StudentDashboard() {
  const { navigate, currentUser } = useApp();
  const activeEnrollments = STUDENT_ENROLLMENTS.filter(e => e.status === 'active');
  const completedEnrollments = STUDENT_ENROLLMENTS.filter(e => e.status === 'completed');
  const pendingAssignments = STUDENT_ASSIGNMENTS.filter(a => a.status === 'pending' || a.status === 'resubmit');
  const recentGrade = STUDENT_GRADES[0];

  const avgProgress = Math.round(activeEnrollments.reduce((s, e) => s + e.progress, 0) / (activeEnrollments.length || 1));

  return (
    <DashboardLayout>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Enrolled Courses"
          value={STUDENT_ENROLLMENTS.length}
          subtitle={`${completedEnrollments.length} completed`}
          icon={<IconBook size={20} />}
          iconBg="#e0f6ff" iconColor="#007991"
          trend={{ value: 1, label: 'this month', positive: true }}
          onClick={() => navigate('student-courses')}
        />
        <StatCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          subtitle="Across active courses"
          icon={<IconTrendingUp size={20} />}
          iconBg="#fff3e6" iconColor="#FF9635"
          trend={{ value: 8, label: 'vs last month', positive: true }}
        />
        <StatCard
          title="Attendance"
          value={`${ATTENDANCE_SUMMARY.percentage}%`}
          subtitle={`${ATTENDANCE_SUMMARY.present} / ${ATTENDANCE_SUMMARY.totalClasses} sessions`}
          icon={<IconCalendar size={20} />}
          iconBg="#D1FAE5" iconColor="#10B981"
          onClick={() => navigate('student-attendance')}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingAssignments.length}
          subtitle="Assignments due"
          icon={<IconClipboard size={20} />}
          iconBg={pendingAssignments.length > 0 ? "#FEF3C7" : "#D1FAE5"}
          iconColor={pendingAssignments.length > 0 ? "#F59E0B" : "#10B981"}
          onClick={() => navigate('student-assignments')}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <SectionCard
            title="Continue Learning"
            subtitle="Pick up where you left off"
            action={<Button variant="ghost" size="sm" iconRight={<IconChevronRight size={14} />} onClick={() => navigate('student-courses')}>All Courses</Button>}
          >
            <div className="divide-y divide-[#F2F4F6]">
              {activeEnrollments.map(enr => (
                <div key={enr.id} className="flex gap-4 p-5 hover:bg-[#F9FAFB] transition-colors">
                  <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#E6F4F6]">
                    <img src={enr.thumbnail} alt={enr.courseTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1F2933] truncate">{enr.courseTitle}</p>
                    <p className="text-xs text-[#667085] mt-0.5 truncate">{enr.nextLesson}</p>
                    <div className="mt-2.5">
                      <ProgressBar value={enr.progress} showLabel label="Progress" height={6} />
                    </div>
                    <p className="text-[10px] text-[#9BA3AF] mt-1.5">{enr.lessonsCompleted}/{enr.totalLessons} lessons · {enr.trainer}</p>
                  </div>
                  <Button variant="cta" size="sm" icon={<IconPlay size={12} />} className="flex-shrink-0 self-start mt-1">
                    Resume
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Assignments Due */}
          <SectionCard
            title="Upcoming Assignments"
            subtitle={`${pendingAssignments.length} pending`}
            action={<Button variant="ghost" size="sm" iconRight={<IconChevronRight size={14} />} onClick={() => navigate('student-assignments')}>View All</Button>}
          >
            {pendingAssignments.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-sm font-semibold text-[#1F2933]">All caught up!</p>
                <p className="text-xs text-[#667085]">No pending assignments right now</p>
              </div>
            ) : (
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Course</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAssignments.slice(0, 4).map(asgn => {
                    const due = new Date(asgn.dueDate);
                    const now = new Date();
                    const days = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = days <= 2;
                    return (
                      <tr key={asgn.id}>
                        <td>
                          <p className="font-semibold text-[#1F2933]">{asgn.title}</p>
                          <p className="text-xs text-[#667085]">{asgn.maxMarks} marks</p>
                        </td>
                        <td className="text-[#667085] text-xs">{asgn.courseTitle.split(' ').slice(0, 3).join(' ')}</td>
                        <td>
                          <div className={`flex items-center gap-1 text-xs font-semibold ${isUrgent ? 'text-[#EF4444]' : 'text-[#1F2933]'}`}>
                            {isUrgent && <IconAlertTriangle size={12} />}
                            {due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                          {days > 0 && <p className="text-[10px] text-[#9BA3AF]">{days}d remaining</p>}
                        </td>
                        <td><StatusBadge status={asgn.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </SectionCard>

          {/* Recent Grades */}
          <SectionCard
            title="Recent Grades"
            action={<Button variant="ghost" size="sm" iconRight={<IconChevronRight size={14} />} onClick={() => navigate('student-grades')}>All Grades</Button>}
          >
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Type</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {STUDENT_GRADES.slice(0, 4).map(g => (
                  <tr key={g.id}>
                    <td>
                      <p className="font-medium text-[#1F2933]">{g.title}</p>
                      <p className="text-xs text-[#667085]">{g.course.split(' ').slice(0, 3).join(' ')}</p>
                    </td>
                    <td><Badge variant={g.type === 'exam' ? 'error' : g.type === 'quiz' ? 'info' : 'teal'} size="sm">{g.type}</Badge></td>
                    <td className="font-semibold text-[#1F2933]">{g.marksObtained}/{g.maxMarks}</td>
                    <td>
                      <span className={`text-sm font-bold ${g.percentage >= 90 ? 'text-[#10B981]' : g.percentage >= 75 ? 'text-[#007991]' : g.percentage >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                        {g.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>

        {/* Right column - sidebar widgets */}
        <div className="space-y-6">
          {/* Attendance summary */}
          <SectionCard title="Attendance Overview" action={<Button variant="ghost" size="sm" onClick={() => navigate('student-attendance')}>View</Button>}>
            <div className="flex items-center gap-4 px-5 py-4">
              <CircularProgress value={ATTENDANCE_SUMMARY.percentage} size={80} strokeWidth={8} />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-[#667085]">Present</span>
                  <span className="font-semibold text-[#1F2933] ml-auto">{ATTENDANCE_SUMMARY.present}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="text-[#667085]">Absent</span>
                  <span className="font-semibold text-[#1F2933] ml-auto">{ATTENDANCE_SUMMARY.absent}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  <span className="text-[#667085]">Late</span>
                  <span className="font-semibold text-[#1F2933] ml-auto">{ATTENDANCE_SUMMARY.late}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="text-[#667085]">Excused</span>
                  <span className="font-semibold text-[#1F2933] ml-auto">{ATTENDANCE_SUMMARY.excused}</span>
                </div>
              </div>
            </div>
            <div className="px-5 pb-4">
              <div className={`text-center py-2 rounded-xl text-xs font-semibold ${ATTENDANCE_SUMMARY.percentage >= 75 ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                {ATTENDANCE_SUMMARY.percentage >= 75 ? '✓ Eligible for certification' : '⚠ Below minimum 75% threshold'}
              </div>
            </div>
          </SectionCard>

          {/* Completed courses */}
          {completedEnrollments.length > 0 && (
            <SectionCard title="Completed Courses">
              <div className="divide-y divide-[#F2F4F6]">
                {completedEnrollments.map(enr => (
                  <div key={enr.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={enr.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1F2933] truncate">{enr.courseTitle}</p>
                      <p className="text-[10px] text-[#9BA3AF]">{enr.trainer}</p>
                    </div>
                    {enr.certificate ? (
                      <Button variant="outline" size="sm" onClick={() => navigate('student-certificates')}>Certificate</Button>
                    ) : (
                      <StatusBadge status="completed" />
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Announcements */}
          <SectionCard title="Announcements">
            <div className="divide-y divide-[#F2F4F6]">
              {ANNOUNCEMENTS.slice(0, 2).map(ann => (
                <div key={ann.id} className="px-5 py-4">
                  {ann.priority === 'high' && (
                    <Badge variant="error" size="sm" className="mb-2">📌 Important</Badge>
                  )}
                  <p className="text-sm font-semibold text-[#1F2933] mb-1">{ann.title}</p>
                  <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">{ann.message}</p>
                  <p className="text-[10px] text-[#9BA3AF] mt-2">{ann.author} · {new Date(ann.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Fee status */}
          <SectionCard title="Payment Status" action={<Button variant="ghost" size="sm" onClick={() => navigate('student-payments')}>View</Button>}>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FEF3C7]">
                <div>
                  <p className="text-xs font-semibold text-[#92400E]">Pending Payment</p>
                  <p className="text-sm font-bold text-[#92400E]">₹5,000</p>
                </div>
                <Button variant="cta" size="sm" onClick={() => navigate('student-payments')}>Pay Now</Button>
              </div>
              <p className="text-xs text-[#9BA3AF] text-center">Due: Dec 31, 2024</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
