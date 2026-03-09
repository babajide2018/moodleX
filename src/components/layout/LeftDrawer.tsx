'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  X,
  Home,
  LayoutDashboard,
  Calendar,
  FolderOpen,
  BookOpen,
  Archive,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDrawerStore } from '@/store/drawer';

interface CourseSection {
  id: string;
  name: string;
  section: number;
  modules?: {
    id: string;
    name: string;
    moduleType: string;
  }[];
}

interface EnrolledCourse {
  id: string;
  fullname: string;
  shortname: string;
}

interface LeftDrawerProps {
  mode?: 'navigation' | 'courseindex';
  courseName?: string;
  courseId?: string;
  sections?: CourseSection[];
}

const courseColors = [
  '#4e6e9c', '#57a89a', '#7b62a8', '#ce5f5f',
  '#e8a54b', '#63a563', '#8e6e4e', '#5c8a8a',
];

function getCourseColor(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return courseColors[hash % courseColors.length];
}

export default function LeftDrawer({ mode = 'navigation', courseName, courseId, sections = [] }: LeftDrawerProps) {
  const { leftOpen, setLeftOpen } = useDrawerStore();
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['0']));
  const [expandedNav, setExpandedNav] = useState<Set<string>>(new Set(['mycourses']));
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setEnrolledCourses(
            (data.courses || []).map((c: Record<string, string>) => ({
              id: c.id,
              fullname: c.fullname,
              shortname: c.shortname,
            }))
          );
        }
      } catch {
        // API not ready
      }
    }
    fetchCourses();
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const toggleNav = (navId: string) => {
    setExpandedNav((prev) => {
      const next = new Set(prev);
      if (next.has(navId)) next.delete(navId);
      else next.add(navId);
      return next;
    });
  };

  const navItems = [
    { id: 'home', label: 'Home', href: '/home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', href: '/calendar', icon: Calendar },
    { id: 'privatefiles', label: 'Private files', href: '/user/files', icon: FolderOpen },
    { id: 'contentbank', label: 'Content bank', href: '/contentbank', icon: Archive },
  ];

  // Course index mode
  if (mode === 'courseindex' && sections.length > 0) {
    return (
      <aside className={`drawer drawer-left ${leftOpen ? '' : 'closed'}`}>
        <div className="drawer-header">
          <span>Course index</span>
          <button
            className="drawer-toggler"
            onClick={() => setLeftOpen(false)}
            aria-label="Close course index"
          >
            <X size={16} />
          </button>
        </div>

        {courseName && (
          <div className="px-5 py-3 border-b border-[var(--border-color)]">
            <Link
              href={courseId ? `/course/${courseId}` : '#'}
              className="font-semibold text-sm text-[var(--text-primary)] hover:text-[var(--moodle-primary)]"
            >
              {courseName}
            </Link>
          </div>
        )}

        <ul className="courseindex">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const hasModules = section.modules && section.modules.length > 0;

            return (
              <li key={section.id} className="courseindex-item">
                <div
                  className="courseindex-item-content"
                  onClick={() => toggleSection(section.id)}
                >
                  {hasModules ? (
                    isExpanded ? (
                      <ChevronDown size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                    ) : (
                      <ChevronRight size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                    )
                  ) : (
                    <span className="w-3.5 flex-shrink-0" />
                  )}
                  <span className="truncate">{section.name || `Topic ${section.section}`}</span>
                </div>

                {isExpanded && hasModules && (
                  <ul className="list-none m-0 p-0 pb-1">
                    {section.modules!.map((mod) => (
                      <li key={mod.id}>
                        <Link
                          href={
                            courseId
                              ? `/course/${courseId}/mod/${mod.moduleType}/${mod.id}`
                              : '#'
                          }
                          className="flex items-center gap-2 px-5 pl-10 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors no-underline"
                        >
                          <FileText size={12} className="flex-shrink-0" />
                          <span className="truncate">{mod.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    );
  }

  // Navigation mode
  return (
    <aside className={`drawer drawer-left ${leftOpen ? '' : 'closed'}`}>
      <div className="drawer-header">
        <span>Navigation</span>
        <button
          className="drawer-toggler"
          onClick={() => setLeftOpen(false)}
          aria-label="Close navigation"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="py-2">
        <ul className="list-none m-0 p-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-2 text-sm no-underline transition-colors ${
                    isActive
                      ? 'bg-[var(--moodle-primary-light)] text-[var(--moodle-primary)] font-medium border-l-3 border-[var(--moodle-primary)] pl-[17px]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* My courses expandable section */}
        <div className="mt-1 border-t border-[var(--border-color)] pt-1">
          <button
            className="flex items-center gap-3 px-5 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] w-full border-none bg-transparent cursor-pointer text-left transition-colors"
            onClick={() => toggleNav('mycourses')}
          >
            {expandedNav.has('mycourses') ? (
              <ChevronDown size={14} className="flex-shrink-0" />
            ) : (
              <ChevronRight size={14} className="flex-shrink-0" />
            )}
            <BookOpen size={16} className="flex-shrink-0" />
            <span>My courses</span>
          </button>

          {expandedNav.has('mycourses') && (
            <div className="pl-6">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => {
                  const isCoursePage = pathname === `/course/${course.id}` || pathname.startsWith(`/course/${course.id}/`);
                  return (
                    <Link
                      key={course.id}
                      href={`/course/${course.id}`}
                      className={`flex items-center gap-2.5 px-4 py-1.5 text-xs no-underline transition-colors rounded-sm ${
                        isCoursePage
                          ? 'text-[var(--moodle-primary)] font-medium bg-[var(--moodle-primary-light)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getCourseColor(course.id) }}
                      />
                      <span className="truncate">{course.fullname}</span>
                    </Link>
                  );
                })
              ) : (
                <p className="px-4 py-1.5 text-xs text-[var(--text-muted)] m-0">No enrolled courses</p>
              )}
              <Link
                href="/my/courses"
                className="flex items-center gap-3 px-4 py-1.5 mt-1 text-xs text-[var(--moodle-primary)] hover:bg-[var(--bg-hover)] no-underline transition-colors"
              >
                View all courses
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
