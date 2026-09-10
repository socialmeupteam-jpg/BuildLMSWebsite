import { useState } from 'react';
import DashboardLayout, { PageHeader, SectionCard } from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge, { StatusBadge } from '../../components/ui/Badge';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import { useApp } from '../../contexts/AppContext';
import { COURSES, BATCHES } from '../../data/mockData';
import {
  IconBook, IconPlus, IconFileText, IconUpload,
  IconCheckCircle, IconEye, IconClock, IconUsers
} from '../../components/Icons';

interface CourseModule {
  id: string;
  title: string;
  lessonsCount: number;
  duration: string;
  status: 'published' | 'draft';
  lessons: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'quiz' | 'resource';
    resourceName?: string;
  }[];
}

const TRAINER_MODULES: CourseModule[] = [
  {
    id: 'm-1',
    title: 'Module 1: Digital Marketing Ecosystem & Strategy',
    lessonsCount: 6,
    duration: '4 hours',
    status: 'published',
    lessons: [
      { id: 'l-1', title: '1.1 The Marketing Funnel & Customer Journey', duration: '28 min', type: 'video' },
      { id: 'l-2', title: '1.2 Developing Buyer Personas & Ideal Customer Profiles', duration: '35 min', type: 'video' },
      { id: 'l-3', title: '1.3 Competitor Analysis Framework (PDF Guide)', duration: '15 min', type: 'resource', resourceName: 'Competitor_Analysis_Template.pdf' },
      { id: 'l-4', title: '1.4 Module 1 Knowledge Check Quiz', duration: '20 min', type: 'quiz' },
    ],
  },
  {
    id: 'm-2',
    title: 'Module 2: Search Engine Optimization (Technical & On-Page)',
    lessonsCount: 8,
    duration: '6 hours',
    status: 'published',
    lessons: [
      { id: 'l-5', title: '2.1 Keyword Research with Semrush & Ahrefs', duration: '45 min', type: 'video' },
      { id: 'l-6', title: '2.2 On-Page Optimization: Title, Meta & Header Tags', duration: '38 min', type: 'video' },
      { id: 'l-7', title: '2.3 Schema Markup & Structured Data Checklist', duration: '20 min', type: 'resource', resourceName: 'Schema_Cheatsheet_2024.pdf' },
    ],
  },
  {
    id: 'm-3',
    title: 'Module 3: Google Ads & Paid Search Architecture',
    lessonsCount: 7,
    duration: '5 hours',
    status: 'published',
    lessons: [
      { id: 'l-8', title: '3.1 Campaign Setup & Quality Score Optimization', duration: '42 min', type: 'video' },
      { id: 'l-9', title: '3.2 Negative Keywords & Match Types', duration: '30 min', type: 'video' },
      { id: 'l-10', title: '3.3 Live Bidding Simulation & Bid Adjustments', duration: '50 min', type: 'video' },
    ],
  },
];

