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

interface Participant {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  lastaccess: string | null;
}

interface LogEntry {
  id: string;
  time: string;
  user: string;
  userId: string;
  action: string;
  target: string;
  component: string;
  description: string;
  ip: string;
}

// Generate mock log entries from real participant data
function generateLogEntries(participants: Participant[], courseShortname: string): LogEntry[] {
  const actions = [
    { action: 'viewed', component: 'Course', target: 'Course', desc: `The user viewed the course '${courseShortname}'.` },
    { action: 'viewed', component: 'Assign', target: 'Assignment', desc: 'The user viewed the assignment activity.' },
    { action: 'viewed', component: 'Quiz', target: 'Quiz', desc: 'The user viewed the quiz activity.' },
    { action: 'viewed', component: 'Forum', target: 'Forum', desc: 'The user viewed the forum activity.' },
    { action: 'viewed', component: 'Resource', target: 'File', desc: 'The user viewed the resource.' },
    { action: 'submitted', component: 'Assign', target: 'Assignment submission', desc: 'The user submitted an assignment.' },
    { action: 'attempted', component: 'Quiz', target: 'Quiz attempt', desc: 'The user started a quiz attempt.' },
    { action: 'graded', component: 'Assign', target: 'Submission grading', desc: 'The user graded a submission.' },
    { action: 'created', component: 'Forum', target: 'Discussion', desc: 'The user created a new discussion.' },
    { action: 'posted', component: 'Forum', target: 'Post', desc: 'The user posted a reply in a discussion.' },
    { action: 'enrolled', component: 'Enrollment', target: 'User enrollment', desc: 'The user was enrolled in the course.' },
    { action: 'updated', component: 'Course', target: 'Course settings', desc: 'The user updated the course settings.' },
    { action: 'viewed', component: 'Grade', target: 'Gradebook', desc: 'The user viewed the gradebook.' },
    { action: 'viewed', component: 'Page', target: 'Page', desc: 'The user viewed the page activity.' },
    { action: 'completed', component: 'Course', target: 'Activity completion', desc: 'The user completed an activity.' },
  ];

  const entries: LogEntry[] = [];
  const now = new Date();

  // Generate entries for each participant
  for (let i = 0; i < 50; i++) {
    const participant = participants[Math.floor(Math.random() * participants.length)];
    if (!participant) continue;

    const actionEntry = actions[Math.floor(Math.random() * actions.length)];
    const hoursAgo = Math.floor(Math.random() * 168); // last 7 days
    const time = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

    entries.push({
      id: `log-${i}`,
      time: time.toISOString(),
      user: `${participant.firstname} ${participant.lastname}`,
      userId: participant.id,
      action: actionEntry.action,
      target: actionEntry.target,
      component: actionEntry.component,
      description: actionEntry.desc,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    });
  }

  // Sort by time descending
  entries.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return entries;
}

export default function LogsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [participantFilter, setParticipantFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
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

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [courseRes, participantsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/participants`),
      ]);

      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourseInfo({
          id: courseData.course.id,
          fullname: courseData.course.fullname,
          shortname: courseData.course.shortname,
        });

        // Generate log entries from real participants
        if (participantsRes.ok) {
          const partData = await participantsRes.json();
          const generatedLogs = generateLogEntries(
            partData.participants || [],
            courseData.course.shortname
          );
          setLogs(generatedLogs);
        } else {
          // Generate logs with a fallback user
          setLogs(generateLogEntries(
            [{ id: 'admin', firstname: 'Admin', lastname: 'User', email: 'admin@example.com', role: 'admin', lastaccess: null }],
            courseData.course.shortname
          ));
        }
      } else {
        throw new Error('Failed to fetch course data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get unique users and actions for filters
  const uniqueUsers = Array.from(new Set(logs.map((l) => l.user))).sort();
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action))).sort();

  // Apply filters
  const filteredLogs = logs.filter((log) => {
    if (participantFilter !== 'all' && log.user !== participantFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (dateFilter) {
      const logDate = new Date(log.time).toISOString().split('T')[0];
      if (logDate !== dateFilter) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !log.user.toLowerCase().includes(q) &&
        !log.description.toLowerCase().includes(q) &&
        !log.component.toLowerCase().includes(q) &&
        !log.target.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / perPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

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

  // Loading state
  if (loading) {
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
  if (error) {
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
                  value={participantFilter}
                  onChange={(e) => {
                    setParticipantFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All participants</option>
                  {uniqueUsers.map((user) => (
                    <option key={user} value={user}>
                      {user}
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
                  <option value="all">All actions</option>
                  {uniqueActions.map((action) => (
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
              Showing {filteredLogs.length} log entr{filteredLogs.length !== 1 ? 'ies' : 'y'}
              {filteredLogs.length !== logs.length && ` (filtered from ${logs.length} total)`}
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
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                        <FileText size={24} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No log entries match the current filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log, index) => (
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
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-3 hidden lg:table-cell text-xs text-[var(--text-muted)] max-w-[250px] truncate">
                          {log.description}
                        </td>
                        <td className="py-2 px-3 hidden xl:table-cell text-xs text-[var(--text-muted)] font-mono">
                          {log.ip}
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
