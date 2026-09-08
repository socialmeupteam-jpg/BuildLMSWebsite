import type {
  User, Course, Enrollment, Assignment, AttendanceRecord,
  AttendanceSummary, GradeRecord, Payment, Certificate,
  Notification, Announcement, Student, Batch, Message,
  GrievanceTicket, AdminStats
} from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'student-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    role: 'student',
    phone: '+91 98765 43210',
    joinDate: '2024-02-15',
    status: 'active',
    bio: 'Aspiring digital marketer passionate about social media and content creation.',
    avatar: 'RS',
  },
  {
    id: 'parent-1',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@email.com',
    role: 'parent',
    phone: '+91 98765 43211',
    joinDate: '2024-02-15',
    status: 'active',
    bio: 'Parent of Rahul Sharma',
    avatar: 'SS',
  },
  {
    id: 'trainer-1',
    name: 'Ankit Verma',
    email: 'ankit.verma@socialmeup.in',
    role: 'trainer',
    phone: '+91 99887 76655',
    joinDate: '2023-06-01',
    status: 'active',
    bio: '8+ years in digital marketing. Ex-Dentsu. Expert in performance marketing and brand strategy.',
    avatar: 'AV',
  },
  {
    id: 'admin-1',
    name: 'Rajesh Kumar',
    email: 'admin@socialmeupacademy.in',
    role: 'admin',
    phone: '+91 99001 12233',
    joinDate: '2023-01-01',
    status: 'active',
    bio: 'Academy Operations Director',
    avatar: 'RK',
  },
];

export const COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Digital Marketing Mastery',
    slug: 'digital-marketing-mastery',
    shortDescription: 'Master the complete digital marketing ecosystem — from SEO and social media to paid ads, email marketing, and analytics.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop&auto=format',
    duration: '6 months',
    price: 15000,
    originalPrice: 20000,
    category: 'Digital Marketing',
    level: 'beginner',
    status: 'published',
    trainer: 'Ankit Verma',
    trainerId: 'trainer-1',
    enrolledCount: 248,
    modulesCount: 12,
    lessonsCount: 86,
    rating: 4.8,
    tags: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
  },
  {
    id: 'course-2',
    title: 'Social Media Marketing Essentials',
    slug: 'social-media-marketing',
    shortDescription: 'Build and grow brand presence across Instagram, Facebook, LinkedIn, and YouTube using proven strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=340&fit=crop&auto=format',
    duration: '3 months',
    price: 8000,
    category: 'Social Media',
    level: 'beginner',
    status: 'published',
    trainer: 'Sneha Nair',
    trainerId: 'trainer-2',
    enrolledCount: 156,
    modulesCount: 8,
    lessonsCount: 52,
    rating: 4.7,
    tags: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube'],
  },
  {
    id: 'course-3',
    title: 'SEO & Content Strategy',
    slug: 'seo-content-strategy',
    shortDescription: 'Rank on Google, create high-converting content, and build authority through technical and on-page SEO mastery.',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=340&fit=crop&auto=format',
    duration: '4 months',
    price: 10000,
    category: 'SEO',
    level: 'intermediate',
    status: 'published',
    trainer: 'Vikram Singh',
    trainerId: 'trainer-3',
    enrolledCount: 112,
    modulesCount: 10,
    lessonsCount: 68,
    rating: 4.9,
    tags: ['SEO', 'Content Writing', 'Keyword Research', 'Link Building'],
  },
  {
    id: 'course-4',
    title: 'Performance Marketing: Meta & Google Ads',
    slug: 'performance-marketing',
    shortDescription: 'Run profitable ad campaigns on Meta and Google. Learn ROAS, targeting, creatives, and funnel optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format',
    duration: '3 months',
    price: 12000,
    originalPrice: 15000,
    category: 'Paid Advertising',
    level: 'advanced',
    status: 'published',
    trainer: 'Ankit Verma',
    trainerId: 'trainer-1',
    enrolledCount: 89,
    modulesCount: 9,
    lessonsCount: 61,
    rating: 4.8,
    tags: ['Meta Ads', 'Google Ads', 'ROAS', 'Funnel'],
  },
];

