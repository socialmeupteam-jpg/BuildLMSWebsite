import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import { IconGraduate, IconUser, IconMail, IconShield, IconEye } from '../../components/Icons';
import type { UserRole } from '../../types';

export default function RegisterPage() {
  const { navigate, login } = useApp();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | ''>('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', terms: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles: { value: UserRole; label: string; description: string; icon: string }[] = [
    { value: 'student', label: 'Student', description: 'I want to learn and grow my skills', icon: '🎓' },
    { value: 'parent', label: 'Parent / Guardian', description: 'I want to monitor my child\'s progress', icon: '👨‍👩‍👦' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    setTimeout(() => {
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
                    onClick={() => setRole(r.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${role === r.value ? 'border-[#007991] bg-[#f0fbff]' : 'border-[#E5E7EB] hover:border-[#b1ebff]'}`}
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
                <button onClick={() => setStep(1)} className="text-[#667085] hover:text-[#1F2933]">←</button>
                <h2 className="text-2xl font-bold text-[#1F2933]">Your details</h2>
              </div>
              <p className="text-[#667085] text-sm mb-6">Registering as <strong>{roles.find(r => r.value === role)?.label}</strong></p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Full Name</label>
                  <input
                    required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:border-[#007991] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Email Address</label>
                  <input
                    required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:border-[#007991] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Phone Number</label>
                  <input
                    required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:border-[#007991] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      required type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Min. 8 characters"
                      className="w-full h-10 pl-3 pr-9 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2933] placeholder-[#9BA3AF] bg-[#F9FAFB] focus:outline-none focus:border-[#007991] focus:bg-white transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]">
                      <IconEye size={16} />
                    </button>
                  </div>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required checked={form.terms} onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))} className="mt-0.5 w-4 h-4 rounded accent-[#007991]" />
                  <span className="text-xs text-[#667085]">I agree to the <span className="text-[#007991] font-semibold">Terms of Service</span> and <span className="text-[#007991] font-semibold">Privacy Policy</span> of SocialMeUp Academy</span>
                </label>
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
