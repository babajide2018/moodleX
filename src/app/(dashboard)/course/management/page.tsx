'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Search,
  MoreVertical,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  coursecount: number;
  children?: Category[];
}

interface CourseItem {
  id: string;
  fullname: string;
  shortname: string;
  visible: boolean;
  enrolledcount: number;
}

const demoCategories: Category[] = [
  {
    id: '1',
    name: 'Miscellaneous',
    coursecount: 2,
    children: [],
  },
  {
    id: '2',
    name: 'Computer Science',
    coursecount: 3,
    children: [
      { id: '2a', name: 'Programming', coursecount: 2 },
      { id: '2b', name: 'Theory', coursecount: 1 },
    ],
  },
  {
    id: '3',
    name: 'Mathematics',
    coursecount: 2,
    children: [],
  },
  {
    id: '4',
    name: 'Science',
    coursecount: 1,
    children: [
      { id: '4a', name: 'Physics', coursecount: 1 },
      { id: '4b', name: 'Chemistry', coursecount: 0 },
      { id: '4c', name: 'Biology', coursecount: 0 },
    ],
  },
  {
    id: '5',
    name: 'Humanities',
    coursecount: 2,
    children: [],
  },
];

const demoCourses: Record<string, CourseItem[]> = {
  '1': [
    { id: 'c1', fullname: 'Welcome to Moodle', shortname: 'WELCOME', visible: true, enrolledcount: 150 },
    { id: 'c2', fullname: 'Staff Training', shortname: 'STAFF01', visible: false, enrolledcount: 25 },
  ],
  '2': [
    { id: 'c3', fullname: 'Introduction to Computer Science', shortname: 'CS101', visible: true, enrolledcount: 89 },
    { id: 'c4', fullname: 'Data Structures and Algorithms', shortname: 'CS201', visible: true, enrolledcount: 67 },
    { id: 'c5', fullname: 'Web Development', shortname: 'CS150', visible: true, enrolledcount: 45 },
  ],
  '3': [
    { id: 'c6', fullname: 'Mathematics for Engineers', shortname: 'MATH201', visible: true, enrolledcount: 112 },
    { id: 'c7', fullname: 'Linear Algebra', shortname: 'MATH301', visible: true, enrolledcount: 34 },
  ],
  '4': [
    { id: 'c8', fullname: 'Introduction to Physics', shortname: 'PHY101', visible: true, enrolledcount: 78 },
  ],
  '5': [
    { id: 'c9', fullname: 'English Literature', shortname: 'ENG102', visible: true, enrolledcount: 56 },
    { id: 'c10', fullname: 'History of Art', shortname: 'ART110', visible: true, enrolledcount: 23 },
  ],
};

const managementTabs = [
  { key: 'management', label: 'Course and category management', href: '/course/management' },
];

export default function CourseManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('2');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['2', '4']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCourseSelection = (id: string) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const courses = demoCourses[selectedCategory] || [];

  const renderCategory = (cat: Category, depth: number = 0) => {
    const isExpanded = expandedCategories.has(cat.id);
    const isSelected = selectedCategory === cat.id;
    const hasChildren = cat.children && cat.children.length > 0;

    return (
      <div key={cat.id}>
        <div
          className={`flex items-center gap-1 py-1.5 px-2 cursor-pointer rounded text-sm transition-colors ${
            isSelected
              ? 'bg-[var(--moodle-primary)] text-white'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => setSelectedCategory(cat.id)}
        >
          {hasChildren ? (
            <button
              className="p-0 border-none bg-transparent cursor-pointer flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(cat.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown size={14} className={isSelected ? 'text-white' : 'text-[var(--text-muted)]'} />
              ) : (
                <ChevronRight size={14} className={isSelected ? 'text-white' : 'text-[var(--text-muted)]'} />
              )}
            </button>
          ) : (
            <span className="w-3.5 flex-shrink-0" />
          )}
          <FolderOpen size={14} className="flex-shrink-0" />
          <span className="truncate flex-1">{cat.name}</span>
          <span className={`text-xs flex-shrink-0 ${isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
            {cat.coursecount}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {cat.children!.map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Manage courses and categories"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Manage courses and categories' },
        ]}
      />

      <SecondaryNavigation tabs={managementTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Two-panel layout matching Moodle */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Left panel: Category tree */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-light)] border-b border-[var(--border-color)] rounded-t-lg">
                  <h3 className="text-sm font-semibold m-0">Course categories</h3>
                  <button className="btn-icon" title="Create new category">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                  {demoCategories.map((cat) => renderCategory(cat))}
                </div>
                <div className="p-2 border-t border-[var(--border-color)] flex gap-1">
                  <button className="btn btn-secondary text-xs flex-1">
                    Create category
                  </button>
                </div>
              </div>
            </div>

            {/* Right panel: Courses in selected category */}
            <div className="flex-1 min-w-0">
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-light)] border-b border-[var(--border-color)] rounded-t-lg flex-wrap gap-2">
                  <h3 className="text-sm font-semibold m-0">
                    Courses: {demoCategories.find((c) => c.id === selectedCategory)?.name || 'All'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        className="form-control text-xs py-1 pl-7 w-48"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    </div>
                    <Link
                      href="/course/new/edit"
                      className="btn btn-primary text-xs flex items-center gap-1"
                    >
                      <Plus size={14} /> New course
                    </Link>
                  </div>
                </div>

                {courses.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                    No courses in this category.
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border-color)]">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 flex-shrink-0"
                          checked={selectedCourses.has(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/course/${course.id}`}
                            className="text-sm font-medium text-[var(--text-link)] hover:underline"
                          >
                            {course.fullname}
                          </Link>
                          <div className="text-xs text-[var(--text-muted)]">
                            {course.shortname} &middot; {course.enrolledcount} enrolled
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {course.visible ? (
                            <Eye size={14} className="text-[var(--text-muted)]" />
                          ) : (
                            <EyeOff size={14} className="text-[var(--text-muted)]" />
                          )}
                          <Link href={`/course/${course.id}/edit`} className="btn-icon">
                            <Settings size={14} />
                          </Link>
                          <button className="btn-icon">
                            <ArrowUp size={14} />
                          </button>
                          <button className="btn-icon">
                            <ArrowDown size={14} />
                          </button>
                          <button className="btn-icon">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bulk actions */}
                {selectedCourses.size > 0 && (
                  <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-light)] flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">
                      {selectedCourses.size} selected:
                    </span>
                    <button className="btn btn-secondary text-xs flex items-center gap-1">
                      <Copy size={12} /> Move
                    </button>
                    <button className="btn btn-secondary text-xs flex items-center gap-1">
                      <EyeOff size={12} /> Hide
                    </button>
                    <button className="btn btn-secondary text-xs flex items-center gap-1 text-[var(--moodle-danger)]">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
