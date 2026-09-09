import { AppProvider, useApp } from './contexts/AppContext';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import CoursesPage from './pages/student/CoursesPage';
import AssignmentsPage from './pages/student/AssignmentsPage';
import AttendancePage from './pages/student/AttendancePage';
import GradesPage from './pages/student/GradesPage';
import PaymentsPage from './pages/student/PaymentsPage';
import CertificatesPage from './pages/student/CertificatesPage';
import MessagesPage from './pages/student/MessagesPage';

// Parent pages
import ParentDashboard from './pages/parent/ParentDashboard';

// Trainer pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerAttendancePage from './pages/trainer/TrainerAttendancePage';
import TrainerAssignmentsPage from './pages/trainer/TrainerAssignmentsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import CoursesAdminPage from './pages/admin/CoursesPage';

// Shared
import PlaceholderPage from './pages/PlaceholderPage';
import ToastContainer from './components/ui/Toast';

function Router() {
  const { currentUser, currentPage } = useApp();

  // Auth routes
  if (!currentUser) {
    if (currentPage === 'register') return <RegisterPage />;
    return <LoginPage />;
  }

  // Student routes
  if (currentPage === 'student-dashboard') return <StudentDashboard />;
  if (currentPage === 'student-courses') return <CoursesPage />;
  if (currentPage === 'student-assignments') return <AssignmentsPage />;
  if (currentPage === 'student-attendance') return <AttendancePage />;
  if (currentPage === 'student-grades') return <GradesPage />;
  if (currentPage === 'student-payments') return <PaymentsPage />;
  if (currentPage === 'student-certificates') return <CertificatesPage />;
  if (currentPage === 'student-messages') return <MessagesPage />;

  // Parent routes
  if (currentPage === 'parent-dashboard') return <ParentDashboard />;

  // Trainer routes
  if (currentPage === 'trainer-dashboard') return <TrainerDashboard />;
  if (currentPage === 'trainer-attendance') return <TrainerAttendancePage />;
  if (currentPage === 'trainer-assignments') return <TrainerAssignmentsPage />;

  // Admin routes
  if (currentPage === 'admin-dashboard') return <AdminDashboard />;
  if (currentPage === 'admin-users') return <UsersPage />;
  if (currentPage === 'admin-courses') return <CoursesAdminPage />;

  // Placeholder for all other routes
  return <PlaceholderPage pageId={currentPage} />;
}

export default function App() {
  return (
    <AppProvider>
      <div className="h-full">
        <Router />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
