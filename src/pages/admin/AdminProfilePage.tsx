import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../contexts/AppContext';
import {
  IconUser, IconMail, IconLock, IconShield,
  IconCheckCircle, IconClock, IconFileText
} from '../../components/Icons';

export default function AdminProfilePage() {
  const { currentUser, addToast } = useApp();

  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Rajesh Kumar',
    email: currentUser?.email || 'admin@socialmeup.in',
    phone: currentUser?.phone || '+91 98765 43210',
    designation: 'Academy Director & Operations Head',
    department: 'Academic Operations & Governance',
    campusLocation: 'Mumbai Powai Campus (Headquarters)',
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
      title: 'Administrator Profile Saved',
      message: 'Official contact and designation details updated.',
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
      title: 'Administrator Credentials Updated',
      message: 'Master password refreshed.',
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Administrator Profile & Security"
        subtitle="Manage master credentials, operational designation, and governance audit records"
      />

      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-6 shadow-xs">
        <div className="h-32 bg-gradient-to-r from-[#007991] to-[#005263] relative" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-xl bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-2xl font-bold border-2 border-white">
                RK
              </div>
            </div>
            <div className="mb-1">
              <h2 className="text-xl font-bold text-[#1F2933]">{profile.name}</h2>
              <p className="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                <span>{profile.designation}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">Super Admin Authority</span>
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
            Edit Administrator Details
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Director Information" subtitle="System records and operational jurisdiction">
            <div className="p-6 grid sm:grid-cols-2 gap-5 text-xs">
              <div>
                <span className="text-[#9BA3AF] block mb-1">Full Name</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.name}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Executive Email</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.email}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Direct Phone</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.phone}</p>
              </div>
              <div>
                <span className="text-[#9BA3AF] block mb-1">Assigned Department</span>
                <p className="font-semibold text-[#1F2933] text-sm">{profile.department}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#F2F4F6]">
                <span className="text-[#9BA3AF] block mb-1">Primary Campus</span>
                <p className="font-semibold text-[#1F2933]">{profile.campusLocation}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Recent Administrative Audit Log" subtitle="Security logs of actions taken under this credential">
            <div className="divide-y divide-[#F2F4F6] text-xs">
              {[
                { action: 'Approved offline fee payment (₹5,000)', target: 'Student Rohan Verma', time: 'Today, 11:42 AM' },
                { action: 'Updated curriculum module status', target: 'Digital Marketing Mastery (M3)', time: 'Yesterday, 04:15 PM' },
                { action: 'Created new batch cohort', target: 'DMM-Feb-2025 (Online)', time: 'Dec 09, 2024, 02:30 PM' },
                { action: 'Resolved support grievance ticket #TK-1002', target: 'Attendance discrepancy', time: 'Dec 08, 2024, 10:15 AM' },
              ].map((log, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1F2933]">{log.action}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5">Target: {log.target}</p>
                  </div>
                  <span className="text-[11px] text-[#9BA3AF] flex-shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Master Password */}
        <div className="space-y-6">
          <SectionCard title="Security & Master Password" subtitle="Update root administrator credentials">
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

          <div className="bg-[#E6F4F6] rounded-2xl border border-[#007991]/20 p-5 text-xs text-[#007991]">
            <p className="font-bold mb-1 flex items-center gap-1.5">
              <IconShield size={16} /> Super Admin Privilege Level
            </p>
            <p className="leading-relaxed text-[#005263]">
              This account possesses top-level permissions to modify academy financial records, change course curriculum, and issue institutional certificates.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Administrator Details"
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
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Designation</label>
              <input
                type="text"
                value={editForm.designation}
                onChange={e => setEditForm(f => ({ ...f, designation: e.target.value }))}
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
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Campus Location</label>
            <input
              type="text"
              value={editForm.campusLocation}
              onChange={e => setEditForm(f => ({ ...f, campusLocation: e.target.value }))}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
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
