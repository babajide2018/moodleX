'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Users,
  BookOpen,
  FolderTree,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Copy,
  Archive,
  Download,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { adminTabs } from '@/lib/admin-tabs';

interface Course {
  id: string;
  fullname: string;
  shortname: string;
  category: string;
  categoryId: string;
  visible: boolean;
  format: string;
  startdate: string;
  enddate: string | null;
  studentCount: number;
  sectionCount: number;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/courses'),
          fetch('/api/courses/all'),
        ]);

        if (!coursesRes.ok) {
          const data = await coursesRes.json().catch(() => ({}));
          throw new Error(data.error || `Failed to fetch courses (${coursesRes.status})`);
        }

        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);

        // Extract unique categories from courses data, and also from /api/courses/all if available
        if (categoriesRes.ok) {
          const catData = await categoriesRes.json();
          // Extract unique categories from the public courses endpoint
          const catMap = new Map<string, string>();
          (catData.courses || []).forEach((c: { category?: { id: string; name: string } }) => {
            if (c.category) {
              catMap.set(c.category.id, c.category.name);
            }
          });
          // Also add categories from admin courses
          (coursesData.courses || []).forEach((c: Course) => {
            if (c.categoryId && c.category) {
              catMap.set(c.categoryId, c.category);
            }
          });
          const cats: Category[] = [];
          catMap.forEach((name, id) => cats.push({ id, name }));
          cats.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(cats);
        } else {
          // Fallback: extract categories from courses data
          const catMap = new Map<string, string>();
          (coursesData.courses || []).forEach((c: Course) => {
            if (c.categoryId && c.category) {
              catMap.set(c.categoryId, c.category);
            }
          });
          const cats: Category[] = [];
          catMap.forEach((name, id) => cats.push({ id, name }));
          cats.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(cats);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = courses.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.fullname.toLowerCase().includes(q) && !c.shortname.toLowerCase().includes(q)) return false;
    }
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (visibilityFilter === 'visible' && !c.visible) return false;
    if (visibilityFilter === 'hidden' && c.visible) return false;
    return true;
  });

  // Compute stats from fetched data
  const totalCourses = courses.length;
  const totalCategories = categories.length;
  const hiddenCount = courses.filter((c) => !c.visible).length;
  const totalEnrolments = courses.reduce((sum, c) => sum + c.studentCount, 0);

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <>
      <PageHeader
        title="Manage courses and categories"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              className="btn btn-primary text-sm flex items-center gap-1"
              onClick={() => setShowAddCourse(true)}
            >
              <Plus size={16} /> Add a new course
            </button>
            <button
              className="btn btn-secondary text-sm flex items-center gap-1"
              onClick={() => setShowCategories(!showCategories)}
            >
              <FolderTree size={14} /> Manage categories
            </button>
          </div>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-[var(--moodle-primary)]" />
              <span className="ml-3 text-sm text-[var(--text-muted)]">Loading courses...</span>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 mb-6">
              <AlertCircle size={20} />
              <div>
                <div className="font-medium text-sm">Failed to load courses</div>
                <div className="text-xs mt-0.5">{error}</div>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[var(--moodle-primary)]">{totalCourses}</div>
                  <div className="text-xs text-[var(--text-muted)]">Total courses</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{totalCategories}</div>
                  <div className="text-xs text-[var(--text-muted)]">Categories</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-600">{hiddenCount}</div>
                  <div className="text-xs text-[var(--text-muted)]">Hidden courses</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{totalEnrolments}</div>
                  <div className="text-xs text-[var(--text-muted)]">Total enrolments</div>
                </div>
              </div>

              {/* Category management section */}
              {showCategories && (
                <div className="border border-[var(--border-color)] rounded-lg mb-6">
                  <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
                    <h3 className="text-sm font-semibold m-0">Course categories</h3>
                    <button className="btn btn-primary text-xs flex items-center gap-1">
                      <Plus size={12} /> Add category
                    </button>
                  </div>
                  {categories.length === 0 ? (
                    <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                      No categories found. Create your first category to organize courses.
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                          <th className="py-2 px-3 text-left font-semibold w-8"></th>
                          <th className="py-2 px-3 text-left font-semibold">Category name</th>
                          <th className="py-2 px-3 text-left font-semibold">Courses</th>
                          <th className="py-2 px-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => {
                          const courseCount = courses.filter((c) => c.category === cat.name).length;
                          return (
                            <tr key={cat.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                              <td className="py-2 px-3 text-[var(--text-muted)]">
                                <GripVertical size={14} />
                              </td>
                              <td className="py-2 px-3 font-medium text-[var(--text-link)]">{cat.name}</td>
                              <td className="py-2 px-3 text-[var(--text-muted)]">{courseCount}</td>
                              <td className="py-2 px-3">
                                <button className="btn-icon"><MoreVertical size={14} /></button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Filters bar */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <input
                    type="text"
                    className="form-control text-sm"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-[var(--text-muted)]" />
                  <select
                    className="form-control text-sm py-1"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    className="form-control text-sm py-1"
                    value={visibilityFilter}
                    onChange={(e) => setVisibilityFilter(e.target.value)}
                  >
                    <option value="all">All visibility</option>
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <span className="text-sm text-[var(--text-muted)]">
                  {filtered.length} courses
                </span>
              </div>

              {/* Courses table */}
              {filtered.length === 0 ? (
                <div className="border border-[var(--border-color)] rounded-lg p-8 text-center">
                  <div className="text-[var(--text-muted)] text-sm">
                    {courses.length === 0
                      ? 'No courses found. Create your first course to get started.'
                      : 'No courses match the current filters.'}
                  </div>
                </div>
              ) : (
                <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                        <th className="py-2 px-3 text-left font-semibold">Course name</th>
                        <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Short name</th>
                        <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Category</th>
                        <th className="py-2 px-3 text-left font-semibold">Students</th>
                        <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Format</th>
                        <th className="py-2 px-3 text-left font-semibold">Visibility</th>
                        <th className="py-2 px-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((course) => (
                        <tr key={course.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                          <td className="py-2 px-3">
                            <Link
                              href={`/course/${course.id}`}
                              className="text-[var(--text-link)] font-medium hover:underline"
                            >
                              {course.fullname}
                            </Link>
                            <div className="text-xs text-[var(--text-muted)] mt-0.5">
                              {formatDate(course.startdate)} - {formatDate(course.enddate)}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell font-mono text-xs">
                            {course.shortname}
                          </td>
                          <td className="py-2 px-3 text-[var(--text-muted)] hidden lg:table-cell text-xs">
                            {course.category}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1 text-xs">
                              <Users size={12} className="text-[var(--text-muted)]" />
                              <span>{course.studentCount}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 hidden md:table-cell">
                            <span className="text-xs capitalize text-[var(--text-muted)]">{course.format}</span>
                          </td>
                          <td className="py-2 px-3">
                            {course.visible ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                                <Eye size={10} /> Visible
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                <EyeOff size={10} /> Hidden
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <button className="btn-icon"><MoreVertical size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add course modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/40 z-[1060] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-base">Add a new course</h3>
              <button className="btn-icon" onClick={() => setShowAddCourse(false)}>&times;</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="form-label text-sm">Course full name <span className="text-red-500">*</span></label>
                <input type="text" className="form-control" placeholder="e.g. Introduction to Computer Science" />
              </div>
              <div>
                <label className="form-label text-sm">Course short name <span className="text-red-500">*</span></label>
                <input type="text" className="form-control w-48" placeholder="e.g. CS101" />
              </div>
              <div>
                <label className="form-label text-sm">Course category <span className="text-red-500">*</span></label>
                <select className="form-control">
                  {categories.length === 0 && (
                    <option value="">No categories available</option>
                  )}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label text-sm">Course summary</label>
                <textarea className="form-control min-h-[80px]" placeholder="A brief description of the course..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-sm">Course start date <span className="text-red-500">*</span></label>
                  <input type="date" className="form-control" defaultValue="2026-01-20" />
                </div>
                <div>
                  <label className="form-label text-sm">Course end date</label>
                  <input type="date" className="form-control" defaultValue="2026-06-01" />
                </div>
              </div>
              <div>
                <label className="form-label text-sm">Course format</label>
                <select className="form-control">
                  <option value="topics">Topics format</option>
                  <option value="weeks">Weekly format</option>
                  <option value="social">Social format</option>
                  <option value="singleactivity">Single activity format</option>
                </select>
              </div>
              <div>
                <label className="form-label text-sm">Visibility</label>
                <select className="form-control w-32">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
              <button className="btn btn-secondary" onClick={() => setShowAddCourse(false)}>Cancel</button>
              <button className="btn btn-primary">Create course</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
