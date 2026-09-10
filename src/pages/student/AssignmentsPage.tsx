import { useState } from 'react';
import DashboardLayout, { PageHeader } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { STUDENT_ASSIGNMENTS } from '../../data/mockData';
import {
  IconClipboard,
  IconUpload,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconLink,
  IconFileText,
} from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';
import type { Assignment } from '../../types';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'graded', label: 'Graded' },
];

export default function AssignmentsPage() {
  const { addToast } = useApp();
  const [assignments, setAssignments] = useState<Assignment[]>(STUDENT_ASSIGNMENTS);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Submission Modal State
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [submissionTab, setSubmissionTab] = useState<'file' | 'link'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState<string>('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const filtered = assignments.filter(a =>
    filter === 'all'
      ? true
      : filter === 'pending'
      ? ['pending', 'resubmit', 'late'].includes(a.status)
      : a.status === filter
  );

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleOpenSubmit = (asgn: Assignment) => {
    setSubmittingAssignment(asgn);
    setSubmissionTab('file');
    setSelectedFile(null);
    setMockFileName('');
    setSubmissionLink('');
    setStudentNotes('');
    setSubmitError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setMockFileName(file.name);
      setSubmitError('');
    }
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionTab === 'file' && !selectedFile && !mockFileName) {
      setSubmitError('Please upload a submission file (PDF, ZIP, DOCX).');
      return;
    }
    if (submissionTab === 'link' && (!submissionLink.trim() || !/^https?:\/\//i.test(submissionLink))) {
      setSubmitError('Please provide a valid web URL (e.g. https://github.com/... or Google Drive link).');
      return;
    }

    if (!submittingAssignment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const updatedList = assignments.map(a =>
        a.id === submittingAssignment.id
          ? {
              ...a,
              status: 'submitted' as const,
              submittedDate: new Date().toISOString(),
              submissionFile: mockFileName || submissionLink,
            }
          : a
      );
      setAssignments(updatedList);
      setSubmittingAssignment(null);

      addToast({
        title: 'Assignment Submitted!',
        message: `Your work for "${submittingAssignment.title}" was submitted to ${submittingAssignment.trainerName}.`,
        type: 'success',
      });
    }, 700);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Assignments"
        subtitle="Track and submit your course assignments"
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: assignments.length, color: '#007991', bg: '#e0f6ff' },
          { label: 'Pending', value: assignments.filter(a => ['pending', 'resubmit'].includes(a.status)).length, color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Submitted', value: assignments.filter(a => a.status === 'submitted').length, color: '#3B82F6', bg: '#DBEAFE' },
          { label: 'Graded', value: assignments.filter(a => a.status === 'graded').length, color: '#10B981', bg: '#D1FAE5' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#667085] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-5">
        {FILTER_TABS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${filter === t.key ? 'bg-white text-[#007991] shadow-sm' : 'text-[#667085] hover:text-[#1F2933]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<IconClipboard size={28} />} title="No assignments found" description="There are no assignments matching the selected filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map(asgn => {
            const days = getDaysRemaining(asgn.dueDate);
            const isExpanded = expanded === asgn.id;
            const isUrgent = days <= 2 && ['pending', 'resubmit'].includes(asgn.status);
            const pct = asgn.marksObtained != null ? Math.round((asgn.marksObtained / asgn.maxMarks) * 100) : null;

            return (
              <div
                key={asgn.id}
                className={`bg-white rounded-2xl border overflow-hidden ${isUrgent ? 'border-l-4 border-l-[#EF4444] border-[#E5E7EB]' : 'border-[#E5E7EB]'}`}
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : asgn.id)}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${asgn.status === 'graded' ? 'bg-[#D1FAE5] text-[#10B981]' : isUrgent ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#e0f6ff] text-[#007991]'}`}>
                    {asgn.status === 'graded' ? <IconCheck size={18} /> : isUrgent ? <IconAlertTriangle size={18} /> : <IconClipboard size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h3 className="text-sm font-bold text-[#1F2933] flex-1">{asgn.title}</h3>
                      <StatusBadge status={asgn.status} />
                    </div>
                    <p className="text-xs text-[#667085] mt-0.5">{asgn.courseTitle} · {asgn.trainerName}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-[#667085] flex items-center gap-1">
                        <IconClock size={11} />
                        Due: {new Date(asgn.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {days > 0 && ['pending', 'resubmit'].includes(asgn.status) && (
                          <span className={`ml-1 font-semibold ${isUrgent ? 'text-[#EF4444]' : 'text-[#007991]'}`}>({days}d left)</span>
                        )}
                      </span>
                      <span className="text-xs text-[#9BA3AF]">Max: {asgn.maxMarks} marks</span>
                      {pct !== null && (
                        <span className={`text-xs font-bold ${pct >= 80 ? 'text-[#10B981]' : pct >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                          Score: {asgn.marksObtained}/{asgn.maxMarks} ({pct}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[#F2F4F6] pt-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider mb-1">Instructions</p>
                      <p className="text-sm text-[#374151] leading-relaxed">{asgn.description}</p>
                    </div>
                    {asgn.feedback && (
                      <div className="p-4 bg-[#f0fbff] rounded-xl border border-[#b1ebff]">
                        <p className="text-xs font-bold text-[#005f72] uppercase tracking-wider mb-1">Trainer Feedback</p>
                        <p className="text-sm text-[#1F2933]">{asgn.feedback}</p>
                      </div>
                    )}
                    {['pending', 'resubmit'].includes(asgn.status) && (
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="cta"
                          size="sm"
                          icon={<IconUpload size={14} />}
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenSubmit(asgn);
                          }}
                        >
                          Submit Assignment
                        </Button>
                      </div>
                    )}
                    {asgn.status === 'submitted' && (
                      <div className="flex items-center gap-2 p-3 bg-[#DBEAFE] rounded-xl">
                        <IconCheck size={14} className="text-[#3B82F6]" />
                        <p className="text-xs text-[#1E40AF]">
                          Submitted on {asgn.submittedDate ? new Date(asgn.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'} · Awaiting grading by {asgn.trainerName}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={!!submittingAssignment}
        onClose={() => setSubmittingAssignment(null)}
        title="Submit Assignment"
        description={submittingAssignment ? `${submittingAssignment.title} (${submittingAssignment.courseTitle})` : ''}
        size="md"
      >
        <form onSubmit={handleSubmitAssignment} className="space-y-4">
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {submitError}
            </div>
          )}

          {/* Tab Selector: File Upload vs Link */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => {
                setSubmissionTab('file');
                setSubmitError('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                submissionTab === 'file' ? 'bg-white text-[#007991] shadow-xs' : 'text-slate-600'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmissionTab('link');
                setSubmitError('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                submissionTab === 'link' ? 'bg-white text-[#007991] shadow-xs' : 'text-slate-600'
              }`}
            >
              External Link
            </button>
          </div>

          {submissionTab === 'file' ? (
            <div className="space-y-2">
              <label htmlFor="file-upload-input" className="block text-xs font-semibold text-slate-700">
                Assignment Deliverable (PDF, DOCX, ZIP up to 50MB)
              </label>
              <div
                onClick={() => document.getElementById('file-upload-input')?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#007991] rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-[#f0fbff] transition-all"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-200/80 text-[#007991] flex items-center justify-center mb-2">
                  <IconUpload size={20} />
                </div>
                {mockFileName ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-sm">
                    <IconFileText size={16} />
                    <span>{mockFileName}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-700">Click to browse or drag file here</p>
                    <p className="text-[11px] text-slate-400 mt-1">Supported: .pdf, .docx, .zip, .fig</p>
                  </>
                )}
                <input
                  id="file-upload-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="submission-link-input" className="block text-xs font-semibold text-slate-700">
                Project or Document URL
              </label>
              <div className="relative">
                <IconLink size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="submission-link-input"
                  type="url"
                  value={submissionLink}
                  onChange={e => {
                    setSubmissionLink(e.target.value);
                    if (submitError) setSubmitError('');
                  }}
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
                />
              </div>
            </div>
          )}

          {/* Student Notes */}
          <div>
            <label htmlFor="student-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Notes for Trainer (Optional)
            </label>
            <textarea
              id="student-notes"
              rows={3}
              value={studentNotes}
              onChange={e => setStudentNotes(e.target.value)}
              placeholder="Add any context or questions regarding this submission..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubmittingAssignment(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cta"
              loading={isSubmitting}
              icon={<IconCheck size={14} />}
            >
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
