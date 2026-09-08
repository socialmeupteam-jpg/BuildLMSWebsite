import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cta' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-[#007991] text-white hover:bg-[#005f72] active:bg-[#004d60] shadow-sm',
  cta:     'bg-[#FF9635] text-white hover:bg-[#e67e22] active:bg-[#d4700f] shadow-sm',
  outline: 'border border-[#007991] text-[#007991] bg-white hover:bg-[#e0f6ff] active:bg-[#b1ebff]',
  ghost:   'text-[#667085] hover:bg-[#F2F4F6] hover:text-[#1F2933] active:bg-[#E5E7EB]',
  danger:  'bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-sm',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-6 text-base gap-2.5 rounded-xl',
};

export default function Button({
  variant = 'primary', size = 'md', loading, icon, iconRight, children,
  fullWidth, className = '', disabled, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-150 cursor-pointer select-none
        focus-visible:outline-2 focus-visible:outline-[#007991] focus-visible:outline-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
    >
      {loading ? (
        <svg className="lms-spin" width={size === 'sm' ? 14 : 16} height={size === 'sm' ? 14 : 16} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeLinecap="round" opacity="0.3" />
          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
