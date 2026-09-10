import { useState } from 'react';
import DashboardLayout, { PageHeader } from '../../components/layout/DashboardLayout';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { STUDENT_ENROLLMENTS, COURSES } from '../../data/mockData';
import {
  IconPlay,
  IconBook,
  IconClock,
  IconUsers,
  IconStar,
  IconCheckCircle,
  IconChevronRight,
  IconDownload,
} from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  isCompleted: boolean;
  type: 'video' | 'quiz' | 'reading';
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

const SAMPLE_CURRICULUM: Record<string, Module[]> = {
  'c-001': [
    {
      id: 'm1',
      title: 'Module 1: Foundations of Digital Marketing',
      lessons: [
        { id: 'l1', title: 'Welcome & Course Orientation', duration: '12:45', isCompleted: true, type: 'video' },
        { id: 'l2', title: 'The Modern Digital Marketing Landscape', duration: '18:20', isCompleted: true, type: 'video' },
        { id: 'l3', title: 'Understanding Customer Personas & Funnels', duration: '24:10', isCompleted: true, type: 'video' },
        { id: 'l4', title: 'Module 1 Knowledge Check Quiz', duration: '15:00', isCompleted: true, type: 'quiz' },
      ],
    },
    {
      id: 'm2',
      title: 'Module 2: Search Engine Optimization (SEO)',
      lessons: [
        { id: 'l5', title: 'Keyword Research Masterclass', duration: '32:15', isCompleted: true, type: 'video' },
        { id: 'l6', title: 'On-Page SEO Best Practices', duration: '28:40', isCompleted: false, type: 'video' },
        { id: 'l7', title: 'Technical SEO Audit Walkthrough', duration: '35:10', isCompleted: false, type: 'video' },
        { id: 'l8', title: 'Backlink Building Strategies', duration: '21:05', isCompleted: false, type: 'video' },
      ],
    },
    {
      id: 'm3',
      title: 'Module 3: Paid Advertising & PPC',
      lessons: [
        { id: 'l9', title: 'Google Ads Account Architecture', duration: '29:50', isCompleted: false, type: 'video' },
        { id: 'l10', title: 'Campaign Budget Optimization', duration: '26:15', isCompleted: false, type: 'video' },
      ],
    },
  ],
};

