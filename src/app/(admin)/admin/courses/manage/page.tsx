'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  GripVertical,
  Settings,
  BookOpen,
  Loader2,
} from 'lucide-react';

interface Course {
  id: string;
  shortname: string;
  fullname: string;
  visible: boolean;
  studentCount: number;
}

interface CategoryData {
  id: string;
  name: string;
  parentId: string | null;
  visible: boolean;
  depth: number;
  courseCount: number;
  childCount: number;
}

interface CategoryTree {
  id: string;
  name: string;
  parentId: string | null;
  visible: boolean;
  depth: number;
  courseCount: number;
  children: CategoryTree[];
}

function buildTree(categories: CategoryData[]): CategoryTree[] {
  const map = new Map<string, CategoryTree>();
  const roots: CategoryTree[] = [];

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function flattenTree(tree: CategoryTree[], result: CategoryTree[] = []): CategoryTree[] {
  for (const node of tree) {
    result.push(node);
    if (node.children.length > 0) {
      flattenTree(node.children, result);
    }
  }
  return result;
}

function CategoryRow({
  category,
  isSelected,
  onSelect,
  expanded,
  onToggle,
}: {
  category: CategoryTree;
  isSelected: boolean;
  onSelect: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasChildren = category.children.length > 0;

  return (
    <div
      className={`flex items-center gap-1 py-2 px-2 border-b border-[var(--border-color)] cursor-pointer transition-colors ${
        isSelected ? 'bg-[var(--moodle-primary)] text-white' : 'hover:bg-[var(--bg-hover)]'
      } ${!category.visible ? 'opacity-60' : ''}`}
      style={{ paddingLeft: `${category.depth * 20 + 8}px` }}
      onClick={onSelect}
    >
      {hasChildren ? (
        <button
          className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-[var(--text-muted)]'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      ) : (
        <span className="w-4 flex-shrink-0" />
      )}
      <GripVertical size={14} className={`flex-shrink-0 cursor-move ${isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`} />
      {isSelected ? (
        <FolderOpen size={16} className="text-yellow-300 flex-shrink-0" />
      ) : (
        <Folder size={16} className="text-amber-500 flex-shrink-0" />
      )}
      <span className="text-sm font-medium flex-1 truncate">{category.name}</span>
      <span className={`text-xs flex-shrink-0 ${isSelected ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
        {category.courseCount}
      </span>
    </div>
  );
}

function CourseRow({ course }: { course: Course }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`flex items-center gap-2 py-2.5 px-3 border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
        !course.visible ? 'opacity-60' : ''
      }`}
    >
      <GripVertical size={14} className="text-[var(--text-muted)] cursor-move flex-shrink-0" />
      <BookOpen size={16} className="text-[var(--moodle-primary)] flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Link href={`/course/${course.id}`} className="text-sm text-[var(--text-link)] hover:underline block truncate">
          {course.fullname}
        </Link>
      </div>
      <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{course.shortname}</span>
      {!course.visible && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0">Hidden</span>
      )}
      <div className="relative flex-shrink-0">
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
              {course.visible ? <EyeOff size={13} /> : <Eye size={13} />}
              {course.visible ? 'Hide' : 'Show'}
            </button>
            <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2">
              <Settings size={13} /> Backup
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
  );
}

export default function ManageCoursesPage() {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [allCourses, setAllCourses] = useState<(Course & { categoryId: string })[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [courseSortBy, setCourseSortBy] = useState<string>('fullname');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, courseRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/courses'),
        ]);
        const catData = await catRes.json();
        const courseData = await courseRes.json();

        if (catData.categories) {
          const tree = buildTree(catData.categories);
          setCategories(tree);
          // Auto-select first category
          const flat = flattenTree(tree);
          if (flat.length > 0) {
            setSelectedCategoryId(flat[0].id);
          }
          // Auto-expand top-level categories that have children
          const expanded = new Set<string>();
          for (const cat of flat) {
            if (cat.children.length > 0) expanded.add(cat.id);
          }
          setExpandedCategories(expanded);
        }

        if (courseData.courses) {
          setAllCourses(
            courseData.courses.map((c: { id: string; fullname: string; shortname: string; visible: boolean; studentCount: number; categoryId: string }) => ({
              id: c.id,
              fullname: c.fullname,
              shortname: c.shortname,
              visible: c.visible,
              studentCount: c.studentCount,
              categoryId: c.categoryId,
            }))
          );
        }
      } catch {
        // DB may not be set up
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Build visible categories list (respecting expand state)
  const visibleCategories: CategoryTree[] = [];
  const addVisible = (cats: CategoryTree[]) => {
    for (const cat of cats) {
      visibleCategories.push(cat);
      if (cat.children.length > 0 && expandedCategories.has(cat.id)) {
        addVisible(cat.children);
      }
    }
  };
  addVisible(categories);

  const allFlat = flattenTree(categories);
  const selectedCategory = allFlat.find((c) => c.id === selectedCategoryId);

  // Courses for the selected category
  const coursesInCategory = allCourses
    .filter((c) => c.categoryId === selectedCategoryId)
    .sort((a, b) => {
      if (courseSortBy === 'shortname') return a.shortname.localeCompare(b.shortname);
      return a.fullname.localeCompare(b.fullname);
    });

  const totalCourses = allCourses.length;

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

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-sm text-[var(--text-muted)]">
              <Loader2 size={18} className="animate-spin" />
              Loading courses and categories...
            </div>
          ) : allFlat.length === 0 ? (
            <div className="text-center py-12">
              <Folder size={48} className="mx-auto text-[var(--text-muted)] mb-3" />
              <p className="text-sm text-[var(--text-muted)] mb-4">No course categories found. Create your first category to get started.</p>
              <Link href="/admin/courses/addcategory" className="btn btn-primary text-sm inline-flex items-center gap-1">
                <Plus size={14} /> Create new category
              </Link>
            </div>
          ) : (
            <>
              {/* Two-column layout like real Moodle */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left panel: Course categories */}
                <div>
                  <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-hidden">
                    <div className="bg-[var(--bg-light)] border-b border-[var(--border-color)] px-3 py-2.5 flex items-center justify-between">
                      <span className="text-sm font-semibold">Course categories</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {allFlat.length} categories
                      </span>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto">
                      {visibleCategories.map((category) => (
                        <CategoryRow
                          key={category.id}
                          category={category}
                          isSelected={selectedCategoryId === category.id}
                          onSelect={() => setSelectedCategoryId(category.id)}
                          expanded={expandedCategories.has(category.id)}
                          onToggle={() => toggleExpand(category.id)}
                        />
                      ))}
                    </div>

                    {/* Category actions */}
                    <div className="border-t border-[var(--border-color)] px-3 py-2.5 bg-[var(--bg-light)] flex items-center gap-2 flex-wrap">
                      <Link
                        href="/admin/courses/addcategory"
                        className="btn btn-primary text-xs flex items-center gap-1 py-1 px-2.5"
                      >
                        <Plus size={12} /> Create new category
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-[var(--text-muted)]">Resort by:</label>
                        <select className="form-control text-xs py-0.5 w-auto">
                          <option value="name">Name</option>
                          <option value="idnumber">ID number</option>
                          <option value="coursecount">Course count</option>
                        </select>
                        <button className="btn btn-secondary text-xs py-0.5 px-2">Resort</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right panel: Courses in selected category */}
                <div>
                  <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-hidden">
                    <div className="bg-[var(--bg-light)] border-b border-[var(--border-color)] px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-amber-500" />
                        <span className="text-sm font-semibold">{selectedCategory?.name || 'Select a category'}</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">
                        {coursesInCategory.length} course(s)
                      </span>
                    </div>

                    {selectedCategory ? (
                      <>
                        {/* Category details bar */}
                        <div className="px-3 py-2 bg-blue-50/50 border-b border-[var(--border-color)] flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                            <span>ID: {selectedCategory.id.slice(0, 8)}...</span>
                            {!selectedCategory.visible && (
                              <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">Hidden</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="btn-icon" title="Edit category">
                              <Pencil size={13} />
                            </button>
                            <button className="btn-icon" title={selectedCategory.visible ? 'Hide' : 'Show'}>
                              {selectedCategory.visible ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button className="btn-icon text-red-500" title="Delete category">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Course list */}
                        <div className="max-h-[400px] overflow-y-auto">
                          {coursesInCategory.length > 0 ? (
                            coursesInCategory.map((course) => (
                              <CourseRow key={course.id} course={course} />
                            ))
                          ) : (
                            <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                              No courses in this category
                            </div>
                          )}
                        </div>

                        {/* Course actions */}
                        <div className="border-t border-[var(--border-color)] px-3 py-2.5 bg-[var(--bg-light)] flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/courses/add?category=${selectedCategoryId}`}
                            className="btn btn-primary text-xs flex items-center gap-1 py-1 px-2.5"
                          >
                            <Plus size={12} /> New course
                          </Link>
                          <div className="flex items-center gap-1.5">
                            <label className="text-xs text-[var(--text-muted)]">Sort by:</label>
                            <select
                              className="form-control text-xs py-0.5 w-auto"
                              value={courseSortBy}
                              onChange={(e) => setCourseSortBy(e.target.value)}
                            >
                              <option value="fullname">Full name</option>
                              <option value="shortname">Short name</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center text-sm text-[var(--text-muted)]">
                        Select a category from the left to view its courses
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary bar */}
              <div className="mt-4 text-xs text-[var(--text-muted)] flex items-center gap-4">
                <span>Total: {allFlat.length} categories, {totalCourses} courses</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
