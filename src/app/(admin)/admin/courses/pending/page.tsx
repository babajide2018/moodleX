'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Check, X, Eye, Search, Info } from 'lucide-react';

interface CourseRequest {
  id: string;
  requester: string;
  requesterEmail: string;
  courseName: string;
  shortName: string;
  category: string;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const demoRequests: CourseRequest[] = [
  {
    id: '1',
    requester: 'John Smith',
    requesterEmail: 'j.smith@example.com',
    courseName: 'Advanced Data Analysis',
    shortName: 'DATA301',
    category: 'Science',
    reason: 'Need a dedicated course for the new data analysis module in the MSc program. Will cover Python, R, and statistical methods.',
    requestDate: '8 Mar 2026',
    status: 'pending',
  },
  {
    id: '2',
    requester: 'Maria Garcia',
    requesterEmail: 'm.garcia@example.com',
    courseName: 'Creative Writing Workshop',
    shortName: 'CW201',
    category: 'Arts & Humanities',
    reason: 'Expanding the creative arts offerings for second-year students. Focus on fiction and poetry.',
    requestDate: '5 Mar 2026',
    status: 'pending',
  },
  {
    id: '3',
    requester: 'David Chen',
    requesterEmail: 'd.chen@example.com',
    courseName: 'Machine Learning Fundamentals',
    shortName: 'ML101',
    category: 'Science',
    reason: 'Introductory ML course for computer science students. Prerequisite for the AI specialization track.',
    requestDate: '1 Mar 2026',
    status: 'pending',
  },
  {
    id: '4',
    requester: 'Sarah Wilson',
    requesterEmail: 's.wilson@example.com',
    courseName: 'Environmental Science',
    shortName: 'ENV101',
    category: 'Science',
    reason: 'Interdisciplinary course for the new sustainability program.',
    requestDate: '25 Feb 2026',
    status: 'pending',
  },
];

export default function PendingCoursesPage() {
  const [requests, setRequests] = useState(demoRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const filtered = requests.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.courseName.toLowerCase().includes(q) ||
      r.requester.toLowerCase().includes(q) ||
      r.shortName.toLowerCase().includes(q)
    );
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r)));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r)));
  };

  return (
    <>
      <PageHeader
        title="Pending course requests"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Manage courses and categories' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Stats */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <Info size={14} />
              <span>{pendingCount} pending request{pendingCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-[var(--border-color)] rounded-lg p-8 text-center">
              <div className="text-[var(--text-muted)] text-sm">
                {requests.length === 0
                  ? 'There are no pending course requests.'
                  : 'No requests match your search.'}
              </div>
            </div>
          ) : (
            <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                    <th className="py-2 px-3 text-left font-semibold">Course name</th>
                    <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Short name</th>
                    <th className="py-2 px-3 text-left font-semibold">Requester</th>
                    <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Category</th>
                    <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Date</th>
                    <th className="py-2 px-3 text-left font-semibold">Status</th>
                    <th className="py-2 px-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => (
                    <>
                      <tr key={req.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-medium">{req.courseName}</td>
                        <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell">{req.shortName}</td>
                        <td className="py-2 px-3">
                          <div>{req.requester}</div>
                          <div className="text-xs text-[var(--text-muted)]">{req.requesterEmail}</div>
                        </td>
                        <td className="py-2 px-3 text-[var(--text-muted)] hidden lg:table-cell">{req.category}</td>
                        <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell">{req.requestDate}</td>
                        <td className="py-2 px-3">
                          {req.status === 'pending' && (
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">Pending</span>
                          )}
                          {req.status === 'approved' && (
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">Approved</span>
                          )}
                          {req.status === 'rejected' && (
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">Rejected</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              className="btn-icon"
                              title="View reason"
                              onClick={() => setExpandedRequest(expandedRequest === req.id ? null : req.id)}
                            >
                              <Eye size={14} />
                            </button>
                            {req.status === 'pending' && (
                              <>
                                <button
                                  className="btn-icon text-green-600 hover:bg-green-50"
                                  title="Approve"
                                  onClick={() => handleApprove(req.id)}
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  className="btn-icon text-red-600 hover:bg-red-50"
                                  title="Reject"
                                  onClick={() => handleReject(req.id)}
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedRequest === req.id && (
                        <tr key={`${req.id}-reason`} className="border-b border-[var(--border-color)]">
                          <td colSpan={7} className="py-3 px-3 bg-[var(--bg-light)]">
                            <div className="text-sm">
                              <span className="font-medium">Reason for request:</span>
                              <p className="mt-1 text-[var(--text-muted)]">{req.reason}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
