import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { STUDENT_ATTENDANCE, ATTENDANCE_SUMMARY } from '../../data/mockData';
import { CircularProgress } from '../../components/ui/ProgressBar';
import { StatusBadge } from '../../components/ui/Badge';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCalendarData(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

export default function AttendancePage() {
  const [viewMonth, setViewMonth] = useState(11); // December
  const [viewYear, setViewYear] = useState(2024);

  const { firstDay, daysInMonth } = getCalendarData(viewYear, viewMonth);

  const attMap: Record<string, typeof STUDENT_ATTENDANCE[0]> = {};
  STUDENT_ATTENDANCE.forEach(a => { attMap[a.date] = a; });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const statusClass = (status?: string) => {
    if (!status) return 'att-empty';
    return `att-${status}`;
  };

  return (
    <DashboardLayout>
      <PageHeader title="Attendance" subtitle="View your class attendance record and summary" />

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
      {ATTENDANCE_SUMMARY.percentage < 75 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] mb-6">
          <span className="text-[#EF4444] text-xl">⚠</span>
          <div>
            <p className="text-sm font-bold text-[#991B1B]">Attendance Below Minimum Threshold</p>
            <p className="text-xs text-[#991B1B]/80">You need at least 75% attendance to be eligible for certification. Please attend upcoming sessions regularly.</p>
          </div>
        </div>
      )}
      {ATTENDANCE_SUMMARY.percentage >= 75 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] mb-6">
          <span className="text-xl">✓</span>
          <p className="text-sm font-semibold text-[#065F46]">Your attendance is above the 75% minimum. You are eligible for certification.</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <SectionCard
            title={`${MONTHS[viewMonth]} ${viewYear}`}
            action={
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-[#F2F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#667085] font-bold">‹</button>
                <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-[#F2F4F6] hover:bg-[#E5E7EB] flex items-center justify-center text-[#667085] font-bold">›</button>
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
                    <div
                      key={day}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold cursor-default
                        ${record ? statusClass(record.status) : isWeekend ? 'bg-[#F9FAFB] text-[#D1D5DB]' : 'hover:bg-[#F2F4F6] text-[#374151]'}
                        ${isToday ? 'ring-2 ring-[#007991]' : ''}
                      `}
                      title={record ? `${record.course} · ${record.status}` : ''}
                    >
                      <span>{day}</span>
                      {record && <span className="text-[7px] mt-0.5 capitalize">{record.status.slice(0, 3)}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#F2F4F6]">
                {[
                  { cls: 'att-present', label: 'Present' },
                  { cls: 'att-absent', label: 'Absent' },
                  { cls: 'att-late', label: 'Late' },
                  { cls: 'att-excused', label: 'Excused' },
                ].map(l => (
                  <div key={l.label} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${l.cls}`}>
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
            <div className="divide-y divide-[#F2F4F6]">
              {[...STUDENT_ATTENDANCE].reverse().slice(0, 10).map((record, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${statusClass(record.status)}`}>
                    {new Date(record.date).getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1F2933] truncate">{record.course.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-[10px] text-[#9BA3AF] truncate">{record.session}</p>
                    <p className="text-[10px] text-[#9BA3AF]">{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
