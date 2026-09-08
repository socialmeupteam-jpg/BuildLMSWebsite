interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'cta' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'teal' | 'orange';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variants = {
  primary: 'bg-[#e0f6ff] text-[#005f72]',
  cta:     'bg-[#fff3e6] text-[#e67e22]',
  success: 'bg-[#D1FAE5] text-[#065F46]',
  warning: 'bg-[#FEF3C7] text-[#92400E]',
  error:   'bg-[#FEE2E2] text-[#991B1B]',
  info:    'bg-[#DBEAFE] text-[#1E40AF]',
  neutral: 'bg-[#F3F4F6] text-[#4B5563]',
  teal:    'bg-[#E6F4F6] text-[#005f72]',
  orange:  'bg-[#FFF3E6] text-[#E67E22]',
};

const dotColors = {
  primary: 'bg-[#007991]',
  cta:     'bg-[#FF9635]',
  success: 'bg-[#10B981]',
  warning: 'bg-[#F59E0B]',
  error:   'bg-[#EF4444]',
  info:    'bg-[#3B82F6]',
  neutral: 'bg-[#9CA3AF]',
  teal:    'bg-[#007991]',
  orange:  'bg-[#FF9635]',
};

export default function Badge({ children, variant = 'neutral', size = 'sm', dot, className = '' }: BadgeProps) {
  const sz = size === 'sm' ? 'px-2 py-0.5 text-[0.7rem]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${sz} ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    active:     { label: 'Active',      variant: 'success' },
    completed:  { label: 'Completed',   variant: 'primary' },
    pending:    { label: 'Pending',     variant: 'warning' },
    suspended:  { label: 'Suspended',   variant: 'error' },
    inactive:   { label: 'Inactive',    variant: 'neutral' },
    draft:      { label: 'Draft',       variant: 'neutral' },
    published:  { label: 'Published',   variant: 'success' },
    archived:   { label: 'Archived',    variant: 'neutral' },
    submitted:  { label: 'Submitted',   variant: 'info' },
    graded:     { label: 'Graded',      variant: 'success' },
    late:       { label: 'Late',        variant: 'warning' },
    missed:     { label: 'Missed',      variant: 'error' },
    resubmit:   { label: 'Resubmit',   variant: 'cta' },
    paid:       { label: 'Paid',        variant: 'success' },
    overdue:    { label: 'Overdue',     variant: 'error' },
    failed:     { label: 'Failed',      variant: 'error' },
    refunded:   { label: 'Refunded',    variant: 'neutral' },
    issued:     { label: 'Issued',      variant: 'success' },
    revoked:    { label: 'Revoked',     variant: 'error' },
    present:    { label: 'Present',     variant: 'success' },
    absent:     { label: 'Absent',      variant: 'error' },
    excused:    { label: 'Excused',     variant: 'info' },
    open:       { label: 'Open',        variant: 'warning' },
    in_progress:{ label: 'In Progress', variant: 'info' },
    waiting:    { label: 'Waiting',     variant: 'neutral' },
    resolved:   { label: 'Resolved',    variant: 'success' },
    closed:     { label: 'Closed',      variant: 'neutral' },
    upcoming:   { label: 'Upcoming',    variant: 'info' },
    deactivated:{ label: 'Deactivated', variant: 'error' },
    high:       { label: 'High',        variant: 'error' },
    medium:     { label: 'Medium',      variant: 'warning' },
    low:        { label: 'Low',         variant: 'neutral' },
    normal:     { label: 'Normal',      variant: 'neutral' },
    beginner:   { label: 'Beginner',    variant: 'success' },
    intermediate:{ label: 'Intermediate', variant: 'warning' },
    advanced:   { label: 'Advanced',    variant: 'error' },
    online:     { label: 'Online',      variant: 'info' },
    offline:    { label: 'Offline',     variant: 'cta' },
    hybrid:     { label: 'Hybrid',      variant: 'primary' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'neutral' as const };
  return <Badge variant={variant} dot>{label}</Badge>;
}
