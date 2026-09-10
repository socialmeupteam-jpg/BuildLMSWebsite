import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import { useApp } from '../../contexts/AppContext';
import { BATCHES, ADMIN_STUDENTS } from '../../data/mockData';
import {
  IconFileText, IconDownload, IconSearch, IconCalendar,
  IconAward, IconUsers, IconCreditCard, IconCheckCircle
} from '../../components/Icons';

type ReportType = 'attendance' | 'financial' | 'grades' | 'enrollment';

export default function ReportsPage() {
  const { addToast } = useApp();
  const [reportType, setReportType] = useState<ReportType>('attendance');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState('Current Term (Q4 2024)');

  const handleExportCSV = () => {
    addToast({
      title: 'Report Export Initiated',
      message: `${reportType.toUpperCase()} report compiled and downloaded as CSV.`,
      type: 'success',
    });
  };

  const handleExportPDF = () => {
    addToast({
      title: 'Executive PDF Generated',
      message: 'Official academic report rendered with institutional letterhead.',
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Academy Analytics & Compliance Reports"
          subtitle="Generate audit-ready attendance summaries, financial reconciliations, and academic transcripts"
        />
        <div className="flex gap-2">
          <Button variant="outline" icon={<IconDownload size={16} />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" icon={<IconFileText size={16} />} onClick={handleExportPDF}>
            Download PDF Summary
          </Button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2 mb-6 shadow-xs flex flex-wrap gap-2">
        {[
          { id: 'attendance', label: 'Attendance & Punctuality', icon: <IconCalendar size={16} /> },
          { id: 'financial', label: 'Financial & Fee Audit', icon: <IconCreditCard size={16} /> },
          { id: 'grades', label: 'Assessment & GPA Analytics', icon: <IconAward size={16} /> },
          { id: 'enrollment', label: 'Cohort Enrollment & Capacity', icon: <IconUsers size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as ReportType)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === tab.id
                ? 'bg-[#007991] text-white shadow-xs'
                : 'text-[#667085] hover:bg-[#F7F9FA] hover:text-[#1F2933]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#667085]">Filter Cohort:</span>
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              <option value="all">All Academy Cohorts</option>
              {BATCHES.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#667085]">Date Range:</span>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              <option value="Current Term (Q4 2024)">Current Term (Q4 2024)</option>
              <option value="Previous Term (Q3 2024)">Previous Term (Q3 2024)</option>
              <option value="Fiscal Year 2023-24">Fiscal Year 2023-24</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-[#9BA3AF]">
          Generated on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* KPI Cards based on selected report */}
      {reportType === 'attendance' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Overall Attendance" value="88.4%" subtitle="Academy-wide average" icon={<IconCheckCircle size={20} />} iconBg="#D1FAE5" iconColor="#10B981" />
          <StatCard title="Total Sessions Held" value="142" subtitle="Lecture & practical labs" icon={<IconCalendar size={20} />} iconBg="#e0f6ff" iconColor="#007991" />
          <StatCard title="At-Risk Absentees" value="4" subtitle="Below 75% threshold" icon={<IconUsers size={20} />} iconBg="#FEE2E2" iconColor="#EF4444" />
          <StatCard title="Perfect Attendance" value="18" subtitle="100% record" icon={<IconAward size={20} />} iconBg="#FEF3C7" iconColor="#F59E0B" />
        </div>
      )}

      {reportType === 'financial' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Gross Fee Invoiced" value="₹16.5L" subtitle="Across all programs" icon={<IconCreditCard size={20} />} iconBg="#e0f6ff" iconColor="#007991" />
          <StatCard title="Total Reconciled" value="₹14.2L" subtitle="86% clearance rate" icon={<IconCheckCircle size={20} />} iconBg="#D1FAE5" iconColor="#10B981" />
          <StatCard title="Active Receivables" value="₹1.8L" subtitle="Scheduled installments" icon={<IconCalendar size={20} />} iconBg="#FEF3C7" iconColor="#F59E0B" />
          <StatCard title="Overdue Defaulters" value="₹50k" subtitle="Urgent notice sent" icon={<IconFileText size={20} />} iconBg="#FEE2E2" iconColor="#EF4444" />
        </div>
      )}

      {reportType === 'grades' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Class Median Score" value="84.2%" subtitle="Practical + Theory" icon={<IconAward size={20} />} iconBg="#e0f6ff" iconColor="#007991" />
          <StatCard title="Distinction (A+)" value="12 Students" subtitle="Scoring ≥90%" icon={<IconCheckCircle size={20} />} iconBg="#D1FAE5" iconColor="#10B981" />
          <StatCard title="Pass Rate" value="98%" subtitle="Eligible for internship" icon={<IconUsers size={20} />} iconBg="#FEF3C7" iconColor="#F59E0B" />
          <StatCard title="Evaluations Completed" value="86" subtitle="Assignments marked" icon={<IconFileText size={20} />} iconBg="#fff3e6" iconColor="#FF9635" />
        </div>
      )}

      {reportType === 'enrollment' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Students" value={ADMIN_STUDENTS.length} subtitle="Active enrollments" icon={<IconUsers size={20} />} iconBg="#e0f6ff" iconColor="#007991" />
          <StatCard title="Total Batches" value={BATCHES.length} subtitle="3 active, 1 upcoming" icon={<IconCalendar size={20} />} iconBg="#D1FAE5" iconColor="#10B981" />
          <StatCard title="Seat Utilization" value="84%" subtitle="Optimal classroom density" icon={<IconCheckCircle size={20} />} iconBg="#FEF3C7" iconColor="#F59E0B" />
          <StatCard title="Retention Rate" value="96.5%" subtitle="Course completion" icon={<IconAward size={20} />} iconBg="#fff3e6" iconColor="#FF9635" />
        </div>
      )}

      {/* Main Report Table */}
      <SectionCard
        title={`Detailed Breakdown: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Ledger`}
        subtitle={`Audit dataset for ${dateRange}`}
      >
        <div className="overflow-x-auto">
          <table className="lms-table">
            <thead>
              {reportType === 'attendance' && (
                <tr>
                  <th>Student Name</th>
                  <th>Cohort</th>
                  <th>Total Classes</th>
                  <th>Attended</th>
                  <th>Absences</th>
                  <th>Attendance %</th>
                  <th>Compliance</th>
                </tr>
              )}
              {reportType === 'financial' && (
                <tr>
                  <th>Student</th>
                  <th>Cohort</th>
                  <th>Total Fee</th>
                  <th>Amount Paid</th>
                  <th>Pending Balance</th>
                  <th>Last Payment</th>
                  <th>Status</th>
                </tr>
              )}
              {reportType === 'grades' && (
                <tr>
                  <th>Student</th>
                  <th>Cohort</th>
                  <th>Assignments (40%)</th>
                  <th>Quizzes (20%)</th>
                  <th>Capstone (40%)</th>
                  <th>Composite Score</th>
                  <th>Grade</th>
                </tr>
              )}
              {reportType === 'enrollment' && (
                <tr>
                  <th>Cohort Code</th>
                  <th>Course Title</th>
                  <th>Lead Trainer</th>
                  <th>Enrollments</th>
                  <th>Max Capacity</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {reportType === 'attendance' &&
                ADMIN_STUDENTS.map(s => (
                  <tr key={s.id} className="hover:bg-[#F7F9FA]">
                    <td className="font-semibold text-[#1F2933]">{s.name}</td>
                    <td className="text-[#667085]">{s.batch}</td>
                    <td>24</td>
                    <td>{Math.round((s.attendance / 100) * 24)}</td>
                    <td>{24 - Math.round((s.attendance / 100) * 24)}</td>
                    <td className={`font-bold ${s.attendance >= 75 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {s.attendance}%
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        s.attendance >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {s.attendance >= 75 ? 'Compliant' : 'Shortage Alert'}
                      </span>
                    </td>
                  </tr>
                ))}

              {reportType === 'financial' &&
                ADMIN_STUDENTS.map(s => (
                  <tr key={s.id} className="hover:bg-[#F7F9FA]">
                    <td className="font-semibold text-[#1F2933]">{s.name}</td>
                    <td className="text-[#667085]">{s.batch}</td>
                    <td>₹15,000</td>
                    <td className="text-emerald-600 font-bold">₹10,000</td>
                    <td className="text-amber-600 font-bold">₹5,000</td>
                    <td className="text-[#667085]">Nov 15, 2024</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                        Partial
                      </span>
                    </td>
                  </tr>
                ))}

              {reportType === 'grades' &&
                ADMIN_STUDENTS.map(s => (
                  <tr key={s.id} className="hover:bg-[#F7F9FA]">
                    <td className="font-semibold text-[#1F2933]">{s.name}</td>
                    <td className="text-[#667085]">{s.batch}</td>
                    <td>88%</td>
                    <td>85%</td>
                    <td>{s.avgGrade}%</td>
                    <td className="font-bold text-[#007991]">{s.avgGrade}%</td>
                    <td>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#E6F4F6] text-[#007991]">
                        {s.gradeLabel}
                      </span>
                    </td>
                  </tr>
                ))}

              {reportType === 'enrollment' &&
                BATCHES.map(b => (
                  <tr key={b.id} className="hover:bg-[#F7F9FA]">
                    <td className="font-mono text-xs font-bold text-[#007991]">{b.name}</td>
                    <td className="font-semibold text-[#1F2933]">{b.courseTitle}</td>
                    <td className="text-[#667085]">{b.trainerName}</td>
                    <td className="font-bold text-[#1F2933]">{b.studentsCount}</td>
                    <td className="text-[#9BA3AF]">{b.maxCapacity}</td>
                    <td className="font-bold text-emerald-600">
                      {Math.round((b.studentsCount / b.maxCapacity) * 100)}%
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 capitalize">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </DashboardLayout>
  );
}
