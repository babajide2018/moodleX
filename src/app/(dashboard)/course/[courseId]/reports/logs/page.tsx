'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Loader2,
  AlertCircle,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  User,
  Monitor,
} from 'lucide-react';

interface CourseInfo {
  id: string;
  fullname: string;
  shortname: string;
}

interface LogEntry {
  id: string;
  time: string;
  user: string;
  userId: string;
  eventName: string;
  action: string;
  target: string;
  component: string;
  description: string;
  ip: string;
}

interface FilterOptions {
  users: { id: string; name: string }[];
  actions: string[];
}

export default function LogsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ users: [], actions: [] });

  // Filters
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  const fetchCourseInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourseInfo({
          id: data.course.id,
          fullname: data.course.fullname,
          shortname: data.course.shortname,
        });
      }
    } catch {
      // Course info is supplementary
    }
  }, [courseId]);

  const fetchLogs = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
      });

      if (userFilter) params.set('userId', userFilter);
      if (dateFilter) params.set('date', dateFilter);
      if (actionFilter) params.set('action', actionFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/courses/${courseId}/logs?${params}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch logs');
      }

      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setFilterOptions(data.filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [courseId, currentPage, userFilter, dateFilter, actionFilter, searchQuery]);

  useEffect(() => {
    fetchCourseInfo();
  }, [fetchCourseInfo]);

  useEffect(() => {
    setLoading(true);
    fetchLogs();
  }, [fetchLogs]);

  const courseLabel = courseInfo?.shortname || courseId;

  function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatEventName(action: string): string {
    return action.charAt(0).toUpperCase() + action.slice(1);
  }

  // Loading state
  if (loading && logs.length === 0) {
    return (
      <>
        <PageHeader
          title="Logs"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Reports', href: `/course/${courseId}/reports` },
            { label: 'Logs' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div id="region-main">
            <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading logs...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && logs.length === 0) {
    return (
      <>
        <PageHeader
          title="Logs"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Reports', href: `/course/${courseId}/reports` },
            { label: 'Logs' },
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
                  fetchLogs();
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
        title="Logs"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My courses', href: '/my/courses' },
          { label: courseLabel, href: `/course/${courseId}` },
          { label: 'Reports', href: `/course/${courseId}/reports` },
          { label: 'Logs' },
        ]}
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Filters */}
          <div className="border border-[var(--border-color)] rounded-lg p-4 bg-white mb-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 flex items-center gap-1">
                  <User size={12} /> Participant
                </label>
                <select
                  className="form-control text-sm"
                  value={userFilter}
                  onChange={(e) => {
                    setUserFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All participants</option>
                  {filterOptions.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[140px]">
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Date
                </label>
                <input
                  type="date"
                  className="form-control text-sm"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="min-w-[130px]">
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 flex items-center gap-1">
                  <Monitor size={12} /> Action
                </label>
                <select
                  className="form-control text-sm"
                  value={actionFilter}
                  onChange={(e) => {
                    setActionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All actions</option>
                  {filterOptions.actions.map((action) => (
                    <option key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 flex items-center gap-1">
                  <Search size={12} /> Search
                </label>
                <input
                  type="text"
                  className="form-control text-sm"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <button
                className="btn btn-secondary text-sm flex items-center gap-1"
                title="Download logs"
              >
                <Download size={14} /> Export
              </button>
            </div>

            <div className="mt-3 text-xs text-[var(--text-muted)]">
              {loading ? (
                <span className="flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> Loading...
                </span>
              ) : (
                <>Showing {total} log entr{total !== 1 ? 'ies' : 'y'}</>
              )}
            </div>
          </div>

          {/* Logs table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                    <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Time</th>
                    <th className="py-2 px-3 text-left font-semibold">User full name</th>
                    <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">
                      Event context
                    </th>
                    <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">
                      Component
                    </th>
                    <th className="py-2 px-3 text-left font-semibold">Event name</th>
                    <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">
                      Description
                    </th>
                    <th className="py-2 px-3 text-left font-semibold hidden xl:table-cell">
                      IP address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                        <FileText size={24} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">
                          {total === 0
                            ? 'No log entries for this course yet. Logs are recorded as users interact with the course.'
                            : 'No log entries match the current filters.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, index) => (
                      <tr
                        key={log.id}
                        className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors ${
                          index % 2 === 0 ? '' : 'bg-[var(--bg-light)]/30'
                        }`}
                      >
                        <td className="py-2 px-3 whitespace-nowrap text-xs text-[var(--text-muted)]">
                          {formatTime(log.time)}
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-[var(--text-link)] hover:underline cursor-pointer font-medium">
                            {log.user}
                          </span>
                        </td>
                        <td className="py-2 px-3 hidden md:table-cell text-xs">
                          {log.target}
                        </td>
                        <td className="py-2 px-3 hidden lg:table-cell">
                          <span className="inline-flex items-center text-xs bg-[var(--bg-light)] px-2 py-0.5 rounded">
                            {log.component}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-xs">
                            {formatEventName(log.action)}
                          </span>
                        </td>
                        <td className="py-2 px-3 hidden lg:table-cell text-xs text-[var(--text-muted)] max-w-[250px] truncate">
                          {log.description}
                        </td>
                        <td className="py-2 px-3 hidden xl:table-cell text-xs text-[var(--text-muted)] font-mono">
                          {log.ip || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-[var(--text-muted)]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="btn btn-secondary text-sm py-1 px-2"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={`text-sm py-1 px-3 rounded ${
                        currentPage === pageNum
                          ? 'bg-[var(--moodle-primary)] text-white'
                          : 'btn btn-secondary'
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  className="btn btn-secondary text-sm py-1 px-2"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
