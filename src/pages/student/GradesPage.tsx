import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { STUDENT_GRADES } from '../../data/mockData';
import { IconDownload, IconCheckCircle, IconEye, IconRefreshCw } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

function GradeCircle({ grade, pct }: { grade: string; pct: number }) {
  const color = pct >= 90 ? '#10B981' : pct >= 75 ? '#007991' : pct >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0" style={{ borderColor: color, color }}>
      {grade}
    </div>
  );
}

export default function GradesPage() {
  const { addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState<typeof STUDENT_GRADES[0] | null>(null);
  const [isReevalRequested, setIsReevalRequested] = useState<Record<string, boolean>>({});

  const avgPct = Math.round(STUDENT_GRADES.reduce((s, g) => s + g.percentage, 0) / STUDENT_GRADES.length);
  const highestPct = Math.max(...STUDENT_GRADES.map(g => g.percentage));
  const totalMarks = STUDENT_GRADES.reduce((s, g) => s + g.marksObtained, 0);
  const totalMax = STUDENT_GRADES.reduce((s, g) => s + g.maxMarks, 0);

  const grades = filter === 'all' ? STUDENT_GRADES : STUDENT_GRADES.filter(g => g.type === filter);

  const handleRequestReevaluation = (id: string, title: string) => {
    setIsReevalRequested(prev => ({ ...prev, [id]: true }));
    addToast({
      title: 'Re-evaluation Requested',
      message: `Your re-evaluation request for "${title}" has been submitted to the academic board.`,
      type: 'info',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Grades & Results"
        subtitle="Your academic performance, evaluation feedback, and grade card across all courses"
        action={
          <Button
            variant="cta"
            size="sm"
            icon={<IconDownload size={14} />}
            onClick={() =>
              addToast({
                type: 'success',
                title: 'Transcript Generated',
                message: 'Academic Grade Transcript (PDF) has been downloaded.',
              })
            }
          >
            Download Transcript
          </Button>
        }
      />

      {/* Grade summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Average Score', value: `${avgPct}%`, color: '#007991' },
          { label: 'Highest Score', value: `${highestPct}%`, color: '#10B981' },
          { label: 'Total Marks', value: `${totalMarks}/${totalMax}`, color: '#1F2933' },
          { label: 'Assessments Evaluated', value: STUDENT_GRADES.length, color: '#FF9635' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 text-center" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#667085] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 mb-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-[#1F2933]">Overall Academic Performance</p>
          <span className={`text-lg font-bold ${avgPct >= 90 ? 'text-[#10B981]' : avgPct >= 75 ? 'text-[#007991]' : avgPct >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
            {avgPct >= 90 ? 'A+' : avgPct >= 85 ? 'A' : avgPct >= 80 ? 'A-' : avgPct >= 75 ? 'B+' : 'B'}
          </span>
        </div>
        <ProgressBar
          value={avgPct}
          height={12}
          color={avgPct >= 75 ? '#007991' : '#EF4444'}
          bgColor={avgPct >= 75 ? '#E6F4F6' : '#FEE2E2'}
        />
        <p className="text-xs text-[#9BA3AF] mt-2">Combined cumulative score: {totalMarks} out of {totalMax} total marks</p>
      </div>

      {/* Filter + table */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-4">
        {[{ key: 'all', label: 'All' }, { key: 'assignment', label: 'Assignments' }, { key: 'quiz', label: 'Quizzes' }, { key: 'exam', label: 'Exams' }].map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              filter === t.key ? 'bg-white text-[#007991] shadow-xs' : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Course</th>
                <th>Type</th>
                <th>Date</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(g => (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <GradeCircle grade={g.grade} pct={g.percentage} />
                      <div>
                        <p className="font-semibold text-[#1F2933]">{g.title}</p>
                        {g.feedback && <p className="text-[10px] text-[#9BA3AF] truncate max-w-[200px]">{g.feedback.slice(0, 50)}…</p>}
                      </div>
                    </div>
                  </td>
                  <td className="text-xs text-[#667085]">{g.course}</td>
                  <td>
                    <Badge variant={g.type === 'exam' ? 'error' : g.type === 'quiz' ? 'info' : 'teal'}>
                      {g.type}
                    </Badge>
                  </td>
                  <td className="text-xs text-[#667085]">
                    {new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td>
                    <span className="font-semibold text-[#1F2933]">{g.marksObtained}</span>
                    <span className="text-[#9BA3AF]">/{g.maxMarks}</span>
                  </td>
                  <td>
                    <span className={`font-bold ${g.percentage >= 90 ? 'text-[#10B981]' : g.percentage >= 75 ? 'text-[#007991]' : g.percentage >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                      {g.percentage}%
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={g.status} />
                  </td>
                  <td className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<IconEye size={12} />}
                      onClick={() => setSelectedGrade(g)}
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Grade Details Modal */}
      <Modal
        isOpen={!!selectedGrade}
        onClose={() => setSelectedGrade(null)}
        title="Assessment Result & Feedback"
        description="Detailed score metrics and instructor remarks"
        size="md"
      >
        {selectedGrade && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{selectedGrade.title}</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">{selectedGrade.course}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#007991]">{selectedGrade.grade}</span>
                <p className="text-[10px] text-slate-500 font-semibold">{selectedGrade.percentage}% Score</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Marks Scored</p>
                <p className="text-base font-bold text-slate-800 mt-0.5">{selectedGrade.marksObtained} / {selectedGrade.maxMarks}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Category</p>
                <p className="text-base font-bold capitalize text-slate-800 mt-0.5">{selectedGrade.type}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
                <p className="text-slate-400 text-[10px] uppercase font-bold">Evaluated Date</p>
                <p className="text-xs font-bold text-slate-800 mt-1">
                  {new Date(selectedGrade.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
              <p className="text-xs font-bold text-amber-900 mb-1">Instructor Review & Feedback</p>
              <p className="text-slate-700 leading-relaxed text-xs">
                {selectedGrade.feedback || 'Excellent work demonstrated in this evaluation. Concepts and practical implementation thoroughly articulated with high accuracy.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={<IconRefreshCw size={12} />}
                disabled={isReevalRequested[selectedGrade.id]}
                onClick={() => handleRequestReevaluation(selectedGrade.id, selectedGrade.title)}
              >
                {isReevalRequested[selectedGrade.id] ? 'Re-evaluation In Review' : 'Request Re-evaluation'}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGrade(null)}
                >
                  Close
                </Button>
                <Button
                  variant="cta"
                  size="sm"
                  icon={<IconDownload size={13} />}
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Download Initiated',
                      message: `Report card for ${selectedGrade.title} downloaded.`,
                    });
                  }}
                >
                  Download Slip
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
