'use client';

import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { CheckCircle2, XCircle, Clock, HardDrive, Download } from 'lucide-react';

type BackupStatus = 'ok' | 'error' | 'skipped' | 'running';

interface BackupEntry {
  id: number;
  course: string;
  timeStarted: string;
  timeCompleted: string;
  status: BackupStatus;
  fileSize: string;
}

const demoBackups: BackupEntry[] = [
  {
    id: 1,
    course: 'Introduction to Computing',
    timeStarted: '9 Mar 2026, 02:00',
    timeCompleted: '9 Mar 2026, 02:04',
    status: 'ok',
    fileSize: '45.2 MB',
  },
  {
    id: 2,
    course: 'Advanced Mathematics',
    timeStarted: '9 Mar 2026, 02:05',
    timeCompleted: '9 Mar 2026, 02:08',
    status: 'ok',
    fileSize: '32.7 MB',
  },
  {
    id: 3,
    course: 'English Literature',
    timeStarted: '9 Mar 2026, 02:09',
    timeCompleted: '9 Mar 2026, 02:11',
    status: 'ok',
    fileSize: '28.1 MB',
  },
  {
    id: 4,
    course: 'Biology 101',
    timeStarted: '9 Mar 2026, 02:12',
    timeCompleted: '9 Mar 2026, 02:12',
    status: 'error',
    fileSize: '-',
  },
  {
    id: 5,
    course: 'Physics Fundamentals',
    timeStarted: '9 Mar 2026, 02:13',
    timeCompleted: '9 Mar 2026, 02:16',
    status: 'ok',
    fileSize: '38.9 MB',
  },
  {
    id: 6,
    course: 'History of Art',
    timeStarted: '9 Mar 2026, 02:17',
    timeCompleted: '9 Mar 2026, 02:22',
    status: 'ok',
    fileSize: '67.4 MB',
  },
  {
    id: 7,
    course: 'Chemistry Lab',
    timeStarted: '9 Mar 2026, 02:23',
    timeCompleted: '9 Mar 2026, 02:23',
    status: 'skipped',
    fileSize: '-',
  },
  {
    id: 8,
    course: 'Business Management',
    timeStarted: '9 Mar 2026, 02:24',
    timeCompleted: '9 Mar 2026, 02:27',
    status: 'ok',
    fileSize: '22.5 MB',
  },
  {
    id: 9,
    course: 'Web Development',
    timeStarted: '9 Mar 2026, 02:28',
    timeCompleted: '9 Mar 2026, 02:33',
    status: 'ok',
    fileSize: '54.8 MB',
  },
  {
    id: 10,
    course: 'Data Science Intro',
    timeStarted: '9 Mar 2026, 02:34',
    timeCompleted: '9 Mar 2026, 02:38',
    status: 'ok',
    fileSize: '41.3 MB',
  },
  {
    id: 11,
    course: 'Creative Writing',
    timeStarted: '9 Mar 2026, 02:39',
    timeCompleted: '9 Mar 2026, 02:41',
    status: 'ok',
    fileSize: '15.6 MB',
  },
  {
    id: 12,
    course: 'Economics 101',
    timeStarted: '9 Mar 2026, 02:42',
    timeCompleted: '9 Mar 2026, 02:45',
    status: 'ok',
    fileSize: '29.8 MB',
  },
];

const statusIcons: Record<BackupStatus, React.ReactNode> = {
  ok: <CheckCircle2 size={16} className="text-green-600" />,
  error: <XCircle size={16} className="text-red-600" />,
  skipped: <Clock size={16} className="text-amber-500" />,
  running: <Clock size={16} className="text-blue-500 animate-spin" />,
};

const statusLabels: Record<BackupStatus, string> = {
  ok: 'Completed',
  error: 'Error',
  skipped: 'Skipped',
  running: 'Running',
};

const statusBadgeColors: Record<BackupStatus, string> = {
  ok: 'bg-green-50 text-green-700',
  error: 'bg-red-50 text-red-700',
  skipped: 'bg-amber-50 text-amber-700',
  running: 'bg-blue-50 text-blue-700',
};

export default function BackupLogsPage() {
  const completedCount = demoBackups.filter((b) => b.status === 'ok').length;
  const errorCount = demoBackups.filter((b) => b.status === 'error').length;
  const skippedCount = demoBackups.filter((b) => b.status === 'skipped').length;
  const totalSize = demoBackups
    .filter((b) => b.fileSize !== '-')
    .reduce((sum, b) => sum + parseFloat(b.fileSize), 0);

  return (
    <>
      <PageHeader
        title="Backup logs"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Backups' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{demoBackups.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Total courses</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{completedCount}</div>
              <div className="text-xs text-[var(--text-muted)]">Completed</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-600">{errorCount}</div>
              <div className="text-xs text-[var(--text-muted)]">Errors</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <HardDrive size={16} className="text-[var(--text-muted)]" />
                <span className="text-xl font-bold">{totalSize.toFixed(1)} MB</span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">Total size</div>
            </div>
          </div>

          {/* Info */}
          <div
            className="border border-[var(--border-color)] rounded-lg p-3 mb-4 text-sm"
            style={{ backgroundColor: 'var(--bg-light)' }}
          >
            Last automated backup run: <strong>9 Mar 2026, 02:00</strong> &middot; Next scheduled: <strong>10 Mar 2026, 02:00</strong>
          </div>

          {/* Backup table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Course</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Time started</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Time completed</th>
                  <th className="py-2 px-3 text-left font-semibold">Status</th>
                  <th className="py-2 px-3 text-right font-semibold whitespace-nowrap">File size</th>
                  <th className="py-2 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {demoBackups.map((backup) => (
                  <tr
                    key={backup.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      backup.status === 'error' ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="py-2 px-3">
                      <span className="text-[var(--text-link)] cursor-pointer hover:underline">
                        {backup.course}
                      </span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap text-[var(--text-muted)]">{backup.timeStarted}</td>
                    <td className="py-2 px-3 whitespace-nowrap text-[var(--text-muted)]">{backup.timeCompleted}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded ${statusBadgeColors[backup.status]}`}>
                        {statusIcons[backup.status]}
                        {statusLabels[backup.status]}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      {backup.fileSize === '-' ? (
                        <span className="text-[var(--text-muted)]">-</span>
                      ) : (
                        backup.fileSize
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {backup.status === 'ok' && (
                        <button className="btn-icon" title="Download backup">
                          <Download size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Skipped note */}
          {skippedCount > 0 && (
            <div className="text-xs text-[var(--text-muted)] mt-2">
              {skippedCount} course{skippedCount !== 1 ? 's were' : ' was'} skipped because backup was not modified since last run.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
