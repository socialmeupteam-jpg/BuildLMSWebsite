import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { TRAINER_PENDING_SUBMISSIONS, STUDENT_ASSIGNMENTS } from '../../data/mockData';
import { IconCheck, IconPlus, IconEye, IconFileText, IconDownload } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function TrainerAssignmentsPage() {
  const { addToast } = useApp();
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, { marks: string; feedback: string }>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [previewSub, setPreviewSub] = useState<typeof TRAINER_PENDING_SUBMISSIONS[0] | null>(null);

  // Create Assignment Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assignmentList, setAssignmentList] = useState(STUDENT_ASSIGNMENTS.slice(0, 5));
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('Advanced Digital Marketing');
  const [newDueDate, setNewDueDate] = useState('2024-12-30');
  const [newMaxMarks, setNewMaxMarks] = useState('100');
  const [newDesc, setNewDesc] = useState('');

  const handleGrade = (id: string) => {
    const g = grades[id];
    if (!g?.marks) return;
    setSubmitted(prev => [...prev, id]);
    setGradingId(null);
    const student = TRAINER_PENDING_SUBMISSIONS.find(s => s.id === id);
    addToast({
      type: 'success',
      title: 'Grade Recorded & Published',
      message: `Score of ${g.marks}/100 published for ${student?.studentName}.`,
    });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newAssignment = {
      id: `asn-${Date.now()}`,
      courseId: 'c1',
      courseTitle: newCourse,
      title: newTitle,
      description: newDesc || 'Follow rubric instructions and upload your deliverable before the deadline.',
      dueDate: newDueDate,
      maxMarks: Number(newMaxMarks) || 100,
      status: 'pending' as const,
      trainerName: 'Prof. Rajesh Sharma',
    };

    setAssignmentList(prev => [newAssignment, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    addToast({
      type: 'success',
      title: 'Assignment Published',
      message: `"${newTitle}" is now live for all enrolled students.`,
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Assignments & Grading Hub"
        subtitle="Review student submissions, provide rubric feedback, and publish course assignments"
        action={
          <Button
            variant="cta"
            size="sm"
            icon={<IconPlus size={14} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Assignment
          </Button>
        }
      />

      {/* Pending submissions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1F2933]">
            Submissions to Review ({TRAINER_PENDING_SUBMISSIONS.filter(s => !submitted.includes(s.id)).length} pending)
          </h3>
        </div>
        <div className="space-y-3">
          {TRAINER_PENDING_SUBMISSIONS.map(sub => {
            const isGrading = gradingId === sub.id;
            const isDone = submitted.includes(sub.id);
            return (
              <div
                key={sub.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-[#E5E7EB]'
                }`}
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isDone ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#E6F4F6] text-[#007991]'
                    }`}
                  >
                    {isDone ? <IconCheck size={18} /> : sub.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1F2933]">{sub.studentName}</p>
                    <p className="text-xs text-[#667085] truncate">{sub.assignmentTitle} · {sub.course}</p>
                    <p className="text-[10px] text-[#9BA3AF] mt-0.5">
                      Submitted on {new Date(sub.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={isDone ? 'graded' : sub.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<IconEye size={12} />}
                      onClick={() => setPreviewSub(sub)}
                    >
                      Inspect File
                    </Button>
                    {!isDone && (
                      <Button
                        variant={isGrading ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => setGradingId(isGrading ? null : sub.id)}
                      >
                        {isGrading ? 'Cancel' : 'Grade'}
                      </Button>
                    )}
                  </div>
                </div>

                {isGrading && !isDone && (
                  <div className="px-5 pb-5 border-t border-[#F2F4F6] pt-4 space-y-4 bg-slate-50/50">
                    <div className="flex flex-wrap sm:flex-nowrap gap-3">
                      <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                          Marks Obtained (Max: 100)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={grades[sub.id]?.marks ?? ''}
                          onChange={e =>
                            setGrades(prev => ({
                              ...prev,
                              [sub.id]: { ...prev[sub.id], marks: e.target.value },
                            }))
                          }
                          placeholder="e.g. 88"
                          className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#007991] bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 self-end mb-1">
                        {[
                          { label: '95 (A+)', val: '95' },
                          { label: '85 (A)', val: '85' },
                          { label: '75 (B+)', val: '75' },
                        ].map(preset => (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() =>
                              setGrades(prev => ({
                                ...prev,
                                [sub.id]: { ...prev[sub.id], marks: preset.val },
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Feedback & Remarks for Student
                      </label>
                      <textarea
                        rows={3}
                        value={grades[sub.id]?.feedback ?? ''}
                        onChange={e =>
                          setGrades(prev => ({
                            ...prev,
                            [sub.id]: { ...prev[sub.id], feedback: e.target.value },
                          }))
                        }
                        placeholder="Provide detailed feedback on methodology, execution, and areas for improvement..."
                        className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm resize-none focus:outline-none focus:border-[#007991] bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="cta"
                        size="sm"
                        icon={<IconCheck size={14} />}
                        onClick={() => handleGrade(sub.id)}
                        disabled={!grades[sub.id]?.marks}
                      >
                        Publish Grade & Notify Student
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setGradingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All assignments created */}
      <SectionCard title="Assignments Published" subtitle="Curriculum tasks across your assigned batches">
        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Submissions</th>
                <th>Max Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignmentList.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="font-semibold text-[#1F2933]">{a.title}</td>
                  <td className="text-xs text-[#667085]">{a.courseTitle}</td>
                  <td className="text-xs text-[#667085]">
                    {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td>
                    <span className="text-xs font-bold text-[#007991] px-2 py-0.5 rounded-md bg-[#e0f6ff]">
                      14 / 32 Submitted
                    </span>
                  </td>
                  <td className="text-sm font-semibold text-slate-700">{a.maxMarks}</td>
                  <td>
                    <StatusBadge status={a.status === 'pending' ? 'published' : a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Inspect Submission Modal */}
      <Modal
        isOpen={!!previewSub}
        onClose={() => setPreviewSub(null)}
        title="Student Deliverable Submission"
        description="Review attached work and student commentary"
        size="md"
      >
        {previewSub && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">{previewSub.studentName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Assignment:</span>
                <span className="font-semibold text-slate-800">{previewSub.assignmentTitle}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Course:</span>
                <span className="text-slate-700">{previewSub.course}</span>
              </div>
            </div>

            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-[#007991] flex items-center justify-center">
                  <IconFileText size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Deliverable_Strategy_Deck.pdf</p>
                  <p className="text-[10px] text-slate-400">4.2 MB · Uploaded on {previewSub.submittedDate}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<IconDownload size={13} />}
                onClick={() =>
                  addToast({
                    type: 'success',
                    title: 'File Downloaded',
                    message: 'Student file deliverable opened for offline evaluation.',
                  })
                }
              >
                Download
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewSub(null)}>
                Close
              </Button>
              <Button
                variant="cta"
                size="sm"
                onClick={() => {
                  const targetId = previewSub.id;
                  setPreviewSub(null);
                  setGradingId(targetId);
                }}
              >
                Proceed to Grade
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        description="Publish coursework, set evaluation rubrics and deadlines"
        size="md"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label htmlFor="asn-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Assignment Title
            </label>
            <input
              id="asn-title"
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. End-to-End Search Engine Marketing Campaign"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="asn-course" className="block text-xs font-semibold text-slate-700 mb-1">
                Target Course
              </label>
              <select
                id="asn-course"
                value={newCourse}
                onChange={e => setNewCourse(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              >
                <option>Advanced Digital Marketing</option>
                <option>Full Stack Web Development</option>
                <option>Data Analytics with Python</option>
              </select>
            </div>
            <div>
              <label htmlFor="asn-maxmarks" className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Marks
              </label>
              <input
                id="asn-maxmarks"
                type="number"
                required
                value={newMaxMarks}
                onChange={e => setNewMaxMarks(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="asn-duedate" className="block text-xs font-semibold text-slate-700 mb-1">
              Submission Due Date
            </label>
            <input
              id="asn-duedate"
              type="date"
              required
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label htmlFor="asn-desc" className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions & Rubric
            </label>
            <textarea
              id="asn-desc"
              rows={3}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Outline evaluation criteria, acceptable submission formats (PDF, GitHub link, ZIP)..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="cta">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
