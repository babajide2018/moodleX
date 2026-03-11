'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import ActivityChooserModal from '@/components/course/ActivityChooserModal';
import {
  FileText,
  MessageSquare,
  ClipboardCheck,
  HelpCircle,
  File,
  Link as LinkIcon,
  BookOpen,
  Pencil,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  BookOpenCheck,
  Plus,
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// Module type icons
const moduleIcons: Record<string, React.ReactNode> = {
  assign: <ClipboardCheck size={16} className="text-green-600" />,
  quiz: <HelpCircle size={16} className="text-orange-500" />,
  forum: <MessageSquare size={16} className="text-blue-500" />,
  resource: <File size={16} className="text-red-500" />,
  url: <LinkIcon size={16} className="text-purple-500" />,
  page: <FileText size={16} className="text-teal-600" />,
  book: <BookOpen size={16} className="text-amber-600" />,
  label: <Pencil size={16} className="text-gray-500" />,
};

interface CourseModule {
  id: string;
  name: string;
  moduleType: string;
  completion: 'none' | 'incomplete' | 'complete';
}

interface CourseSection {
  id: string;
  name: string;
  section: number;
  summary: string;
  modules: CourseModule[];
}

interface CourseData {
  id: string;
  fullname: string;
  shortname: string;
  summary: string | null;
  category: string;
  format: string;
  visible: boolean;
  startdate: string;
  sections: CourseSection[];
}

export default function CourseViewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [initializingSections, setInitializingSections] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [activityModalSection, setActivityModalSection] = useState<string | null>(null);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) {
        setError(res.status === 404 ? 'Course not found' : 'Failed to load course');
        return;
      }
      const data = await res.json();
      setCourse(data.course);
    } catch {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const initializeSections = async () => {
    setInitializingSections(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/sections`, { method: 'POST' });
      const data = await res.json();
      if (data.sections && course) {
        setCourse({ ...course, sections: data.sections });
      }
      setEditMode(true);
    } catch {
      // ignore
    } finally {
      setInitializingSections(false);
    }
  };

  const toggleEditMode = async () => {
    if (!editMode && course && course.sections.length === 0) {
      // First time turning on edit mode — initialize sections
      await initializeSections();
    } else {
      setEditMode(!editMode);
    }
  };

  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-sm text-[var(--text-muted)]">
        <Loader2 size={18} className="animate-spin" />
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <>
        <PageHeader
          title="Course"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
          ]}
        />
        <div className="p-4">
          <div className="flex items-center justify-center py-12 gap-2 text-sm text-red-600">
            <AlertCircle size={18} />
            {error || 'Course not found'}
          </div>
        </div>
      </>
    );
  }

  // Calculate completion stats
  const allModules = course.sections.flatMap((s) => s.modules);
  const trackable = allModules.filter((m) => m.completion !== 'none');
  const completed = trackable.filter((m) => m.completion === 'complete');
  const progressPercent = trackable.length > 0 ? Math.round((completed.length / trackable.length) * 100) : 0;

  return (
    <>
      <PageHeader
        title={course.fullname}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My courses', href: '/my/courses' },
          { label: course.shortname },
        ]}
        actions={
          <button
            className={`text-sm ${editMode ? 'btn btn-primary' : 'btn btn-outline-secondary'}`}
            onClick={toggleEditMode}
            disabled={initializingSections}
          >
            {initializingSections ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={14} className="animate-spin" /> Setting up...
              </span>
            ) : editMode ? (
              'Turn editing off'
            ) : (
              'Edit mode'
            )}
          </button>
        }
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Course completion progress */}
          {!editMode && trackable.length > 0 && (
            <div className="mb-6 p-4 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your progress</span>
                <span className="text-sm text-[var(--text-muted)]">
                  {completed.length} of {trackable.length} activities complete
                </span>
              </div>
              <div className="progress-moodle h-2">
                <div className="progress-bar-moodle" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {/* Course sections */}
          {course.sections.length > 0 ? (
            <div className="space-y-4">
              {course.sections.map((section) => {
                const isCollapsed = collapsedSections.has(section.id);

                return (
                  <div
                    key={section.id}
                    className="border border-[var(--border-color)] rounded-lg overflow-hidden"
                  >
                    {/* Section header */}
                    <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)] flex items-center gap-2">
                      {editMode && (
                        <GripVertical size={14} className="text-[var(--text-muted)] cursor-move flex-shrink-0" />
                      )}
                      <button
                        className="flex-shrink-0 text-[var(--text-muted)]"
                        onClick={() => toggleSectionCollapse(section.id)}
                      >
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold m-0">
                          {section.name || `Topic ${section.section}`}
                        </h3>
                        {section.summary && !isCollapsed && (
                          <p className="text-xs text-[var(--text-secondary)] mt-1 m-0">
                            {section.summary}
                          </p>
                        )}
                      </div>
                      {editMode && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button className="btn-icon" title="Edit section">
                            <Pencil size={13} />
                          </button>
                          <button className="btn-icon" title="Hide section">
                            <EyeOff size={13} />
                          </button>
                          {section.section > 0 && (
                            <button className="btn-icon text-red-500" title="Delete section">
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {!isCollapsed && (
                      <>
                        {/* Section modules/activities */}
                        {section.modules.length > 0 && (
                          <div className="divide-y divide-[var(--border-color)]">
                            {section.modules.map((mod) => (
                              <div key={mod.id} className="flex items-center">
                                {editMode && (
                                  <div className="pl-2 flex-shrink-0">
                                    <GripVertical size={14} className="text-[var(--text-muted)] cursor-move" />
                                  </div>
                                )}
                                <Link
                                  href={`/course/${courseId}/mod/${mod.moduleType}/${mod.id}`}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors no-underline group flex-1"
                                >
                                  <div className="flex-shrink-0">
                                    {mod.completion === 'complete' ? (
                                      <CheckCircle2 size={18} className="text-green-600" />
                                    ) : mod.completion === 'incomplete' ? (
                                      <Circle size={18} className="text-[var(--border-color)]" />
                                    ) : (
                                      <span className="w-[18px] inline-block" />
                                    )}
                                  </div>
                                  <div className="flex-shrink-0">
                                    {moduleIcons[mod.moduleType] || <FileText size={16} />}
                                  </div>
                                  <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--moodle-primary)] transition-colors">
                                    {mod.name}
                                  </span>
                                  <span className="ml-auto text-xs text-[var(--text-muted)] capitalize">
                                    {mod.moduleType === 'assign' ? 'Assignment' : mod.moduleType}
                                  </span>
                                </Link>
                                {editMode && (
                                  <div className="pr-2 flex items-center gap-1 flex-shrink-0">
                                    <button className="btn-icon" title="Edit"><Pencil size={12} /></button>
                                    <button className="btn-icon" title="Hide"><EyeOff size={12} /></button>
                                    <button className="btn-icon text-red-500" title="Delete"><Trash2 size={12} /></button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Empty section message or Add activity button */}
                        {editMode ? (
                          <div className="px-4 py-3 border-t border-[var(--border-color)]">
                            <button
                              className="btn btn-outline-secondary text-xs flex items-center gap-1.5 mx-auto"
                              onClick={() => setActivityModalSection(section.id)}
                            >
                              <Plus size={14} /> Add an activity or resource
                            </button>
                          </div>
                        ) : section.modules.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-[var(--text-muted)]">
                            No activities in this section yet.
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}

              {/* Add section button in edit mode */}
              {editMode && (
                <button className="w-full border-2 border-dashed border-[var(--border-color)] rounded-lg py-3 text-sm text-[var(--text-muted)] hover:border-[var(--moodle-primary)] hover:text-[var(--moodle-primary)] transition-colors flex items-center justify-center gap-1.5">
                  <Plus size={16} /> Add topic
                </button>
              )}
            </div>
          ) : (
            /* Empty course - no sections yet */
            <div className="text-center py-12 border border-[var(--border-color)] rounded-lg bg-white">
              <BookOpenCheck size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
              <h3 className="text-base font-semibold mb-1">Course created successfully</h3>
              <p className="text-sm text-[var(--text-muted)] mb-1">{course.fullname}</p>
              {course.summary && (
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-4">{course.summary}</p>
              )}
              <p className="text-sm text-[var(--text-muted)] mb-4">
                This course has no content yet. Turn on editing mode to start adding activities and resources.
              </p>
              <button
                className="btn btn-primary text-sm flex items-center gap-1.5 mx-auto"
                onClick={toggleEditMode}
                disabled={initializingSections}
              >
                {initializingSections ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Setting up course...
                  </>
                ) : (
                  'Turn editing on'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <ActivityChooserModal
        isOpen={activityModalSection !== null}
        onClose={() => setActivityModalSection(null)}
        courseId={courseId}
        sectionId={activityModalSection ?? ''}
        onModuleAdded={() => fetchCourse()}
      />
    </>
  );
}
