import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole, Notification } from '../types';
import { DEMO_USERS, NOTIFICATIONS } from '../data/mockData';

type Page =
  | 'login' | 'register'
  | 'student-dashboard' | 'student-courses' | 'student-assignments' | 'student-attendance' | 'student-grades' | 'student-payments' | 'student-certificates' | 'student-messages' | 'student-grievances' | 'student-profile'
  | 'parent-dashboard' | 'parent-attendance' | 'parent-grades' | 'parent-payments' | 'parent-messages' | 'parent-profile'
  | 'trainer-dashboard' | 'trainer-courses' | 'trainer-attendance' | 'trainer-assignments' | 'trainer-students' | 'trainer-messages' | 'trainer-profile'
  | 'admin-dashboard' | 'admin-users' | 'admin-courses' | 'admin-batches' | 'admin-finance' | 'admin-reports' | 'admin-grievances' | 'admin-settings' | 'admin-profile';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextValue {
  currentUser: User | null;
  currentPage: Page;
  notifications: Notification[];
  unreadCount: number;
  toasts: Toast[];
  sidebarOpen: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  navigate: (page: Page) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const login = useCallback((role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      const defaultPages: Record<UserRole, Page> = {
        student: 'student-dashboard',
        parent: 'parent-dashboard',
        trainer: 'trainer-dashboard',
        admin: 'admin-dashboard',
      };
      setCurrentPage(defaultPages[role]);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentPage('login');
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, currentPage, notifications, unreadCount,
      toasts, sidebarOpen,
      login, logout, navigate, addToast,
      markNotificationRead, markAllRead, toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
