import { useState } from 'react';
import DashboardLayout, { SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { TRAINER_TODAY_CLASSES, TRAINER_PENDING_SUBMISSIONS, TRAINER_STUDENTS, STUDENT_GRADES, ANNOUNCEMENTS } from '../../data/mockData';
import { IconCalendar, IconClipboard, IconUsers, IconBook, IconVideo, IconChevronRight, IconCheck, IconClock } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function TrainerDashboard() {
  const { navigate, currentUser, addToast } = useApp();

  const avgAttendance = Math.round(TRAINER_STUDENTS.reduce((s, st) => s + st.attendance, 0) / TRAINER_STUDENTS.length);
  const avgGrade = Math.round(TRAINER_STUDENTS.reduce((s, st) => s + st.avgGrade, 0) / TRAINER_STUDENTS.length);

  return (
    <DashboardLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Students" value={TRAINER_STUDENTS.length} subtitle="Across 2 active batches"
          icon={<IconUsers size={20} />} iconBg="#e0f6ff" iconColor="#007991" onClick={() => navigate('trainer-students')} />
        <StatCard title="Avg Attendance" value={`${avgAttendance}%`} subtitle="All active batches"
          icon={<IconCalendar size={20} />} iconBg="#D1FAE5" iconColor="#10B981" />
        <StatCard title="Pending Reviews" value={TRAINER_PENDING_SUBMISSIONS.length}
          subtitle="Submissions awaiting grade"
          icon={<IconClipboard size={20} />}
          iconBg={TRAINER_PENDING_SUBMISSIONS.length > 0 ? '#FEF3C7' : '#D1FAE5'}
          iconColor={TRAINER_PENDING_SUBMISSIONS.length > 0 ? '#F59E0B' : '#10B981'}
          onClick={() => navigate('trainer-assignments')} />
        <StatCard title="Class Avg Grade" value={`${avgGrade}%`} subtitle="All enrolled students"
          icon={<span className="text-xl">📊</span>} iconBg="#fff3e6" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes */}
          <SectionCard title="Today's Classes" subtitle={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}>
            <div className="divide-y divide-[#F2F4F6]">
              {TRAINER_TODAY_CLASSES.map(cls => (
                <div key={cls.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={cls.status} />
                        <Badge variant="neutral">{cls.batchName}</Badge>
                        <Badge variant={cls.mode === 'online' ? 'info' : 'cta'}>{cls.mode}</Badge>
                      </div>
                      <h3 className="text-sm font-bold text-[#1F2933]">{cls.topic}</h3>
                      <p className="text-xs text-[#667085] mt-0.5">{cls.courseName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#007991]">{cls.time}</p>
                      <p className="text-xs text-[#9BA3AF]">{cls.studentsExpected} students expected</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {cls.status === 'upcoming' ? (
                      <>
                        <Button variant="cta" size="sm" icon={<IconVideo size={14} />} onClick={() => addToast({ type: 'info', title: 'Starting class…', message: 'Opening Google Meet…' })}>
                          Start Class
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('trainer-attendance')}>Mark Attendance</Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D1FAE5]">
                          <IconCheck size={14} className="text-[#10B981]" />
                          <span className="text-xs font-semibold text-[#065F46]">{cls.studentsPresent}/{cls.studentsExpected} attended</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('trainer-attendance')}>View Attendance</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Pending Submissions */}
          <SectionCard
            title="Submissions to Grade"
            subtitle={`${TRAINER_PENDING_SUBMISSIONS.length} pending`}
            action={<Button variant="ghost" size="sm" iconRight={<IconChevronRight size={14} />} onClick={() => navigate('trainer-assignments')}>All Assignments</Button>}
          >
            {TRAINER_PENDING_SUBMISSIONS.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#9BA3AF]">🎉 All caught up! No pending submissions.</div>
            ) : (
              <table className="lms-table">
                <thead>
                  <tr><th>Student</th><th>Assignment</th><th>Course</th><th>Submitted</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {TRAINER_PENDING_SUBMISSIONS.map(sub => (
                    <tr key={sub.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold">
                            {sub.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-[#1F2933]">{sub.studentName}</span>
                        </div>
                      </td>
                      <td className="text-sm text-[#374151]">{sub.assignmentTitle}</td>
                      <td className="text-xs text-[#9BA3AF]">{sub.course.split(' ').slice(0, 2).join(' ')}</td>
                      <td className="text-xs text-[#667085]">{new Date(sub.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td><StatusBadge status={sub.status} /></td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => navigate('trainer-assignments')}>Grade</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </SectionCard>

          {/* Student Performance Table */}
          <SectionCard
            title="My Students — Quick Overview"
            action={<Button variant="ghost" size="sm" iconRight={<IconChevronRight size={14} />} onClick={() => navigate('trainer-students')}>All Students</Button>}
          >
            <table className="lms-table">
              <thead>
                <tr><th>Student</th><th>Batch</th><th>Attendance</th><th>Avg Grade</th><th>Status</th></tr>
              </thead>
              <tbody>
                {TRAINER_STUDENTS.slice(0, 5).map(st => (
                  <tr key={st.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold">
                          {st.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1F2933]">{st.name}</p>
                          <p className="text-[10px] text-[#9BA3AF]">{st.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-[#667085]">{st.batch}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <ProgressBar value={st.attendance} height={4} color={st.attendance >= 75 ? '#10B981' : '#EF4444'} bgColor="#F2F4F6" />
                        </div>
                        <span className={`text-xs font-semibold ${st.attendance >= 75 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{st.attendance}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`text-sm font-bold ${st.avgGrade >= 90 ? 'text-[#10B981]' : st.avgGrade >= 75 ? 'text-[#007991]' : st.avgGrade >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                        {st.gradeLabel} ({st.avgGrade}%)
                      </span>
                    </td>
                    <td><StatusBadge status={st.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* My Courses */}
          <SectionCard title="Active Batches" action={<Button variant="ghost" size="sm" onClick={() => navigate('trainer-courses')}>Manage</Button>}>
            <div className="divide-y divide-[#F2F4F6]">
              {[
                { name: 'DMM-Feb-2024', course: 'Digital Marketing Mastery', students: 32, progress: 68 },
                { name: 'DMM-Sep-2024', course: 'Digital Marketing Mastery', students: 8, progress: 24 },
              ].map(b => (
                <div key={b.name} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-[#1F2933]">{b.name}</p>
                    <span className="text-xs text-[#9BA3AF]">{b.students} students</span>
                  </div>
                  <p className="text-xs text-[#667085] mb-2">{b.course}</p>
                  <ProgressBar value={b.progress} height={5} showLabel label="Avg progress" />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Announcements */}
          <SectionCard title="Announcements" action={<Button variant="cta" size="sm" onClick={() => addToast({ type: 'info', title: 'New announcement', message: 'Announcement composer opening…' })}>+ Post</Button>}>
            {ANNOUNCEMENTS.slice(0, 2).map(a => (
              <div key={a.id} className="px-5 py-4 border-b border-[#F2F4F6] last:border-0">
                <p className="text-sm font-semibold text-[#1F2933] mb-1">{a.title}</p>
                <p className="text-xs text-[#667085] line-clamp-2">{a.message}</p>
                <p className="text-[10px] text-[#9BA3AF] mt-2">{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
