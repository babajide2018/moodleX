'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Search,
  GripVertical,
} from 'lucide-react';

interface Course {
  id: string;
  shortname: string;
  fullname: string;
  visible: boolean;
  enrolled: number;
}

interface Category {
  id: string;
  name: string;
  coursecount: number;
  visible: boolean;
  courses: Course[];
  children: Category[];
}

const demoCategories: Category[] = [
  {
    id: '1',
    name: 'Miscellaneous',
    coursecount: 2,
    visible: true,
    courses: [
      { id: 'c1', shortname: 'INTRO101', fullname: 'Introduction to Moodle', visible: true, enrolled: 45 },
      { id: 'c2', shortname: 'DEMO100', fullname: 'Demo Course', visible: false, enrolled: 0 },
    ],
    children: [],
  },
  {
    id: '2',
    name: 'Science',
    coursecount: 3,
    visible: true,
    courses: [
      { id: 'c3', shortname: 'PHY101', fullname: 'Physics Fundamentals', visible: true, enrolled: 32 },
      { id: 'c4', shortname: 'CHEM101', fullname: 'Chemistry Basics', visible: true, enrolled: 28 },
    ],
    children: [
      {
        id: '3',
        name: 'Biology',
        coursecount: 1,
        visible: true,
        courses: [
          { id: 'c5', shortname: 'BIO101', fullname: 'Introduction to Biology', visible: true, enrolled: 19 },
        ],
        children: [],
      },
    ],
  },
  {
    id: '4',
    name: 'Mathematics',
    coursecount: 2,
    visible: true,
    courses: [
      { id: 'c6', shortname: 'MATH101', fullname: 'Calculus I', visible: true, enrolled: 55 },
      { id: 'c7', shortname: 'MATH201', fullname: 'Linear Algebra', visible: true, enrolled: 22 },
    ],
    children: [],
  },
  {
    id: '5',
    name: 'Arts & Humanities',
    coursecount: 0,
    visible: false,
    courses: [],
    children: [],
  },
];

function CategoryNode({ category, depth = 0 }: { category: Category; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const [showActions, setShowActions] = useState(false);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 hover:bg-[var(--bg-hover)] border-b border-[var(--border-color)] ${!category.visible ? 'opacity-60' : ''}`}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[var(--text-muted)] hover:text-[var(--text-link)] flex-shrink-0"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <GripVertical size={14} className="text-[var(--text-muted)] cursor-move flex-shrink-0" />
        <FolderOpen size={16} className="text-amber-500 flex-shrink-0" />
        <span className="text-sm font-medium flex-1">{category.name}</span>
        <span className="text-xs text-[var(--text-muted)]">{category.coursecount} courses</span>
        {!category.visible && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Hidden</span>
        )}
        <div className="relative">
          <button
            className="btn-icon"
            onClick={() => setShowActions(!showActions)}
            onBlur={() => setTimeout(() => setShowActions(false), 200)}
          >
            <MoreVertical size={14} />
          </button>
          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--border-color)] rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
              <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
                <Pencil size={13} /> Edit
              </button>
              <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
                {category.visible ? <EyeOff size={13} /> : <Eye size={13} />}
                {category.visible ? 'Hide' : 'Show'}
              </button>
              <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
                <ArrowUp size={13} /> Move up
              </button>
              <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
                <ArrowDown size={13} /> Move down
              </button>
              <hr className="my-1 border-[var(--border-color)]" />
              <button className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <>
          {category.children.map((child) => (
            <CategoryNode key={child.id} category={child} depth={depth + 1} />
          ))}
          {category.courses.map((course) => (
            <div
              key={course.id}
              className={`flex items-center gap-2 py-2 px-3 hover:bg-[var(--bg-hover)] border-b border-[var(--border-color)] ${!course.visible ? 'opacity-60' : ''}`}
              style={{ paddingLeft: `${(depth + 1) * 24 + 12}px` }}
            >
              <div className="w-4 flex-shrink-0" />
              <GripVertical size={14} className="text-[var(--text-muted)] cursor-move flex-shrink-0" />
              <BookOpen size={16} className="text-[var(--moodle-primary)] flex-shrink-0" />
              <Link href={`/course/${course.id}`} className="text-sm text-[var(--text-link)] hover:underline flex-1">
                {course.fullname}
              </Link>
              <span className="text-xs text-[var(--text-muted)]">{course.shortname}</span>
              <span className="text-xs text-[var(--text-muted)]">{course.enrolled} enrolled</span>
              {!course.visible && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Hidden</span>
              )}
              <button className="btn-icon">
                <MoreVertical size={14} />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function ManageCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <PageHeader
        title="Manage courses and categories"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Manage courses and categories' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/courses/addcategory" className="btn btn-secondary text-sm flex items-center gap-1">
              <Plus size={14} /> Add category
            </Link>
            <Link href="/admin/courses/add" className="btn btn-primary text-sm flex items-center gap-1">
              <Plus size={14} /> Add course
            </Link>
          </div>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Search */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search courses and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">
              {demoCategories.length} categories, {demoCategories.reduce((sum, c) => sum + c.coursecount, 0)} courses
            </span>
          </div>

          {/* Category tree */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-hidden">
            <div className="bg-[var(--bg-light)] border-b border-[var(--border-color)] px-3 py-2 flex items-center gap-4">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Course categories</span>
            </div>
            {demoCategories.map((category) => (
              <CategoryNode key={category.id} category={category} />
            ))}
          </div>

          {/* Bulk actions */}
          <div className="mt-4 flex items-center gap-3">
            <select className="form-control text-sm py-1 w-auto">
              <option value="">With selected categories...</option>
              <option value="show">Show</option>
              <option value="hide">Hide</option>
              <option value="moveinto">Move into...</option>
              <option value="resort">Resort courses</option>
              <option value="delete">Delete</option>
            </select>
            <button className="btn btn-secondary text-sm">Perform</button>
          </div>
        </div>
      </div>
    </>
  );
}
