import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import type { UserRole } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { IconGraduate, IconMail, IconShield, IconEye, IconCheckCircle } from '../../components/Icons';

const DEMO_ACCOUNTS: { role: UserRole; name: string; email: string; description: string; color: string; bg: string; initial: string }[] = [
  { role: 'student', name: 'Rahul Sharma', email: 'rahul.sharma@email.com', description: 'Enrolled in 3 courses', color: '#005f72', bg: '#e0f6ff', initial: 'RS' },
  { role: 'parent', name: 'Sunita Sharma', email: 'sunita.sharma@email.com', description: 'Parent of Rahul Sharma', color: '#4B5563', bg: '#F3F4F6', initial: 'SS' },
  { role: 'trainer', name: 'Ankit Verma', email: 'ankit.verma@socialmeup.in', description: 'Digital Marketing Trainer', color: '#e67e22', bg: '#fff3e6', initial: 'AV' },
  { role: 'admin', name: 'Rajesh Kumar', email: 'admin@socialmeupacademy.in', description: 'Academy Administrator', color: '#92400E', bg: '#FEF3C7', initial: 'RK' },
];

export default function LoginPage() {
  const { login, navigate, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  // Forgot Password Modal State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setTimeout(() => {
      setLoading(false);
      // Check if credentials match any demo user
      const matchedUser = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (matchedUser && password === 'password123') {
        login(matchedUser.role);
      } else {
        setErrors({
          general: 'Invalid credentials. For quick testing, click one of the demo role cards below or use password: password123 with a demo email.',
        });
      }
    }, 600);
  };

  const handleDemo = (role: UserRole) => {
    setLoading(true);
    const demo = DEMO_ACCOUNTS.find(a => a.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword('password123');
    }
    setTimeout(() => {
      login(role);
    }, 350);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Please enter a valid email address');
      return;
    }
    setForgotError('');
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSubmitted(true);
      addToast({
        title: 'Reset Link Sent',
        message: `Password reset instructions sent to ${forgotEmail}`,
        type: 'success',
      });
    }, 700);
  };

  return (
    <div className="min-h-full flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ backgroundColor: '#007991' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#fff', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#fff', transform: 'translate(-30%, 30%)' }} />
        <div className="absolute top-1/2 right-0 w-32 h-64 rounded-full opacity-5" style={{ backgroundColor: '#fff', transform: 'translateY(-50%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <IconGraduate size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">SocialMeUp Academy</p>
              <p className="text-white/60 text-xs">Learning Management System</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Your learning journey<br />starts here.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Access your courses, track progress, submit assignments, and grow your digital marketing career — all in one place.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { icon: '🎯', label: 'Structured Course Learning' },
            { icon: '📊', label: 'Real-time Progress Tracking' },
            { icon: '🏆', label: 'Industry-Recognised Certificates' },
            { icon: '🤝', label: 'Direct Trainer Communication' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-xl">{f.icon}</span>
              <span className="text-white/80 text-sm font-medium">{f.label}</span>
            </div>
          ))}
          <div className="pt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['AV', 'SK', 'PM', 'RK'].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#007991] flex items-center justify-center text-white text-[10px] font-bold">{i}</div>
              ))}
            </div>
            <p className="text-white/60 text-xs">248+ learners enrolled this year</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#F7F9FA]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#007991] flex items-center justify-center">
              <IconGraduate size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#007991]">SocialMeUp Academy</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <h2 className="text-2xl font-bold text-[#1F2933] mb-1">Welcome back</h2>
            <p className="text-[#667085] text-sm mb-6">Sign in to your account to continue</p>

            {errors.general && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] mb-5">
                <span className="text-[#EF4444] mt-0.5 flex-shrink-0">⚠</span>
                <p className="text-sm text-[#991B1B]">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    className={`w-full h-10 pl-9 pr-3 rounded-xl border text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:bg-white transition-all ${
                      errors.email ? 'border-red-400 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#007991]'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <IconShield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    className={`w-full h-10 pl-9 pr-9 rounded-xl border text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:bg-white transition-all ${
                      errors.password ? 'border-red-400 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#007991]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA3AF] hover:text-[#667085] focus:outline-none"
                  >
                    <IconEye size={16} />
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#E5E7EB] accent-[#007991]" />
                  <span className="text-xs text-[#667085]">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSubmitted(false);
                    setForgotError('');
                    setIsForgotOpen(true);
                  }}
                  className="text-xs text-[#007991] font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Sign In
              </Button>
            </form>

            <div className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <hr className="flex-1 border-[#E5E7EB]" />
                <span className="text-xs text-[#9BA3AF] font-medium">Demo Accounts</span>
                <hr className="flex-1 border-[#E5E7EB]" />
              </div>
              <p className="text-xs text-[#9BA3AF] text-center mb-3">Click to sign in instantly as any role</p>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleDemo(acc.role)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#007991] hover:bg-[#f0fbff] transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#007991]/30"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: acc.bg, color: acc.color }}
                    >
                      {acc.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1F2933] truncate">{acc.name}</p>
                      <p className="text-[10px] text-[#9BA3AF] truncate">{acc.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-[#9BA3AF] mt-5">
            {"Don't have an account? "}
            <button onClick={() => navigate('register')} className="text-[#007991] font-semibold hover:underline">
              Register now
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Reset Your Password"
        description="Enter the email address registered with your SocialMeUp Academy account."
      >
        {forgotSubmitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IconCheckCircle size={28} />
            </div>
            <h4 className="text-base font-semibold text-slate-800">Check Your Email</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              We have dispatched password reset instructions to <strong className="text-slate-800">{forgotEmail}</strong>.
            </p>
            <div className="pt-2">
              <Button variant="primary" fullWidth onClick={() => setIsForgotOpen(false)}>
                Return to Login
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4 pt-1">
            <div>
              <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <IconMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={e => {
                    setForgotEmail(e.target.value);
                    if (forgotError) setForgotError('');
                  }}
                  placeholder="name@email.com"
                  className={`w-full h-10 pl-9 pr-3 rounded-xl border text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none transition-all ${
                    forgotError ? 'border-red-400' : 'border-slate-200 focus:border-[#007991]'
                  }`}
                />
              </div>
              {forgotError && <p className="text-xs text-red-500 mt-1">{forgotError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setIsForgotOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={forgotLoading}>
                Send Instructions
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
