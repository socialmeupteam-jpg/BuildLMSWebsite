import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import { IconGraduate, IconEye, IconShield } from '../../components/Icons';
import type { UserRole } from '../../types';

export default function RegisterPage() {
  const { navigate, login, addToast } = useApp();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | ''>('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    childEmailOrId: '',
    terms: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles: { value: UserRole; label: string; description: string; icon: string }[] = [
    { value: 'student', label: 'Student', description: 'I want to learn and grow my skills', icon: '🎓' },
    { value: 'parent', label: 'Parent / Guardian', description: "I want to monitor my child's progress", icon: '👨‍👩‍👦' },
  ];

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-teal-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
  };

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Valid 10-digit phone number is required';
    }
    if (!form.password || form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirm) {
      errs.confirm = 'Passwords do not match';
    }
    if (role === 'parent' && !form.childEmailOrId.trim()) {
      errs.childEmailOrId = "Student's registered email or student ID is required";
    }
    if (!form.terms) {
      errs.terms = 'You must accept the terms of service';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({
        title: 'Account Registered',
        message: `Welcome to SocialMeUp Academy, ${form.name}!`,
        type: 'success',
      });
      login(role);
    }, 600);
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-[#F7F9FA]">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-8 h-8 rounded-lg bg-[#007991] flex items-center justify-center">
            <IconGraduate size={18} className="text-white" />
          </div>
          <span className="font-bold text-[#007991]">SocialMeUp Academy</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step >= s ? 'bg-[#007991] text-white' : 'bg-[#F2F4F6] text-[#9BA3AF]'}`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-0.5 rounded ${step > s ? 'bg-[#007991]' : 'bg-[#E5E7EB]'}`} />}
              </div>
            ))}
            <span className="text-xs text-[#9BA3AF] ml-1">Step {step} of 2</span>
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-[#1F2933] mb-1">Create an account</h2>
              <p className="text-[#667085] text-sm mb-6">Who are you registering as?</p>
              <div className="space-y-3">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${role === r.value ? 'border-[#007991] bg-[#f0fbff]' : 'border-[#E5E7EB] hover:border-[#b1ebff]'}`}
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1F2933]">{r.label}</p>
                      <p className="text-xs text-[#667085]">{r.description}</p>
                    </div>
                    {role === r.value && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[#007991] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <Button
                variant="primary" size="lg" fullWidth className="mt-6"
                disabled={!role}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button type="button" onClick={() => setStep(1)} className="text-[#667085] hover:text-[#1F2933] p-1 rounded-md">
                  ←
                </button>
                <h2 className="text-2xl font-bold text-[#1F2933]">Your details</h2>
              </div>
              <p className="text-[#667085] text-sm mb-5">Registering as <strong>{roles.find(r => r.value === role)?.label}</strong></p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-semibold text-[#374151] mb-1">Full Name</label>
                  <input
                    id="reg-name"
                    value={form.name}
                    onChange={e => {
                      setForm(f => ({ ...f, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full h-10 px-3 rounded-xl border text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:bg-white transition-all ${
                      errors.name ? 'border-red-400' : 'border-[#E5E7EB] focus:border-[#007991]'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-[#374151] mb-1">Email Address</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={e => {
                      setForm(f => ({ ...f, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="you@example.com"
                    className={`w-full h-10 px-3 rounded-xl border text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:bg-white transition-all ${
                      errors.email ? 'border-red-400' : 'border-[#E5E7EB] focus:border-[#007991]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-semibold text-[#374151] mb-1">Phone Number</label>
                  <input
                    id="reg-phone"
                    value={form.phone}
                    onChange={e => {
                      setForm(f => ({ ...f, phone: e.target.value }));
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full h-10 px-3 rounded-xl border text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:bg-white transition-all ${
                      errors.phone ? 'border-red-400' : 'border-[#E5E7EB] focus:border-[#007991]'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Parent / Student Relationship Field */}
                {role === 'parent' && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                    <label htmlFor="reg-child" className="block text-xs font-semibold text-amber-900">
                      Child Student ID or Registered Email
                    </label>
                    <input
                      id="reg-child"
                      value={form.childEmailOrId}
                      onChange={e => {
                        setForm(f => ({ ...f, childEmailOrId: e.target.value }));
                        if (errors.childEmailOrId) setErrors(prev => ({ ...prev, childEmailOrId: '' }));
                      }}
                      placeholder="e.g. rahul.sharma@email.com or STU-2024-001"
                      className={`w-full h-9 px-3 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none ${
                        errors.childEmailOrId ? 'border-red-400' : 'border-amber-300 focus:border-amber-500'
                      }`}
                    />
                    <p className="text-[11px] text-amber-700">
                      We use this to connect your guardian account to your child&apos;s academic records.
                    </p>
                    {errors.childEmailOrId && <p className="text-xs text-red-600 font-medium">{errors.childEmailOrId}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="reg-pass" className="block text-xs font-semibold text-[#374151] mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="reg-pass"
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => {
                        setForm(f => ({ ...f, password: e.target.value }));
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      placeholder="Min. 8 characters"
                      className={`w-full h-10 pl-3 pr-9 rounded-xl border text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:bg-white transition-all ${
                        errors.password ? 'border-red-400' : 'border-[#E5E7EB] focus:border-[#007991]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA3AF] hover:text-slate-600"
                    >
                      <IconEye size={16} />
                    </button>
                  </div>
                  {/* Password Strength Meter */}
                  {form.password && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Strength:</span>
                        <span className="font-semibold text-slate-700">{strength.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`h-full transition-all ${
                              strength.score >= level ? strength.color : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="reg-confirm" className="block text-xs font-semibold text-[#374151] mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirm}
                      onChange={e => {
                        setForm(f => ({ ...f, confirm: e.target.value }));
                        if (errors.confirm) setErrors(prev => ({ ...prev, confirm: '' }));
                      }}
                      placeholder="Re-enter password"
                      className={`w-full h-10 pl-3 pr-9 rounded-xl border text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:bg-white transition-all ${
                        errors.confirm ? 'border-red-400' : 'border-[#E5E7EB] focus:border-[#007991]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA3AF] hover:text-slate-600"
                    >
                      <IconEye size={16} />
                    </button>
                  </div>
                  {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={e => {
                        setForm(f => ({ ...f, terms: e.target.checked }));
                        if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                      }}
                      className="mt-0.5 w-4 h-4 rounded accent-[#007991]"
                    />
                    <span className="text-xs text-[#667085]">
                      I agree to the <span className="text-[#007991] font-semibold">Terms of Service</span> and <span className="text-[#007991] font-semibold">Privacy Policy</span> of SocialMeUp Academy
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
                </div>

                <Button type="submit" variant="cta" size="lg" fullWidth loading={loading}>
                  Create Account
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-[#9BA3AF] mt-4">
          Already have an account?{' '}
          <button onClick={() => navigate('login')} className="text-[#007991] font-semibold hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
}
