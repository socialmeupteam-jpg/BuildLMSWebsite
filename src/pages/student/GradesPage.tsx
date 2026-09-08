import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { STUDENT_GRADES } from '../../data/mockData';

function GradeCircle({ grade, pct }: { grade: string; pct: number }) {
  const color = pct >= 90 ? '#10B981' : pct >= 75 ? '#007991' : pct >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ borderColor: color, color }}>
      {grade}
    </div>
  );
}

export default function GradesPage() {
  const [filter, setFilter] = useState('all');

  const avgPct = Math.round(STUDENT_GRADES.reduce((s, g) => s + g.percentage, 0) / STUDENT_GRADES.length);
  const highestPct = Math.max(...STUDENT_GRADES.map(g => g.percentage));
  const totalMarks = STUDENT_GRADES.reduce((s, g) => s + g.marksObtained, 0);
  const totalMax = STUDENT_GRADES.reduce((s, g) => s + g.maxMarks, 0);

  const grades = filter === 'all' ? STUDENT_GRADES : STUDENT_GRADES.filter(g => g.type === filter);

  return (
    <DashboardLayout>
      <PageHeader title="Grades & Results" subtitle="Your academic performance across all assessments" />

      {/* Grade summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Average Score', value: `${avgPct}%`, color: '#007991', bg: '#e0f6ff' },
          { label: 'Highest Score', value: `${highestPct}%`, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Total Marks', value: `${totalMarks}/${totalMax}`, color: '#1F2933', bg: '#F3F4F6' },
          { label: 'Assessments', value: STUDENT_GRADES.length, color: '#FF9635', bg: '#fff3e6' },
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
        <p className="text-xs text-[#9BA3AF] mt-2">Combined score: {totalMarks} out of {totalMax} marks</p>
      </div>

      {/* Filter + table */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-4">
        {[{ key: 'all', label: 'All' }, { key: 'assignment', label: 'Assignments' }, { key: 'quiz', label: 'Quizzes' }, { key: 'exam', label: 'Exams' }].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === t.key ? 'bg-white text-[#007991] shadow-sm' : 'text-[#667085] hover:text-[#1F2933]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <SectionCard>
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
            </tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr key={g.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <GradeCircle grade={g.grade} pct={g.percentage} />
                    <div>
                      <p className="font-semibold text-[#1F2933]">{g.title}</p>
                      {g.feedback && <p className="text-[10px] text-[#9BA3AF] truncate max-w-[200px]">{g.feedback.slice(0, 50)}…</p>}
                    </div>
                  </div>
                </td>
                <td className="text-xs text-[#667085]">{g.course.split(' ').slice(0, 3).join(' ')}</td>
                <td><Badge variant={g.type === 'exam' ? 'error' : g.type === 'quiz' ? 'info' : 'teal'}>{g.type}</Badge></td>
                <td className="text-xs text-[#667085]">{new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                <td>
                  <span className="font-semibold text-[#1F2933]">{g.marksObtained}</span>
                  <span className="text-[#9BA3AF]">/{g.maxMarks}</span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${g.percentage >= 90 ? 'text-[#10B981]' : g.percentage >= 75 ? 'text-[#007991]' : g.percentage >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                      {g.percentage}%
                    </span>
                  </div>
                </td>
                <td><StatusBadge status={g.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </DashboardLayout>
  );
}
