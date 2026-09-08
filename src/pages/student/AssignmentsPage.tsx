import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { STUDENT_ASSIGNMENTS } from '../../data/mockData';
import { IconClipboard, IconUpload, IconAlertTriangle, IconCheck, IconClock } from '../../components/Icons';
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
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = STUDENT_ASSIGNMENTS.filter(a =>
    filter === 'all' ? true :
    filter === 'pending' ? ['pending', 'resubmit', 'late'].includes(a.status) :
    a.status === filter
  );

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
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
          { label: 'Total', value: STUDENT_ASSIGNMENTS.length, color: '#007991', bg: '#e0f6ff' },
          { label: 'Pending', value: STUDENT_ASSIGNMENTS.filter(a => ['pending', 'resubmit'].includes(a.status)).length, color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Submitted', value: STUDENT_ASSIGNMENTS.filter(a => a.status === 'submitted').length, color: '#3B82F6', bg: '#DBEAFE' },
          { label: 'Graded', value: STUDENT_ASSIGNMENTS.filter(a => a.status === 'graded').length, color: '#10B981', bg: '#D1FAE5' },
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
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === t.key ? 'bg-white text-[#007991] shadow-sm' : 'text-[#667085] hover:text-[#1F2933]'}`}>
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
                className={`bg-white rounded-2xl border overflow-hidden card-lift ${isUrgent ? 'border-l-4 border-l-[#EF4444] border-[#E5E7EB]' : 'border-[#E5E7EB]'}`}
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : asgn.id)}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${asgn.status === 'graded' ? 'bg-[#D1FAE5] text-[#10B981]' : isUrgent ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#e0f6ff] text-[#007991]'}`}>
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
                        <Button variant="cta" size="sm" icon={<IconUpload size={14} />} onClick={() => addToast({ type: 'success', title: 'Submission ready', message: 'File upload dialog opening…' })}>
                          Submit Assignment
                        </Button>
                        <Button variant="outline" size="sm">View Resources</Button>
                      </div>
                    )}
                    {asgn.status === 'submitted' && (
                      <div className="flex items-center gap-2 p-3 bg-[#DBEAFE] rounded-xl">
                        <IconCheck size={14} className="text-[#3B82F6]" />
                        <p className="text-xs text-[#1E40AF]">
                          Submitted on {asgn.submittedDate ? new Date(asgn.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'} · Awaiting grading
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
    </DashboardLayout>
  );
}
