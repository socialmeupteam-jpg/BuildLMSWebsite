import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { COURSES, BATCHES } from '../../data/mockData';
import { IconBook, IconPlus, IconEdit, IconEye, IconUsers, IconClock, IconStar } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function CoursesPage() {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'courses' | 'batches'>('courses');

  return (
    <DashboardLayout>
      <PageHeader
        title="Course Management"
        subtitle="Manage courses, modules, lessons and batches"
        action={
          <Button variant="cta" size="sm" icon={<IconPlus size={14} />} onClick={() => addToast({ type: 'info', title: 'Create Course', message: 'Course builder opening…' })}>
            New Course
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-6">
        {(['courses', 'batches'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-white text-[#007991] shadow-sm' : 'text-[#667085] hover:text-[#1F2933]'}`}>
            {t === 'courses' ? `Courses (${COURSES.length})` : `Batches (${BATCHES.length})`}
          </button>
        ))}
      </div>

      {tab === 'courses' ? (
        <div className="space-y-4">
          {COURSES.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden card-lift" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 sm:h-auto overflow-hidden bg-[#E6F4F6] flex-shrink-0">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div>
                      <h3 className="text-base font-bold text-[#1F2933]">{course.title}</h3>
                      <p className="text-xs text-[#667085] mt-0.5">{course.shortDescription.slice(0, 80)}…</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={course.status} />
                      <StatusBadge status={course.level} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-[#667085] mb-4">
                    <span className="flex items-center gap-1"><IconClock size={12} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><IconBook size={12} /> {course.modulesCount} modules · {course.lessonsCount} lessons</span>
                    <span className="flex items-center gap-1"><IconUsers size={12} /> {course.enrolledCount} enrolled</span>
                    <span className="flex items-center gap-1"><IconStar size={12} className="text-[#FF9635]" /> {course.rating}</span>
                    <span className="font-semibold text-[#007991]">₹{course.price.toLocaleString('en-IN')}</span>
                    {course.originalPrice && <span className="line-through text-[#9BA3AF]">₹{course.originalPrice.toLocaleString('en-IN')}</span>}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="primary" size="sm" icon={<IconEye size={13} />} onClick={() => addToast({ type: 'info', title: 'Course preview', message: 'Opening course editor…' })}>
                      Manage
                    </Button>
                    <Button variant="outline" size="sm" icon={<IconEdit size={13} />} onClick={() => addToast({ type: 'info', title: 'Edit', message: `Editing "${course.title}"…` })}>
                      Edit
                    </Button>
                    {course.status === 'published' ? (
                      <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'warning', title: 'Unpublish course', message: `"${course.title}" will be hidden from students.` })}>
                        Unpublish
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'success', title: 'Course published', message: `"${course.title}" is now live.` })}>
                        Publish
                      </Button>
                    )}
                    <div className="ml-auto flex flex-wrap gap-1">
                      {course.tags.slice(0, 3).map(t => <Badge key={t} variant="teal" size="sm">{t}</Badge>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionCard>
          <div className="p-4 flex gap-3 border-b border-[#F2F4F6]">
            <Button variant="cta" size="sm" icon={<IconPlus size={14} />} onClick={() => addToast({ type: 'info', title: 'New Batch', message: 'Batch creation form opening…' })}>
              Create Batch
            </Button>
          </div>
          <table className="lms-table">
            <thead>
              <tr><th>Batch Name</th><th>Course</th><th>Trainer</th><th>Schedule</th><th>Students</th><th>Mode</th><th>Dates</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {BATCHES.map(b => (
                <tr key={b.id}>
                  <td className="font-bold text-[#007991]">{b.name}</td>
                  <td className="text-sm text-[#1F2933] max-w-[160px] truncate">{b.courseTitle}</td>
                  <td className="text-sm text-[#667085]">{b.trainerName}</td>
                  <td className="text-xs text-[#667085]">{b.schedule}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden" style={{ width: 40 }}>
                        <div className="h-full bg-[#007991] rounded-full" style={{ width: `${(b.studentsCount / b.maxCapacity) * 100}%` }} />
                      </div>
                      <span className="text-xs text-[#667085]">{b.studentsCount}/{b.maxCapacity}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={b.mode} /></td>
                  <td className="text-xs text-[#667085]">
                    <p>{new Date(b.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
                    <p className="text-[#9BA3AF]">→ {new Date(b.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
                  </td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => addToast({ type: 'info', title: 'Manage batch', message: `Managing ${b.name}…` })}>Manage</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </DashboardLayout>
  );
}
