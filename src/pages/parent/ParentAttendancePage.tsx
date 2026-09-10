import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProgressBar, { CircularProgress } from '../../components/ui/ProgressBar';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { STUDENT_ATTENDANCE, ATTENDANCE_SUMMARY } from '../../data/mockData';
import type { AttendanceRecord } from '../../types';
import {
  IconCalendar, IconChevronLeft, IconChevronRight,
  IconCheckCircle, IconX, IconClock, IconAlertTriangle
} from '../../components/Icons';

const LINKED_CHILDREN = [
  { id: 's-1', name: 'Rahul Sharma', cohort: 'Digital Marketing Mastery (DMM-Feb-2024)', roll: 'SMA-2024-0042' },
];

export default function ParentAttendancePage() {
  const { addToast } = useApp();
  const [selectedChild] = useState(LINKED_CHILDREN[0]);
  const [currentMonth, setCurrentMonth] = useState('December 2024');
  const [selectedSession, setSelectedSession] = useState<AttendanceRecord | null>(null);

  // Leave Request Modal state for parents
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2024-12-18');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveCategory, setLeaveCategory] = useState('Medical / Health');

  // Month navigation simulation
  const months = ['October 2024', 'November 2024', 'December 2024', 'January 2025'];
  const currentMonthIdx = months.indexOf(currentMonth);

  const handlePrevMonth = () => {
    if (currentMonthIdx > 0) setCurrentMonth(months[currentMonthIdx - 1]);
  };
  const handleNextMonth = () => {
    if (currentMonthIdx < months.length - 1) setCurrentMonth(months[currentMonthIdx + 1]);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    setIsLeaveModalOpen(false);
    setLeaveReason('');
    addToast({
      title: 'Leave Application Logged',
      message: `Parent leave notice for ${selectedChild.name} on ${leaveDate} submitted to batch trainer.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Child Attendance & Class Log"
          subtitle={`Attendance monitoring and session logs for ${selectedChild.name}`}
        />
        <Button
          variant="outline"
          icon={<IconCalendar size={16} />}
          onClick={() => setIsLeaveModalOpen(true)}
        >
          Submit Leave Notice
        </Button>
      </div>

      {/* Child selector pill banner */}
      <div className="flex items-center gap-3 mb-6 p-3.5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
        <span className="text-xs font-semibold text-[#667085]">Monitored Ward:</span>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#e0f6ff] text-[#005f72] text-xs font-bold border border-[#b1ebff]">
          <span className="w-2 h-2 rounded-full bg-[#007991]" />
          {selectedChild.name} ({selectedChild.roll})
        </div>
        <span className="text-xs text-[#9BA3AF] ml-auto hidden md:inline">
          {selectedChild.cohort}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Attendance Rate"
          value={`${ATTENDANCE_SUMMARY.percentage}%`}
          subtitle="Meets 75% requirement"
          icon={<IconCalendar size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Total Sessions"
          value={ATTENDANCE_SUMMARY.totalClasses}
          subtitle="Held to date"
          icon={<IconClock size={20} />}
          iconBg="#E6F4F6"
          iconColor="#007991"
        />
        <StatCard
          title="Present"
          value={ATTENDANCE_SUMMARY.present}
          subtitle="Attended in full"
          icon={<IconCheckCircle size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Absences"
          value={ATTENDANCE_SUMMARY.absent}
          subtitle={`${ATTENDANCE_SUMMARY.excused} excused`}
          icon={<IconAlertTriangle size={20} />}
          iconBg={ATTENDANCE_SUMMARY.absent > 3 ? '#FEE2E2' : '#FEF3C7'}
          iconColor={ATTENDANCE_SUMMARY.absent > 3 ? '#EF4444' : '#F59E0B'}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Attendance Calendar and Session History */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title={`Attendance Calendar — ${currentMonth}`}
            subtitle="Daily breakdown of batch sessions and attendance marks"
            action={
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={currentMonthIdx === 0}
                  className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] disabled:opacity-40"
                >
                  <IconChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-[#1F2933] px-2">{currentMonth}</span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  disabled={currentMonthIdx === months.length - 1}
                  className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F2F4F6] disabled:opacity-40"
                >
                  <IconChevronRight size={16} />
                </button>
              </div>
            }
          >
            {/* Calendar Grid Representation */}
            <div className="p-5">
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-[#667085]">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }).map((_, idx) => {
                  const day = idx + 1;
                  // Map specific days to attendance statuses for realism
                  const isPresent = [2, 4, 6, 9, 11, 13, 16, 18, 20].includes(day);
                  const isAbsent = day === 23;
                  const isLate = day === 27;
                  const isWeekend = (day % 7 === 6) || (day % 7 === 0);

                  return (
                    <div
                      key={day}
                      onClick={() => {
                        if (isPresent || isAbsent || isLate) {
                          setSelectedSession({
                            date: `2024-12-${day.toString().padStart(2, '0')}`,
                            dayOfWeek: ['Mon', 'Wed', 'Fri'][day % 3] || 'Mon',
                            status: isPresent ? 'present' : isAbsent ? 'absent' : 'late',
                            session: `Session ${day}: Performance Ads & Creative Strategy`,
                            course: 'Digital Marketing Mastery',
                            batchName: 'DMM-Feb-2024',
                            remarks: isAbsent ? 'Unplanned absence reported' : isLate ? 'Joined 12 mins late' : 'Attended full session',
                            markedBy: 'Ankit Verma (Lead Trainer)',
                          });
                        }
                      }}
                      className={`h-14 p-1.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                        isPresent
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                          : isAbsent
                          ? 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100'
                          : isLate
                          ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                          : isWeekend
                          ? 'bg-[#F7F9FA] border-[#E5E7EB] text-[#9BA3AF]'
                          : 'bg-white border-[#E5E7EB] text-[#667085]'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{day}</span>
                      {isPresent && <span className="text-[9px] font-bold text-emerald-700">Present</span>}
                      {isAbsent && <span className="text-[9px] font-bold text-rose-700">Absent</span>}
                      {isLate && <span className="text-[9px] font-bold text-amber-700">Late</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          {/* Session Details List */}
          <SectionCard title="Recent Class Sessions" subtitle="Log of live classes attended by Rahul">
            <div className="divide-y divide-[#F2F4F6]">
              {STUDENT_ATTENDANCE.map((rec: AttendanceRecord, i: number) => (
                <div key={i} className="p-4 flex items-center justify-between gap-4 hover:bg-[#F7F9FA]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#1F2933]">{rec.session}</p>
                      <StatusBadge status={rec.status} />
                    </div>
                    <p className="text-xs text-[#667085]">
                      {rec.course} • Batch: {rec.batchName}
                    </p>
                    {rec.remarks && (
                      <p className="text-[11px] text-[#9BA3AF] mt-0.5">Remark: {rec.remarks}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-[#1F2933]">
                      {new Date(rec.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-[#9BA3AF]">{rec.markedBy || 'Trainer Verified'}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Summary & Legend */}
        <div className="space-y-6">
          <SectionCard title="Attendance Health" subtitle="Eligibility criteria for certificate & exams">
            <div className="p-5 flex flex-col items-center text-center">
              <CircularProgress value={ATTENDANCE_SUMMARY.percentage} size={110} strokeWidth={10} />
              <p className="text-sm font-bold text-[#1F2933] mt-3">
                {ATTENDANCE_SUMMARY.percentage >= 75 ? 'Good Standing' : 'Low Attendance Alert'}
              </p>
              <p className="text-xs text-[#667085] max-w-xs mt-1">
                The academy requires at least 75% attendance to unlock final assessment submission and graduation certification.
              </p>

              <div className="w-full mt-5 pt-4 border-t border-[#F2F4F6] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Current percentage:</span>
                  <span className="font-bold text-emerald-600">{ATTENDANCE_SUMMARY.percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Required benchmark:</span>
                  <span className="font-bold text-[#1F2933]">75.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Safety buffer:</span>
                  <span className="font-bold text-[#007991]">+8% above threshold</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Leave Policies */}
          <SectionCard title="Leave Policy Guidelines">
            <div className="p-5 space-y-3 text-xs text-[#667085] leading-relaxed">
              <p>
                • Planned leaves must be reported at least 24 hours in advance via the parent portal.
              </p>
              <p>
                • Medical leaves require a doctor prescription if absence exceeds 3 consecutive days.
              </p>
              <p>
                • Missed sessions can be compensated via archived cloud lecture recordings with quiz check.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Leave Notice Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Submit Parent Leave Notice"
        size="md"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Student</label>
            <input
              type="text"
              readOnly
              value={`${selectedChild.name} (${selectedChild.cohort})`}
              className="w-full bg-[#F2F4F6] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#4B5563] outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Leave Date *</label>
            <input
              type="date"
              value={leaveDate}
              onChange={e => setLeaveDate(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Reason Category</label>
            <select
              value={leaveCategory}
              onChange={e => setLeaveCategory(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              <option value="Medical / Health">Medical / Health</option>
              <option value="Family Function">Family Function / Travel</option>
              <option value="School Exam Conflict">School / University Exam Conflict</option>
              <option value="Other">Other Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Parent Explanation *</label>
            <textarea
              rows={3}
              value={leaveReason}
              onChange={e => setLeaveReason(e.target.value)}
              placeholder="Briefly state why the student will be unable to attend..."
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit" disabled={!leaveReason.trim()}>
              Submit Notice
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