export const STUDENT_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-1',
    courseId: 'course-1',
    courseTitle: 'Digital Marketing Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop&auto=format',
    progress: 68,
    status: 'active',
    enrolledDate: '2024-02-20',
    lastAccessed: '2024-12-10',
    nextLesson: 'Module 8: Email Marketing Fundamentals',
    trainer: 'Ankit Verma',
    batch: 'DMM-Feb-2024',
    lessonsCompleted: 58,
    totalLessons: 86,
  },
  {
    id: 'enr-2',
    courseId: 'course-2',
    courseTitle: 'Social Media Marketing Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=340&fit=crop&auto=format',
    progress: 100,
    status: 'completed',
    enrolledDate: '2023-10-10',
    lastAccessed: '2024-01-15',
    trainer: 'Sneha Nair',
    batch: 'SMM-Oct-2023',
    lessonsCompleted: 52,
    totalLessons: 52,
    certificate: 'cert-2',
  },
  {
    id: 'enr-3',
    courseId: 'course-3',
    courseTitle: 'SEO & Content Strategy',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=340&fit=crop&auto=format',
    progress: 24,
    status: 'active',
    enrolledDate: '2024-09-01',
    lastAccessed: '2024-12-08',
    nextLesson: 'Module 3: On-Page SEO Techniques',
    trainer: 'Vikram Singh',
    batch: 'SEO-Sep-2024',
    lessonsCompleted: 16,
    totalLessons: 68,
  },
];

export const STUDENT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn-1',
    title: 'Social Media Audit Report',
    courseTitle: 'Digital Marketing Mastery',
    courseId: 'course-1',
    description: 'Conduct a comprehensive audit of a brand of your choice on 3 social media platforms. Analyze engagement rates, content strategy, and competitor positioning.',
    dueDate: '2024-12-15',
    maxMarks: 100,
    status: 'pending',
    trainerName: 'Ankit Verma',
  },
  {
    id: 'asgn-2',
    title: 'Google Ads Campaign Setup',
    courseTitle: 'Digital Marketing Mastery',
    courseId: 'course-1',
    description: 'Set up a complete Google Search campaign for a provided e-commerce brief. Include keyword research, ad copies, and bid strategy.',
    dueDate: '2024-12-22',
    maxMarks: 100,
    status: 'submitted',
    submittedDate: '2024-12-11',
    trainerName: 'Ankit Verma',
  },
  {
    id: 'asgn-3',
    title: 'SEO Keyword Research Document',
    courseTitle: 'SEO & Content Strategy',
    courseId: 'course-3',
    description: 'Build a comprehensive keyword research document for a B2B SaaS company. Include primary, secondary, and long-tail keywords with search volume and difficulty.',
    dueDate: '2024-12-10',
    maxMarks: 50,
    status: 'graded',
    submittedDate: '2024-12-08',
    marksObtained: 44,
    feedback: 'Excellent keyword grouping and intent categorisation. The competitor gap analysis was particularly insightful. Minor improvement needed in local SEO terms.',
    trainerName: 'Vikram Singh',
  },
  {
    id: 'asgn-4',
    title: 'Instagram Content Calendar',
    courseTitle: 'Digital Marketing Mastery',
    courseId: 'course-1',
    description: 'Create a 30-day Instagram content calendar for a fashion brand.',
    dueDate: '2024-11-25',
    maxMarks: 75,
    status: 'graded',
    submittedDate: '2024-11-24',
    marksObtained: 68,
    feedback: 'Great creative concepts. The theme consistency across the calendar was well maintained. Work on more diverse content formats.',
    trainerName: 'Ankit Verma',
  },
  {
    id: 'asgn-5',
    title: 'Meta Ads Creative Analysis',
    courseTitle: 'Digital Marketing Mastery',
    courseId: 'course-1',
    description: 'Analyze 10 top-performing Meta ad creatives in the Ed-Tech space.',
    dueDate: '2024-11-10',
    maxMarks: 60,
    status: 'late',
    submittedDate: '2024-11-15',
    marksObtained: 48,
    feedback: 'Good analysis despite late submission. Late penalty applied (10%). The hooks breakdown was excellent.',
    trainerName: 'Ankit Verma',
  },
];

