'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
} from 'lucide-react';

interface Submission {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  email: string;
  status: 'submitted' | 'draft' | 'new' | 'reopened';
  submittedAt?: string;
  grade?: number;
  gradingStatus: 'graded' | 'notgraded' | 'released';
  feedback?: string;
  files: number;
  onlineText: boolean;
  isLate: boolean;
  extensionGranted: boolean;
}

const demoAssignment = {
  id: 'm5',
  name: 'Your First Program',
  maxGrade: 100,
  duedate: '2026-03-15T23:59:00',
  submissionTypes: ['onlinetext', 'file'],
  totalParticipants: 10,
};

const demoSubmissions: Submission[] = [
  { id: 's1', userId: '3', firstname: 'James', lastname: 'Williams', email: 'james.w@example.com', status: 'submitted', submittedAt: '2026-03-10T14:30:00', grade: 85, gradingStatus: 'graded', feedback: 'Good work!', files: 1, onlineText: true, isLate: false, extensionGranted: false },
  { id: 's2', userId: '4', firstname: 'Emily', lastname: 'Brown', email: 'emily.b@example.com', status: 'submitted', submittedAt: '2026-03-12T09:15:00', grade: 92, gradingStatus: 'graded', feedback: 'Excellent!', files: 2, onlineText: true, isLate: false, extensionGranted: false },
  { id: 's3', userId: '5', firstname: 'Michael', lastname: 'Davis', email: 'michael.d@example.com', status: 'submitted', submittedAt: '2026-03-14T22:45:00', grade: undefined, gradingStatus: 'notgraded', files: 1, onlineText: false, isLate: false, extensionGranted: false },
  { id: 's4', userId: '6', firstname: 'Jessica', lastname: 'Wilson', email: 'jessica.w@example.com', status: 'submitted', submittedAt: '2026-03-16T08:30:00', grade: undefined, gradingStatus: 'notgraded', files: 0, onlineText: true, isLate: true, extensionGranted: false },
  { id: 's5', userId: '7', firstname: 'David', lastname: 'Taylor', email: 'david.t@example.com', status: 'draft', submittedAt: undefined, grade: undefined, gradingStatus: 'notgraded', files: 1, onlineText: false, isLate: false, extensionGranted: false },
  { id: 's6', userId: '8', firstname: 'Ashley', lastname: 'Anderson', email: 'ashley.a@example.com', status: 'new', submittedAt: undefined, grade: undefined, gradingStatus: 'notgraded', files: 0, onlineText: false, isLate: false, extensionGranted: false },
  { id: 's7', userId: '9', firstname: 'Robert', lastname: 'Thomas', email: 'robert.t@example.com', status: 'submitted', submittedAt: '2026-03-17T11:20:00', grade: undefined, gradingStatus: 'notgraded', files: 2, onlineText: true, isLate: true, extensionGranted: true },
  { id: 's8', userId: '10', firstname: 'Jennifer', lastname: 'Martinez', email: 'jennifer.m@example.com', status: 'submitted', submittedAt: '2026-03-13T16:00:00', grade: 78, gradingStatus: 'graded', feedback: 'Good start but needs more comments.', files: 1, onlineText: true, isLate: false, extensionGranted: false },
];

const statusLabels: Record<string, string> = {
  submitted: 'Submitted for grading',
  draft: 'Draft (not submitted)',
  new: 'No submission',
  reopened: 'Reopened',
};

const statusColors: Record<string, string> = {
  submitted: 'bg-green-50 text-green-700',
  draft: 'bg-amber-50 text-amber-700',
  new: 'bg-gray-50 text-gray-600',
  reopened: 'bg-blue-50 text-blue-700',
};

