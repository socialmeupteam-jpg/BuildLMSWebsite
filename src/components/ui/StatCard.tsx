import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: { value: number; label?: string; positive?: boolean };
  accent?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  title, value, subtitle, icon, iconBg = '#E6F4F6', iconColor = '#007991',
  trend, accent, className = '', onClick,
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E5E7EB] p-5 card-lift ${onClick ? 'cursor-pointer' : ''} ${accent ? 'border-l-4 border-l-[#007991]' : ''} ${className}`}
      onClick={onClick}
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#1F2933] truncate">{value}</p>
          {subtitle && <p className="text-xs text-[#667085] mt-0.5 truncate">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${trend.positive !== false ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              <span>{trend.positive !== false ? '↑' : '↓'}</span>
              <span>{trend.value}%</span>
              {trend.label && <span className="text-[#9BA3AF] font-normal">{trend.label}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg, color: iconColor }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function MiniStatRow({ label, value, color = '#007991' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F2F4F6] last:border-0">
      <span className="text-sm text-[#667085]">{label}</span>
      <span className="text-sm font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}