const MONTHS_30 = ['2024-11-01', '2024-11-04', '2024-11-06', '2024-11-08', '2024-11-11', '2024-11-13', '2024-11-15', '2024-11-18', '2024-11-20', '2024-11-22', '2024-11-25', '2024-11-27', '2024-11-29', '2024-12-02', '2024-12-04', '2024-12-06', '2024-12-09', '2024-12-11'];

const STATUSES: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'absent', 'present', 'late', 'present', 'excused', 'present'];

export const STUDENT_ATTENDANCE: AttendanceRecord[] = MONTHS_30.map((date, i) => ({
  date,
  dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
  status: STATUSES[i] || 'present',
  session: i % 3 === 0 ? 'Session A (10:00 AM)' : i % 3 === 1 ? 'Session B (2:00 PM)' : 'Session C (6:00 PM)',
  course: i < 12 ? 'Digital Marketing Mastery' : 'SEO & Content Strategy',
  batchName: i < 12 ? 'DMM-Feb-2024' : 'SEO-Sep-2024',
  markedBy: 'Ankit Verma',
}));

export const ATTENDANCE_SUMMARY: AttendanceSummary = {
  totalClasses: 18,
  present: 14,
  absent: 1,
  late: 1,
  excused: 2,
  percentage: 83,
};

export const STUDENT_GRADES: GradeRecord[] = [
  { id: 'gr-1', type: 'assignment', title: 'Instagram Content Calendar', course: 'Digital Marketing Mastery', maxMarks: 75, marksObtained: 68, percentage: 91, grade: 'A', date: '2024-11-28', status: 'published', feedback: 'Excellent work on theme consistency.' },
  { id: 'gr-2', type: 'assignment', title: 'Meta Ads Creative Analysis', course: 'Digital Marketing Mastery', maxMarks: 60, marksObtained: 48, percentage: 80, grade: 'B+', date: '2024-11-18', status: 'published', feedback: 'Good analysis. Late penalty applied.' },
  { id: 'gr-3', type: 'quiz', title: 'Module 5 Quiz: SEO Fundamentals', course: 'Digital Marketing Mastery', maxMarks: 50, marksObtained: 46, percentage: 92, grade: 'A', date: '2024-11-10', status: 'published' },
  { id: 'gr-4', type: 'assignment', title: 'SEO Keyword Research Document', course: 'SEO & Content Strategy', maxMarks: 50, marksObtained: 44, percentage: 88, grade: 'A-', date: '2024-12-10', status: 'published', feedback: 'Excellent keyword grouping.' },
  { id: 'gr-5', type: 'exam', title: 'Mid-Course Assessment', course: 'Digital Marketing Mastery', maxMarks: 100, marksObtained: 82, percentage: 82, grade: 'B+', date: '2024-10-30', status: 'published' },
  { id: 'gr-6', type: 'quiz', title: 'Module 2 Quiz: Content Fundamentals', course: 'SEO & Content Strategy', maxMarks: 30, marksObtained: 27, percentage: 90, grade: 'A', date: '2024-10-15', status: 'published' },
];

export const STUDENT_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    invoiceNumber: 'INV-2024-0892',
    description: 'Digital Marketing Mastery — Installment 3 of 3',
    amount: 5000,
    dueDate: '2024-12-31',
    status: 'pending',
    course: 'Digital Marketing Mastery',
  },
  {
    id: 'pay-2',
    invoiceNumber: 'INV-2024-0741',
    description: 'Digital Marketing Mastery — Installment 2 of 3',
    amount: 5000,
    dueDate: '2024-10-31',
    paidDate: '2024-10-28',
    status: 'paid',
    method: 'UPI',
    transactionId: 'RZP20241028A1B2',
    course: 'Digital Marketing Mastery',
  },
  {
    id: 'pay-3',
    invoiceNumber: 'INV-2024-0512',
    description: 'Digital Marketing Mastery — Installment 1 of 3',
    amount: 5000,
    dueDate: '2024-07-31',
    paidDate: '2024-07-29',
    status: 'paid',
    method: 'Razorpay',
    transactionId: 'RZP20240729C3D4',
    course: 'Digital Marketing Mastery',
  },
  {
    id: 'pay-4',
    invoiceNumber: 'INV-2023-0398',
    description: 'Social Media Marketing Essentials — Full Payment',
    amount: 8000,
    dueDate: '2023-10-15',
    paidDate: '2023-10-14',
    status: 'paid',
    method: 'Net Banking',
    transactionId: 'RZP20231014E5F6',
    course: 'Social Media Marketing Essentials',
  },
  {
    id: 'pay-5',
    invoiceNumber: 'INV-2024-0831',
    description: 'SEO & Content Strategy — Full Payment',
    amount: 10000,
    dueDate: '2024-09-05',
    paidDate: '2024-09-03',
    status: 'paid',
    method: 'UPI',
    transactionId: 'RZP20240903G7H8',
    course: 'SEO & Content Strategy',
  },
];