export default function GradingPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const assignId = params.assignId as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradingFilter, setGradingFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [perPage, setPerPage] = useState(20);
  const [quickGrades, setQuickGrades] = useState<Record<string, string>>({});

  const assignment = demoAssignment;

  const filtered = demoSubmissions.filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!`${s.firstname} ${s.lastname}`.toLowerCase().includes(q) &&
          !s.email.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (gradingFilter === 'graded' && s.gradingStatus !== 'graded') return false;
    if (gradingFilter === 'notgraded' && s.gradingStatus === 'graded') return false;
    return true;
  });

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUsers.size === filtered.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filtered.map((s) => s.userId)));
    }
  };

  const gradedCount = demoSubmissions.filter((s) => s.gradingStatus === 'graded').length;
  const submittedCount = demoSubmissions.filter((s) => s.status === 'submitted').length;
  const needsGrading = submittedCount - gradedCount;

  return (
    <>
      <PageHeader
        title="Grading summary"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: assignment.name, href: `/course/${courseId}/mod/assign/${assignId}` },
          { label: 'Grading' },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-[var(--border-color)] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">{assignment.totalParticipants}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Participants</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{submittedCount}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Submitted</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{needsGrading}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Needs grading</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[var(--moodle-primary)]">{gradedCount}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Graded</div>
            </div>
          </div>

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
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <select
                className="form-control text-sm py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All submissions</option>
                <option value="submitted">Submitted</option>
                <option value="draft">Draft</option>
                <option value="new">No submission</option>
              </select>

              <select
                className="form-control text-sm py-1"
                value={gradingFilter}
                onChange={(e) => setGradingFilter(e.target.value)}
              >
                <option value="all">All grading status</option>
                <option value="graded">Graded</option>
                <option value="notgraded">Not graded</option>
              </select>
            </div>

            <button className="btn btn-secondary text-sm flex items-center gap-1">
              <Download size={14} /> Download submissions
            </button>
          </div>

          {/* Submissions table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left w-8">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedUsers.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">Full name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Email</th>
                  <th className="py-2 px-3 text-left font-semibold">Status</th>
                  <th className="py-2 px-3 text-center font-semibold hidden sm:table-cell">Files</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Submitted</th>
                  <th className="py-2 px-3 text-center font-semibold w-24">Grade</th>
                  <th className="py-2 px-3 text-center font-semibold w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <td className="py-2 px-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedUsers.has(submission.userId)}
                        onChange={() => toggleUser(submission.userId)}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {submission.firstname[0]}{submission.lastname[0]}
                        </div>
                        <Link
                          href={`/user/${submission.userId}`}
                          className="text-[var(--text-link)] font-medium hover:underline text-sm"
                        >
                          {submission.firstname} {submission.lastname}
                        </Link>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell text-xs">
                      {submission.email}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded ${statusColors[submission.status]}`}>
                          {submission.status === 'submitted' && <CheckCircle2 size={10} className="mr-1" />}
                          {statusLabels[submission.status]}
                        </span>
                        {submission.isLate && !submission.extensionGranted && (
                          <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded">Late</span>
                        )}
                        {submission.extensionGranted && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">Extension</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                        {submission.files > 0 && (
                          <span className="flex items-center gap-0.5">
                            <FileText size={12} /> {submission.files}
                          </span>
                        )}
                        {submission.onlineText && (
                          <span className="flex items-center gap-0.5">
                            <FileText size={12} /> Text
                          </span>
                        )}
                        {!submission.files && !submission.onlineText && '-'}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">
                      {submission.submittedAt
                        ? new Date(submission.submittedAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {submission.gradingStatus === 'graded' ? (
                        <span className="font-medium text-[var(--moodle-primary)]">
                          {submission.grade} / {assignment.maxGrade}
                        </span>
                      ) : submission.status === 'submitted' ? (
                        <input
                          type="number"
                          className="form-control text-sm py-0.5 w-16 text-center mx-auto"
                          placeholder="-"
                          min={0}
                          max={assignment.maxGrade}
                          value={quickGrades[submission.userId] || ''}
                          onChange={(e) =>
                            setQuickGrades((prev) => ({ ...prev, [submission.userId]: e.target.value }))
                          }
                        />
                      ) : (
                        <span className="text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {submission.status === 'submitted' && (
                        <Link
                          href={`/course/${courseId}/mod/assign/${assignId}/grading/${submission.userId}`}
                          className="btn-icon inline-flex items-center justify-center"
                          title="Grade"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bulk actions */}
          {selectedUsers.size > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">
                With {selectedUsers.size} selected:
              </span>
              <select className="form-control text-sm py-1 w-auto">
                <option value="">Choose...</option>
                <option value="lock">Lock submissions</option>
                <option value="unlock">Unlock submissions</option>
                <option value="extension">Grant extension</option>
                <option value="download">Download selected</option>
                <option value="revert">Revert to draft</option>
              </select>
              <button className="btn btn-secondary text-sm">Go</button>
            </div>
          )}

          {/* Quick grading save */}
          {Object.keys(quickGrades).length > 0 && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={16} className="text-amber-600" />
              <span className="text-sm text-amber-800">You have unsaved grade changes.</span>
              <button className="btn btn-primary text-sm ml-auto">Save all quick grading changes</button>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
            <span>{filtered.length} submissions shown</span>
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select
                className="form-control text-sm py-0.5 w-16"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>per page</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
