'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Filter, Mail, Users } from 'lucide-react';

interface ParticipationEntry {
  id: number;
  user: string;
  email: string;
  actionCount: number;
  lastAction: string;
}

const demoParticipation: ParticipationEntry[] = [
  { id: 1, user: 'Jane Doe', email: 'jdoe@example.com', actionCount: 47, lastAction: '9 Mar 2026, 14:22' },
  { id: 2, user: 'John Smith', email: 'jsmith@example.com', actionCount: 35, lastAction: '9 Mar 2026, 14:10' },
  { id: 3, user: 'Emily Brown', email: 'ebrown@example.com', actionCount: 31, lastAction: '9 Mar 2026, 13:58' },
  { id: 4, user: 'Mike Johnson', email: 'mjohnson@example.com', actionCount: 28, lastAction: '9 Mar 2026, 13:30' },
  { id: 5, user: 'Sarah Wilson', email: 'swilson@example.com', actionCount: 24, lastAction: '9 Mar 2026, 12:45' },
  { id: 6, user: 'Tom Lee', email: 'tlee@example.com', actionCount: 19, lastAction: '8 Mar 2026, 16:30' },
  { id: 7, user: 'Karen Patel', email: 'kpatel@example.com', actionCount: 16, lastAction: '8 Mar 2026, 15:20' },
  { id: 8, user: 'David Chen', email: 'dchen@example.com', actionCount: 12, lastAction: '8 Mar 2026, 14:05' },
  { id: 9, user: 'Lisa Garcia', email: 'lgarcia@example.com', actionCount: 8, lastAction: '7 Mar 2026, 17:00' },
  { id: 10, user: 'Robert Taylor', email: 'rtaylor@example.com', actionCount: 3, lastAction: '6 Mar 2026, 10:15' },
  { id: 11, user: 'Anna White', email: 'awhite@example.com', actionCount: 1, lastAction: '4 Mar 2026, 09:30' },
  { id: 12, user: 'James Moore', email: 'jmoore@example.com', actionCount: 0, lastAction: 'Never' },
];

export default function ParticipationReportPage() {
  const [courseFilter, setCourseFilter] = useState('intro-computing');
  const [activityFilter, setActivityFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('student');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUsers.size === demoParticipation.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(demoParticipation.map((p) => p.id)));
    }
  };

  const selectNoAction = () => {
    setSelectedUsers(new Set(demoParticipation.filter((p) => p.actionCount === 0).map((p) => p.id)));
  };

  return (
    <>
      <PageHeader
        title="Participation report"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Participation report' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Filter bar */}
          <div
            className="border border-[var(--border-color)] rounded-lg p-4 mb-4"
            style={{ backgroundColor: 'var(--bg-light)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-[var(--text-muted)]" />
              <span className="text-sm font-semibold">Filters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Course</label>
                <select
                  className="form-control text-sm"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="intro-computing">Introduction to Computing</option>
                  <option value="advanced-maths">Advanced Mathematics</option>
                  <option value="english-lit">English Literature</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Activity module</label>
                <select
                  className="form-control text-sm"
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                >
                  <option value="all">All activities</option>
                  <option value="forum">Forum</option>
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="resource">Resource</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Role</label>
                <select
                  className="form-control text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="editingteacher">Editing teacher</option>
                  <option value="all">All roles</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Look back period</label>
                <select
                  className="form-control text-sm"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                >
                  <option value="all">All time</option>
                  <option value="today">Today</option>
                  <option value="week">Past week</option>
                  <option value="month">Past month</option>
                  <option value="3months">Past 3 months</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary text-sm">Go</button>
            </div>
          </div>

          {/* Results info */}
          <div className="flex items-center gap-2 mb-3 text-sm text-[var(--text-muted)]">
            <Users size={14} />
            {demoParticipation.length} participants found &middot; {selectedUsers.size} selected
          </div>

          {/* Participation table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left w-8">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedUsers.size === demoParticipation.length && demoParticipation.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">User</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Email</th>
                  <th className="py-2 px-3 text-right font-semibold">Action count</th>
                  <th className="py-2 px-3 text-left font-semibold">Date of last action</th>
                </tr>
              </thead>
              <tbody>
                {demoParticipation.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      entry.actionCount === 0 ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="py-2 px-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedUsers.has(entry.id)}
                        onChange={() => toggleUser(entry.id)}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[var(--text-link)] cursor-pointer hover:underline">{entry.user}</span>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell">{entry.email}</td>
                    <td className="py-2 px-3 text-right">
                      {entry.actionCount > 0 ? (
                        <span className="font-medium">{entry.actionCount}</span>
                      ) : (
                        <span className="text-red-600 font-medium">0</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)]">
                      {entry.lastAction === 'Never' ? (
                        <span className="text-red-600">Never</span>
                      ) : (
                        entry.lastAction
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={selectNoAction}
              className="btn text-sm"
            >
              Select users with no action
            </button>
            <button
              className="btn btn-primary text-sm flex items-center gap-2"
              disabled={selectedUsers.size === 0}
            >
              <Mail size={14} /> Send message to selected ({selectedUsers.size})
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
