'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Search,
  UserPlus,
  Filter,
  Mail,
  MoreVertical,
  Shield,
  GraduationCap,
  Settings,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
} from 'lucide-react';

interface Participant {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
  enrolMethod: string;
  lastaccess: string | null;
  enrolledAt: string;
}

interface SearchUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface CourseInfo {
  id: string;
  fullname: string;
  shortname: string;
}

const roleIcons: Record<string, React.ReactNode> = {
  editingteacher: <Shield size={14} className="text-[var(--moodle-danger)]" />,
  teacher: <Shield size={14} className="text-orange-500" />,
  student: <GraduationCap size={14} className="text-[var(--moodle-primary)]" />,
};

const roleLabels: Record<string, string> = {
  admin: 'Manager',
  coursecreator: 'Course creator',
  editingteacher: 'Teacher',
  teacher: 'Non-editing teacher',
  student: 'Student',
  guest: 'Guest',
};

function formatLastAccess(dateStr: string | null): string {
  if (!dateStr) return 'Never';

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

export default function ParticipantsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  // Data states
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Enrol modal states
  const [showEnrolModal, setShowEnrolModal] = useState(false);
  const [enrolSearchQuery, setEnrolSearchQuery] = useState('');
  const [enrolSearchResults, setEnrolSearchResults] = useState<SearchUser[]>([]);
  const [enrolSearching, setEnrolSearching] = useState(false);
  const [enrolRole, setEnrolRole] = useState('student');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolSuccess, setEnrolSuccess] = useState<string | null>(null);
  const [enrolError, setEnrolError] = useState<string | null>(null);

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/courses/${courseId}/participants`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch participants');
      }
      const data = await res.json();
      setParticipants(data.participants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch participants');
    }
  }, [courseId]);

  // Fetch course info for breadcrumbs
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
      // Non-critical: breadcrumbs will use courseId as fallback
    }
  }, [courseId]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchParticipants(), fetchCourseInfo()]);
      setLoading(false);
    };
    loadData();
  }, [fetchParticipants, fetchCourseInfo]);

  // Search users for enrolment
  useEffect(() => {
    if (!enrolSearchQuery || enrolSearchQuery.length < 2) {
      setEnrolSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setEnrolSearching(true);
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(enrolSearchQuery)}&limit=10`
        );
        if (res.ok) {
          const data = await res.json();
          // Filter out users already enrolled
          const enrolledIds = new Set(participants.map((p) => p.id));
          const filtered = (data.users || []).filter(
            (u: SearchUser) => !enrolledIds.has(u.id)
          );
          setEnrolSearchResults(filtered);
        }
      } catch {
        // Search failed silently
      } finally {
        setEnrolSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [enrolSearchQuery, participants]);

  // Enrol a user
  const handleEnrolUser = async (userId: string) => {
    setEnrolling(true);
    setEnrolError(null);
    setEnrolSuccess(null);

    try {
      const res = await fetch(`/api/courses/${courseId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roleId: enrolRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to enrol user');
      }

      const data = await res.json();
      setParticipants((prev) => [...prev, data.participant]);
      setEnrolSearchResults((prev) => prev.filter((u) => u.id !== userId));
      setEnrolSuccess(
        `${data.participant.firstname} ${data.participant.lastname} has been enrolled.`
      );

      setTimeout(() => setEnrolSuccess(null), 3000);
    } catch (err) {
      setEnrolError(err instanceof Error ? err.message : 'Failed to enrol user');
    } finally {
      setEnrolling(false);
    }
  };

  // Filter participants
  const filtered = participants.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !`${p.firstname} ${p.lastname}`.toLowerCase().includes(q) &&
        !p.email.toLowerCase().includes(q) &&
        !p.username.toLowerCase().includes(q)
      )
        return false;
    }
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUsers.size === filtered.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filtered.map((p) => p.id)));
    }
  };

  const courseLabel = courseInfo?.shortname || courseId;
  const manualCount = participants.filter((p) => p.enrolMethod === 'manual').length;
  const selfCount = participants.filter((p) => p.enrolMethod === 'self').length;

  // Loading state
  if (loading) {
    return (
      <>
        <PageHeader
          title="Participants"
          breadcrumbs={[
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Participants' },
          ]}
        />
        <SecondaryNavigation tabs={courseTabs} />
        <div id="page-content" className="p-4">
          <div id="region-main">
            <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading participants...</span>
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
          title="Participants"
          breadcrumbs={[
            { label: 'My courses', href: '/my/courses' },
            { label: courseLabel, href: `/course/${courseId}` },
            { label: 'Participants' },
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
                  fetchParticipants().finally(() => setLoading(false));
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
        title="Participants"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My courses', href: '/my/courses' },
          { label: courseLabel, href: `/course/${courseId}` },
          { label: 'Participants' },
        ]}
        actions={
          <button
            className="btn btn-primary text-sm flex items-center gap-1"
            onClick={() => setShowEnrolModal(true)}
          >
            <UserPlus size={16} /> Enrol users
          </button>
        }
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Filters bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <select
                className="form-control text-sm py-1"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All roles</option>
                <option value="editingteacher">Teacher</option>
                <option value="teacher">Non-editing teacher</option>
                <option value="student">Student</option>
              </select>

              <select
                className="form-control text-sm py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Active and suspended</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <span className="text-sm text-[var(--text-muted)]">
              {filtered.length} participant{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Participants table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left w-8">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={
                        selectedUsers.size === filtered.length && filtered.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">
                    First name / Last name
                  </th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">
                    Email address
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">Roles</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">
                    Last access
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">Status</th>
                  <th className="py-2 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[var(--text-muted)]">
                      {participants.length === 0
                        ? 'No participants enrolled in this course yet.'
                        : 'No participants match the current filters.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <td className="py-2 px-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedUsers.has(participant.id)}
                          onChange={() => toggleUser(participant.id)}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {participant.firstname[0]}
                            {participant.lastname[0]}
                          </div>
                          <Link
                            href={`/user/${participant.id}`}
                            className="text-[var(--text-link)] font-medium hover:underline"
                          >
                            {participant.firstname} {participant.lastname}
                          </Link>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell">
                        {participant.email}
                      </td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center gap-1 text-xs bg-[var(--bg-light)] px-2 py-0.5 rounded">
                          {roleIcons[participant.role] || (
                            <Shield size={14} className="text-[var(--text-muted)]" />
                          )}
                          {roleLabels[participant.role] || participant.role}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
                        {formatLastAccess(participant.lastaccess)}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center text-xs px-2 py-0.5 rounded ${
                            participant.status === 'active'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {participant.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <button className="btn-icon">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bulk actions */}
          {selectedUsers.size > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">
                With {selectedUsers.size} selected user{selectedUsers.size !== 1 ? 's' : ''}:
              </span>
              <select className="form-control text-sm py-1 w-auto">
                <option value="">Choose...</option>
                <option value="message">Send a message</option>
                <option value="addnote">Add a note</option>
                <option value="remove">Remove from course</option>
              </select>
              <button className="btn btn-secondary text-sm">Go</button>
            </div>
          )}

          {/* Enrolment methods info */}
          <div className="mt-6 text-sm">
            <h3 className="font-semibold mb-2">Enrolment methods</h3>
            <div className="border border-[var(--border-color)] rounded-lg divide-y divide-[var(--border-color)]">
              <div className="flex items-center justify-between px-4 py-2">
                <div>
                  <span className="font-medium">Manual enrolments</span>
                  <span className="text-[var(--text-muted)] ml-2">
                    ({manualCount} enrolled user{manualCount !== 1 ? 's' : ''})
                  </span>
                </div>
                <button className="btn-icon">
                  <Settings size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <div>
                  <span className="font-medium">Self enrolment (Student)</span>
                  <span className="text-[var(--text-muted)] ml-2">
                    ({selfCount} enrolled user{selfCount !== 1 ? 's' : ''})
                  </span>
                </div>
                <button className="btn-icon">
                  <Settings size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between px-4 py-2">
                <div>
                  <span className="font-medium">Guest access</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2">Disabled</span>
                </div>
                <button className="btn-icon">
                  <Settings size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrol users modal */}
      {showEnrolModal && (
        <div className="fixed inset-0 bg-black/40 z-[1060] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-base">Enrol users</h3>
              <button
                className="btn-icon"
                onClick={() => {
                  setShowEnrolModal(false);
                  setEnrolSearchQuery('');
                  setEnrolSearchResults([]);
                  setEnrolError(null);
                  setEnrolSuccess(null);
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {enrolSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                  <CheckCircle size={16} />
                  {enrolSuccess}
                </div>
              )}

              {enrolError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <AlertCircle size={16} />
                  {enrolError}
                </div>
              )}

              <div>
                <label className="form-label text-sm">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="Search for users by name or email..."
                    autoFocus
                    value={enrolSearchQuery}
                    onChange={(e) => setEnrolSearchQuery(e.target.value)}
                  />
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-sm">Assign role</label>
                <select
                  className="form-control"
                  value={enrolRole}
                  onChange={(e) => setEnrolRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="editingteacher">Teacher</option>
                  <option value="teacher">Non-editing teacher</option>
                </select>
              </div>

              <div className="border border-[var(--border-color)] rounded min-h-[120px] overflow-y-auto max-h-[200px]">
                {enrolSearching ? (
                  <div className="flex items-center justify-center py-8 text-[var(--text-muted)]">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span className="text-sm">Searching...</span>
                  </div>
                ) : enrolSearchResults.length > 0 ? (
                  <div className="divide-y divide-[var(--border-color)]">
                    {enrolSearchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-[var(--bg-hover)]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {user.firstname[0]}
                            {user.lastname[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {user.firstname} {user.lastname}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-primary text-xs py-1 px-2"
                          disabled={enrolling}
                          onClick={() => handleEnrolUser(user.id)}
                        >
                          {enrolling ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            'Enrol'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : enrolSearchQuery.length >= 2 ? (
                  <div className="flex items-center justify-center py-8 text-sm text-[var(--text-muted)]">
                    No users found matching your search.
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-sm text-[var(--text-muted)]">
                    Search for users above to enrol them in this course.
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEnrolModal(false);
                  setEnrolSearchQuery('');
                  setEnrolSearchResults([]);
                  setEnrolError(null);
                  setEnrolSuccess(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
