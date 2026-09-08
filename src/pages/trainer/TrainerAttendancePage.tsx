import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { TRAINER_STUDENTS } from '../../data/mockData';
import { IconCheck, IconCalendar } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

type AttStatus = 'present' | 'absent' | 'late' | 'excused';

export default function TrainerAttendancePage() {
  const { addToast } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('DMM-Feb-2024');
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>({});
  const [saved, setSaved] = useState(false);

  const batches = ['DMM-Feb-2024', 'DMM-Sep-2024'];

  const statusColors: Record<AttStatus, string> = {
    present: 'bg-[#D1FAE5] text-[#065F46] ring-2 ring-[#10B981]',
    absent: 'bg-[#FEE2E2] text-[#991B1B] ring-2 ring-[#EF4444]',
    late: 'bg-[#FEF3C7] text-[#92400E] ring-2 ring-[#F59E0B]',
    excused: 'bg-[#DBEAFE] text-[#1E40AF] ring-2 ring-[#3B82F6]',
  };

  const mark = (studentId: string, status: AttStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const markAll = (status: AttStatus) => {
    const newAtt: Record<string, AttStatus> = {};
    TRAINER_STUDENTS.forEach(s => { newAtt[s.id] = status; });
    setAttendance(newAtt);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    addToast({ type: 'success', title: 'Attendance saved', message: `Attendance for ${selectedBatch} on ${new Date().toLocaleDateString('en-IN')} has been recorded.` });
  };

  const present = Object.values(attendance).filter(v => v === 'present').length;
  const total = TRAINER_STUDENTS.length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Mark Attendance"
        subtitle={`Today: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
        action={
          <Button variant="cta" size="sm" icon={<IconCheck size={14} />} onClick={handleSave} disabled={Object.keys(attendance).length === 0}>
            Save Attendance
          </Button>
        }
      />

      {/* Batch selector */}
      <div className="flex items-center gap-3 mb-6">
        <p className="text-sm font-semibold text-[#667085]">Batch:</p>
        {batches.map(b => (
          <button key={b}
            onClick={() => { setSelectedBatch(b); setAttendance({}); setSaved(false); }}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${selectedBatch === b ? 'border-[#007991] bg-[#f0fbff] text-[#007991]' : 'border-[#E5E7EB] bg-white text-[#667085] hover:border-[#007991]'}`}>
            {b}
          </button>
        ))}
      </div>

      {/* Attendance stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(['present', 'absent', 'late', 'excused'] as AttStatus[]).map(s => {
          const count = Object.values(attendance).filter(v => v === s).length;
          return (
            <div key={s} className={`p-3 rounded-xl border border-[#E5E7EB] text-center bg-white`}>
              <p className={`text-xl font-bold capitalize ${s === 'present' ? 'text-[#10B981]' : s === 'absent' ? 'text-[#EF4444]' : s === 'late' ? 'text-[#F59E0B]' : 'text-[#3B82F6]'}`}>{count}</p>
              <p className="text-xs text-[#667085] capitalize">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <p className="text-sm font-semibold text-[#667085] self-center mr-2">Mark all as:</p>
        {(['present', 'absent', 'late', 'excused'] as AttStatus[]).map(s => (
          <button key={s}
            onClick={() => markAll(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
              ${s === 'present' ? 'border-[#10B981] text-[#065F46] hover:bg-[#D1FAE5]' :
                s === 'absent' ? 'border-[#EF4444] text-[#991B1B] hover:bg-[#FEE2E2]' :
                s === 'late' ? 'border-[#F59E0B] text-[#92400E] hover:bg-[#FEF3C7]' :
                'border-[#3B82F6] text-[#1E40AF] hover:bg-[#DBEAFE]'}`}
          >
            All {s}
          </button>
        ))}
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] mb-5">
          <IconCheck size={16} className="text-[#10B981]" />
          <p className="text-sm font-semibold text-[#065F46]">Attendance saved successfully for {present}/{total} students present.</p>
        </div>
      )}

      <SectionCard title={`Students — ${selectedBatch}`} subtitle={`${total} students enrolled`}>
        <table className="lms-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Overall Attendance</th>
              <th style={{ minWidth: 300 }}>Today's Status</th>
            </tr>
          </thead>
          <tbody>
            {TRAINER_STUDENTS.map(student => {
              const status = attendance[student.id];
              return (
                <tr key={student.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="font-semibold text-[#1F2933]">{student.name}</p>
                    </div>
                  </td>
                  <td className="text-xs text-[#667085]">{student.email}</td>
                  <td>
                    <span className={`text-sm font-bold ${student.attendance >= 75 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{student.attendance}%</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {(['present', 'absent', 'late', 'excused'] as AttStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => mark(student.id, s)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${status === s ? statusColors[s] : 'border-[#E5E7EB] text-[#9BA3AF] hover:border-[#D1D5DB] capitalize'}`}
                        >
                          {s.slice(0, 1).toUpperCase() + s.slice(1, 3)}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SectionCard>
    </DashboardLayout>
  );
}
