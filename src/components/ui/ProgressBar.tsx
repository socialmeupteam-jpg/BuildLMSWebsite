interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  bgColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
  rounded?: boolean;
}

export default function ProgressBar({
  value, max = 100, color = '#007991', bgColor = '#E6F4F6',
  height = 8, showLabel, label, className = '', rounded = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = rounded ? '9999px' : '4px';
  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#667085]">{label || 'Progress'}</span>
          <span className="text-xs font-semibold text-[#1F2933]">{Math.round(pct)}%</span>
        </div>
      )}
      <div style={{ height, backgroundColor: bgColor, borderRadius: r, overflow: 'hidden' }}>
        <div
          className="progress-fill h-full"
          style={{ width: `${pct}%`, backgroundColor: color, borderRadius: r }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({ value, size = 64, strokeWidth = 6, color = '#007991', label }: {
  value: number; size?: number; strokeWidth?: number; color?: string; label?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E6F4F6" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute text-center">
        <span className="text-sm font-bold text-[#1F2933]">{value}%</span>
        {label && <span className="block text-[10px] text-[#667085]">{label}</span>}
      </span>
    </div>
  );
}
