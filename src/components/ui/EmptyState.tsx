import type { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: ReactNode };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

export default function EmptyState({ icon, title, description, action, secondaryAction, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#F2F4F6] flex items-center justify-center mb-4 text-[#9BA3AF]">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#1F2933] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#667085] max-w-xs">{description}</p>}
      {(action || secondaryAction) && (
        <div className="flex gap-2 mt-5">
          {secondaryAction && (
            <Button variant="outline" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button variant="cta" size="sm" icon={action.icon} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 rounded" style={{ width: `${60 + (i * 7) % 30}%` }} />
            <div className="skeleton h-3 rounded w-2/5" />
          </div>
          <div className="skeleton h-7 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ cols = 5, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <div className="overflow-hidden">
      <div className="flex gap-4 p-4 border-b border-[#E5E7EB] bg-[#F7F9FA]">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-3 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-[#F2F4F6]">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-4 rounded flex-1" style={{ opacity: 0.6 + j * 0.05 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
