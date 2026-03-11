'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { Loader2, AlertCircle, ChevronDown, BookOpen } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GradeEntry {
  id: string;
  userId: string;
  rawgrade: number | null;
  finalgrade: number | null;
  feedback: string | null;
  overridden: boolean;
  excluded: boolean;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
}

interface GradeItem {
  id: string;
  itemName: string;
  itemType: string;
  itemModule: string | null;
  gradeMax: number;
  gradeMin: number;
  gradePass: number;
  sortorder: number;
  hidden: boolean;
  locked: boolean;
  grades: GradeEntry[];
}

interface Participant {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

interface CourseInfo {
  id: string;
  fullname: string;
  shortname: string;
}

interface CourseTotals {
  [userId: string]: { earned: number; max: number };
}

type ViewMode = 'grader' | 'user';

// ---------------------------------------------------------------------------
// Helper – find a student's grade for a given grade item
// ---------------------------------------------------------------------------

function findGrade(item: GradeItem, userId: string): GradeEntry | undefined {
  return item.grades.find((g) => g.userId === userId);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CourseGradesPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  // Data
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [courseTotals, setCourseTotals] = useState<CourseTotals>({});

  // UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grader');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Tabs
  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  // -------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------

  const fetchGrades = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/courses/${courseId}/grades`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch grades');
      }
      const data = await res.json();
      setGradeItems(data.gradeItems);
      setParticipants(data.participants);
      setCourseInfo(data.course);
      setCourseTotals(data.courseTotals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch grades');
    }
  }, [courseId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchGrades();
      setLoading(false);
    };
    load();
  }, [fetchGrades]);

  // When participants load and no user is selected for user-report, pick first student
  useEffect(() => {
    if (!selectedUserId && participants.length > 0) {
      const firstStudent = participants.find((p) => p.role === 'student') || participants[0];
      setSelectedUserId(firstStudent.id);
    }
  }, [participants, selectedUserId]);

  // -------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------

  const courseLabel = courseInfo?.shortname || courseId;

  // Filter to only activity-level grade items (not course or category totals)
  const activityItems = gradeItems.filter(
    (item) => item.itemType !== 'course' && item.itemType !== 'category'
  );

  const students = participants.filter((p) => p.role === 'student');
  const selectedUser = participants.find((p) => p.id === selectedUserId) || null;

  // -------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------

  if (loading) {
    return (
      <>
        <PageHeader
          title="Grades"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Grades' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div id="region-main">
            <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading gradebook...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // -------------------------------------------------------------------
  // Error state
  // -------------------------------------------------------------------

  if (error) {
    return (
      <>
        <PageHeader
          title="Grades"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Grades' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div id="region-main">
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle size={32} className="text-[var(--moodle-danger)] mb-3" />
              <p className="text-sm text-[var(--text-muted)] mb-4">{error}</p>
              <button
                className="btn btn-primary text-sm"
                onClick={() => {
                  setLoading(true);
                  fetchGrades().finally(() => setLoading(false));
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // -------------------------------------------------------------------
  // Empty state
  // -------------------------------------------------------------------

  if (activityItems.length === 0) {
    return (
      <>
        <PageHeader
          title={viewMode === 'grader' ? 'Grader report' : 'User report'}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Grades' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div id="region-main">
            {/* View selector */}
            <div className="mb-4">
              <ViewSelector viewMode={viewMode} onChange={setViewMode} />
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen size={48} className="text-[var(--text-muted)] mb-4 opacity-40" />
              <h3 className="text-base font-semibold mb-2">No grade items in this course yet</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-md">
                No grade items in this course yet. Add graded activities to see the gradebook.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------

  return (
    <>
      <PageHeader
        title={viewMode === 'grader' ? 'Grader report' : 'User report'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My courses', href: '/my/courses' },
          { label: courseLabel, href: `/course/${courseId}` },
          { label: 'Grades' },
        ]}
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* View selector */}
          <div className="mb-4">
            <ViewSelector viewMode={viewMode} onChange={setViewMode} />
          </div>

          {viewMode === 'grader' ? (
            <GraderReport
              activityItems={activityItems}
              students={students}
              courseTotals={courseTotals}
              courseId={courseId}
            />
          ) : (
            <UserReport
              activityItems={activityItems}
              participants={participants}
              selectedUser={selectedUser}
              courseTotals={courseTotals}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
              courseInfo={courseInfo}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ===========================================================================
// View Selector Dropdown
// ===========================================================================

function ViewSelector({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="grade-view-select" className="text-sm font-medium">
        View:
      </label>
      <div className="relative">
        <select
          id="grade-view-select"
          className="form-control text-sm py-1.5 pr-8 appearance-none"
          value={viewMode}
          onChange={(e) => onChange(e.target.value as ViewMode)}
        >
          <option value="grader">Grader report</option>
          <option value="user">User report</option>
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]"
        />
      </div>
    </div>
  );
}

// ===========================================================================
// Grader Report – rows = students, columns = grade items + course total
// ===========================================================================

function GraderReport({
  activityItems,
  students,
  courseTotals,
  courseId,
}: {
  activityItems: GradeItem[];
  students: Participant[];
  courseTotals: CourseTotals;
  courseId: string;
}) {
  // Compute overall max possible (sum of all item gradeMax)
  const overallMax = activityItems.reduce((sum, item) => sum + item.gradeMax, 0);

  return (
    <>
      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No students are enrolled in this course yet.{' '}
            <Link
              href={`/course/${courseId}/participants`}
              className="text-[var(--text-link)] hover:underline"
            >
              Enrol students
            </Link>{' '}
            to populate the gradebook.
          </p>
        </div>
      ) : (
        <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-light)] border-b-2 border-[var(--border-color)]">
                <th className="py-2 px-4 text-left font-semibold sticky left-0 bg-[var(--bg-light)] z-10 min-w-[200px]">
                  First name / Last name
                </th>
                {activityItems.map((item) => (
                  <th
                    key={item.id}
                    className="py-2 px-3 text-center font-semibold min-w-[100px]"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="flex items-center gap-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                            item.itemModule === 'assign'
                              ? 'bg-green-500'
                              : item.itemModule === 'quiz'
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className="truncate max-w-[120px]" title={item.itemName}>
                          {item.itemName}
                        </span>
                      </span>
                      <span className="text-xs font-normal text-[var(--text-muted)]">
                        /{item.gradeMax}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="py-2 px-4 text-center font-semibold min-w-[120px] bg-blue-50">
                  <div className="flex flex-col items-center gap-0.5">
                    <span>Course total</span>
                    <span className="text-xs font-normal text-[var(--text-muted)]">
                      /{overallMax}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const total = courseTotals[student.id] || { earned: 0, max: 0 };
                const totalPct = total.max > 0 ? (total.earned / total.max) * 100 : null;

                return (
                  <tr
                    key={student.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    {/* Student name – sticky */}
                    <td className="py-2 px-4 sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {student.firstname[0]}
                          {student.lastname[0]}
                        </div>
                        <Link
                          href={`/user/${student.id}`}
                          className="text-[var(--text-link)] font-medium hover:underline"
                        >
                          {student.firstname} {student.lastname}
                        </Link>
                      </div>
                    </td>

                    {/* Grade cells */}
                    {activityItems.map((item) => {
                      const grade = findGrade(item, student.id);
                      const value = grade?.finalgrade ?? null;

                      return (
                        <td key={item.id} className="py-2 px-3 text-center">
                          {value !== null ? (
                            <GradeBadge
                              value={value}
                              max={item.gradeMax}
                              pass={item.gradePass}
                            />
                          ) : (
                            <span className="text-[var(--text-muted)]">-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Course total */}
                    <td className="py-2 px-4 text-center bg-blue-50/50">
                      {totalPct !== null ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold text-[var(--moodle-primary)]">
                            {total.earned.toFixed(2)}
                          </span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(totalPct, 100)}%`,
                                backgroundColor:
                                  totalPct >= 50 ? 'var(--moodle-success)' : 'var(--moodle-danger)',
                              }}
                            />
                          </div>
                          <span className="text-xs text-[var(--text-muted)]">
                            {totalPct.toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Overall averages row */}
              <tr className="bg-[var(--bg-light)] border-t-2 border-[var(--border-color)] font-medium">
                <td className="py-2 px-4 sticky left-0 bg-[var(--bg-light)] z-10 text-sm font-semibold">
                  Overall average
                </td>
                {activityItems.map((item) => {
                  const gradedEntries = item.grades.filter(
                    (g) =>
                      g.finalgrade !== null &&
                      students.some((s) => s.id === g.userId)
                  );
                  const avg =
                    gradedEntries.length > 0
                      ? gradedEntries.reduce((sum, g) => sum + (g.finalgrade ?? 0), 0) /
                        gradedEntries.length
                      : null;

                  return (
                    <td key={item.id} className="py-2 px-3 text-center">
                      {avg !== null ? (
                        <span className="text-sm">{avg.toFixed(2)}</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="py-2 px-4 text-center bg-blue-50">
                  {(() => {
                    const totals = students
                      .map((s) => courseTotals[s.id])
                      .filter((t) => t && t.max > 0);
                    if (totals.length === 0) return <span className="text-[var(--text-muted)]">-</span>;
                    const avgPct =
                      totals.reduce((sum, t) => sum + (t.earned / t.max) * 100, 0) / totals.length;
                    return <span className="text-sm font-semibold">{avgPct.toFixed(1)}%</span>;
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ===========================================================================
// User Report – single student's grades in a table
// ===========================================================================

function UserReport({
  activityItems,
  participants,
  selectedUser,
  courseTotals,
  selectedUserId,
  onSelectUser,
  courseInfo,
}: {
  activityItems: GradeItem[];
  participants: Participant[];
  selectedUser: Participant | null;
  courseTotals: CourseTotals;
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
  courseInfo: CourseInfo | null;
}) {
  const total = selectedUserId ? courseTotals[selectedUserId] : null;
  const overallMax = activityItems.reduce((sum, item) => sum + item.gradeMax, 0);
  const totalPct = total && total.max > 0 ? (total.earned / total.max) * 100 : null;

  // Compute contribution weights (equal weight by default, using gradeMax proportions)
  const getWeight = (item: GradeItem) =>
    overallMax > 0 ? (item.gradeMax / overallMax) * 100 : 0;

  return (
    <>
      {/* User selector */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
        {selectedUser && (
          <div className="w-10 h-10 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center font-medium flex-shrink-0">
            {selectedUser.firstname[0]}
            {selectedUser.lastname[0]}
          </div>
        )}
        <div className="flex-1">
          <label htmlFor="user-select" className="text-xs text-[var(--text-muted)] block mb-0.5">
            Select user
          </label>
          <select
            id="user-select"
            className="form-control text-sm py-1"
            value={selectedUserId || ''}
            onChange={(e) => onSelectUser(e.target.value)}
          >
            {participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstname} {p.lastname} ({p.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedUser ? (
        <>
          {/* Grades table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b-2 border-[var(--border-color)]">
                  <th className="py-2 px-4 text-left font-semibold">Grade item</th>
                  <th className="py-2 px-4 text-center font-semibold w-20">Weight</th>
                  <th className="py-2 px-4 text-center font-semibold w-24">Grade</th>
                  <th className="py-2 px-4 text-center font-semibold w-20">Range</th>
                  <th className="py-2 px-4 text-center font-semibold w-24">Percentage</th>
                  <th className="py-2 px-4 text-left font-semibold hidden lg:table-cell">
                    Feedback
                  </th>
                  <th className="py-2 px-4 text-center font-semibold w-28 hidden md:table-cell">
                    Contribution to course total
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Course total row */}
                <tr className="bg-blue-50 border-b border-[var(--border-color)] font-medium">
                  <td className="py-2 px-4">
                    <span className="font-semibold">
                      {courseInfo?.fullname || 'Course total'}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">-</td>
                  <td className="py-2 px-4 text-center">
                    {total && total.max > 0 ? (
                      <span className="text-[var(--moodle-primary)] font-bold">
                        {total.earned.toFixed(2)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-2 px-4 text-center">0&ndash;{overallMax}</td>
                  <td className="py-2 px-4 text-center">
                    {totalPct !== null ? `${totalPct.toFixed(2)} %` : '-'}
                  </td>
                  <td className="py-2 px-4 hidden lg:table-cell">-</td>
                  <td className="py-2 px-4 text-center hidden md:table-cell">-</td>
                </tr>

                {/* Individual grade items */}
                {activityItems.map((item) => {
                  const grade = findGrade(item, selectedUser.id);
                  const value = grade?.finalgrade ?? null;
                  const pct = value !== null ? (value / item.gradeMax) * 100 : null;
                  const weight = getWeight(item);
                  const contribution = pct !== null ? (pct * weight) / 100 : null;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
                    >
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                              item.itemModule === 'assign'
                                ? 'bg-green-500'
                                : item.itemModule === 'quiz'
                                ? 'bg-orange-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <span>{item.itemName}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center text-[var(--text-muted)]">
                        {weight.toFixed(2)} %
                      </td>
                      <td className="py-2 px-4 text-center">
                        {value !== null ? (
                          <span className="font-medium">{value.toFixed(2)}</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center text-[var(--text-muted)]">
                        {item.gradeMin}&ndash;{item.gradeMax}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {pct !== null ? (
                          <span>{pct.toFixed(2)} %</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-xs text-[var(--text-muted)] hidden lg:table-cell">
                        {grade?.feedback || '-'}
                      </td>
                      <td className="py-2 px-4 text-center hidden md:table-cell">
                        {contribution !== null ? (
                          <span>{contribution.toFixed(2)} %</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Overall course grade bar */}
          <div className="mt-4 p-4 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall course grade</span>
              <span className="text-sm font-bold text-[var(--moodle-primary)]">
                {totalPct !== null ? `${totalPct.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <div className="progress-moodle h-3">
              <div
                className="progress-bar-moodle"
                style={{ width: `${totalPct ?? 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>
                {activityItems.filter((item) => findGrade(item, selectedUser.id)?.finalgrade !== null && findGrade(item, selectedUser.id)?.finalgrade !== undefined).length} of{' '}
                {activityItems.length} graded
              </span>
              <span>
                {activityItems.filter((item) => {
                  const g = findGrade(item, selectedUser.id);
                  return !g || g.finalgrade === null;
                }).length}{' '}
                pending
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-12 text-sm text-[var(--text-muted)]">
          Select a user above to view their grades.
        </div>
      )}
    </>
  );
}

// ===========================================================================
// Grade Badge – color-coded display of a grade value
// ===========================================================================

function GradeBadge({
  value,
  max,
  pass,
}: {
  value: number;
  max: number;
  pass: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const passing = pass > 0 && value >= pass;
  const failing = pass > 0 && value < pass;

  let colorClass = 'text-[var(--text-primary)]';
  if (passing) colorClass = 'text-green-700';
  if (failing) colorClass = 'text-red-700';

  return (
    <span className={`font-medium ${colorClass}`} title={`${pct.toFixed(1)}%`}>
      {value.toFixed(2)}
    </span>
  );
}
