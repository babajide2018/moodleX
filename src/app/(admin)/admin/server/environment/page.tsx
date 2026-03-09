'use client';

import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface EnvironmentCheck {
  id: number;
  component: string;
  info: string;
  status: 'ok' | 'warn' | 'error';
  details: string;
  versionChecked: string;
}

const demoChecks: EnvironmentCheck[] = [
  { id: 1, component: 'Node.js', info: 'Version 20.11.0', status: 'ok', details: 'Node.js version meets the minimum requirement (>=18.0.0).', versionChecked: '4.5 (Build 20260301)' },
  { id: 2, component: 'npm', info: 'Version 10.2.4', status: 'ok', details: 'npm is available and up to date.', versionChecked: '4.5 (Build 20260301)' },
  { id: 3, component: 'Database (PostgreSQL)', info: 'Version 16.1', status: 'ok', details: 'PostgreSQL version meets the minimum requirement (>=13.0).', versionChecked: '4.5 (Build 20260301)' },
  { id: 4, component: 'Prisma ORM', info: 'Version 6.3.0', status: 'ok', details: 'Prisma Client is installed and database connection is active.', versionChecked: '4.5 (Build 20260301)' },
  { id: 5, component: 'Next.js', info: 'Version 16.0.0', status: 'ok', details: 'Next.js framework version is compatible.', versionChecked: '4.5 (Build 20260301)' },
  { id: 6, component: 'Memory limit', info: '512 MB available', status: 'ok', details: 'Available memory exceeds the recommended minimum of 256 MB.', versionChecked: '4.5 (Build 20260301)' },
  { id: 7, component: 'Disk space', info: '45.2 GB free', status: 'ok', details: 'Sufficient disk space available.', versionChecked: '4.5 (Build 20260301)' },
  { id: 8, component: 'HTTPS', info: 'Not detected', status: 'warn', details: 'HTTPS is recommended for production environments. Currently running on HTTP.', versionChecked: '4.5 (Build 20260301)' },
  { id: 9, component: 'File permissions', info: 'Data directory writable', status: 'ok', details: 'The data directory is writable by the server process.', versionChecked: '4.5 (Build 20260301)' },
  { id: 10, component: 'Cron', info: 'Last run: 5 min ago', status: 'ok', details: 'Cron is running regularly. Last execution was within acceptable limits.', versionChecked: '4.5 (Build 20260301)' },
  { id: 11, component: 'Email (SMTP)', info: 'Not configured', status: 'warn', details: 'SMTP is not configured. Email notifications will not be sent until SMTP settings are provided.', versionChecked: '4.5 (Build 20260301)' },
  { id: 12, component: 'Unicode (UTF-8)', info: 'Supported', status: 'ok', details: 'Full Unicode support is available.', versionChecked: '4.5 (Build 20260301)' },
  { id: 13, component: 'Sharp (image processing)', info: 'Version 0.33.2', status: 'ok', details: 'Sharp library is available for image processing and thumbnail generation.', versionChecked: '4.5 (Build 20260301)' },
  { id: 14, component: 'Redis', info: 'Not installed', status: 'error', details: 'Redis is not available. Some caching features may be limited to file-based caching.', versionChecked: '4.5 (Build 20260301)' },
];

const statusIcons = {
  ok: <CheckCircle size={18} className="text-green-500" />,
  warn: <AlertTriangle size={18} className="text-amber-500" />,
  error: <XCircle size={18} className="text-red-500" />,
};

const statusLabels = {
  ok: 'OK',
  warn: 'Check',
  error: 'Error',
};

const statusBadge = {
  ok: 'bg-green-50 text-green-700',
  warn: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
};

export default function EnvironmentChecksPage() {
  const okCount = demoChecks.filter(c => c.status === 'ok').length;
  const warnCount = demoChecks.filter(c => c.status === 'warn').length;
  const errorCount = demoChecks.filter(c => c.status === 'error').length;

  return (
    <>
      <PageHeader
        title="Environment"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Environment' },
        ]}
        actions={
          <button className="btn btn-secondary text-sm flex items-center gap-1">
            <RefreshCw size={16} /> Re-check environment
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{demoChecks.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Total checks</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{okCount}</div>
              <div className="text-xs text-[var(--text-muted)]">Passed</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-amber-600">{warnCount}</div>
              <div className="text-xs text-[var(--text-muted)]">Warnings</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-600">{errorCount}</div>
              <div className="text-xs text-[var(--text-muted)]">Errors</div>
            </div>
          </div>

          {/* Overall status */}
          {errorCount > 0 ? (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800 mb-4 flex items-center gap-2">
              <XCircle size={18} /> Some environment checks have failed. Please review the errors below.
            </div>
          ) : warnCount > 0 ? (
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={18} /> Your server environment passes all required checks but has some warnings.
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle size={18} /> Your server environment passes all checks.
            </div>
          )}

          {/* Environment checks table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-center font-semibold w-16">Status</th>
                  <th className="py-2 px-3 text-left font-semibold">Component</th>
                  <th className="py-2 px-3 text-left font-semibold">Info</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Details</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Version checked</th>
                </tr>
              </thead>
              <tbody>
                {demoChecks.map(check => (
                  <tr key={check.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {statusIcons[check.status]}
                        <span className={`text-xs px-1.5 py-0.5 rounded ${statusBadge[check.status]}`}>
                          {statusLabels[check.status]}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 font-medium">{check.component}</td>
                    <td className="py-2 px-3 text-xs">{check.info}</td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{check.details}</td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">{check.versionChecked}</td>
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
