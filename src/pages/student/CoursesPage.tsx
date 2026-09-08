import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { STUDENT_ENROLLMENTS, COURSES } from '../../data/mockData';
import { IconPlay, IconBook, IconClock, IconUsers, IconStar, IconChevronRight } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function CoursesPage() {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'enrolled' | 'browse'>('enrolled');

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
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-[#007991] shadow-sm' : 'text-[#667085] hover:text-[#1F2933]'}`}
          >
            {t === 'enrolled' ? `My Enrollments (${STUDENT_ENROLLMENTS.length})` : 'Browse Courses'}
          </button>
        ))}
      </div>

      {tab === 'enrolled' ? (
        <div className="space-y-4">
          {STUDENT_ENROLLMENTS.map(enr => (
            <div key={enr.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden card-lift" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
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

                  <div className="flex items-center gap-3">
                    {enr.status === 'active' ? (
                      <Button variant="cta" size="sm" icon={<IconPlay size={12} />} onClick={() => addToast({ type: 'info', title: 'Course Player', message: 'Full video player coming soon!' })}>
                        {enr.progress > 0 ? 'Resume Course' : 'Start Course'}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => addToast({ type: 'info', title: 'Completed!', message: 'This course is already completed.' })}>
                        Review Materials
                      </Button>
                    )}
                    {enr.certificate && (
                      <Button variant="primary" size="sm">View Certificate</Button>
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
            <div key={course.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden card-lift" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
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
                    <Button variant="cta" size="sm" onClick={() => addToast({ type: 'success', title: 'Enrollment started', message: 'Redirecting to payment…' })}>
                      Enroll Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
