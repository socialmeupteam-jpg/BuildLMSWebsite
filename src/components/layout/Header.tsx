import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { IconMenu, IconBell, IconSearch, IconX, IconCheck } from '../Icons';
import type { UserRole } from '../../types';

const PAGE_TITLES: Record<string, string> = {
  'student-dashboard': 'Dashboard', 'student-courses': 'My Courses',
  'student-assignments': 'Assignments', 'student-attendance': 'Attendance',
  'student-grades': 'Grades & Results', 'student-payments': 'Fees & Payments',
  'student-certificates': 'My Certificates', 'student-messages': 'Messages',
  'student-grievances': 'Support Tickets', 'student-profile': 'Profile',
  'parent-dashboard': 'Dashboard', 'parent-attendance': "Child's Attendance",
  'parent-grades': 'Progress & Grades', 'parent-payments': 'Fees & Payments',
  'parent-messages': 'Messages', 'parent-profile': 'Profile',
  'trainer-dashboard': 'Dashboard', 'trainer-courses': 'My Batches',
  'trainer-attendance': 'Mark Attendance', 'trainer-assignments': 'Assignments & Grading',
  'trainer-students': 'My Students', 'trainer-messages': 'Messages', 'trainer-profile': 'Profile',
  'admin-dashboard': 'Dashboard', 'admin-users': 'User Management',
  'admin-courses': 'Course Management', 'admin-batches': 'Batch Management',
  'admin-finance': 'Finance', 'admin-reports': 'Reports & Analytics',
  'admin-grievances': 'Grievances', 'admin-settings': 'System Settings', 'admin-profile': 'Profile',
};

const GREETINGS: Record<UserRole, string> = {
  student: "Keep up the great work",
  parent: "Stay informed about your child's progress",
  trainer: "Ready to inspire your students?",
  admin: "Academy overview at a glance",
};

export default function Header() {
  const { currentUser, currentPage, notifications, unreadCount, markAllRead, markNotificationRead, toggleSidebar } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  if (!currentUser) return null;

  const title = PAGE_TITLES[currentPage] ?? 'LMS';
  const isHome = currentPage.endsWith('-dashboard');
  const greeting = GREETINGS[currentUser.role];
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const typeIcon: Record<string, string> = {
    success: '✓', error: '!', warning: '⚠', info: 'ℹ', announcement: '📢', grade: '📝', payment: '₹',
  };

  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-[#E5E7EB] flex items-center gap-4 px-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[#667085] hover:bg-[#F2F4F6] hover:text-[#1F2933] transition-colors"
        aria-label="Toggle sidebar"
      >
        <IconMenu size={20} />
      </button>

      {/* Title / Greeting */}
      <div className="flex-1 min-w-0">
        {isHome ? (
          <>
            <p className="text-[0.7rem] text-[#667085] hidden sm:block">{timeGreet}, <span className="font-semibold text-[#007991]">{currentUser.name.split(' ')[0]}</span> — {greeting}</p>
            <h1 className="text-lg font-bold text-[#1F2933] leading-tight">{title}</h1>
          </>
        ) : (
          <h1 className="text-lg font-bold text-[#1F2933] truncate">{title}</h1>
        )}
      </div>

      {/* Search toggle */}
      {searchOpen ? (
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="flex items-center gap-2 flex-1 bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 h-9">
            <IconSearch size={16} className="text-[#9BA3AF] flex-shrink-0" />
            <input
              autoFocus
              placeholder="Search…"
              className="flex-1 bg-transparent text-sm text-[#1F2933] placeholder-[#9BA3AF] outline-none"
            />
          </div>
          <button onClick={() => setSearchOpen(false)} className="text-[#667085] hover:text-[#1F2933]">
            <IconX size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-[#667085] hover:bg-[#F2F4F6] hover:text-[#1F2933] transition-colors"
        >
          <IconSearch size={18} />
        </button>
      )}

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#667085] hover:bg-[#F2F4F6] hover:text-[#1F2933] transition-colors"
        >
          <IconBell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF9635] text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-11 z-30 w-80 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#F2F4F6]">
                <h3 className="text-sm font-bold text-[#1F2933]">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-[#007991] font-semibold hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[#9BA3AF]">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full text-left flex gap-3 px-4 py-3 border-b border-[#F2F4F6] hover:bg-[#F7F9FA] transition-colors ${!n.read ? 'bg-[#f0fbff]' : ''}`}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E6F4F6] text-[#007991] flex items-center justify-center text-sm font-bold">
                        {typeIcon[n.type] ?? 'ℹ'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${!n.read ? 'font-semibold text-[#1F2933]' : 'text-[#374151]'}`}>{n.title}</p>
                        <p className="text-xs text-[#9BA3AF] truncate mt-0.5">{n.message.slice(0, 60)}…</p>
                        <p className="text-[10px] text-[#9BA3AF] mt-1">{new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      {!n.read && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#FF9635] mt-1.5" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 cursor-pointer"
        style={{ backgroundColor: '#007991' }}
        title={currentUser.name}
        onClick={() => { /* navigate profile */ }}
      >
        {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>
    </header>
  );
}
