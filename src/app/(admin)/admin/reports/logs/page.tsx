'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Search, Download, Filter } from 'lucide-react';

interface LogEntry {
  id: number;
  time: string;
  user: string;
  affectedUser: string;
  eventContext: string;
  component: string;
  eventName: string;
  description: string;
  origin: string;
  ipAddress: string;
}

const demoLogs: LogEntry[] = [
  {
    id: 1,
    time: '9 Mar 2026, 14:23',
    user: 'Admin User',
    affectedUser: '-',
    eventContext: 'System',
    component: 'System',
    eventName: 'User logged in',
    description: 'The user with id \'2\' logged in.',
    origin: 'web',
    ipAddress: '192.168.1.10',
  },
  {
    id: 2,
    time: '9 Mar 2026, 14:20',
    user: 'Admin User',
    affectedUser: 'John Smith',
    eventContext: 'User: John Smith',
    component: 'System',
    eventName: 'User profile viewed',
    description: 'The user with id \'2\' viewed the profile for the user with id \'5\'.',
    origin: 'web',
    ipAddress: '192.168.1.10',
  },
  {
    id: 3,
    time: '9 Mar 2026, 14:15',
    user: 'Jane Doe',
    affectedUser: '-',
    eventContext: 'Course: Introduction to Computing',
    component: 'Forum',
    eventName: 'Discussion created',
    description: 'The user with id \'3\' created a discussion in the forum with course module id \'12\'.',
    origin: 'web',
    ipAddress: '10.0.0.45',
  },
  {
    id: 4,
    time: '9 Mar 2026, 14:10',
    user: 'John Smith',
    affectedUser: '-',
    eventContext: 'Course: Introduction to Computing',
    component: 'Assignment',
    eventName: 'Submission created',
    description: 'The user with id \'5\' submitted an assignment with course module id \'8\'.',
    origin: 'web',
    ipAddress: '172.16.0.22',
  },
  {
    id: 5,
    time: '9 Mar 2026, 13:58',
    user: 'Emily Brown',
    affectedUser: '-',
    eventContext: 'Course: Advanced Mathematics',
    component: 'Quiz',
    eventName: 'Quiz attempt started',
    description: 'The user with id \'7\' started a quiz attempt for quiz with id \'4\'.',
    origin: 'web',
    ipAddress: '10.0.0.91',
  },
  {
    id: 6,
    time: '9 Mar 2026, 13:45',
    user: 'Admin User',
    affectedUser: '-',
    eventContext: 'System',
    component: 'System',
    eventName: 'Course created',
    description: 'The user with id \'2\' created a course with id \'15\'.',
    origin: 'web',
    ipAddress: '192.168.1.10',
  },
  {
    id: 7,
    time: '9 Mar 2026, 13:30',
    user: 'Mike Johnson',
    affectedUser: '-',
    eventContext: 'Course: English Literature',
    component: 'Resource',
    eventName: 'Course module viewed',
    description: 'The user with id \'9\' viewed the resource with course module id \'22\'.',
    origin: 'web',
    ipAddress: '172.16.0.55',
  },
  {
    id: 8,
    time: '9 Mar 2026, 13:22',
    user: 'Emily Brown',
    affectedUser: '-',
    eventContext: 'Course: Advanced Mathematics',
    component: 'Quiz',
    eventName: 'Quiz attempt submitted',
    description: 'The user with id \'7\' submitted a quiz attempt for quiz with id \'4\'.',
    origin: 'web',
    ipAddress: '10.0.0.91',
  },
  {
    id: 9,
    time: '9 Mar 2026, 13:10',
    user: 'Admin User',
    affectedUser: 'Sarah Wilson',
    eventContext: 'User: Sarah Wilson',
    component: 'System',
    eventName: 'User updated',
    description: 'The user with id \'2\' updated the user with id \'11\'.',
    origin: 'web',
    ipAddress: '192.168.1.10',
  },
  {
    id: 10,
    time: '9 Mar 2026, 12:55',
    user: 'Jane Doe',
    affectedUser: '-',
    eventContext: 'Course: Introduction to Computing',
    component: 'System',
    eventName: 'User enrolled in course',
    description: 'The user with id \'3\' was enrolled in course with id \'6\'.',
    origin: 'web',
    ipAddress: '10.0.0.45',
  },
];

export default function LogsPage() {
  const [userFilter, setUserFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [educationLevel, setEducationLevel] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = demoLogs.filter((log) => {
    if (userFilter && !log.user.toLowerCase().includes(userFilter.toLowerCase())) return false;
    if (courseFilter !== 'all' && !log.eventContext.toLowerCase().includes(courseFilter.toLowerCase())) return false;
    if (actionFilter !== 'all' && !log.eventName.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Logs"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Logs' },
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">User</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-control text-sm"
                    placeholder="All users"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    style={{ paddingLeft: '2rem' }}
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Course</label>
                <select
                  className="form-control text-sm"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All courses</option>
                  <option value="introduction to computing">Introduction to Computing</option>
                  <option value="advanced mathematics">Advanced Mathematics</option>
                  <option value="english literature">English Literature</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Date from</label>
                <input
                  type="date"
                  className="form-control text-sm"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Date to</label>
                <input
                  type="date"
                  className="form-control text-sm"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Actions</label>
                <select
                  className="form-control text-sm"
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                >
                  <option value="all">All actions</option>
                  <option value="logged in">Logged in</option>
                  <option value="viewed">Viewed</option>
                  <option value="created">Created</option>
                  <option value="updated">Updated</option>
                  <option value="submitted">Submitted</option>
                  <option value="enrolled">Enrolled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Education level</label>
                <select
                  className="form-control text-sm"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                >
                  <option value="all">All levels</option>
                  <option value="teaching">Teaching</option>
                  <option value="participating">Participating</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button className="btn btn-primary text-sm">Get these logs</button>
              <button className="btn text-sm flex items-center gap-1">
                <Download size={14} /> Download table data as
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-[var(--text-muted)] mb-3">
            Showing {filtered.length} log record{filtered.length !== 1 ? 's' : ''}
          </div>

          {/* Logs table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Time</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">User full name</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Affected user</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Event context</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Component</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Event name</th>
                  <th className="py-2 px-3 text-left font-semibold">Description</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Origin</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">IP address</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
                  >
                    <td className="py-2 px-3 whitespace-nowrap text-[var(--text-muted)]">{log.time}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="text-[var(--text-link)] cursor-pointer hover:underline">{log.user}</span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {log.affectedUser === '-' ? (
                        <span className="text-[var(--text-muted)]">-</span>
                      ) : (
                        <span className="text-[var(--text-link)] cursor-pointer hover:underline">{log.affectedUser}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">{log.eventContext}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{log.component}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{log.eventName}</td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)]">{log.description}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{log.origin}</td>
                    <td className="py-2 px-3 whitespace-nowrap text-[var(--text-muted)]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
