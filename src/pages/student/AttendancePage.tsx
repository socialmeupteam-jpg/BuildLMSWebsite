import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { STUDENT_ATTENDANCE, ATTENDANCE_SUMMARY } from '../../data/mockData';
import { CircularProgress } from '../../components/ui/ProgressBar';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { IconCalendar, IconPlus, IconCheckCircle, IconInfo } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCalendarData(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

export default function AttendancePage() {
  const { addToast } = useApp();
  const [viewMonth, setViewMonth] = useState(11); // December
  const [viewYear, setViewYear] = useState(2024);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [selectedDayRecord, setSelectedDayRecord] = useState<typeof STUDENT_ATTENDANCE[0] | null>(null);

  // Leave / Correction Request Modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2024-12-20');
  const [leaveReason, setLeaveReason] = useState('Medical / Health Appointment');
  const [leaveNotes, setLeaveNotes] = useState('');

  const { firstDay, daysInMonth } = getCalendarData(viewYear, viewMonth);

  const filteredAttendance = selectedCourseFilter === 'All'
    ? STUDENT_ATTENDANCE
    : STUDENT_ATTENDANCE.filter(a => a.course.toLowerCase().includes(selectedCourseFilter.toLowerCase()));

  const attMap: Record<string, typeof STUDENT_ATTENDANCE[0]> = {};
  filteredAttendance.forEach(a => { attMap[a.date] = a; });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const statusClass = (status?: string) => {
    if (!status) return 'bg-slate-50 text-slate-400';
    if (status === 'present') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'absent') return 'bg-rose-50 text-rose-700 border border-rose-200';
    if (status === 'late') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (status === 'excused') return 'bg-sky-50 text-sky-700 border border-sky-200';
    return 'bg-slate-50 text-slate-700';
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLeaveModalOpen(false);
    addToast({
      title: 'Request Submitted',
      message: `Your leave/correction request for ${leaveDate} has been sent to the trainer.`,
      type: 'success',
    });
    setLeaveNotes('');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Attendance Record"
        subtitle="Monitor your class attendance rate, monthly log, and session eligibility"
        action={
          <Button
            variant="cta"
            size="sm"
            icon={<IconPlus size={14} />}
            onClick={() => setIsLeaveModalOpen(true)}
          >
            Apply for Leave / Correction
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="col-span-2 sm:col-span-1 flex items-center justify-center bg-white rounded-2xl border border-[#E5E7EB] py-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <CircularProgress value={ATTENDANCE_SUMMARY.percentage} size={90} strokeWidth={8} label="Overall" />
        </div>
        {[
          { label: 'Total Classes', value: ATTENDANCE_SUMMARY.totalClasses, color: '#007991' },
          { label: 'Present', value: ATTENDANCE_SUMMARY.present, color: '#10B981' },
          { label: 'Absent', value: ATTENDANCE_SUMMARY.absent, color: '#EF4444' },
          { label: 'Late / Excused', value: ATTENDANCE_SUMMARY.late + ATTENDANCE_SUMMARY.excused, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#667085] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Minimum attendance warning */}
      {ATTENDANCE_SUMMARY.percentage < 75 ? (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] mb-6">
          <span className="text-[#EF4444] text-xl font-bold">⚠</span>
          <div>
            <p className="text-sm font-bold text-[#991B1B]">Attendance Below Minimum Threshold</p>
            <p className="text-xs text-[#991B1B]/80">You need at least 75% attendance to be eligible for certification. Please attend upcoming sessions regularly.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] mb-6">
          <span className="text-emerald-700 text-lg font-bold">✓</span>
          <p className="text-sm font-semibold text-[#065F46]">Your attendance is above the 75% minimum requirement. You are eligible for the final certificate.</p>
        </div>
      )}

      {/* Course Filter */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Course:</span>
          <select
            value={selectedCourseFilter}
            onChange={e => setSelectedCourseFilter(e.target.value)}
            className="h-8 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#007991]"
          >
            <option value="All">All Enrolled Courses</option>
            <option value="Digital Marketing">Advanced Digital Marketing</option>
            <option value="Web Development">Full Stack Web Development</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <SectionCard
            title={`${MONTHS[viewMonth]} ${viewYear}`}
            action={
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-[#F2F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#667085] font-bold cursor-pointer">‹</button>
                <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-[#F2F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#667085] font-bold cursor-pointer">›</button>
              </div>
            }
          >
            <div className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-[#9BA3AF] py-1">{d}</div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const record = attMap[dateStr];
                  const isToday = dateStr === new Date().toISOString().slice(0, 10);
                  const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => record && setSelectedDayRecord(record)}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold cursor-pointer transition-transform active:scale-95
                        ${record ? statusClass(record.status) : isWeekend ? 'bg-slate-50 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}
                        ${isToday ? 'ring-2 ring-[#007991]' : ''}
                      `}
                      title={record ? `${record.course} · ${record.status}` : ''}
                    >
                      <span>{day}</span>
                      {record && <span className="text-[8px] mt-0.5 capitalize font-bold">{record.status.slice(0, 3)}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#F2F4F6]">
                {[
                  { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Present' },
                  { cls: 'bg-rose-50 text-rose-700 border border-rose-200', label: 'Absent' },
                  { cls: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Late' },
                  { cls: 'bg-sky-50 text-sky-700 border border-sky-200', label: 'Excused' },
                ].map(l => (
                  <div key={l.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold ${l.cls}`}>
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Recent records */}
        <div>
          <SectionCard title="Recent Sessions">
            <div className="divide-y divide-[#F2F4F6] max-h-[480px] overflow-y-auto">
              {[...filteredAttendance].reverse().slice(0, 10).map((record, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDayRecord(record)}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${statusClass(record.status)}`}>
                    {new Date(record.date).getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1F2933] truncate">{record.course}</p>
                    <p className="text-[10px] text-[#9BA3AF] truncate">{record.session}</p>
                    <p className="text-[10px] text-[#9BA3AF]">{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                  <StatusBadge status={record.status} />
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Day Session Detail Modal */}
      <Modal
        isOpen={!!selectedDayRecord}
        onClose={() => setSelectedDayRecord(null)}
        title="Session Attendance Detail"
        description="Session log and verification status"
        size="sm"
      >
        {selectedDayRecord && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Date:</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedDayRecord.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Course:</span>
                <span className="font-bold text-slate-800 text-right">{selectedDayRecord.course}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Session Topic:</span>
                <span className="font-medium text-slate-800 text-right">{selectedDayRecord.session}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Marked Status:</span>
                <StatusBadge status={selectedDayRecord.status} />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDayRecord(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Leave Application Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Leave / Attendance Correction"
        description="Submit reason for absence or request session attendance review"
        size="md"
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div>
            <label htmlFor="leave-course" className="block text-xs font-semibold text-slate-700 mb-1">
              Course
            </label>
            <select
              id="leave-course"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            >
              <option>Advanced Digital Marketing (DM-2024-A)</option>
              <option>Full Stack Web Development (WD-2024-B)</option>
            </select>
          </div>

          <div>
            <label htmlFor="leave-date" className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Absence
            </label>
            <input
              id="leave-date"
              type="date"
              required
              value={leaveDate}
              onChange={e => setLeaveDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label htmlFor="leave-reason" className="block text-xs font-semibold text-slate-700 mb-1">
              Reason Category
            </label>
            <select
              id="leave-reason"
              value={leaveReason}
              onChange={e => setLeaveReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            >
              <option>Medical / Health Appointment</option>
              <option>College / University Examination</option>
              <option>Family Emergency</option>
              <option>Technical / Power Connectivity Issue</option>
              <option>Attendance Discrepancy Correction</option>
            </select>
          </div>

          <div>
            <label htmlFor="leave-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Supporting Explanation
            </label>
            <textarea
              id="leave-notes"
              required
              rows={3}
              value={leaveNotes}
              onChange={e => setLeaveNotes(e.target.value)}
              placeholder="Explain details for the trainer's approval..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="cta">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
