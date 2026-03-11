'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import CoursePlaceholderImage from '@/components/course/CoursePlaceholderImage';

interface RecentCourse {
  id: string;
  fullname: string;
  shortname: string;
  category?: string;
  image?: string;
}

export default function RecentlyAccessedCourses() {
  const [courses, setCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
              category: c.category,
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

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [courses]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth / 3;
    el.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h5 className="text-base font-semibold mb-3 text-gray-900">Recently accessed courses</h5>
        <div className="text-center py-4">
          <Loader2 size={20} className="animate-spin mx-auto text-gray-400" />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="mb-6">
        <h5 className="text-base font-semibold mb-3 text-gray-900">Recently accessed courses</h5>
        <div className="border border-gray-200 rounded p-4 text-center text-sm text-gray-500">
          No recent courses
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Header with arrows */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-base font-semibold m-0 text-gray-900">Recently accessed courses</h5>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all
              ${canScrollLeft
                ? 'border-gray-300 bg-white hover:bg-gray-100 text-gray-600 cursor-pointer'
                : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all
              ${canScrollRight
                ? 'border-gray-300 bg-white hover:bg-gray-100 text-gray-600 cursor-pointer'
                : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable course cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        onScroll={updateScrollState}
      >
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/course/${course.id}`}
            className="flex-shrink-0 snap-start no-underline group"
            style={{ width: 'calc((100% - 1.5rem) / 3)' }}
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
              {course.image ? (
                <img
                  src={course.image}
                  alt={course.fullname}
                  className="w-full h-20 object-cover"
                />
              ) : (
                <CoursePlaceholderImage
                  courseId={course.id}
                  category={course.category}
                  className="w-full h-20"
                  size="sm"
                />
              )}
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2 m-0">
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
