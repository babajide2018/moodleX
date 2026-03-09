'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
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

// Demo course data
const demoCourse = {
  id: '1',
  fullname: 'Introduction to Computer Science',
  shortname: 'CS101',
  summary: 'An introductory course covering the fundamentals of computer science, algorithms, and programming concepts.',
  category: 'Computer Science',
  sections: [
    {
      id: 's0',
      name: 'General',
      section: 0,
      summary: '',
      modules: [
        { id: 'm1', name: 'Announcements', moduleType: 'forum', completion: 'none' as const },
        { id: 'm2', name: 'Course Syllabus', moduleType: 'resource', completion: 'complete' as const },
      ],
    },
    {
      id: 's1',
      name: 'Week 1: Introduction to Programming',
      section: 1,
      summary: 'Get started with programming concepts and your first program.',
      modules: [
        { id: 'm3', name: 'What is Programming?', moduleType: 'page', completion: 'complete' as const },
        { id: 'm4', name: 'Setting Up Your Environment', moduleType: 'page', completion: 'complete' as const },
        { id: 'm5', name: 'Your First Program', moduleType: 'assign', completion: 'complete' as const },
        { id: 'm6', name: 'Week 1 Discussion', moduleType: 'forum', completion: 'incomplete' as const },
      ],
    },
    {
      id: 's2',
      name: 'Week 2: Variables and Data Types',
      section: 2,
      summary: 'Learn about different data types and how to use variables.',
      modules: [
        { id: 'm7', name: 'Variables Lecture Notes', moduleType: 'resource', completion: 'incomplete' as const },
        { id: 'm8', name: 'Data Types Reference', moduleType: 'url', completion: 'none' as const },
        { id: 'm9', name: 'Variables Practice Quiz', moduleType: 'quiz', completion: 'incomplete' as const },
        { id: 'm10', name: 'Week 2 Assignment', moduleType: 'assign', completion: 'incomplete' as const },
      ],
    },
    {
      id: 's3',
      name: 'Week 3: Control Flow',
      section: 3,
      summary: 'Understanding if statements, loops, and control flow.',
      modules: [
        { id: 'm11', name: 'Control Flow Textbook', moduleType: 'book', completion: 'incomplete' as const },
        { id: 'm12', name: 'If Statements Exercise', moduleType: 'assign', completion: 'incomplete' as const },
        { id: 'm13', name: 'Loops Quiz', moduleType: 'quiz', completion: 'incomplete' as const },
      ],
    },
    {
      id: 's4',
      name: 'Week 4: Functions',
      section: 4,
      summary: 'Learn how to write and use functions.',
      modules: [
        { id: 'm14', name: 'Functions Overview', moduleType: 'page', completion: 'incomplete' as const },
        { id: 'm15', name: 'Functions Assignment', moduleType: 'assign', completion: 'incomplete' as const },
      ],
    },
  ],
};

export default function CourseViewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = demoCourse; // Will be fetched from DB

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/grades` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

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
          <button className="btn btn-outline-secondary text-sm">
            Edit mode
          </button>
        }
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Course completion progress */}
          <div className="mb-6 p-4 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your progress</span>
              <span className="text-sm text-[var(--text-muted)]">3 of 15 activities complete</span>
            </div>
            <div className="progress-moodle h-2">
              <div className="progress-bar-moodle" style={{ width: '20%' }} />
            </div>
          </div>

          {/* Course sections - Moodle topics format */}
          <div className="space-y-4">
            {course.sections.map((section) => (
              <div
                key={section.id}
                className="border border-[var(--border-color)] rounded-lg overflow-hidden"
              >
                {/* Section header */}
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">
                    {section.name || `Topic ${section.section}`}
                  </h3>
                  {section.summary && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1 m-0">
                      {section.summary}
                    </p>
                  )}
                </div>

                {/* Section modules/activities */}
                <div className="divide-y divide-[var(--border-color)]">
                  {section.modules.map((mod) => (
                    <Link
                      key={mod.id}
                      href={`/course/${courseId}/mod/${mod.moduleType}/${mod.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors no-underline group"
                    >
                      {/* Completion indicator */}
                      <div className="flex-shrink-0">
                        {mod.completion === 'complete' ? (
                          <CheckCircle2 size={18} className="text-green-600" />
                        ) : mod.completion === 'incomplete' ? (
                          <Circle size={18} className="text-[var(--border-color)]" />
                        ) : (
                          <span className="w-[18px] inline-block" />
                        )}
                      </div>

                      {/* Module icon */}
                      <div className="flex-shrink-0">
                        {moduleIcons[mod.moduleType] || <FileText size={16} />}
                      </div>

                      {/* Module name */}
                      <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--moodle-primary)] transition-colors">
                        {mod.name}
                      </span>

                      {/* Module type badge */}
                      <span className="ml-auto text-xs text-[var(--text-muted)] capitalize">
                        {mod.moduleType === 'assign' ? 'Assignment' : mod.moduleType}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
