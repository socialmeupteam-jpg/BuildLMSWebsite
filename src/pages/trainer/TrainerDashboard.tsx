import { useState } from 'react';
import DashboardLayout, { SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import { TRAINER_TODAY_CLASSES, TRAINER_PENDING_SUBMISSIONS, TRAINER_STUDENTS, ANNOUNCEMENTS } from '../../data/mockData';
import { IconCalendar, IconClipboard, IconUsers, IconVideo, IconChevronRight, IconCheck, IconPlus, IconBell } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function TrainerDashboard() {
  const { navigate, addToast } = useApp();

  const [announcementList, setAnnouncementList] = useState(ANNOUNCEMENTS);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annTarget, setAnnTarget] = useState('All My Batches');
  const [annMessage, setAnnMessage] = useState('');

  const [activeLiveClass, setActiveLiveClass] = useState<typeof TRAINER_TODAY_CLASSES[0] | null>(null);

  const avgAttendance = Math.round(TRAINER_STUDENTS.reduce((s, st) => s + st.attendance, 0) / TRAINER_STUDENTS.length);
  const avgGrade = Math.round(TRAINER_STUDENTS.reduce((s, st) => s + st.avgGrade, 0) / TRAINER_STUDENTS.length);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) return;

    const newPost = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      message: annMessage,
      date: new Date().toISOString().slice(0, 10),
      author: 'Prof. Rajesh Sharma (You)',
      authorRole: 'Head Trainer',
      course: annTarget,
      priority: 'normal' as const,
      audience: 'students' as const,
    };

    setAnnouncementList(prev => [newPost, ...prev]);
    setIsPostModalOpen(false);
    setAnnTitle('');
    setAnnMessage('');
    addToast({
      type: 'success',
      title: 'Announcement Broadcasted',
      message: `Announcement published to ${annTarget}.`,
    });
  };

  return (
    <DashboardLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="My Students"
          value={TRAINER_STUDENTS.length}
          subtitle="Across 2 active batches"
          icon={<IconUsers size={20} />}
          iconBg="#e0f6ff"
          iconColor="#007991"
          onClick={() => navigate('trainer-students')}
        />
        <StatCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          subtitle="All active batches"
          icon={<IconCalendar size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Pending Reviews"
          value={TRAINER_PENDING_SUBMISSIONS.length}
          subtitle="Submissions awaiting grade"
          icon={<IconClipboard size={20} />}
          iconBg={TRAINER_PENDING_SUBMISSIONS.length > 0 ? '#FEF3C7' : '#D1FAE5'}
          iconColor={TRAINER_PENDING_SUBMISSIONS.length > 0 ? '#F59E0B' : '#10B981'}
          onClick={() => navigate('trainer-assignments')}
        />
        <StatCard
          title="Class Avg Grade"
          value={`${avgGrade}%`}
          subtitle="All enrolled students"
          icon={<span className="text-xl">📊</span>}
          iconBg="#fff3e6"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes */}
          <SectionCard
            title="Today's Classes & Sessions"
            subtitle={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          >
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
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#007991]">{cls.time}</p>
                      <p className="text-xs text-[#9BA3AF]">{cls.studentsExpected} students expected</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {cls.status === 'upcoming' ? (
                      <>
                        <Button
                          variant="cta"
                          size="sm"
                          icon={<IconVideo size={14} />}
                          onClick={() => setActiveLiveClass(cls)}
                        >
                          Launch Classroom
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate('trainer-attendance')}>
                          Mark Attendance
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D1FAE5]">
                          <IconCheck size={14} className="text-[#10B981]" />
                          <span className="text-xs font-semibold text-[#065F46]">
                            {cls.studentsPresent}/{cls.studentsExpected} attended
                          </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('trainer-attendance')}>
                          View Attendance
                        </Button>
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
            action={
              <Button
                variant="ghost"
                size="sm"
                iconRight={<IconChevronRight size={14} />}
                onClick={() => navigate('trainer-assignments')}
              >
                All Assignments
              </Button>
            }
          >
            {TRAINER_PENDING_SUBMISSIONS.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#9BA3AF]">🎉 All caught up! No pending submissions.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="lms-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Assignment</th>
                      <th>Course</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRAINER_PENDING_SUBMISSIONS.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold">
                              {sub.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-[#1F2933]">{sub.studentName}</span>
                          </div>
                        </td>
                        <td className="text-sm text-[#374151]">{sub.assignmentTitle}</td>
                        <td className="text-xs text-[#9BA3AF]">{sub.course}</td>
                        <td className="text-xs text-[#667085]">
                          {new Date(sub.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td>
                          <StatusBadge status={sub.status} />
                        </td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => navigate('trainer-assignments')}>
                            Grade
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {/* Student Performance Table */}
          <SectionCard
            title="My Students — Quick Overview"
            action={
              <Button
                variant="ghost"
                size="sm"
                iconRight={<IconChevronRight size={14} />}
                onClick={() => navigate('trainer-students')}
              >
                All Students
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Batch</th>
                    <th>Attendance</th>
                    <th>Avg Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAINER_STUDENTS.slice(0, 5).map(st => (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
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
                            <ProgressBar
                              value={st.attendance}
                              height={4}
                              color={st.attendance >= 75 ? '#10B981' : '#EF4444'}
                              bgColor="#F2F4F6"
                            />
                          </div>
                          <span className={`text-xs font-semibold ${st.attendance >= 75 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                            {st.attendance}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`text-sm font-bold ${st.avgGrade >= 90 ? 'text-[#10B981]' : st.avgGrade >= 75 ? 'text-[#007991]' : st.avgGrade >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                          {st.gradeLabel} ({st.avgGrade}%)
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={st.status} />
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
          {/* My Courses */}
          <SectionCard
            title="Active Batches"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('trainer-courses')}>
                Manage
              </Button>
            }
          >
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
          <SectionCard
            title="Broadcast Announcements"
            action={
              <Button
                variant="cta"
                size="sm"
                icon={<IconPlus size={12} />}
                onClick={() => setIsPostModalOpen(true)}
              >
                Post
              </Button>
            }
          >
            <div className="divide-y divide-slate-100">
              {announcementList.slice(0, 3).map(a => (
                <div key={a.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-bold text-[#1F2933] truncate">{a.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">{a.message}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Post Announcement Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Broadcast Batch Announcement"
        description="Deliver important notifications, schedule updates, or lecture links to your students"
        size="md"
      >
        <form onSubmit={handlePostAnnouncement} className="space-y-4">
          <div>
            <label htmlFor="ann-target" className="block text-xs font-semibold text-slate-700 mb-1">
              Target Audience
            </label>
            <select
              id="ann-target"
              value={annTarget}
              onChange={e => setAnnTarget(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            >
              <option>All My Batches</option>
              <option>DMM-Feb-2024 (Digital Marketing Mastery)</option>
              <option>DMM-Sep-2024 (Digital Marketing Mastery)</option>
            </select>
          </div>

          <div>
            <label htmlFor="ann-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Title
            </label>
            <input
              id="ann-title"
              type="text"
              required
              value={annTitle}
              onChange={e => setAnnTitle(e.target.value)}
              placeholder="e.g. Tomorrow's Guest Lecture & Pre-reading Material"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label htmlFor="ann-message" className="block text-xs font-semibold text-slate-700 mb-1">
              Message Content
            </label>
            <textarea
              id="ann-message"
              required
              rows={4}
              value={annMessage}
              onChange={e => setAnnMessage(e.target.value)}
              placeholder="Write announcement details..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPostModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="cta">
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>

      {/* Launch Classroom Modal */}
      <Modal
        isOpen={!!activeLiveClass}
        onClose={() => setActiveLiveClass(null)}
        title="Live Interactive Classroom"
        description="Session room and presentation controls"
        size="md"
      >
        {activeLiveClass && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 rounded-2xl text-white text-center py-8 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-cyan-300 mb-3">
                <IconVideo size={28} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{activeLiveClass.topic}</h4>
              <p className="text-slate-400 text-xs">{activeLiveClass.courseName} · {activeLiveClass.batchName}</p>
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Room Ready
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-semibold text-slate-800">{activeLiveClass.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Attendance:</span>
                <span className="font-semibold text-slate-800">{activeLiveClass.studentsExpected} enrolled learners</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Video Bridge:</span>
                <span className="font-mono text-[#007991]">meet.google.com/dmm-class-live</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveLiveClass(null)}>
                Close
              </Button>
              <Button
                variant="cta"
                size="sm"
                onClick={() => {
                  setActiveLiveClass(null);
                  addToast({
                    type: 'success',
                    title: 'Classroom Started',
                    message: 'Video conference link initialized and attendees notified.',
                  });
                }}
              >
                Join Video Bridge
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
