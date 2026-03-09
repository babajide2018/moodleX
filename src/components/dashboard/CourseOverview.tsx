'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  List,
  AlignJustify,
  Search,
  ChevronDown,
  MoreVertical,
  Star,
  Loader2,
  EyeOff,
  Download,
} from 'lucide-react';
import CoursePlaceholderImage from '@/components/course/CoursePlaceholderImage';
import { getCourseColor } from '@/lib/course-colors';

type ViewMode = 'card' | 'list' | 'summary';
type SortOption = 'lastaccessed' | 'title' | 'shortname';
type GroupOption = 'all' | 'inprogress' | 'future' | 'past' | 'favourites' | 'hidden';

interface CourseCardData {
  id: string;
  fullname: string;
  shortname: string;
  category: string;
  image?: string;
  progress?: number;
  isFavourite?: boolean;
  lastAccessed?: string;
}

const groupOptions = [
  { key: 'all', label: 'All (except removed from view)' },
  { key: 'inprogress', label: 'In progress' },
  { key: 'future', label: 'Future' },
  { key: 'past', label: 'Past' },
  { key: 'favourites', label: 'Starred' },
  { key: 'hidden', label: 'Removed from view' },
];

const sortOptions = [
  { key: 'lastaccessed', label: 'Last accessed' },
  { key: 'title', label: 'Course name' },
  { key: 'shortname', label: 'Short name' },
];

