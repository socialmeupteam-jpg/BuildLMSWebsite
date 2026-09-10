import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { TRAINER_STUDENTS } from '../../data/mockData';
import { IconCheck, IconCalendar, IconDownload, IconEye } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

type AttStatus = 'present' | 'absent' | 'late' | 'excused';

export default function TrainerAttendancePage() {
  const { addToast } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('DMM-Feb-2024');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionTopic, setSessionTopic] = useState('Module 4: Performance Marketing & Ad Copy Architecture');
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>({
    's1': 'present',
    's2': 'present',
    's3': 'late',
    's4': 'present',
    's5': 'excused',
  });
  const [saved, setSaved] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<typeof TRAINER_STUDENTS[0] | null>(null);

  const batches = ['DMM-Feb-2024', 'DMM-Sep-2024'];

  const statusColors: Record<AttStatus, string> = {
    present: 'bg-[#D1FAE5] text-[#065F46] border-[#10B981] font-bold shadow-2xs',
    absent: 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444] font-bold shadow-2xs',
    late: 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B] font-bold shadow-2xs',
    excused: 'bg-[#DBEAFE] text-[#1E40AF] border-[#3B82F6] font-bold shadow-2xs',
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
    addToast({
      type: 'success',
      title: 'Attendance Saved',
      message: `Attendance for batch ${selectedBatch} on ${selectedDate} has been saved.`,
    });
  };

  const handleExportCSV = () => {
    const headers = 'Student ID,Name,Email,Attendance %,Marked Status\n';
    const rows = TRAINER_STUDENTS.map(
      s => `${s.id},"${s.name}",${s.email},${s.attendance}%,${attendance[s.id] || 'Unmarked'}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${selectedBatch}_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      title: 'Attendance Exported',
      message: `CSV report generated for ${selectedBatch}.`,
      type: 'success',
    });
  };

  const present = Object.values(attendance).filter(v => v === 'present').length;
  const total = TRAINER_STUDENTS.length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Mark Batch Attendance"
        subtitle="Record daily classroom presence, late entries, and track student compliance"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<IconDownload size={14} />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="cta"
              size="sm"
              icon={<IconCheck size={14} />}
              onClick={handleSave}
              disabled={Object.keys(attendance).length === 0}
            >
              Save Attendance
            </Button>
          </div>
        }
      />

      {/* Configuration Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Select Batch:</span>
            <div className="flex gap-2">
              {batches.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setSelectedBatch(b);
                    setSaved(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedBatch === b
                      ? 'border-[#007991] bg-[#f0fbff] text-[#007991]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-[#007991]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value);
                setSaved(false);
              }}
              className="h-8 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 shrink-0">Session Topic:</span>
          <input
            type="text"
            value={sessionTopic}
            onChange={e => setSessionTopic(e.target.value)}
            placeholder="e.g. Module 3: Keyword Research and Negative Keyword Mapping"
            className="w-full h-8 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
          />
        </div>
      </div>

      {/* Attendance stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(['present', 'absent', 'late', 'excused'] as AttStatus[]).map(s => {
          const count = Object.values(attendance).filter(v => v === s).length;
          return (
            <div key={s} className="p-3 rounded-xl border border-[#E5E7EB] text-center bg-white shadow-2xs">
              <p className={`text-2xl font-bold capitalize ${
                s === 'present' ? 'text-[#10B981]' : s === 'absent' ? 'text-[#EF4444]' : s === 'late' ? 'text-[#F59E0B]' : 'text-[#3B82F6]'
              }`}>
                {count}
              </p>
              <p className="text-xs text-[#667085] capitalize font-medium">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700">Quick Mark All:</span>
          {(['present', 'absent', 'late', 'excused'] as AttStatus[]).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => markAll(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                s === 'present'
                  ? 'border-[#10B981] bg-white text-[#065F46] hover:bg-[#D1FAE5]'
                  : s === 'absent'
                  ? 'border-[#EF4444] bg-white text-[#991B1B] hover:bg-[#FEE2E2]'
                  : s === 'late'
                  ? 'border-[#F59E0B] bg-white text-[#92400E] hover:bg-[#FEF3C7]'
                  : 'border-[#3B82F6] bg-white text-[#1E40AF] hover:bg-[#DBEAFE]'
              }`}
            >
              All {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          {present} of {total} marked present ({Math.round((present / total) * 100)}%)
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] mb-5">
          <IconCheck size={16} className="text-[#10B981]" />
          <p className="text-sm font-semibold text-[#065F46]">
            Attendance successfully saved for {present}/{total} students on {selectedDate}.
          </p>
        </div>
      )}

      <SectionCard title={`Enrolled Students — ${selectedBatch}`} subtitle={`${total} active learners`}>
        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Overall Record</th>
                <th style={{ minWidth: 260 }}>Mark Today's Status</th>
                <th className="text-right">History</th>
              </tr>
            </thead>
            <tbody>
              {TRAINER_STUDENTS.map(student => {
                const status = attendance[student.id];
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-xs font-bold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1F2933]">{student.name}</p>
                          <p className="text-[10px] text-slate-400">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-[#667085]">{student.email}</td>
                    <td>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        student.attendance >= 75
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        {(['present', 'absent', 'late', 'excused'] as AttStatus[]).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => mark(student.id, s)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              status === s
                                ? statusColors[s]
                                : 'border-[#E5E7EB] bg-white text-slate-500 hover:border-[#007991]'
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<IconEye size={12} />}
                        onClick={() => setInspectedStudent(student)}
                      >
                        Profile
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Student Attendance Profile Modal */}
      <Modal
        isOpen={!!inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        title="Student Attendance & Engagement Profile"
        description="Comprehensive attendance logs and contact info"
        size="md"
      >
        {inspectedStudent && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#007991] text-white flex items-center justify-center font-bold text-sm">
                  {inspectedStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{inspectedStudent.name}</h4>
                  <p className="text-slate-500 text-xs">{inspectedStudent.email}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xl font-bold ${inspectedStudent.attendance >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {inspectedStudent.attendance}%
                </span>
                <p className="text-[10px] text-slate-400">Cumulative Attendance</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-700">Past 5 Session Logs</h5>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                {[
                  { date: 'Dec 12, 2024', session: 'Google Search Ads & Bidding', status: 'present' },
                  { date: 'Dec 10, 2024', session: 'SEO Technical Audit & Schema', status: 'present' },
                  { date: 'Dec 08, 2024', session: 'Conversion Rate Optimization', status: 'late' },
                  { date: 'Dec 05, 2024', session: 'Content Marketing Frameworks', status: 'present' },
                  { date: 'Dec 03, 2024', session: 'Email Automation Funnels', status: 'absent' },
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{s.session}</p>
                      <p className="text-[10px] text-slate-400">{s.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      s.status === 'present' ? 'bg-emerald-50 text-emerald-700' : s.status === 'late' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setInspectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
