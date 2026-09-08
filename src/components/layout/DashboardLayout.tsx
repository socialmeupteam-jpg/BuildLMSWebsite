import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-full overflow-hidden bg-[#F7F9FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 lg:p-6 fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-[#1F2933]">{title}</h2>
        {subtitle && <p className="text-sm text-[#667085] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function SectionCard({ title, subtitle, action, children, className = '' }: {
  title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden ${className}`} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#F2F4F6]">
          <div>
            {title && <h3 className="text-sm font-bold text-[#1F2933]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#667085] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
