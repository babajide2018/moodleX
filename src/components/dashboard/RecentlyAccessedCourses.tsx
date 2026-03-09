'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface RecentCourse {
  id: string;
  fullname: string;
  shortname: string;
  image?: string;
}

const courseColors = [
  '#4e6e9c', '#57a89a', '#7b62a8', '#ce5f5f',
  '#e8a54b', '#63a563', '#8e6e4e', '#5c8a8a',
];

function getCourseColor(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return courseColors[hash % courseColors.length];
}

export default function RecentlyAccessedCourses() {
  const [courses, setCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(
            (data.courses || []).slice(0, 10).map((c: Record<string, string>) => ({
              id: c.id,
              fullname: c.fullname,
              shortname: c.shortname,
              image: c.image,
            }))
          );
        }
      } catch {
        // API may not be ready
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="mb-6">
        <h5 className="text-base font-semibold mb-3">Recently accessed courses</h5>
        <div className="text-center py-4">
          <Loader2 size={20} className="animate-spin mx-auto text-[var(--text-muted)]" />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="mb-6">
        <h5 className="text-base font-semibold mb-3">Recently accessed courses</h5>
        <div className="border border-[var(--border-color)] rounded p-4 text-center text-sm text-[var(--text-muted)]">
          No recent courses
        </div>
      </div>
    );
  }

  const visibleCount = 4;
  const canScrollLeft = scrollIndex > 0;
  const canScrollRight = scrollIndex + visibleCount < courses.length;
  const visibleCourses = courses.slice(scrollIndex, scrollIndex + visibleCount);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-base font-semibold m-0">Recently accessed courses</h5>
        <div className="flex gap-1">
          <button
            className="btn-icon"
            disabled={!canScrollLeft}
            onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))}
          >
            <ChevronLeft size={16} className={canScrollLeft ? '' : 'opacity-30'} />
          </button>
          <button
            className="btn-icon"
            disabled={!canScrollRight}
            onClick={() => setScrollIndex(scrollIndex + 1)}
          >
            <ChevronRight size={16} className={canScrollRight ? '' : 'opacity-30'} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {visibleCourses.map((course) => (
          <Link
            key={course.id}
            href={`/course/${course.id}`}
            className="no-underline group"
          >
            <div className="border border-[var(--border-color)] rounded overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="h-16"
                style={{
                  backgroundColor: course.image ? undefined : getCourseColor(course.id),
                  backgroundImage: course.image ? `url(${course.image})` : undefined,
                  backgroundSize: 'cover',
                }}
              />
              <div className="p-2">
                <p className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--moodle-primary)] line-clamp-2 m-0">
                  {course.fullname}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
