'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Search, Filter, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskLog {
  id: number;
  taskName: string;
  startTime: string;
  duration: string;
  result: 'success' | 'fail';
  hostname: string;
  pid: number;
  dbQueries: number;
}

const demoLogs: TaskLog[] = [
  { id: 1, taskName: 'Send email notifications', startTime: '2026-03-09 14:00:01', duration: '2.34s', result: 'success', hostname: 'web-01', pid: 12345, dbQueries: 48 },
  { id: 2, taskName: 'Clean up temp files', startTime: '2026-03-09 02:00:00', duration: '15.82s', result: 'success', hostname: 'web-01', pid: 11234, dbQueries: 156 },
  { id: 3, taskName: 'Calculate course completions', startTime: '2026-03-09 14:00:02', duration: '8.91s', result: 'success', hostname: 'web-02', pid: 22345, dbQueries: 312 },
  { id: 4, taskName: 'Grade history cleanup', startTime: '2026-03-09 03:00:00', duration: '1.23s', result: 'success', hostname: 'web-01', pid: 11235, dbQueries: 24 },
  { id: 5, taskName: 'Send forum digests', startTime: '2026-03-09 13:00:00', duration: '45.67s', result: 'success', hostname: 'web-01', pid: 12340, dbQueries: 892 },
  { id: 6, taskName: 'Crawl course links', startTime: '2026-03-09 01:00:00', duration: '120.45s', result: 'fail', hostname: 'web-02', pid: 22340, dbQueries: 2045 },
  { id: 7, taskName: 'Sync external calendars', startTime: '2026-03-09 14:00:03', duration: '3.56s', result: 'success', hostname: 'web-01', pid: 12346, dbQueries: 67 },
  { id: 8, taskName: 'Session cleanup', startTime: '2026-03-09 14:00:01', duration: '0.89s', result: 'success', hostname: 'web-02', pid: 22346, dbQueries: 15 },
  { id: 9, taskName: 'Backup courses', startTime: '2026-03-09 04:00:00', duration: '342.12s', result: 'success', hostname: 'web-01', pid: 11236, dbQueries: 5678 },
  { id: 10, taskName: 'Process assignment submissions', startTime: '2026-03-09 13:40:00', duration: '5.23s', result: 'success', hostname: 'web-02', pid: 22341, dbQueries: 145 },
  { id: 11, taskName: 'Update RSS feeds', startTime: '2026-03-09 13:30:00', duration: '18.90s', result: 'fail', hostname: 'web-01', pid: 12341, dbQueries: 234 },
  { id: 12, taskName: 'Send badge notifications', startTime: '2026-03-09 14:00:02', duration: '1.12s', result: 'success', hostname: 'web-01', pid: 12347, dbQueries: 28 },
];

export default function TaskLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('all');

  const filtered = demoLogs.filter(log => {
    if (searchQuery && !log.taskName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (resultFilter !== 'all' && log.result !== resultFilter) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Task logs"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Task configuration' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{demoLogs.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Total runs</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{demoLogs.filter(l => l.result === 'success').length}</div>
              <div className="text-xs text-[var(--text-muted)]">Successful</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-600">{demoLogs.filter(l => l.result === 'fail').length}</div>
              <div className="text-xs text-[var(--text-muted)]">Failed</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[var(--moodle-primary)]">{demoLogs.reduce((sum, l) => sum + l.dbQueries, 0).toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">Total DB queries</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search task logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <select
                className="form-control text-sm py-1"
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
              >
                <option value="all">All results</option>
                <option value="success">Success</option>
                <option value="fail">Failed</option>
              </select>
            </div>
            <span className="text-sm text-[var(--text-muted)]">{filtered.length} entries</span>
          </div>

          {/* Table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Task name</th>
                  <th className="py-2 px-3 text-left font-semibold">Start time</th>
                  <th className="py-2 px-3 text-left font-semibold">Duration</th>
                  <th className="py-2 px-3 text-center font-semibold">Result</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Hostname</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">PID</th>
                  <th className="py-2 px-3 text-right font-semibold hidden lg:table-cell">DB queries</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3 font-medium text-[var(--text-link)]">{log.taskName}</td>
                    <td className="py-2 px-3 text-xs">{log.startTime}</td>
                    <td className="py-2 px-3 text-xs font-mono">{log.duration}</td>
                    <td className="py-2 px-3 text-center">
                      {log.result === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={14} /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600">
                          <XCircle size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{log.hostname}</td>
                    <td className="py-2 px-3 text-xs font-mono hidden md:table-cell">{log.pid}</td>
                    <td className="py-2 px-3 text-xs text-right font-mono hidden lg:table-cell">{log.dbQueries.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-[var(--text-muted)]">Showing 1 to {filtered.length} of {filtered.length} entries</span>
            <div className="flex items-center gap-1">
              <button className="btn-icon" disabled><ChevronLeft size={16} /></button>
              <span className="px-3 py-1 text-sm bg-[var(--moodle-primary)] text-white rounded">1</span>
              <button className="btn-icon" disabled><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