export const STUDENT_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    courseTitle: 'Social Media Marketing Essentials',
    courseId: 'course-2',
    issuedDate: '2024-01-20',
    certificateNumber: 'SMA-2024-SMM-00247',
    status: 'issued',
    verificationUrl: 'https://lms.socialmeupacademy.in/verify/SMA-2024-SMM-00247',
    downloadUrl: '#',
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n-1', title: 'Assignment Due Tomorrow', message: '"Social Media Audit Report" is due on December 15. Please submit before 11:59 PM.', type: 'warning', read: false, date: '2024-12-14T09:00:00Z' },
  { id: 'n-2', title: 'Assignment Graded', message: 'Your "SEO Keyword Research Document" has been graded. You scored 44/50.', type: 'grade', read: false, date: '2024-12-10T14:30:00Z' },
  { id: 'n-3', title: 'New Announcement', message: 'Guest lecture by industry expert on Dec 20. Attendance is mandatory for all DMM students.', type: 'announcement', read: false, date: '2024-12-09T10:00:00Z' },
  { id: 'n-4', title: 'Payment Reminder', message: 'Your Digital Marketing Mastery installment of ₹5,000 is due on December 31.', type: 'payment', read: true, date: '2024-12-01T08:00:00Z' },
  { id: 'n-5', title: 'Certificate Ready', message: 'Your certificate for "Social Media Marketing Essentials" is ready. Download it from Certificates page.', type: 'success', read: true, date: '2024-01-20T16:00:00Z' },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Special Guest Lecture — Industry Leader from Dentsu',
    message: 'We are excited to host a special guest lecture by a Senior Director from Dentsu on "The Future of AI in Digital Marketing" on December 20, 2024 at 5:00 PM. All Digital Marketing Mastery students must attend. Meeting link will be shared 24 hours before.',
    author: 'Rajesh Kumar',
    date: '2024-12-09',
    audience: 'students',
    priority: 'high',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'Holiday Schedule — December 24–26',
    message: 'The academy will be on holiday from December 24–26. Classes will resume on December 27. Assignment deadlines falling in this period are extended by 3 days. Happy holidays!',
    author: 'Rajesh Kumar',
    date: '2024-12-05',
    audience: 'all',
    priority: 'normal',
  },
  {
    id: 'ann-3',
    title: 'Mid-Course Project Guidelines Released',
    message: 'The mid-course capstone project guidelines for Digital Marketing Mastery have been published. Check your course materials section for the full brief. Submission deadline: January 15, 2025.',
    author: 'Ankit Verma',
    date: '2024-12-01',
    audience: 'students',
    priority: 'normal',
  },
];

export const MESSAGES: Message[] = [
  { id: 'msg-1', from: 'Ankit Verma', fromRole: 'trainer', subject: 'Feedback on your Google Ads assignment', preview: 'Hi Rahul, I reviewed your Google Ads campaign setup and wanted to give you some additional pointers on bid strategy...', date: '2024-12-11', read: false },
  { id: 'msg-2', from: 'Vikram Singh', fromRole: 'trainer', subject: 'Module 3 resources shared', preview: 'I have uploaded additional reading materials for Module 3 in the course resources section. These cover technical SEO aspects...', date: '2024-12-08', read: true },
  { id: 'msg-3', from: 'Rajesh Kumar', fromRole: 'admin', subject: 'Welcome to SocialMeUp Academy', preview: 'Welcome aboard, Rahul! We are thrilled to have you as part of the SocialMeUp family. Your learning journey starts now...', date: '2024-02-20', read: true },
];