export default function TrainerCoursesPage() {
  const { addToast } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [modules, setModules] = useState<CourseModule[]>(TRAINER_MODULES);

  // Resource Upload Drawer state
  const [isResourceDrawerOpen, setIsResourceDrawerOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string>(TRAINER_MODULES[0].id);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<'video' | 'resource' | 'quiz'>('resource');
  const [resourceDuration, setResourceDuration] = useState('20 min');
  const [fileName, setFileName] = useState('');

  // Course syllabus drawer
  const [viewingSyllabus, setViewingSyllabus] = useState(false);

  const trainerBatches = BATCHES.filter(b => b.trainerName.includes('Ankit') || b.courseId === selectedCourse.id);

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim()) return;

    const newLesson = {
      id: `l-${Date.now()}`,
      title: resourceTitle,
      duration: resourceDuration,
      type: resourceType,
      resourceName: fileName || (resourceType === 'resource' ? 'Curriculum_Attachment.pdf' : undefined),
    };

    setModules(prev =>
      prev.map(m =>
        m.id === targetModuleId
          ? {
              ...m,
              lessonsCount: m.lessonsCount + 1,
              lessons: [...m.lessons, newLesson],
            }
          : m
      )
    );

    setIsResourceDrawerOpen(false);
    setResourceTitle('');
    setFileName('');

    addToast({
      title: 'Curriculum Updated',
      message: `"${resourceTitle}" published to ${modules.find(m => m.id === targetModuleId)?.title}.`,
      type: 'success',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageHeader
          title="Assigned Courses & Curriculum"
          subtitle="Manage course syllabus, module lesson materials, and cohort delivery"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<IconEye size={16} />}
            onClick={() => setViewingSyllabus(true)}
          >
            Preview Full Syllabus
          </Button>
          <Button
            variant="primary"
            icon={<IconPlus size={16} />}
            onClick={() => setIsResourceDrawerOpen(true)}
          >
            Upload Material
          </Button>
        </div>
      </div>

      {/* Assigned Course Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#E6F4F6] flex-shrink-0">
              <img src={selectedCourse.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="primary">{selectedCourse.category}</Badge>
                <StatusBadge status={selectedCourse.status} />
                <span className="text-xs text-[#667085]">Duration: {selectedCourse.duration}</span>
              </div>
              <h2 className="text-xl font-bold text-[#1F2933]">{selectedCourse.title}</h2>
              <p className="text-xs text-[#667085] mt-1 max-w-2xl">{selectedCourse.shortDescription}</p>
            </div>
          </div>

          <div className="flex gap-6 border-t lg:border-t-0 lg:border-l border-[#E5E7EB] pt-4 lg:pt-0 lg:pl-6 text-center">
            <div>
              <span className="text-xl font-bold text-[#007991]">{selectedCourse.enrolledCount}</span>
              <p className="text-xs text-[#667085]">Students</p>
            </div>
            <div>
              <span className="text-xl font-bold text-[#10B981]">{modules.length}</span>
              <p className="text-xs text-[#667085]">Modules</p>
            </div>
            <div>
              <span className="text-xl font-bold text-[#FF9635]">
                {modules.reduce((s, m) => s + m.lessons.length, 0)}
              </span>
              <p className="text-xs text-[#667085]">Lessons</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Curriculum Modules & Lessons */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="Course Modules & Content"
            subtitle="Manage lesson items, video lectures, and practical assignments"
          >
            <div className="divide-y divide-[#F2F4F6]">
              {modules.map(mod => (
                <div key={mod.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#1F2933]">{mod.title}</h3>
                      <p className="text-xs text-[#667085]">
                        {mod.lessons.length} lessons • Total duration: {mod.duration}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<IconPlus size={14} />}
                      onClick={() => {
                        setTargetModuleId(mod.id);
                        setIsResourceDrawerOpen(true);
                      }}
                    >
                      Add Lesson
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {mod.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className="p-3 bg-[#F7F9FA] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              lesson.type === 'video'
                                ? 'bg-[#e0f6ff] text-[#007991]'
                                : lesson.type === 'quiz'
                                ? 'bg-[#fff3e6] text-[#FF9635]'
                                : 'bg-[#D1FAE5] text-[#10B981]'
                            }`}
                          >
                            {lesson.type === 'video' ? '▶' : lesson.type === 'quiz' ? '?' : '📄'}
                          </span>
                          <div>
                            <p className="font-semibold text-[#1F2933]">{lesson.title}</p>
                            {lesson.resourceName && (
                              <p className="text-[10px] text-[#007991] font-mono">{lesson.resourceName}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[#9BA3AF]">{lesson.duration}</span>
                          <span className="text-emerald-600 font-bold">Published</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Col: Associated Batches */}
        <div className="space-y-6">
          <SectionCard title="Allocated Cohorts & Batches" subtitle="Batches studying this course">
            <div className="divide-y divide-[#F2F4F6]">
              {trainerBatches.map(b => (
                <div key={b.id} className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1F2933]">{b.name}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-[#667085]">{b.schedule}</p>
                  <div className="flex justify-between text-[#9BA3AF] pt-1">
                    <span>Capacity: {b.studentsCount}/{b.maxCapacity}</span>
                    <span className="capitalize font-semibold text-[#007991]">{b.mode} Mode</span>
                  </div>
                  <ProgressBar value={(b.studentsCount / b.maxCapacity) * 100} height={4} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Resource Upload Drawer */}
      <Drawer
        isOpen={isResourceDrawerOpen}
        onClose={() => setIsResourceDrawerOpen(false)}
        title="Upload Learning Resource / Lesson"
        size="md"
      >
        <form onSubmit={handleAddResource} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Target Module *</label>
            <select
              value={targetModuleId}
              onChange={e => setTargetModuleId(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            >
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Lesson Title *</label>
            <input
              type="text"
              placeholder="e.g., Module 2.4 - Advanced Negative Match Strategies"
              value={resourceTitle}
              onChange={e => setResourceTitle(e.target.value)}
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Content Type</label>
              <select
                value={resourceType}
                onChange={e => setResourceType(e.target.value as any)}
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              >
                <option value="video">Video Recording / Stream</option>
                <option value="resource">PDF / Cheat Sheet Document</option>
                <option value="quiz">Interactive Assessment Quiz</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2933] mb-1">Estimated Duration</label>
              <input
                type="text"
                value={resourceDuration}
                onChange={e => setResourceDuration(e.target.value)}
                placeholder="e.g. 35 min"
                className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#1F2933] outline-none focus:border-[#007991]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] mb-1">Select File / Asset</label>
            <div className="border border-dashed border-[#E5E7EB] rounded-xl p-4 text-center bg-[#F7F9FA]">
              <input
                type="file"
                id="trainer-asset"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) setFileName(f.name);
                }}
              />
              <label
                htmlFor="trainer-asset"
                className="cursor-pointer text-xs text-[#007991] font-semibold hover:underline inline-flex items-center gap-2"
              >
                <IconUpload size={16} />
                {fileName ? fileName : 'Choose Video or Document (MP4, PDF, ZIP up to 500MB)'}
              </label>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E7EB]">
            <Button variant="outline" type="button" onClick={() => setIsResourceDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" type="submit" disabled={!resourceTitle.trim()}>
              Publish to Batch
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Full Syllabus Preview Modal */}
      <Modal
        isOpen={viewingSyllabus}
        onClose={() => setViewingSyllabus(false)}
        title="Complete Course Syllabus"
        size="lg"
      >
        <div className="p-2 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          <div className="p-4 bg-[#F7F9FA] rounded-xl border border-[#E5E7EB]">
            <h4 className="font-bold text-[#007991] text-base">{selectedCourse.title}</h4>
            <p className="text-[#667085]">Academic Master Plan • 86 Total Instructional Hours</p>
          </div>
          {modules.map((m, idx) => (
            <div key={m.id} className="p-3 border border-[#E5E7EB] rounded-xl">
              <h5 className="font-bold text-[#1F2933] mb-2">{m.title}</h5>
              <ul className="space-y-1.5 pl-2 text-[#4B5563]">
                {m.lessons.map(l => (
                  <li key={l.id} className="flex justify-between">
                    <span>• {l.title}</span>
                    <span className="text-[#9BA3AF]">{l.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="pt-2 flex justify-end">
            <Button variant="primary" onClick={() => setViewingSyllabus(false)}>
              Close Syllabus
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
