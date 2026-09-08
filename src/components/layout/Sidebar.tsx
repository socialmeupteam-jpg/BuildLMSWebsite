import type { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';
import type { UserRole } from '../../types';
import {
  IconDashboard, IconBook, IconClipboard, IconCalendar, IconAward, IconCreditCard,
  IconMedal, IconMail, IconUsers, IconSettings, IconBarChart, IconLogOut,
  IconMenu, IconX, IconHelp, IconMessageSquare, IconGraduate, IconList,
  IconHome, IconActivity, IconFileText, IconVideo, IconDollarSign, IconShield,
} from '../Icons';

type NavItem = { id: string; label: string; icon: ReactNode; badge?: number };

const NAV_BY_ROLE: Record<UserRole, NavItem[][]> = {
  student: [
    [
      { id: 'student-dashboard', label: 'Dashboard', icon: <IconDashboard size={18} /> },
    ],
    [
      { id: 'student-courses', label: 'My Courses', icon: <IconBook size={18} /> },
      { id: 'student-assignments', label: 'Assignments', icon: <IconClipboard size={18} /> },
      { id: 'student-attendance', label: 'Attendance', icon: <IconCalendar size={18} /> },
      { id: 'student-grades', label: 'Grades', icon: <IconAward size={18} /> },
    ],
    [
      { id: 'student-payments', label: 'Payments', icon: <IconCreditCard size={18} /> },
      { id: 'student-certificates', label: 'Certificates', icon: <IconMedal size={18} /> },
    ],
    [
      { id: 'student-messages', label: 'Messages', icon: <IconMail size={18} />, badge: 2 },
      { id: 'student-grievances', label: 'Support', icon: <IconHelp size={18} /> },
    ],
  ],
  parent: [
    [
      { id: 'parent-dashboard', label: 'Dashboard', icon: <IconDashboard size={18} /> },
    ],
    [
      { id: 'parent-attendance', label: "Child's Attendance", icon: <IconCalendar size={18} /> },
      { id: 'parent-grades', label: 'Progress & Grades', icon: <IconAward size={18} /> },
      { id: 'parent-payments', label: 'Fees & Payments', icon: <IconCreditCard size={18} /> },
    ],
    [
      { id: 'parent-messages', label: 'Messages', icon: <IconMail size={18} /> },
    ],
  ],
  trainer: [
    [
      { id: 'trainer-dashboard', label: 'Dashboard', icon: <IconDashboard size={18} /> },
    ],
    [
      { id: 'trainer-courses', label: 'My Batches', icon: <IconBook size={18} /> },
      { id: 'trainer-attendance', label: 'Mark Attendance', icon: <IconCalendar size={18} /> },
      { id: 'trainer-assignments', label: 'Assignments & Grades', icon: <IconClipboard size={18} />, badge: 4 },
      { id: 'trainer-students', label: 'My Students', icon: <IconUsers size={18} /> },
    ],
    [
      { id: 'trainer-messages', label: 'Messages', icon: <IconMail size={18} /> },
    ],
  ],
  admin: [
    [
      { id: 'admin-dashboard', label: 'Dashboard', icon: <IconDashboard size={18} /> },
    ],
    [
      { id: 'admin-users', label: 'Users', icon: <IconUsers size={18} /> },
      { id: 'admin-courses', label: 'Courses', icon: <IconBook size={18} /> },
      { id: 'admin-batches', label: 'Batches', icon: <IconList size={18} /> },
    ],
    [
      { id: 'admin-finance', label: 'Finance', icon: <IconDollarSign size={18} /> },
      { id: 'admin-reports', label: 'Reports', icon: <IconBarChart size={18} /> },
    ],
    [
      { id: 'admin-grievances', label: 'Grievances', icon: <IconHelp size={18} />, badge: 7 },
      { id: 'admin-settings', label: 'Settings', icon: <IconSettings size={18} /> },
    ],
  ],
};

const SECTION_LABELS: Record<UserRole, string[]> = {
  student:  ['Main', 'Learning', 'Finance', 'Support'],
  parent:   ['Main', 'Monitoring', 'Communication'],
  trainer:  ['Main', 'Teaching', 'Communication'],
  admin:    ['Main', 'Management', 'Analytics', 'System'],
};

const ROLE_LABEL: Record<UserRole, string> = {
  student: 'Student',
  parent: 'Parent',
  trainer: 'Trainer',
  admin: 'Administrator',
};

const ROLE_COLOR: Record<UserRole, string> = {
  student: '#e0f6ff',
  parent: '#F2F4F6',
  trainer: '#fff3e6',
  admin: '#FEF3C7',
};

const ROLE_TEXT: Record<UserRole, string> = {
  student: '#005f72',
  parent: '#4B5563',
  trainer: '#e67e22',
  admin: '#92400E',
};

export default function Sidebar() {
  const { currentUser, currentPage, navigate, logout, sidebarOpen, toggleSidebar, unreadCount } = useApp();
  if (!currentUser) return null;

  const role = currentUser.role;
  const groups = NAV_BY_ROLE[role];
  const labels = SECTION_LABELS[role];

  const avatarInitials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          width: 256,
          backgroundColor: '#007991',
          boxShadow: '4px 0 20px rgba(0,121,145,0.15)',
        }}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <IconGraduate size={18} className="text-[#007991]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">SocialMeUp</p>
              <p className="text-white/60 text-[10px] leading-tight">Academy LMS</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-white/70 hover:text-white p-1 rounded">
            <IconX size={18} />
          </button>
        </div>

        {/* User card */}
        <div className="mx-3 mt-4 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-[#007991]" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
              {avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{currentUser.name}</p>
              <p className="text-white/60 text-[11px] truncate">{currentUser.email}</p>
            </div>
          </div>
          <div className="mt-2 px-1">
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: ROLE_COLOR[role], color: ROLE_TEXT[role] }}>
              {ROLE_LABEL[role]}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {groups.map((group, gi) => (
            <div key={gi}>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-2 mb-1.5">
                {labels[gi]}
              </p>
              <ul className="space-y-0.5">
                {group.map(item => {
                  const isActive = currentPage === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => navigate(item.id as any)}
                        className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left group ${isActive ? 'sidebar-item-active' : 'hover:bg-white/10'}`}
                      >
                        <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                          {item.icon}
                        </span>
                        <span className={`flex-1 text-sm ${isActive ? 'text-white font-semibold' : 'text-white/75 group-hover:text-white font-medium'}`}>
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF9635] text-white text-[10px] font-bold flex items-center justify-center">
                            {item.badge}
                          </span>
                        ) : isActive && (
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <button
            onClick={() => navigate(`${role}-profile` as any)}
            className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white group"
          >
            <IconSettings size={18} className="flex-shrink-0" />
            <span className="text-sm font-medium">Profile & Settings</span>
          </button>
          <button
            onClick={logout}
            className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white group"
          >
            <IconLogOut size={18} className="flex-shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