export const ADMIN_STUDENTS: Student[] = [
  { id: 's-1', name: 'Rahul Sharma', email: 'rahul@email.com', phone: '+91 98765 43210', enrollmentDate: '2024-02-20', coursesCount: 3, attendance: 83, avgGrade: 87, gradeLabel: 'A-', status: 'active', batch: 'DMM-Feb-2024' },
  { id: 's-2', name: 'Priya Patel', email: 'priya@email.com', phone: '+91 97654 32109', enrollmentDate: '2024-02-20', coursesCount: 2, attendance: 91, avgGrade: 93, gradeLabel: 'A+', status: 'active', batch: 'DMM-Feb-2024' },
  { id: 's-3', name: 'Arjun Kumar', email: 'arjun@email.com', phone: '+91 96543 21098', enrollmentDate: '2024-03-15', coursesCount: 1, attendance: 72, avgGrade: 74, gradeLabel: 'B', status: 'active', batch: 'SMM-Mar-2024' },
  { id: 's-4', name: 'Ananya Gupta', email: 'ananya@email.com', phone: '+91 95432 10987', enrollmentDate: '2024-04-01', coursesCount: 2, attendance: 88, avgGrade: 91, gradeLabel: 'A', status: 'active', batch: 'SEO-Apr-2024' },
  { id: 's-5', name: 'Rohan Verma', email: 'rohan@email.com', phone: '+91 94321 09876', enrollmentDate: '2024-01-10', coursesCount: 1, attendance: 65, avgGrade: 68, gradeLabel: 'C+', status: 'suspended', batch: 'DMM-Jan-2024' },
  { id: 's-6', name: 'Meera Krishnan', email: 'meera@email.com', phone: '+91 93210 98765', enrollmentDate: '2024-05-20', coursesCount: 3, attendance: 95, avgGrade: 96, gradeLabel: 'A+', status: 'active', batch: 'PM-May-2024' },
  { id: 's-7', name: 'Karan Mehta', email: 'karan@email.com', phone: '+91 92109 87654', enrollmentDate: '2024-06-01', coursesCount: 1, attendance: 79, avgGrade: 82, gradeLabel: 'B+', status: 'active', batch: 'SEO-Jun-2024' },
  { id: 's-8', name: 'Neha Joshi', email: 'neha@email.com', phone: '+91 91098 76543', enrollmentDate: '2024-09-10', coursesCount: 2, attendance: 90, avgGrade: 88, gradeLabel: 'A-', status: 'active', batch: 'DMM-Sep-2024' },
];

export const ADMIN_STATS: AdminStats = {
  totalStudents: 248,
  totalTrainers: 12,
  totalCourses: 18,
  totalEnrollments: 412,
  revenue: 3250000,
  pendingPayments: 185000,
  certificatesIssued: 178,
  activeGrievances: 7,
  avgAttendance: 84,
  completionRate: 71,
};

export const BATCHES: Batch[] = [
  { id: 'b-1', name: 'DMM-Feb-2024', courseId: 'course-1', courseTitle: 'Digital Marketing Mastery', startDate: '2024-02-20', endDate: '2024-08-20', schedule: 'Mon/Wed/Fri 6:00–8:00 PM', trainerId: 'trainer-1', trainerName: 'Ankit Verma', studentsCount: 32, maxCapacity: 40, status: 'active', mode: 'online' },
  { id: 'b-2', name: 'SMM-Oct-2023', courseId: 'course-2', courseTitle: 'Social Media Marketing Essentials', startDate: '2023-10-10', endDate: '2024-01-10', schedule: 'Tue/Thu 5:00–7:00 PM', trainerId: 'trainer-2', trainerName: 'Sneha Nair', studentsCount: 28, maxCapacity: 35, status: 'completed', mode: 'online' },
  { id: 'b-3', name: 'SEO-Sep-2024', courseId: 'course-3', courseTitle: 'SEO & Content Strategy', startDate: '2024-09-01', endDate: '2024-12-31', schedule: 'Sat/Sun 10:00 AM–1:00 PM', trainerId: 'trainer-3', trainerName: 'Vikram Singh', studentsCount: 24, maxCapacity: 30, status: 'active', mode: 'hybrid' },
  { id: 'b-4', name: 'PM-Jan-2025', courseId: 'course-4', courseTitle: 'Performance Marketing: Meta & Google Ads', startDate: '2025-01-15', endDate: '2025-04-15', schedule: 'Mon/Wed 7:00–9:00 PM', trainerId: 'trainer-1', trainerName: 'Ankit Verma', studentsCount: 18, maxCapacity: 25, status: 'upcoming', mode: 'online' },
];