export default function CoursesPage() {
  const { addToast, navigate } = useApp();
  const [tab, setTab] = useState<'enrolled' | 'browse'>('enrolled');

  // Player & Curriculum Modal State
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<Record<string, Module[]>>(SAMPLE_CURRICULUM);
  const [activeLessonId, setActiveLessonId] = useState<string>('l6');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(45);

  const activeEnrollment = STUDENT_ENROLLMENTS.find(e => e.courseId === activeCourseId);
  const activeModules = activeCourseId ? curriculum[activeCourseId] || curriculum['c-001'] : [];

  // Flatten lessons to find active lesson
  const allLessons = activeModules.flatMap(m => m.lessons);
  const currentLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);

  const handleOpenCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    // select first uncompleted lesson
    const modules = curriculum[courseId] || curriculum['c-001'];
    const uncompleted = modules.flatMap(m => m.lessons).find(l => !l.isCompleted);
    if (uncompleted) {
      setActiveLessonId(uncompleted.id);
    } else if (modules[0]?.lessons[0]) {
      setActiveLessonId(modules[0].lessons[0].id);
    }
  };

  const handleToggleLessonComplete = (lessonId: string) => {
    if (!activeCourseId) return;
    setCurriculum(prev => {
      const courseMods = prev[activeCourseId] || prev['c-001'];
      const updated = courseMods.map(m => ({
        ...m,
        lessons: m.lessons.map(l => (l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l)),
      }));
      return { ...prev, [activeCourseId]: updated };
    });

    addToast({
      title: 'Progress Saved',
      message: 'Lesson status updated successfully.',
      type: 'success',
    });
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentLessonIndex + 1].id);
      setIsPlaying(true);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(allLessons[currentLessonIndex - 1].id);
      setIsPlaying(true);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Courses"
        subtitle="Track your learning progress across all enrolled courses"
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-6">
        {(['enrolled', 'browse'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${tab === t ? 'bg-white text-[#007991] shadow-sm' : 'text-[#667085] hover:text-[#1F2933]'}`}
          >
            {t === 'enrolled' ? `My Enrollments (${STUDENT_ENROLLMENTS.length})` : 'Browse Courses'}
          </button>
        ))}
      </div>

      {tab === 'enrolled' ? (
        <div className="space-y-4">
          {STUDENT_ENROLLMENTS.map(enr => (
            <div key={enr.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-56 h-36 sm:h-auto flex-shrink-0 overflow-hidden bg-[#E6F4F6]">
                  <img src={enr.thumbnail} alt={enr.courseTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-base font-bold text-[#1F2933]">{enr.courseTitle}</h3>
                    <StatusBadge status={enr.status} />
                  </div>
                  <p className="text-xs text-[#667085] mb-3">Trainer: {enr.trainer} · Batch: {enr.batch}</p>

                  {enr.status === 'active' && enr.nextLesson && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-[#f0fbff] rounded-xl">
                      <IconPlay size={12} className="text-[#007991] flex-shrink-0" />
                      <span className="text-xs text-[#005f72] font-medium truncate">Next: {enr.nextLesson}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <ProgressBar value={enr.progress} showLabel label="Course Progress" height={8} />
                    <p className="text-xs text-[#9BA3AF] mt-1.5">{enr.lessonsCompleted} of {enr.totalLessons} lessons completed</p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant={enr.status === 'active' ? 'cta' : 'outline'}
                      size="sm"
                      icon={<IconPlay size={12} />}
                      onClick={() => handleOpenCourse(enr.courseId)}
                    >
                      {enr.progress > 0 ? 'Resume Course' : 'Start Learning'}
                    </Button>
                    {enr.certificate && (
                      <Button variant="primary" size="sm" onClick={() => navigate('student-certificates')}>
                        View Certificate
                      </Button>
                    )}
                    <span className="text-xs text-[#9BA3AF] ml-auto">
                      Last accessed: {enr.lastAccessed ? new Date(enr.lastAccessed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {COURSES.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="h-44 overflow-hidden bg-[#E6F4F6] relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={course.level} />
                </div>
                {course.originalPrice && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="cta">Sale</Badge>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-[#1F2933] leading-snug">{course.title}</h3>
                </div>
                <p className="text-xs text-[#667085] mb-3 line-clamp-2">{course.shortDescription}</p>

                <div className="flex items-center gap-3 text-xs text-[#9BA3AF] mb-3">
                  <span className="flex items-center gap-1"><IconClock size={12} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><IconBook size={12} /> {course.lessonsCount} lessons</span>
                  <span className="flex items-center gap-1"><IconUsers size={12} /> {course.enrolledCount}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <IconStar size={13} className="text-[#FF9635]" />
                  <span className="text-xs font-bold text-[#1F2933]">{course.rating}</span>
                  <span className="text-xs text-[#9BA3AF]">({course.enrolledCount} students)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[#007991]">₹{course.price.toLocaleString('en-IN')}</span>
                    {course.originalPrice && (
                      <span className="text-xs text-[#9BA3AF] line-through ml-1.5">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {STUDENT_ENROLLMENTS.some(e => e.courseId === course.id) ? (
                    <Badge variant="success">Enrolled</Badge>
                  ) : (
                    <Button
                      variant="cta"
                      size="sm"
                      onClick={() =>
                        addToast({
                          type: 'info',
                          title: 'Course Enrollment',
                          message: 'Enrollment flow is simulated in this frontend view.',
                        })
                      }
                    >
                      Enroll Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Curriculum & Video Player Modal */}
      <Modal
        isOpen={!!activeCourseId}
        onClose={() => {
          setActiveCourseId(null);
          setIsPlaying(false);
        }}
        size="full"
        title={activeEnrollment?.courseTitle || 'Course Curriculum'}
        description={`Trainer: ${activeEnrollment?.trainer || 'Ankit Verma'} · Batch: ${activeEnrollment?.batch || 'Active'}`}
      >
        <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
          {/* Main Player Screen */}
          <div className="flex-1 flex flex-col">
            {/* Simulated Video Frame */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden flex flex-col justify-between p-4 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 z-10">
                <span className="bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs font-medium text-white">
                  Lesson {currentLessonIndex + 1} of {allLessons.length}
                </span>
                <span className="bg-[#007991]/80 text-white px-2 py-0.5 rounded text-[11px] font-semibold uppercase">
                  1080p HD
                </span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-[#007991]/90 hover:bg-[#007991] text-white flex items-center justify-center shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <IconPlay size={28} className={isPlaying ? 'opacity-80' : 'ml-1'} />
                </button>
              </div>

              {/* Video Bottom Controls Bar */}
              <div className="z-10 bg-slate-900/80 backdrop-blur-md rounded-xl p-3 space-y-2 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-white truncate mr-2">{currentLesson?.title}</span>
                  <span className="font-mono text-[11px] shrink-0">{isPlaying ? '08:42' : '00:00'} / {currentLesson?.duration || '15:00'}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-[#FF9635] h-full" style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
            </div>

            {/* Video Lesson Metadata & Actions */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{currentLesson?.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Duration: {currentLesson?.duration} · Format: HD Video + Practice Exercise</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant={currentLesson?.isCompleted ? 'outline' : 'primary'}
                  size="sm"
                  icon={<IconCheckCircle size={14} />}
                  onClick={() => currentLesson && handleToggleLessonComplete(currentLesson.id)}
                >
                  {currentLesson?.isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                </Button>
                <Button
                  variant="cta"
                  size="sm"
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === allLessons.length - 1}
                >
                  Next Lesson
                </Button>
              </div>
            </div>

            {/* Resource Downloads */}
            <div className="mt-3 p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">📄</span>
                <span className="font-semibold text-slate-700">Lesson Slides & Cheat Sheet (PDF)</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<IconDownload size={13} />}
                onClick={() => addToast({ title: 'Download Started', message: 'Downloading PDF resource package...', type: 'info' })}
              >
                Download
              </Button>
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 flex flex-col max-h-[560px]">
            <div className="mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Curriculum Outline</h4>
              <p className="text-xs text-slate-600 mt-1">
                {allLessons.filter(l => l.isCompleted).length} of {allLessons.length} lessons finished
              </p>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1">
              {activeModules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-800 bg-slate-100/80 px-2.5 py-1.5 rounded-lg">
                    {mod.title}
                  </p>
                  <div className="space-y-1 pl-1">
                    {mod.lessons.map(lesson => {
                      const isActive = lesson.id === activeLessonId;
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            setIsPlaying(true);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#007991]/10 text-[#007991] font-semibold border border-[#007991]/30'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            onClick={e => {
                              e.stopPropagation();
                              handleToggleLessonComplete(lesson.id);
                            }}
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                              lesson.isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 hover:border-[#007991]'
                            }`}
                          >
                            {lesson.isCompleted && <span className="text-[10px] font-bold">✓</span>}
                          </span>
                          <span className="truncate flex-1">{lesson.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">{lesson.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
