import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { STUDENT_ENROLLMENTS } from '../../data/mockData';
import {
  IconCheckCircle, IconShield, IconMail, IconAward,
  IconCalendar, IconCreditCard, IconLock, IconEye
} from '../../components/Icons';

export default function StudentProfilePage() {
  const { currentUser, addToast } = useApp();

  // Profile data in local state
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Rahul Sharma',
    email: currentUser?.email || 'rahul.sharma@email.com',
    phone: currentUser?.phone || '+91 98765 43210',
    bio: currentUser?.bio || 'Passionate digital marketer aiming to specialize in growth loops, performance ads, and organic SEO architecture.',
    dateOfBirth: '2004-08-14',
    gender: 'Male',
    location: 'Mumbai, Maharashtra, India',
    rollNumber: 'SMA-2024-0042',
    batch: 'DMM-Feb-2024',
    emergencyContactName: 'Sunita Sharma (Mother)',
    emergencyContactPhone: '+91 98765 43211',
    emergencyRelation: 'Parent / Primary Guardian',
  });

  // Notification Preferences
  const [notifPrefs, setNotifPrefs] = useState({
    emailAssignments: true,
    emailClasses: true,
    emailGrades: true,
    smsReminders: false,
    promotionalOffers: false,
  });

  // Edit Profile Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    setIsEditModalOpen(false);
    addToast({
      title: 'Profile Updated',
      message: 'Your personal information was saved successfully.',
      type: 'success',
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (!currentPass) {
      setPassError('Current password is required');
      return;
    }
    if (newPass.length < 8) {
      setPassError('New password must be at least 8 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match');
      return;
    }

    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    addToast({
      title: 'Security Updated',
      message: 'Your password has been changed successfully.',
      type: 'success',
    });
  };

  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout>
      <PageHeader
        title="Student Profile & Settings"
        subtitle="Manage your personal details, academic standing, and account preferences"
      />

      {/* Top Banner & Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-6 shadow-xs">
        <div className="h-32 bg-gradient-to-r from-[#007991] to-[#005263] relative" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-2xl font-bold border-2 border-white">
                {initials}
              </div>
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-bold text-[#1F2933]">{profile.name}</h2>
              <p className="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                <span>Roll: <strong className="text-[#007991]">{profile.rollNumber}</strong></span>
                <span>•</span>
                <span>Cohort: <strong>{profile.batch}</strong></span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditForm({ ...profile });
              setIsEditModalOpen(true);
            }}
          >
            Edit Profile Details
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Academics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <SectionCard title="Personal Information" subtitle="Official student identification records">
            <div className="p-6 grid sm:grid-cols-2 gap-5 text-xs">
              <div>
                <span className="text-[#9BA3AF] block mb-1">Full Name</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.name}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Email Address</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.email}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Mobile Phone</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.phone}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Location</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.location}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Date of Birth</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.dateOfBirth}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Gender</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.gender}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#F2F4F6]">
                <span className="text-[#9BA3AF] block mb-1">Student Bio</span>
                <p className="text-[#4B5563] leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          </SectionCard>

          {/* Academic & Cohort Summary */}
          <SectionCard title="Enrolled Programs" subtitle="Active curriculum streams and progress">
            <div className="divide-y divide-[#F2F4F6]">
              {STUDENT_ENROLLMENTS.map(enr => (
                <div key={enr.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F4F6] text-[#007991] flex items-center justify-center flex-shrink-0 font-bold">
                      <IconAward size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1F2933] truncate">{enr.courseTitle}</p>
                      <p className="text-xs text-[#667085]">{enr.trainer} · {enr.batch}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-[#007991]">{enr.progress}% Complete</span>
                    <p className="text-[11px] text-[#9BA3AF]">{enr.lessonsCompleted}/{enr.totalLessons} lessons</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Emergency & Guardian Contact */}
          <SectionCard title="Guardian & Emergency Details" subtitle="Primary emergency contact on academy file">
            <div className="p-6 grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#9BA3AF] block mb-1">Contact Name</span>
                <p className="font-semibold text-[#1F2933]">{profile.emergencyContactName}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Relationship</span>
                <p className="font-semibold text-[#1F2933]">{profile.emergencyRelation}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Contact Phone</span>
                <p className="font-semibold text-[#1F2933]">{profile.emergencyContactPhone}</p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Security & Notification Preferences */}
        <div className="space-y-6">
          {/* Account Security / Password Change */}
          <SectionCard title="Account Security" subtitle="Update your portal password">
            <form onSubmit={handlePasswordChange} className="p-5 space-y-3">
              {passError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium">
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium">
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
                  placeholder="At least 8 characters"
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
                  Update Password
                </Button>
              </div>
            </form>
          </SectionCard>

          {/* Notification Preferences */}
          <SectionCard title="Notification Preferences" subtitle="Control which alerts you receive">
            <div className="p-5 space-y-3">
              {[
                { key: 'emailClasses', label: 'Class & Lecture Reminders', desc: 'Alerts 30 mins before live session starts' },
                { key: 'emailAssignments', label: 'Assignment Deadlines', desc: 'Notifications on pending submissions' },
                { key: 'emailGrades', label: 'Evaluation & Grades', desc: 'Immediate notification when scores publish' },
                { key: 'smsReminders', label: 'SMS Reminders', desc: 'Critical SMS alerts for test dates' },
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
                      message: 'Notification settings updated.',
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

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Information"
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
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
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Location</label>
            <input
              type="text"
              value={editForm.location}
              onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Bio / Headline</label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E7EB]">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={editForm.emergencyContactName}
                onChange={e => setEditForm(f => ({ ...f, emergencyContactName: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={editForm.emergencyContactPhone}
                onChange={e => setEditForm(f => ({ ...f, emergencyContactPhone: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
