import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import { COURSES, BATCHES } from '../../data/mockData';
import { IconBook, IconPlus, IconEdit, IconEye, IconUsers, IconClock, IconStar, IconCheck, IconCalendar } from '../../components/Icons';
import { useApp } from '../../contexts/AppContext';

export default function CoursesPage() {
  const { addToast } = useApp();
  const [tab, setTab] = useState<'courses' | 'batches'>('courses');

  const [courseList, setCourseList] = useState(COURSES);
  const [batchList, setBatchList] = useState(BATCHES);

  // Modals state
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [manageCourse, setManageCourse] = useState<typeof COURSES[0] | null>(null);
  const [editCourse, setEditCourse] = useState<typeof COURSES[0] | null>(null);
  const [manageBatch, setManageBatch] = useState<typeof BATCHES[0] | null>(null);

  // Form states
  const [newCourse, setNewCourse] = useState({
    title: '',
    shortDescription: '',
    category: 'Digital Marketing',
    level: 'beginner' as const,
    duration: '8 weeks',
    price: 19999,
  });

  const [newBatch, setNewBatch] = useState({
    name: '',
    courseTitle: COURSES[0].title,
    trainerName: 'Prof. Rajesh Sharma',
    schedule: 'Mon/Wed/Fri 6:00–8:00 PM',
    maxCapacity: 35,
    mode: 'online' as const,
    startDate: new Date().toISOString().slice(0, 10),
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title) return;

    const created = {
      id: `course-${Date.now()}`,
      title: newCourse.title,
      slug: newCourse.title.toLowerCase().replace(/\s+/g, '-'),
      category: newCourse.category,
      shortDescription: newCourse.shortDescription || 'Comprehensive training program designed for career growth.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      duration: newCourse.duration,
      level: newCourse.level,
      price: Number(newCourse.price),
      rating: 5.0,
      enrolledCount: 0,
      modulesCount: 6,
      lessonsCount: 24,
      status: 'published' as const,
      tags: ['New', 'Certification', 'High Demand'],
      trainer: 'Prof. Rajesh Sharma',
      trainerId: 'trainer-1',
    };

    setCourseList(prev => [created, ...prev]);
    setIsNewCourseModalOpen(false);
    setNewCourse({
      title: '',
      shortDescription: '',
      category: 'Digital Marketing',
      level: 'beginner',
      duration: '8 weeks',
      price: 19999,
    });
    addToast({
      type: 'success',
      title: 'Course Created',
      message: `"${created.title}" is now added and published.`,
    });
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.name) return;

    const created = {
      id: `b-${Date.now()}`,
      name: newBatch.name,
      courseId: 'course-custom',
      courseTitle: newBatch.courseTitle,
      startDate: newBatch.startDate,
      endDate: '2025-06-30',
      schedule: newBatch.schedule,
      trainerId: 'trainer-1',
      trainerName: newBatch.trainerName,
      studentsCount: 0,
      maxCapacity: Number(newBatch.maxCapacity),
      status: 'upcoming' as const,
      mode: newBatch.mode,
    };

    setBatchList(prev => [created, ...prev]);
    setIsNewBatchModalOpen(false);
    setNewBatch({
      name: '',
      courseTitle: COURSES[0].title,
      trainerName: 'Prof. Rajesh Sharma',
      schedule: 'Mon/Wed/Fri 6:00–8:00 PM',
      maxCapacity: 35,
      mode: 'online',
      startDate: new Date().toISOString().slice(0, 10),
    });
    addToast({
      type: 'success',
      title: 'Batch Created',
      message: `Cohort "${created.name}" opened for enrollment.`,
    });
  };

  const toggleCoursePublish = (course: typeof COURSES[0]) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    setCourseList(prev => prev.map(c => c.id === course.id ? { ...c, status: nextStatus } : c));
    addToast({
      type: nextStatus === 'published' ? 'success' : 'warning',
      title: nextStatus === 'published' ? 'Course Published' : 'Course Unpublished',
      message: `"${course.title}" status changed to ${nextStatus}.`,
    });
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;

    setCourseList(prev => prev.map(c => c.id === editCourse.id ? editCourse : c));
    setEditCourse(null);
    addToast({
      type: 'success',
      title: 'Course Saved',
      message: `Modifications to "${editCourse.title}" have been saved.`,
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Course Management"
        subtitle="Manage courses, modules, curriculum and batch schedules"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<IconPlus size={14} />}
              onClick={() => setIsNewBatchModalOpen(true)}
            >
              New Batch
            </Button>
            <Button
              variant="cta"
              size="sm"
              icon={<IconPlus size={14} />}
              onClick={() => setIsNewCourseModalOpen(true)}
            >
              New Course
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F2F4F6] rounded-xl w-fit mb-6">
        {(['courses', 'batches'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              tab === t ? 'bg-white text-[#007991] shadow-xs' : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            {t === 'courses' ? `Courses (${courseList.length})` : `Batches (${batchList.length})`}
          </button>
        ))}
      </div>

      {tab === 'courses' ? (
        <div className="space-y-4">
          {courseList.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden card-lift shadow-xs"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 sm:h-auto overflow-hidden bg-[#E6F4F6] shrink-0">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div>
                      <h3 className="text-base font-bold text-[#1F2933]">{course.title}</h3>
                      <p className="text-xs text-[#667085] mt-0.5">{course.shortDescription.slice(0, 110)}…</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={course.status} />
                      <StatusBadge status={course.level} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-[#667085] mb-4">
                    <span className="flex items-center gap-1">
                      <IconClock size={12} /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconBook size={12} /> {course.modulesCount} modules · {course.lessonsCount} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <IconUsers size={12} /> {course.enrolledCount} enrolled
                    </span>
                    <span className="flex items-center gap-1">
                      <IconStar size={12} className="text-[#FF9635]" /> {course.rating}
                    </span>
                    <span className="font-semibold text-[#007991]">₹{course.price.toLocaleString('en-IN')}</span>
                    {course.originalPrice && (
                      <span className="line-through text-[#9BA3AF]">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<IconEye size={13} />}
                      onClick={() => setManageCourse(course)}
                    >
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<IconEdit size={13} />}
                      onClick={() => setEditCourse(course)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCoursePublish(course)}
                    >
                      {course.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <div className="ml-auto flex flex-wrap gap-1">
                      {course.tags.slice(0, 3).map(t => (
                        <Badge key={t} variant="teal" size="sm">
                          {t}
                        </Badge>
                      ))}
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
            <Button
              variant="cta"
              size="sm"
              icon={<IconPlus size={14} />}
              onClick={() => setIsNewBatchModalOpen(true)}
            >
              Create Batch
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="lms-table">
              <thead>
                <tr>
                  <th>Batch Name</th>
                  <th>Course</th>
                  <th>Trainer</th>
                  <th>Schedule</th>
                  <th>Capacity</th>
                  <th>Mode</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batchList.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="font-bold text-[#007991]">{b.name}</td>
                    <td className="text-sm text-[#1F2933] max-w-[160px] truncate">{b.courseTitle}</td>
                    <td className="text-sm text-[#667085]">{b.trainerName}</td>
                    <td className="text-xs text-[#667085]">{b.schedule}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#007991] rounded-full"
                            style={{ width: `${Math.min(100, (b.studentsCount / b.maxCapacity) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#667085]">
                          {b.studentsCount}/{b.maxCapacity}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={b.mode} />
                    </td>
                    <td className="text-xs text-[#667085]">
                      <p>{new Date(b.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</p>
                      <p className="text-[#9BA3AF]">
                        → {new Date(b.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setManageBatch(b)}
                      >
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* New Course Modal */}
      <Modal
        isOpen={isNewCourseModalOpen}
        onClose={() => setIsNewCourseModalOpen(false)}
        title="Create New Course"
        description="Configure basic program information and curriculum metadata"
        size="md"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label htmlFor="course-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Course Title
            </label>
            <input
              id="course-title"
              type="text"
              required
              value={newCourse.title}
              onChange={e => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. AI-Powered Growth Marketing Bootcamp"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label htmlFor="course-desc" className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description
            </label>
            <textarea
              id="course-desc"
              rows={3}
              value={newCourse.shortDescription}
              onChange={e => setNewCourse(prev => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="A concise synopsis of the learning outcomes and target audience..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="course-category" className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                id="course-category"
                value={newCourse.category}
                onChange={e => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              >
                <option>Digital Marketing</option>
                <option>SEO & Analytics</option>
                <option>Social Media Marketing</option>
                <option>Performance Advertising</option>
              </select>
            </div>
            <div>
              <label htmlFor="course-level" className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                id="course-level"
                value={newCourse.level}
                onChange={e => setNewCourse(prev => ({ ...prev, level: e.target.value as any }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="course-duration" className="block text-xs font-semibold text-slate-700 mb-1">
                Program Duration
              </label>
              <input
                id="course-duration"
                type="text"
                value={newCourse.duration}
                onChange={e => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g. 12 weeks"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label htmlFor="course-price" className="block text-xs font-semibold text-slate-700 mb-1">
                Tuition Fee (₹ INR)
              </label>
              <input
                id="course-price"
                type="number"
                value={newCourse.price}
                onChange={e => setNewCourse(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsNewCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cta">
              Create & Publish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={!!editCourse}
        onClose={() => setEditCourse(null)}
        title="Edit Course Details"
        description="Update program information, tuition, and duration"
        size="md"
      >
        {editCourse && (
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div>
              <label htmlFor="edit-course-title" className="block text-xs font-semibold text-slate-700 mb-1">
                Course Title
              </label>
              <input
                id="edit-course-title"
                type="text"
                required
                value={editCourse.title}
                onChange={e => setEditCourse(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>

            <div>
              <label htmlFor="edit-course-desc" className="block text-xs font-semibold text-slate-700 mb-1">
                Short Description
              </label>
              <textarea
                id="edit-course-desc"
                rows={3}
                value={editCourse.shortDescription}
                onChange={e => setEditCourse(prev => prev ? ({ ...prev, shortDescription: e.target.value }) : null)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="edit-course-price" className="block text-xs font-semibold text-slate-700 mb-1">
                  Tuition Fee (₹)
                </label>
                <input
                  id="edit-course-price"
                  type="number"
                  value={editCourse.price}
                  onChange={e => setEditCourse(prev => prev ? ({ ...prev, price: Number(e.target.value) }) : null)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
                />
              </div>
              <div>
                <label htmlFor="edit-course-duration" className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration
                </label>
                <input
                  id="edit-course-duration"
                  type="text"
                  value={editCourse.duration}
                  onChange={e => setEditCourse(prev => prev ? ({ ...prev, duration: e.target.value }) : null)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditCourse(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Updates
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Course Modules & Structure Drawer */}
      <Drawer
        isOpen={!!manageCourse}
        onClose={() => setManageCourse(null)}
        title={manageCourse ? manageCourse.title : 'Course Structure'}
        description="Modules, curriculum breakdown and assigned trainers"
        size="lg"
      >
        {manageCourse && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{manageCourse.title}</h4>
                <p className="text-slate-500 mt-0.5">{manageCourse.duration} · {manageCourse.modulesCount} modules · {manageCourse.lessonsCount} lessons</p>
              </div>
              <StatusBadge status={manageCourse.status} />
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 text-xs">Curriculum Modules ({manageCourse.modulesCount})</h5>
              <div className="space-y-2">
                {Array.from({ length: manageCourse.modulesCount }).map((_, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Module {idx + 1}: Core Concepts & Practical Application</span>
                      <span className="text-slate-400">{Math.ceil(manageCourse.lessonsCount / manageCourse.modulesCount)} lessons</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setManageCourse(null)}>
                Close
              </Button>
              <Button
                variant="cta"
                size="sm"
                onClick={() => {
                  const target = manageCourse;
                  setManageCourse(null);
                  setEditCourse(target);
                }}
              >
                Edit Course Meta
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* New Batch Modal */}
      <Modal
        isOpen={isNewBatchModalOpen}
        onClose={() => setIsNewBatchModalOpen(false)}
        title="Schedule New Batch"
        description="Establish a fresh cohort, assign a lead trainer, and set schedules"
        size="md"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <div>
            <label htmlFor="batch-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Cohort Code / Batch Name
            </label>
            <input
              id="batch-name"
              type="text"
              required
              value={newBatch.name}
              onChange={e => setNewBatch(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. DMM-Nov-2024"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            />
          </div>

          <div>
            <label htmlFor="batch-course" className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Course
            </label>
            <select
              id="batch-course"
              value={newBatch.courseTitle}
              onChange={e => setNewBatch(prev => ({ ...prev, courseTitle: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
            >
              {courseList.map(c => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="batch-trainer" className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Trainer
              </label>
              <select
                id="batch-trainer"
                value={newBatch.trainerName}
                onChange={e => setNewBatch(prev => ({ ...prev, trainerName: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              >
                <option>Prof. Rajesh Sharma</option>
                <option>Ankit Verma</option>
                <option>Sneha Nair</option>
                <option>Vikram Singh</option>
              </select>
            </div>
            <div>
              <label htmlFor="batch-mode" className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Mode
              </label>
              <select
                id="batch-mode"
                value={newBatch.mode}
                onChange={e => setNewBatch(prev => ({ ...prev, mode: e.target.value as any }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              >
                <option value="online">Online (Live Virtual)</option>
                <option value="offline">In-Person (Classroom)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="batch-schedule" className="block text-xs font-semibold text-slate-700 mb-1">
                Class Schedule
              </label>
              <input
                id="batch-schedule"
                type="text"
                value={newBatch.schedule}
                onChange={e => setNewBatch(prev => ({ ...prev, schedule: e.target.value }))}
                placeholder="Mon/Wed/Fri 6:00–8:00 PM"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>
            <div>
              <label htmlFor="batch-capacity" className="block text-xs font-semibold text-slate-700 mb-1">
                Max Student Capacity
              </label>
              <input
                id="batch-capacity"
                type="number"
                value={newBatch.maxCapacity}
                onChange={e => setNewBatch(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsNewBatchModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cta">
              Create Cohort
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manage Batch Drawer */}
      <Drawer
        isOpen={!!manageBatch}
        onClose={() => setManageBatch(null)}
        title={manageBatch ? manageBatch.name : 'Cohort Details'}
        description="Enrollment capacity, schedule, and trainer overview"
        size="md"
      >
        {manageBatch && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{manageBatch.name}</h4>
                  <p className="text-slate-500">{manageBatch.courseTitle}</p>
                </div>
                <StatusBadge status={manageBatch.status} />
              </div>
              <div className="flex gap-2">
                <Badge variant="teal">{manageBatch.mode}</Badge>
                <Badge variant="neutral">{manageBatch.schedule}</Badge>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Instructor:</span>
                <span className="font-semibold text-slate-800">{manageBatch.trainerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Enrolled Students:</span>
                <span className="font-semibold text-slate-800">{manageBatch.studentsCount} / {manageBatch.maxCapacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Start Date:</span>
                <span className="font-semibold text-slate-800">{manageBatch.startDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">End Date:</span>
                <span className="font-semibold text-slate-800">{manageBatch.endDate}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setManageBatch(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
