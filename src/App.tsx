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
import GrievancesPage from './pages/student/GrievancesPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Parent pages
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentAttendancePage from './pages/parent/ParentAttendancePage';
import ParentGradesPage from './pages/parent/ParentGradesPage';
import ParentPaymentsPage from './pages/parent/ParentPaymentsPage';
import ParentMessagesPage from './pages/parent/ParentMessagesPage';
import ParentProfilePage from './pages/parent/ParentProfilePage';

// Trainer pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerCoursesPage from './pages/trainer/TrainerCoursesPage';
import TrainerAttendancePage from './pages/trainer/TrainerAttendancePage';
import TrainerAssignmentsPage from './pages/trainer/TrainerAssignmentsPage';
import TrainerStudentsPage from './pages/trainer/TrainerStudentsPage';
import TrainerMessagesPage from './pages/trainer/TrainerMessagesPage';
import TrainerProfilePage from './pages/trainer/TrainerProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import CoursesAdminPage from './pages/admin/CoursesPage';
import BatchesPage from './pages/admin/BatchesPage';
import FinancePage from './pages/admin/FinancePage';
import ReportsPage from './pages/admin/ReportsPage';
import AdminGrievancesPage from './pages/admin/AdminGrievancesPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// Shared
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
  if (currentPage === 'student-grievances') return <GrievancesPage />;
  if (currentPage === 'student-profile') return <StudentProfilePage />;

  // Parent routes
  if (currentPage === 'parent-dashboard') return <ParentDashboard />;
  if (currentPage === 'parent-attendance') return <ParentAttendancePage />;
  if (currentPage === 'parent-grades') return <ParentGradesPage />;
  if (currentPage === 'parent-payments') return <ParentPaymentsPage />;
  if (currentPage === 'parent-messages') return <ParentMessagesPage />;
  if (currentPage === 'parent-profile') return <ParentProfilePage />;

  // Trainer routes
  if (currentPage === 'trainer-dashboard') return <TrainerDashboard />;
  if (currentPage === 'trainer-courses') return <TrainerCoursesPage />;
  if (currentPage === 'trainer-attendance') return <TrainerAttendancePage />;
  if (currentPage === 'trainer-assignments') return <TrainerAssignmentsPage />;
  if (currentPage === 'trainer-students') return <TrainerStudentsPage />;
  if (currentPage === 'trainer-messages') return <TrainerMessagesPage />;
  if (currentPage === 'trainer-profile') return <TrainerProfilePage />;

  // Admin routes
  if (currentPage === 'admin-dashboard') return <AdminDashboard />;
  if (currentPage === 'admin-users') return <UsersPage />;
  if (currentPage === 'admin-courses') return <CoursesAdminPage />;
  if (currentPage === 'admin-batches') return <BatchesPage />;
  if (currentPage === 'admin-finance') return <FinancePage />;
  if (currentPage === 'admin-reports') return <ReportsPage />;
  if (currentPage === 'admin-grievances') return <AdminGrievancesPage />;
  if (currentPage === 'admin-settings') return <SettingsPage />;
  if (currentPage === 'admin-profile') return <AdminProfilePage />;

  // Default fallback to role-specific dashboard
  if (currentUser.role === 'admin') return <AdminDashboard />;
  if (currentUser.role === 'trainer') return <TrainerDashboard />;
  if (currentUser.role === 'parent') return <ParentDashboard />;
  return <StudentDashboard />;
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
