import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { TRAINER_PENDING_SUBMISSIONS, STUDENT_ASSIGNMENTS } from '../../data/mockData';
import { IconCheck, IconPlus } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function TrainerAssignmentsPage() {
  const { addToast } = useApp();
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, { marks: string; feedback: string }>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);

  const handleGrade = (id: string) => {
    const g = grades[id];
    if (!g?.marks) return;
    setSubmitted(prev => [...prev, id]);
    setGradingId(null);
    addToast({ type: 'success', title: 'Grade saved', message: `Grade submitted for ${TRAINER_PENDING_SUBMISSIONS.find(s => s.id === id)?.studentName}` });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Assignments & Grading"
        action={<Button variant="cta" size="sm" icon={<IconPlus size={14} />} onClick={() => addToast({ type: 'info', title: 'Create Assignment', message: 'Assignment builder opening…' })}>Create Assignment</Button>}
      />

      {/* Pending submissions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1F2933]">Submissions to Grade ({TRAINER_PENDING_SUBMISSIONS.filter(s => !submitted.includes(s.id)).length})</h3>
        </div>
        <div className="space-y-3">
          {TRAINER_PENDING_SUBMISSIONS.map(sub => {
            const isGrading = gradingId === sub.id;
            const isDone = submitted.includes(sub.id);
            return (
              <div key={sub.id} className={`bg-white rounded-2xl border overflow-hidden ${isDone ? 'border-[#D1FAE5]' : 'border-[#E5E7EB]'}`} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-4 p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${isDone ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#E6F4F6] text-[#007991]'}`}>
                    {isDone ? <IconCheck size={18} /> : sub.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1F2933]">{sub.studentName}</p>
                    <p className="text-xs text-[#667085]">{sub.assignmentTitle} · {sub.course}</p>
                    <p className="text-[10px] text-[#9BA3AF]">Submitted {new Date(sub.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <StatusBadge status={isDone ? 'graded' : sub.status} />
                  {!isDone && (
                    <Button variant="primary" size="sm" onClick={() => setGradingId(isGrading ? null : sub.id)}>
                      {isGrading ? 'Cancel' : 'Grade'}
                    </Button>
                  )}
                </div>

                {isGrading && !isDone && (
                  <div className="px-5 pb-5 border-t border-[#F2F4F6] pt-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-[#374151] mb-1">Marks Obtained</label>
                        <input
                          type="number" min={0} max={100}
                          value={grades[sub.id]?.marks ?? ''}
                          onChange={e => setGrades(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], marks: e.target.value } }))}
                          placeholder="e.g. 85"
                          className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#007991] bg-[#F9FAFB]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-[#374151] mb-1">Out of</label>
                        <input disabled value="100" className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB] text-sm bg-[#F2F4F6] text-[#9BA3AF]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">Feedback for Student</label>
                      <textarea
                        rows={3}
                        value={grades[sub.id]?.feedback ?? ''}
                        onChange={e => setGrades(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], feedback: e.target.value } }))}
                        placeholder="Provide constructive feedback on the submission…"
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm resize-none focus:outline-none focus:border-[#007991] bg-[#F9FAFB]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="cta" size="sm" icon={<IconCheck size={14} />} onClick={() => handleGrade(sub.id)} disabled={!grades[sub.id]?.marks}>
                        Save Grade & Publish
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setGradingId(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All assignments created */}
      <SectionCard title="Assignments I Created" subtitle="All published and draft assignments">
        <table className="lms-table">
          <thead>
            <tr><th>Title</th><th>Course</th><th>Due Date</th><th>Submissions</th><th>Max Marks</th><th>Status</th></tr>
          </thead>
          <tbody>
            {STUDENT_ASSIGNMENTS.slice(0, 5).map(a => (
              <tr key={a.id}>
                <td className="font-semibold text-[#1F2933]">{a.title}</td>
                <td className="text-xs text-[#667085]">{a.courseTitle.split(' ').slice(0, 3).join(' ')}</td>
                <td className="text-xs text-[#667085]">{new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>
                  <span className="text-sm font-bold text-[#007991]">
                    {['submitted', 'graded'].includes(a.status) ? '1' : '0'}/32
                  </span>
                </td>
                <td className="text-sm">{a.maxMarks}</td>
                <td><StatusBadge status={a.status === 'pending' ? 'published' : a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </DashboardLayout>
  );
}
