'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  FileText,
  Radio,
  BarChart3,
  Users,
  CheckSquare,
  Loader2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  TrendingUp,
} from 'lucide-react';

interface CourseInfo {
  id: string;
  fullname: string;
  shortname: string;
}

interface ReportStats {
  courseId: string;
  courseName: string;
  courseShortname: string;
  enrollments: number;
  recentEnrollments: number;
  sections: number;
  modules: number;
  moduleTypes: Record<string, number>;
  gradeItems: number;
  completionRecords: number;
  completedActivities: number;
  completionRate: number;
  startdate: string;
  enddate: string | null;
  enablecompletion: boolean;
}

const reportTypes = [
  {
    key: 'logs',
    title: 'Logs',
    description: 'View all course activity logs. See who did what and when in this course.',
    icon: FileText,
    hasPage: true,
  },
  {
    key: 'livelogs',
    title: 'Live logs',
    description: 'View real-time course activity as it happens. Shows the most recent activity in the last hour.',
    icon: Radio,
    hasPage: false,
  },
  {
    key: 'activity',
    title: 'Activity report',
    description: 'Shows activity completion status for all activities and all students enrolled in the course.',
    icon: BarChart3,
    hasPage: false,
  },
  {
    key: 'participation',
    title: 'Course participation',
    description: 'View course participation by activity module. Filter by role and time period to see who has participated.',
    icon: Users,
    hasPage: false,
  },
  {
    key: 'completion',
    title: 'Activity completion',
    description: 'View activity completion status for all students. Track which activities each student has completed.',
    icon: CheckSquare,
    hasPage: false,
  },
];

export default function ReportsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [courseRes, statsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/reports`),
      ]);

      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourseInfo({
          id: courseData.course.id,
          fullname: courseData.course.fullname,
          shortname: courseData.course.shortname,
        });
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      } else {
        const data = await statsRes.json();
        throw new Error(data.error || 'Failed to fetch report data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const courseLabel = courseInfo?.shortname || courseId;

  // Loading state
  if (loading) {
    return (
      <>
        <PageHeader
          title="Reports"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Reports' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div id="region-main">
            <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading reports...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader
          title="Reports"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Reports' },
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
                  fetchData();
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

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My courses', href: '/my/courses' },
          { label: courseLabel, href: `/course/${courseId}` },
          { label: 'Reports' },
        ]}
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-5xl">
          {/* Course stats overview */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="border border-[var(--border-color)] rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={18} className="text-[var(--moodle-primary)]" />
                  <span className="text-sm text-[var(--text-muted)]">Enrolled users</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.enrollments}
                </p>
                {stats.recentEnrollments > 0 && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    +{stats.recentEnrollments} in last 30 days
                  </p>
                )}
              </div>

              <div className="border border-[var(--border-color)] rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={18} className="text-[var(--moodle-primary)]" />
                  <span className="text-sm text-[var(--text-muted)]">Activities</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.modules}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  across {stats.sections} section{stats.sections !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="border border-[var(--border-color)] rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Layers size={18} className="text-[var(--moodle-primary)]" />
                  <span className="text-sm text-[var(--text-muted)]">Grade items</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.gradeItems}
                </p>
              </div>

              <div className="border border-[var(--border-color)] rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-[var(--moodle-primary)]" />
                  <span className="text-sm text-[var(--text-muted)]">Completion rate</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.completionRate}%
                </p>
                {stats.enablecompletion ? (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {stats.completedActivities} of {stats.completionRecords} tracked
                  </p>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Completion tracking disabled
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Module type breakdown */}
          {stats && Object.keys(stats.moduleTypes).length > 0 && (
            <div className="border border-[var(--border-color)] rounded-lg p-4 bg-white mb-6">
              <h3 className="text-sm font-semibold mb-3">Activity types</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(stats.moduleTypes).map(([type, count]) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 text-xs bg-[var(--bg-light)] border border-[var(--border-color)] px-3 py-1.5 rounded-full"
                  >
                    <span className="font-medium capitalize">{type}</span>
                    <span className="text-[var(--text-muted)]">({count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Report types */}
          <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Available reports</h3>
          <div className="space-y-3">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const href = report.hasPage
                ? `/course/${courseId}/reports/${report.key}`
                : `/course/${courseId}/reports`;

              return (
                <Link
                  key={report.key}
                  href={href}
                  className={`block border border-[var(--border-color)] rounded-lg p-4 bg-white hover:bg-[var(--bg-hover)] hover:border-[var(--moodle-primary)] transition-all group ${
                    !report.hasPage ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-light)] flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50">
                      <Icon size={20} className="text-[var(--moodle-primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--moodle-primary)]">
                          {report.title}
                        </h4>
                        {!report.hasPage && (
                          <span className="text-[10px] bg-[var(--bg-light)] text-[var(--text-muted)] px-1.5 py-0.5 rounded uppercase font-medium">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                        {report.description}
                      </p>
                    </div>
                    {report.hasPage && (
                      <ArrowRight
                        size={16}
                        className="text-[var(--text-muted)] flex-shrink-0 mt-1 group-hover:text-[var(--moodle-primary)] transition-colors"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
