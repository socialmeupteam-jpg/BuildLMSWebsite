import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { useApp } from '../../contexts/AppContext';
import {
  IconSettings, IconBook, IconMail, IconShield,
  IconCheckCircle, IconLock, IconUsers, IconAward
} from '../../components/Icons';

type TabKey = 'general' | 'academic' | 'branding' | 'notifications' | 'roles' | 'security';

export default function SettingsPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // Academy General Settings
  const [generalForm, setGeneralForm] = useState({
    academyName: 'SocialMeUp Digital Academy',
    supportEmail: 'support@socialmeup.in',
    supportPhone: '+91 98765 43210',
    address: 'Level 4, Pinnacle Tech Towers, Powai, Mumbai 400076',
    gstin: '27AABCS1429R1Z4',
    website: 'https://socialmeup.in',
  });

  // Academic Settings
  const [academicForm, setAcademicForm] = useState({
    currentTerm: 'Academic Year 2024–25 (Winter Term)',
    attendanceThreshold: 75,
    minPassGrade: 60,
    allowLateSubmissions: true,
    latePenaltyPercent: 5,
  });

  // Notification Settings
  const [notifSettings, setNotifSettings] = useState({
    emailAlertsOnTicket: true,
    smsOnStudentAbsence: true,
    weeklyDigestToParents: true,
    whatsappFeeReminders: true,
  });

  // Security Settings
  const [securityForm, setSecurityForm] = useState({
    enforceMfaForStaff: false,
    sessionTimeoutMinutes: 60,
    passwordExpiryDays: 90,
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Academy Info Saved',
      message: 'Institutional identity settings updated.',
      type: 'success',
    });
  };

  const handleSaveAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Academic Policies Saved',
      message: 'Attendance threshold & grading criteria configured.',
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Institutional System Settings"
        subtitle="Configure academy identity, academic policies, communications, and access control"
      />

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2 mb-6 shadow-xs flex flex-wrap gap-2">
        {[
          { id: 'general', label: 'Academy Profile', icon: <IconBook size={16} /> },
          { id: 'academic', label: 'Academic Policies', icon: <IconAward size={16} /> },
          { id: 'notifications', label: 'Notification Rules', icon: <IconMail size={16} /> },
          { id: 'roles', label: 'Roles & Permissions', icon: <IconUsers size={16} /> },
          { id: 'security', label: 'System Security', icon: <IconShield size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabKey)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#007991] text-white shadow-xs'
                : 'text-[#667085] hover:bg-[#F7F9FA] hover:text-[#1F2933]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Panes */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <SectionCard title="Academy Legal & Operational Profile" subtitle="Public institute details across invoices and parent portal">
            <form onSubmit={handleSaveGeneral} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Institution Legal Name</label>
                  <input
                    type="text"
                    value={generalForm.academyName}
                    onChange={e => setGeneralForm(f => ({ ...f, academyName: e.target.value }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={generalForm.gstin}
                    onChange={e => setGeneralForm(f => ({ ...f, gstin: e.target.value }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Primary Support Email</label>
                  <input
                    type="email"
                    value={generalForm.supportEmail}
                    onChange={e => setGeneralForm(f => ({ ...f, supportEmail: e.target.value }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Support Phone Helpline</label>
                  <input
                    type="text"
                    value={generalForm.supportPhone}
                    onChange={e => setGeneralForm(f => ({ ...f, supportPhone: e.target.value }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Campus Physical Address</label>
                <textarea
                  rows={3}
                  value={generalForm.address}
                  onChange={e => setGeneralForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
                <Button variant="cta" type="submit">
                  Save General Settings
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        {activeTab === 'academic' && (
          <SectionCard title="Academic Policies & Standards" subtitle="Configure minimum thresholds for certification eligibility">
            <form onSubmit={handleSaveAcademic} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Current Academic Term / Calendar</label>
                <input
                  type="text"
                  value={academicForm.currentTerm}
                  onChange={e => setAcademicForm(f => ({ ...f, currentTerm: e.target.value }))}
                  className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Minimum Attendance Threshold (%)</label>
                  <input
                    type="number"
                    value={academicForm.attendanceThreshold}
                    onChange={e => setAcademicForm(f => ({ ...f, attendanceThreshold: Number(e.target.value) }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                  <span className="text-[11px] text-[#667085]">Students below this will trigger parent alert notices.</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Minimum Passing Grade (%)</label>
                  <input
                    type="number"
                    value={academicForm.minPassGrade}
                    onChange={e => setAcademicForm(f => ({ ...f, minPassGrade: Number(e.target.value) }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                  <span className="text-[11px] text-[#667085]">Required for certificate issuance and agency placement.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
                <Button variant="cta" type="submit">
                  Save Academic Policies
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        {activeTab === 'notifications' && (
          <SectionCard title="Automated Communication & Notification Rules" subtitle="Control SMS, email, and WhatsApp dispatch conditions">
            <div className="p-6 space-y-4">
              {[
                { key: 'emailAlertsOnTicket', label: 'Email Admin on Urgent Support Ticket', desc: 'Dispatches instant alert to operations whenever high priority ticket is lodged' },
                { key: 'smsOnStudentAbsence', label: 'SMS Absence Alert to Parents', desc: 'Sends immediate SMS to primary guardian if student misses 2 consecutive live sessions' },
                { key: 'weeklyDigestToParents', label: 'Weekly Performance Digest', desc: 'Emails parents every Sunday with attendance and assignment marks summary' },
                { key: 'whatsappFeeReminders', label: 'WhatsApp Fee Installment Reminders', desc: 'Automated 5-day and 1-day reminders before upcoming payment due date' },
              ].map(item => (
                <label key={item.key} className="flex items-start gap-3 p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E7EB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(notifSettings as any)[item.key]}
                    onChange={e => setNotifSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="mt-0.5 accent-[#007991] w-4 h-4 rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1F2933]">{item.label}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5">{item.desc}</p>
                  </div>
                </label>
              ))}

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
                <Button
                  variant="cta"
                  onClick={() =>
                    addToast({
                      title: 'Notification Rules Saved',
                      message: 'Automated message rules applied across SMS and Email gateways.',
                      type: 'success',
                    })
                  }
                >
                  Save Notification Rules
                </Button>
              </div>
            </div>
          </SectionCard>
        )}

        {activeTab === 'roles' && (
          <SectionCard title="Role-Based Access Overview" subtitle="System privileges per user role">
            <div className="p-6 space-y-4 text-xs">
              <div className="overflow-x-auto">
                <table className="lms-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Curriculum & Classes</th>
                      <th>Fee Management</th>
                      <th>Attendance</th>
                      <th>Support / Grievances</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold text-[#007991]">Admin / Director</td>
                      <td>Full CRUD Access</td>
                      <td>Full Reconcile & Invoicing</td>
                      <td>Academy-Wide Audits</td>
                      <td>Full Management & Escalation</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#FF9635]">Trainer / Mentor</td>
                      <td>View & Upload Lessons</td>
                      <td>No Access</td>
                      <td>Mark Assigned Batches</td>
                      <td>View & Respond to Doubts</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#10B981]">Student</td>
                      <td>View & Submit Projects</td>
                      <td>View Invoices & Pay Online</td>
                      <td>View Own Record</td>
                      <td>Raise & Track Tickets</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#6B7280]">Parent / Guardian</td>
                      <td>View Syllabus Progress</td>
                      <td>View Invoices & Receipts</td>
                      <td>Monitor Ward Attendance</td>
                      <td>Direct Staff Messaging</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        )}

        {activeTab === 'security' && (
          <SectionCard title="Platform Security & Session Rules" subtitle="Session durability and password compliance policies">
            <div className="p-6 space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Session Inactivity Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={securityForm.sessionTimeoutMinutes}
                    onChange={e => setSecurityForm(f => ({ ...f, sessionTimeoutMinutes: Number(e.target.value) }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-1">Force Password Rotation (Days)</label>
                  <input
                    type="number"
                    value={securityForm.passwordExpiryDays}
                    onChange={e => setSecurityForm(f => ({ ...f, passwordExpiryDays: Number(e.target.value) }))}
                    className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
                <Button
                  variant="cta"
                  onClick={() =>
                    addToast({
                      title: 'Security Policy Applied',
                      message: 'Global timeout and authentication rules updated.',
                      type: 'success',
                    })
                  }
                >
                  Save Security Policies
                </Button>
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </DashboardLayout>
  );
}
