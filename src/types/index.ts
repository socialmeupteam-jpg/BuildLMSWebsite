export type UserRole = 'student' | 'parent' | 'trainer' | 'admin';

export type AccountStatus = 'active' | 'pending' | 'suspended' | 'deactivated';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  joinDate: string;
  status: AccountStatus;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  duration: string;
  price: number;
  originalPrice?: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  trainer: string;
  trainerId: string;
  enrolledCount: number;
  modulesCount: number;
  lessonsCount: number;
  rating: number;
  tags: string[];
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  thumbnail: string;
  progress: number;
  status: 'active' | 'completed' | 'suspended' | 'expired';
  enrolledDate: string;
  lastAccessed?: string;
  nextLesson?: string;
  trainer: string;
  batch?: string;
  lessonsCompleted: number;
  totalLessons: number;
  certificate?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseTitle: string;
  courseId: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded' | 'late' | 'missed' | 'resubmit';
  submittedDate?: string;
  marksObtained?: number;
  feedback?: string;
  attachments?: string[];
  trainerName: string;
}

export interface AttendanceRecord {
  date: string;
  dayOfWeek: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  session: string;
  course: string;
  batchName: string;
  remarks?: string;
  markedBy?: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export interface GradeRecord {
  id: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project';
  title: string;
  course: string;
  maxMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  date: string;
  status: 'published' | 'pending';
  feedback?: string;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  tax?: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed' | 'refunded';
  method?: string;
  transactionId?: string;
  course?: string;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  courseId: string;
  issuedDate: string;
  certificateNumber: string;
  status: 'issued' | 'pending' | 'revoked';
  verificationUrl?: string;
  downloadUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement' | 'grade' | 'payment';
  read: boolean;
  date: string;
  actionUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  author: string;
  date: string;
  audience: 'all' | 'students' | 'trainers' | 'parents';
  priority: 'normal' | 'high';
  pinned?: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  coursesCount: number;
  attendance: number;
  avgGrade: number;
  gradeLabel: string;
  status: 'active' | 'suspended' | 'inactive' | 'pending';
  avatar?: string;
  batch?: string;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  courseTitle: string;
  startDate: string;
  endDate: string;
  schedule: string;
  trainerId: string;
  trainerName: string;
  studentsCount: number;
  maxCapacity: number;
  status: 'upcoming' | 'active' | 'completed';
  mode: 'online' | 'offline' | 'hybrid';
}

export interface Message {
  id: string;
  from: string;
  fromRole: UserRole;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  avatar?: string;
}

export interface GrievanceTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  createdDate: string;
  updatedDate: string;
  description: string;
}

export interface AdminStats {
  totalStudents: number;
  totalTrainers: number;
  totalCourses: number;
  totalEnrollments: number;
  revenue: number;
  pendingPayments: number;
  certificatesIssued: number;
  activeGrievances: number;
  avgAttendance: number;
  completionRate: number;
}

export interface NavigationPage {
  id: string;
  section?: string;
}