export default function CourseOverview() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [sortBy, setSortBy] = useState<SortOption>('lastaccessed');
  const [groupBy, setGroupBy] = useState<GroupOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const sortRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        setShowGroupDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(
            (data.courses || []).map((c: Record<string, string>) => ({
              id: c.id,
              fullname: c.fullname,
              shortname: c.shortname,
              category: c.category,
              image: c.image,
            }))
          );
        }
      } catch {
        // API may not be available yet
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (searchQuery) {
      return (
        course.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (groupBy === 'favourites') return course.isFavourite;
    if (groupBy === 'inprogress') return course.progress && course.progress > 0 && course.progress < 100;
    return true;
  });

  return (
    <div className="mb-6">
      {/* Header with controls - matches Moodle's myoverview block */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h5 className="text-base font-semibold m-0">Course overview</h5>

        <div className="flex items-center gap-2">
          {/* Group/filter selector */}
          <div className="relative" ref={groupRef}>
            <button
              className="btn btn-outline-secondary text-xs flex items-center gap-1"
              onClick={() => {
                setShowGroupDropdown(!showGroupDropdown);
                setShowSortDropdown(false);
              }}
            >
              {groupOptions.find((o) => o.key === groupBy)?.label || groupBy}
              <ChevronDown size={12} />
            </button>
            {showGroupDropdown && (
              <div className="dropdown-menu mt-1" style={{ display: 'block' }}>
                {groupOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`dropdown-item text-sm ${groupBy === option.key ? 'font-medium text-[var(--moodle-primary)]' : ''}`}
                    onClick={() => {
                      setGroupBy(option.key as GroupOption);
                      setShowGroupDropdown(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort selector */}
          <div className="relative" ref={sortRef}>
            <button
              className="btn btn-outline-secondary text-xs flex items-center gap-1"
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowGroupDropdown(false);
              }}
            >
              Sort by {sortOptions.find((o) => o.key === sortBy)?.label?.toLowerCase() || sortBy}
              <ChevronDown size={12} />
            </button>
            {showSortDropdown && (
              <div className="dropdown-menu mt-1" style={{ display: 'block' }}>
                {sortOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`dropdown-item text-sm ${sortBy === option.key ? 'font-medium text-[var(--moodle-primary)]' : ''}`}
                    onClick={() => {
                      setSortBy(option.key as SortOption);
                      setShowSortDropdown(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              className="form-control text-xs py-1 w-40"
              style={{ paddingLeft: '2rem' }}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
          </div>

          {/* View mode toggles */}
          <div className="flex border border-[var(--border-color)] rounded overflow-hidden">
            {([
              { mode: 'card' as ViewMode, icon: LayoutGrid, title: 'Card' },
              { mode: 'list' as ViewMode, icon: List, title: 'List' },
              { mode: 'summary' as ViewMode, icon: AlignJustify, title: 'Summary' },
            ]).map(({ mode, icon: Icon, title }, i) => (
              <button
                key={mode}
                className={`p-1.5 ${i > 0 ? 'border-l border-[var(--border-color)]' : ''} ${
                  viewMode === mode
                    ? 'bg-[var(--moodle-primary)] text-white'
                    : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
                onClick={() => setViewMode(mode)}
                title={`${title} view`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course grid/list */}
      {loading ? (
        <div className="text-center py-8 text-[var(--text-muted)]">
          <Loader2 size={24} className="animate-spin mx-auto mb-2" />
          <p className="m-0">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="border border-[var(--border-color)] rounded p-8 text-center text-[var(--text-muted)]">
          <p className="m-0">No courses</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-1">
          {filteredCourses.map((course) => (
            <CourseListItem key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => (
            <CourseSummaryItem key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCardMenu({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn-icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <div
          className="dropdown-menu"
          style={{ display: 'block', right: 0, left: 'auto', minWidth: '180px' }}
          onClick={(e) => e.preventDefault()}
        >
          <button className="dropdown-item text-sm" onClick={() => setOpen(false)}>
            <Star size={14} />
            Star this course
          </button>
          <button className="dropdown-item text-sm" onClick={() => setOpen(false)}>
            <EyeOff size={14} />
            Remove from view
          </button>
          <button className="dropdown-item text-sm" onClick={() => setOpen(false)}>
            <Download size={14} />
            Download course content
          </button>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <div className="card-moodle group relative">
      <Link href={`/course/${course.id}`} className="no-underline">
        <div className="relative">
          <CoursePlaceholderImage
            courseId={course.id}
            category={course.category}
            className="card-img-top"
            size="md"
          />
          {course.isFavourite && (
            <div className="absolute top-2 left-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400 drop-shadow" />
            </div>
          )}
        </div>

        <div className="card-body pb-2">
          <p className="text-xs text-[var(--text-muted)] mb-0.5 uppercase tracking-wide">
            {course.shortname}
          </p>
          <h6 className="card-title text-sm group-hover:text-[var(--moodle-primary)] transition-colors line-clamp-2 mb-1">
            {course.fullname}
          </h6>
          <p className="card-text text-xs mb-0">{course.category}</p>

          {course.progress !== undefined && course.progress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                <span>{course.progress}% complete</span>
              </div>
              <div className="progress-moodle">
                <div
                  className="progress-bar-moodle"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Card footer with menu */}
      <div className="px-4 pb-3 flex justify-end">
        <CourseCardMenu courseId={course.id} />
      </div>
    </div>
  );
}

function CourseListItem({ course }: { course: CourseCardData }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: getCourseColor(course.id) }}
      />

      <Link href={`/course/${course.id}`} className="flex-1 min-w-0 no-underline">
        <span className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--moodle-primary)]">
          {course.fullname}
        </span>
      </Link>

      {course.isFavourite && (
        <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
      )}

      {course.progress !== undefined && course.progress > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-24 progress-moodle">
            <div
              className="progress-bar-moodle"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="text-xs text-[var(--text-muted)]">{course.progress}%</span>
        </div>
      )}

      <CourseCardMenu courseId={course.id} />
    </div>
  );
}

function CourseSummaryItem({ course }: { course: CourseCardData }) {
  return (
    <div className="flex gap-4 p-4 rounded border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
      {/* Course image block */}
      <Link href={`/course/${course.id}`} className="no-underline flex-shrink-0">
        <CoursePlaceholderImage
          courseId={course.id}
          category={course.category}
          className="w-20 h-20 rounded"
          size="sm"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--text-muted)] mb-0.5 uppercase tracking-wide">
          {course.shortname}
        </p>
        <Link href={`/course/${course.id}`} className="no-underline">
          <h6 className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--moodle-primary)] mb-1">
            {course.fullname}
          </h6>
        </Link>
        <p className="text-xs text-[var(--text-muted)] mb-0">{course.category}</p>

        {course.progress !== undefined && course.progress > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-32 progress-moodle">
              <div
                className="progress-bar-moodle"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <span className="text-xs text-[var(--text-muted)]">{course.progress}% complete</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 flex-shrink-0">
        {course.isFavourite && (
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
        )}
        <CourseCardMenu courseId={course.id} />
      </div>
    </div>
  );
}
