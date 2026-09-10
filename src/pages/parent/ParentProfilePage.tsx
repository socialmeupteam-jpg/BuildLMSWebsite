import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import {
  IconUser, IconMail, IconLock, IconShield,
  IconCheckCircle, IconEye, IconAward
} from '../../components/Icons';

export default function ParentProfilePage() {
  const { currentUser, addToast } = useApp();

  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Sunita Sharma',
    email: currentUser?.email || 'sunita.sharma@email.com',
    phone: currentUser?.phone || '+91 98765 43211',
    relationship: 'Mother / Primary Guardian',
    occupation: 'Education Consultant',
    address: 'Flat 402, Green Meadows, Andheri East, Mumbai 400069',
    childName: 'Rahul Sharma',
    childRoll: 'SMA-2024-0042',
    childBatch: 'Digital Marketing Mastery (DMM-Feb-2024)',
  });

  const [notifPrefs, setNotifPrefs] = useState({
    dailyAttendanceAlert: true,
    weeklyGradeDigest: true,
    dueFeeAlert: true,
    trainerDirectMessages: true,
    whatsappUpdates: true,
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
      message: 'Parent contact information saved.',
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
      message: 'Account security credentials updated.',
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Parent Profile & Guardianship"
        subtitle="Manage contact records, verified child relations, and security settings"
      />

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-6 shadow-xs">
        <div className="h-32 bg-gradient-to-r from-[#007991] to-[#005263] relative" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-2xl font-bold border-2 border-white">
                SS
              </div>
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-bold text-[#1F2933]">{profile.name}</h2>
              <p className="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                <span>{profile.relationship}</span>
                <span>•</span>
                <span>Ward: <strong className="text-[#007991]">{profile.childName}</strong></span>
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
            Edit Contact Details
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Linked Child */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Guardian Information" subtitle="Registered contact on academy file">
            <div className="p-6 grid sm:grid-cols-2 gap-5 text-xs">
              <div>
                <span className="text-[#9BA3AF] block mb-1">Guardian Name</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.name}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Email Address</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.email}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Mobile Contact</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.phone}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Occupation</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.occupation}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#F2F4F6]">
                <span className="text-[#9BA3AF] block mb-1">Residential Address</span>
                <p className="font-semibold text-[#1F2933]">{profile.address}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Linked Child Verification" subtitle="Associated student records under this parent portal">
            <div className="p-5 flex items-center justify-between gap-4 bg-[#F7F9FA] rounded-xl m-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4F6] text-[#007991] flex items-center justify-center font-bold text-sm">
                  RS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1F2933]">{profile.childName}</h4>
                  <p className="text-xs text-[#667085]">Roll: {profile.childRoll}</p>
                  <p className="text-[11px] text-[#007991] font-semibold mt-0.5">{profile.childBatch}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                Verified Ward
              </span>
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Security & Alert Preferences */}
        <div className="space-y-6">
          <SectionCard title="Portal Security" subtitle="Update login password">
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
                  Change Password
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard title="Notification Preferences" subtitle="Alerts on your child's progress">
            <div className="p-5 space-y-3">
              {[
                { key: 'dailyAttendanceAlert', label: 'Absence & Attendance Alerts', desc: 'Instant alert if child is marked absent or late' },
                { key: 'weeklyGradeDigest', label: 'Evaluation & Test Scores', desc: 'Score notifications when assignments are evaluated' },
                { key: 'dueFeeAlert', label: 'Fee Due & Invoices', desc: 'Payment reminders before milestone dates' },
                { key: 'whatsappUpdates', label: 'WhatsApp Broadcasts', desc: 'Academy events and special masterclasses' },
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
                      message: 'Parent alert settings updated.',
                      type: 'success',
                    })
                  }
                >
                  Save Alert Settings
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Guardian Details"
        size="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Guardian Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Occupation</label>
              <input
                type="text"
                value={editForm.occupation}
                onChange={e => setEditForm(f => ({ ...f, occupation: e.target.value }))}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Address</label>
            <textarea
              rows={3}
              value={editForm.address}
              onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit">
              Save Details
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
