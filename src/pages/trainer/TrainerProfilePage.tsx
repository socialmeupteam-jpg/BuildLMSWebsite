import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { BATCHES } from '../../data/mockData';
import {
  IconUser, IconMail, IconLock, IconAward,
  IconClock, IconBook, IconCheckCircle, IconEye
} from '../../components/Icons';

export default function TrainerProfilePage() {
  const { currentUser, addToast } = useApp();

  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Ankit Verma',
    email: currentUser?.email || 'ankit.verma@socialmeup.in',
    phone: currentUser?.phone || '+91 99887 76655',
    roleTitle: 'Senior Growth & Performance Marketing Trainer',
    bio: currentUser?.bio || '8+ years in digital marketing. Ex-Dentsu Media Director. Specialize in Meta & Google Ads conversion scaling, programmatic bidding, and marketing analytics.',
    qualifications: 'MBA in Marketing (NMIMS), Google Ads Certified Professional, Meta Certified Media Buying Professional',
    experienceYears: '8.5 Years',
    specializations: ['Google Search & Display Ads', 'Meta Performance Marketing', 'Growth Hacking', 'SEO Analytics'],
    officeHours: 'Monday – Friday, 4:00 PM – 6:00 PM',
  });

  const [notifPrefs, setNotifPrefs] = useState({
    submissionAlerts: true,
    studentDirectMessages: true,
    classStartReminders: true,
    adminAnnouncements: true,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditOpen(false);
    addToast({
      title: 'Profile Updated',
      message: 'Trainer biographical information saved.',
      type: 'success',
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (!currentPass) {
      setPassError('Current password required');
      return;
    }
    if (newPass.length < 8) {
      setPassError('Password must be at least 8 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Passwords do not match');
      return;
    }

    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    addToast({
      title: 'Password Changed',
      message: 'Trainer account credentials updated.',
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Trainer Profile & Academic Bio"
        subtitle="Manage credentials, curriculum specializations, office hours, and account security"
      />

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-6 shadow-xs">
        <div className="h-32 bg-gradient-to-r from-[#007991] to-[#005263] relative" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-2xl font-bold border-2 border-white">
                AV
              </div>
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-bold text-[#1F2933]">{profile.name}</h2>
              <p className="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                <span>{profile.roleTitle}</span>
                <span>•</span>
                <span>Experience: <strong className="text-[#007991]">{profile.experienceYears}</strong></span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditForm({ ...profile });
              setIsEditOpen(true);
            }}
          >
            Edit Instructor Bio
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Assigned Batches */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Instructor Dossier" subtitle="Academic credentials and professional experience">
            <div className="p-6 grid sm:grid-cols-2 gap-5 text-xs">
              <div>
                <span className="text-[#9BA3AF] block mb-1">Full Name</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.name}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Official Email</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.email}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Contact Phone</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.phone}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Office / Doubt Clearing Hours</span>
                <p className="font-semibold text-[#007991] text-sm">{profile.officeHours}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#F2F4F6]">
                <span className="text-[#9BA3AF] block mb-1">Professional Qualifications</span>
                <p className="font-semibold text-[#1F2933]">{profile.qualifications}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#F2F4F6]">
                <span className="text-[#9BA3AF] block mb-1">Curriculum Specializations</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.specializations.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E6F4F6] text-[#007991]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#F2F4F6]">
                <span className="text-[#9BA3AF] block mb-1">Instructor Biography</span>
                <p className="text-[#4B5563] leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Assigned Batches" subtitle="Active cohorts assigned under your instruction">
            <div className="divide-y divide-[#F2F4F6]">
              {BATCHES.slice(0, 2).map(b => (
                <div key={b.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-sm text-[#1F2933]">{b.name}</h4>
                    <p className="text-[#667085]">{b.courseTitle}</p>
                    <p className="text-[11px] text-[#9BA3AF] mt-0.5">Schedule: {b.schedule}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#007991]">{b.studentsCount} Students</span>
                    <p className="text-[10px] text-emerald-600 font-semibold">Active Cohort</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Security & Notification Preferences */}
        <div className="space-y-6">
          <SectionCard title="Account Security" subtitle="Update portal password">
            <form onSubmit={handlePasswordChange} className="p-5 space-y-3">
              {passError && (
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium">
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium">
                  Password updated successfully!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" size="sm" fullWidth type="submit">
                  Save New Password
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard title="Notification Preferences" subtitle="Alerts on submissions and student inquiries">
            <div className="p-5 space-y-3">
              {[
                { key: 'submissionAlerts', label: 'New Assignment Submissions', desc: 'Alert when students hand in practical briefs' },
                { key: 'studentDirectMessages', label: 'Student Direct Questions', desc: 'Notify immediately upon student doubt message' },
                { key: 'classStartReminders', label: 'Live Session Reminders', desc: '15-minute prompt prior to classroom launch' },
                { key: 'adminAnnouncements', label: 'Academic Staff Notices', desc: 'Circulars from Director of Operations' },
              ].map(item => (
                <label key={item.key} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F7F9FA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(notifPrefs as any)[item.key]}
                    onChange={e =>
                      setNotifPrefs(prev => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="mt-0.5 accent-[#007991] w-4 h-4 rounded"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#1F2933]">{item.label}</p>
                    <p className="text-[11px] text-[#667085]">{item.desc}</p>
                  </div>
                </label>
              ))}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() =>
                    addToast({
                      title: 'Preferences Saved',
                      message: 'Trainer alert preferences updated.',
                      type: 'success',
                    })
                  }
                >
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Edit Bio Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Instructor Dossier"
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Full Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Role Title</label>
              <input
                type="text"
                value={editForm.roleTitle}
                onChange={e => setEditForm(f => ({ ...f, roleTitle: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Qualifications</label>
            <input
              type="text"
              value={editForm.qualifications}
              onChange={e => setEditForm(f => ({ ...f, qualifications: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Office / Doubt Hours</label>
            <input
              type="text"
              value={editForm.officeHours}
              onChange={e => setEditForm(f => ({ ...f, officeHours: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Biography</label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit">
              Save Bio
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
