import DashboardLayout, { PageHeader } from '../components/layout/DashboardLayout';

const PAGE_META: Record<string, { title: string; subtitle: string; emoji: string }> = {
  'student-grievances':  { title: 'Support Tickets', subtitle: 'Create and track your support requests', emoji: '🎫' },
  'student-profile':     { title: 'Profile & Settings', subtitle: 'Manage your account and preferences', emoji: '👤' },
  'parent-attendance':   { title: "Child's Attendance", subtitle: 'View detailed attendance records', emoji: '📅' },
  'parent-grades':       { title: 'Progress & Grades', subtitle: "Your child's academic performance", emoji: '📊' },
  'parent-payments':     { title: 'Fees & Payments', subtitle: 'Manage fee payments for linked students', emoji: '💳' },
  'parent-messages':     { title: 'Messages', subtitle: 'Communicate with trainers and academy', emoji: '💬' },
  'parent-profile':      { title: 'Profile & Settings', subtitle: 'Manage your account and preferences', emoji: '👤' },
  'trainer-courses':     { title: 'My Batches', subtitle: 'View and manage your assigned batches', emoji: '📚' },
  'trainer-students':    { title: 'My Students', subtitle: 'Performance overview of all your students', emoji: '👨‍🎓' },
  'trainer-messages':    { title: 'Messages', subtitle: 'Communicate with students and admin', emoji: '💬' },
  'trainer-profile':     { title: 'Profile & Settings', subtitle: 'Manage your account and preferences', emoji: '👤' },
  'admin-batches':       { title: 'Batch Management', subtitle: 'Create and manage course batches', emoji: '📋' },
  'admin-finance':       { title: 'Finance & Payments', subtitle: 'Revenue, fees, invoices and reconciliation', emoji: '💰' },
  'admin-reports':       { title: 'Reports & Analytics', subtitle: 'Comprehensive operational reports', emoji: '📈' },
  'admin-grievances':    { title: 'Grievances', subtitle: 'Manage student and parent support tickets', emoji: '🎫' },
  'admin-settings':      { title: 'System Settings', subtitle: 'Configure academy settings and preferences', emoji: '⚙️' },
  'admin-profile':       { title: 'Profile & Settings', subtitle: 'Manage your administrator account', emoji: '👤' },
};

export default function PlaceholderPage({ pageId }: { pageId: string }) {
  const meta = PAGE_META[pageId] ?? { title: pageId, subtitle: 'This page is under construction', emoji: '🚧' };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-[#E5E7EB] flex items-center justify-center text-4xl mb-6">
          {meta.emoji}
        </div>
        <h2 className="text-xl font-bold text-[#1F2933] mb-2">{meta.title}</h2>
        <p className="text-sm text-[#667085] max-w-sm mb-6">{meta.subtitle}</p>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#e0f6ff] rounded-xl">
          <div className="w-2 h-2 rounded-full bg-[#007991] animate-pulse" />
          <p className="text-xs font-semibold text-[#005f72]">This section is being developed — coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
