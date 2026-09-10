import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { STUDENT_GRADES } from '../../data/mockData';
import {
  IconAward, IconTrendingUp, IconFileText, IconCheckCircle,
  IconClock, IconDownload, IconExternalLink
} from '../../components/Icons';

const LINKED_CHILDREN = [
  { id: 's-1', name: 'Rahul Sharma', cohort: 'Digital Marketing Mastery (DMM-Feb-2024)', roll: 'SMA-2024-0042' },
];

export default function ParentGradesPage() {
  const { addToast } = useApp();
  const [selectedChild] = useState(LINKED_CHILDREN[0]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'assignment' | 'quiz' | 'project'>('all');
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);

  const filteredGrades = STUDENT_GRADES.filter(g => {
    if (typeFilter === 'all') return true;
    return g.type === typeFilter;
  });

  const avgScore = Math.round(
    STUDENT_GRADES.reduce((acc, g) => acc + g.percentage, 0) / STUDENT_GRADES.length
  );

  const handleDownloadTranscript = () => {
    addToast({
      title: 'Generating Official Transcript',
      message: `PDF transcript for ${selectedChild.name} downloaded successfully.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Grades & Performance Reports"
          subtitle={`Academic achievements, assessments, and trainer evaluations for ${selectedChild.name}`}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<IconFileText size={16} />}
            onClick={() => setIsReportCardOpen(true)}
          >
            Term Report Card
          </Button>
          <Button
            variant="primary"
            icon={<IconDownload size={16} />}
            onClick={handleDownloadTranscript}
          >
            Download Transcript
          </Button>
        </div>
      </div>

      {/* Child selector header banner */}
      <div className="flex items-center gap-3 mb-6 p-3.5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
        <span className="text-xs font-semibold text-[#667085]">Student Profile:</span>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#e0f6ff] text-[#005f72] text-xs font-bold border border-[#b1ebff]">
          <span className="w-2 h-2 rounded-full bg-[#007991]" />
          {selectedChild.name} ({selectedChild.roll})
        </div>
        <span className="text-xs text-[#9BA3AF] ml-auto hidden md:inline">
          {selectedChild.cohort}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Overall Average"
          value={`${avgScore}%`}
          subtitle="Grade A Equivalent"
          icon={<IconAward size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Class Standing"
          value="Top 10%"
          subtitle="Ranked 4th of 40 in cohort"
          icon={<IconTrendingUp size={20} />}
          iconBg="#E6F4F6"
          iconColor="#007991"
        />
        <StatCard
          title="Assessments Completed"
          value={STUDENT_GRADES.length}
          subtitle="Assignments, Quizzes & Projects"
          icon={<IconCheckCircle size={20} />}
          iconBg="#D1FAE5"
          iconColor="#10B981"
        />
        <StatCard
          title="Trainer Remarks"
          value="Exceptional"
          subtitle="Exemplary campaign design"
          icon={<IconFileText size={20} />}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
        />
      </div>

      {/* Subject Performance and Trainer Remarks */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="Assessment Records"
            subtitle="Grades obtained in quizzes, practical briefs, and mid-term projects"
            action={
              <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl text-xs">
                {(['all', 'assignment', 'quiz', 'project'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setTypeFilter(tab)}
                    className={`px-3 py-1 rounded-lg font-semibold capitalize cursor-pointer transition-all ${
                      typeFilter === tab ? 'bg-white text-[#007991] shadow-xs' : 'text-[#667085]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Course</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map(g => (
                    <tr key={g.id} className="hover:bg-[#F7F9FA]">
                      <td>
                        <p className="text-sm font-semibold text-[#1F2933]">{g.title}</p>
                        {g.feedback && (
                          <p className="text-xs text-[#007991] mt-0.5">Note: "{g.feedback}"</p>
                        )}
                      </td>
                      <td className="text-xs text-[#667085]">{g.course}</td>
                      <td>
                        <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4F6] text-[#4B5563]">
                          {g.type}
                        </span>
                      </td>
                      <td className="font-bold text-xs">
                        {g.marksObtained} / {g.maxMarks}
                      </td>
                      <td>
                        <span
                          className={`font-bold text-xs ${
                            g.percentage >= 90
                              ? 'text-emerald-600'
                              : g.percentage >= 75
                              ? 'text-[#007991]'
                              : 'text-amber-600'
                          }`}
                        >
                          {g.grade} ({g.percentage}%)
                        </span>
                      </td>
                      <td className="text-xs text-[#9BA3AF]">
                        {new Date(g.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Remarks and Skill Breakdown */}
        <div className="space-y-6">
          <SectionCard title="Lead Trainer Feedback" subtitle="Instructor Ankit Verma (DMM-Feb-2024)">
            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-[#f0fbff] border border-[#b1ebff] rounded-2xl">
                <p className="font-bold text-[#005f72] text-sm mb-1">Trainer Observation</p>
                <p className="text-[#374151] leading-relaxed">
                  "Rahul has displayed keen analytical aptitude in Google Ads keyword clustering and Meta ROAS optimization. His project presentation demonstrated professional agency-level readiness. Continuing this diligence will yield top honors."
                </p>
                <p className="text-[10px] text-[#9BA3AF] mt-3">Evaluated: Dec 10, 2024</p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="font-bold text-[#1F2933]">Skill Competency Benchmarks</p>
                {[
                  { skill: 'Search Engine Marketing', val: 92 },
                  { skill: 'Performance Advertising', val: 88 },
                  { skill: 'Social Strategy & Content', val: 85 },
                  { skill: 'Data Analytics & Reporting', val: 94 },
                ].map(item => (
                  <div key={item.skill}>
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="text-[#667085]">{item.skill}</span>
                      <span className="font-bold text-[#007991]">{item.val}%</span>
                    </div>
                    <ProgressBar value={item.val} height={5} />
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Report Card Modal */}
      <Modal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        title="Mid-Term Performance Report Card"
        size="lg"
      >
        <div className="space-y-5 p-2 text-xs">
          <div className="p-4 bg-[#F7F9FA] rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-[#1F2933]">{selectedChild.name}</h4>
              <p className="text-xs text-[#667085]">Roll: {selectedChild.roll} • {selectedChild.cohort}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-600">Grade: A (87.5%)</span>
              <p className="text-[10px] text-[#9BA3AF]">Academic Year 2024–2025</p>
            </div>
          </div>

          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Subject / Module</th>
                  <th>Maximum</th>
                  <th>Obtained</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Digital Marketing Foundations</td>
                  <td>100</td>
                  <td className="font-bold text-[#007991]">92</td>
                  <td><span className="text-emerald-600 font-bold">Passed</span></td>
                </tr>
                <tr>
                  <td className="font-semibold">Search Engine Optimization (SEO)</td>
                  <td>100</td>
                  <td className="font-bold text-[#007991]">88</td>
                  <td><span className="text-emerald-600 font-bold">Passed</span></td>
                </tr>
                <tr>
                  <td className="font-semibold">Google Ads & Performance Marketing</td>
                  <td>100</td>
                  <td className="font-bold text-[#007991]">85</td>
                  <td><span className="text-emerald-600 font-bold">Passed</span></td>
                </tr>
                <tr>
                  <td className="font-semibold">Social Media Brand Architecture</td>
                  <td>100</td>
                  <td className="font-bold text-[#007991]">85</td>
                  <td><span className="text-emerald-600 font-bold">Passed</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#E6F4F6] text-[#005f72] rounded-xl flex items-center justify-between">
            <span className="font-semibold">Certified by Academy Examination Board</span>
            <Button variant="cta" size="sm" onClick={handleDownloadTranscript}>
              Print Official PDF
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