export const GRIEVANCES: GrievanceTicket[] = [
  { id: 'gv-1', ticketNumber: 'TKT-2024-0142', subject: 'Certificate not received after course completion', category: 'Certification', priority: 'high', status: 'in_progress', createdDate: '2024-12-05', updatedDate: '2024-12-10', description: 'I completed the Social Media Marketing course 3 weeks ago but have not received my certificate yet.' },
  { id: 'gv-2', ticketNumber: 'TKT-2024-0138', subject: 'Payment receipt not sent for October installment', category: 'Finance', priority: 'medium', status: 'resolved', createdDate: '2024-10-30', updatedDate: '2024-11-02', description: 'I made the October payment but did not receive the official payment receipt on email.' },
];

export const TRAINER_TODAY_CLASSES = [
  { id: 'cls-1', batchName: 'DMM-Feb-2024', courseName: 'Digital Marketing Mastery', topic: 'Module 8: Email Marketing — Segmentation & Automation', time: '6:00 PM – 8:00 PM', studentsExpected: 32, studentsPresent: 0, status: 'upcoming', mode: 'online', link: 'https://meet.google.com/abc-defg-hij' },
  { id: 'cls-2', batchName: 'PM-Dec-2024', courseName: 'Performance Marketing', topic: 'Module 4: Google Ads — Smart Bidding Strategies', time: '10:00 AM – 12:00 PM', studentsExpected: 18, studentsPresent: 16, status: 'completed', mode: 'online', link: 'https://meet.google.com/xyz-uvwx-yza' },
];

export const TRAINER_PENDING_SUBMISSIONS = [
  { id: 'ps-1', studentName: 'Priya Patel', assignmentTitle: 'Google Ads Campaign Setup', submittedDate: '2024-12-11', course: 'Digital Marketing Mastery', status: 'submitted' },
  { id: 'ps-2', studentName: 'Karan Mehta', assignmentTitle: 'Google Ads Campaign Setup', submittedDate: '2024-12-11', course: 'Digital Marketing Mastery', status: 'submitted' },
  { id: 'ps-3', studentName: 'Neha Joshi', assignmentTitle: 'Google Ads Campaign Setup', submittedDate: '2024-12-12', course: 'Digital Marketing Mastery', status: 'submitted' },
  { id: 'ps-4', studentName: 'Arjun Kumar', assignmentTitle: 'Google Ads Campaign Setup', submittedDate: '2024-12-12', course: 'Digital Marketing Mastery', status: 'resubmit' },
];

export const TRAINER_STUDENTS: Student[] = ADMIN_STUDENTS.filter(s => ['DMM-Feb-2024', 'DMM-Sep-2024'].includes(s.batch || ''));

export const RECENT_ADMIN_ACTIVITIES = [
  { id: 'act-1', action: 'New enrollment', detail: 'Priya Patel enrolled in SEO & Content Strategy', time: '2 hours ago', type: 'enrollment' },
  { id: 'act-2', action: 'Payment received', detail: '₹10,000 from Arjun Kumar for SEO course', time: '4 hours ago', type: 'payment' },
  { id: 'act-3', action: 'Certificate issued', detail: 'Certificate issued to Meera Krishnan for Social Media Marketing', time: '1 day ago', type: 'certificate' },
  { id: 'act-4', action: 'New grievance', detail: 'Ticket TKT-2024-0142 opened by Rahul Sharma', time: '2 days ago', type: 'grievance' },
  { id: 'act-5', action: 'Course published', detail: 'Performance Marketing: Meta & Google Ads batch PM-Jan-2025 created', time: '3 days ago', type: 'course' },
];
