'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ChevronDown } from 'lucide-react';

interface StarredCourse {
  id: string;
  fullname: string;
  shortname: string;
  color: string;
}

const mockCourses: StarredCourse[] = [
  {
    id: 'cs101',
    fullname: 'Introduction to Computer Science',
    shortname: 'CS101',
    color: '#4e6e9c',
  },
  {
    id: 'math201',
    fullname: 'Linear Algebra',
    shortname: 'MATH201',
    color: '#7b62a8',
  },
  {
    id: 'eng102',
    fullname: 'Academic Writing',
    shortname: 'ENG102',
    color: '#57a89a',
  },
];

export default function StarredCourses() {
  const [showEmpty, setShowEmpty] = useState(false);

  const courses = showEmpty ? [] : mockCourses;

  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)] flex items-center justify-between">
        <h6 className="text-sm font-semibold m-0">Starred courses</h6>
        <button
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--moodle-primary)]"
          onClick={() => setShowEmpty(!showEmpty)}
          title="Toggle empty state"
        >
          <ChevronDown size={12} />
        </button>
      </div>
      <div className="p-3">
        {courses.length === 0 ? (
          <div className="text-center py-4">
            <Star size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)] m-0">
              You have not starred any courses
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/course/${course.id}`}
                className="flex items-center gap-3 p-2 rounded hover:bg-[var(--bg-light)] no-underline transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: course.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-secondary)] m-0 truncate">
                    {course.fullname}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] m-0">
                    {course.shortname}
                  </p>
                </div>
                <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
