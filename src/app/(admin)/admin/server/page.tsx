'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Save,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  FolderOpen,
  Mail,
  Clock,
  Cpu,
  RefreshCw,
  Play,
  Pause,
} from 'lucide-react';
import { adminTabs } from '@/lib/admin-tabs';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SettingsSection({ title, icon, defaultOpen = false, children }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-left bg-[var(--bg-light)] hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="text-[var(--text-muted)]">{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-[var(--border-color)]">
          {children}
        </div>
      )}
    </div>
  );
}

function SettingField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {help && (
          <span className="text-[var(--text-muted)] cursor-help" title={help}>
            <HelpCircle size={12} />
          </span>
        )}
      </label>
      <div>{children}</div>
    </div>
  );
}

const environmentChecks = [
  { requirement: 'Node.js version', value: 'v20.11.0', status: 'ok' as const, info: 'Minimum: v18.0.0' },
  { requirement: 'npm version', value: '10.2.4', status: 'ok' as const, info: 'Minimum: v9.0.0' },
  { requirement: 'Database (PostgreSQL)', value: '16.1', status: 'ok' as const, info: 'Minimum: v14.0' },
  { requirement: 'Memory limit', value: '512 MB', status: 'ok' as const, info: 'Minimum: 256 MB' },
  { requirement: 'Disk space', value: '45.2 GB free', status: 'ok' as const, info: 'Minimum: 5 GB' },
  { requirement: 'HTTPS', value: 'Enabled', status: 'ok' as const, info: 'Required for production' },
  { requirement: 'File permissions', value: 'Writable', status: 'ok' as const, info: 'Data directory must be writable' },
  { requirement: 'Prisma CLI', value: '6.2.1', status: 'ok' as const, info: 'Minimum: v5.0.0' },
  { requirement: 'Sharp (image processing)', value: '0.33.2', status: 'ok' as const, info: 'Optional, for image resizing' },
  { requirement: 'Cron/scheduler', value: 'Not configured', status: 'warn' as const, info: 'Required for scheduled tasks' },
  { requirement: 'Redis (caching)', value: 'Not installed', status: 'warn' as const, info: 'Optional, improves performance' },
  { requirement: 'Unicode support', value: 'Full UTF-8', status: 'ok' as const, info: 'Required' },
  { requirement: 'Email (SMTP)', value: 'Not configured', status: 'fail' as const, info: 'Required for notifications' },
];

const scheduledTasks = [
  { name: 'Send forum post notifications', component: 'mod_forum', nextRun: '2026-03-09 14:00', lastRun: '2026-03-09 13:00', lastResult: 'ok' as const, schedule: 'Every 1 min', enabled: true },
  { name: 'Clean up temporary files', component: 'core', nextRun: '2026-03-09 15:00', lastRun: '2026-03-09 14:00', lastResult: 'ok' as const, schedule: 'Every 1 hour', enabled: true },
  { name: 'Send course completion notifications', component: 'core_completion', nextRun: '2026-03-10 00:00', lastRun: '2026-03-09 00:00', lastResult: 'ok' as const, schedule: 'Daily at midnight', enabled: true },
  { name: 'Process assignment submissions', component: 'mod_assign', nextRun: '2026-03-09 14:05', lastRun: '2026-03-09 13:05', lastResult: 'ok' as const, schedule: 'Every 5 min', enabled: true },
  { name: 'Calculate grade aggregations', component: 'core_grades', nextRun: '2026-03-09 14:30', lastRun: '2026-03-09 13:30', lastResult: 'ok' as const, schedule: 'Every 30 min', enabled: true },
  { name: 'Clean up session data', component: 'core', nextRun: '2026-03-09 16:00', lastRun: '2026-03-09 14:00', lastResult: 'ok' as const, schedule: 'Every 2 hours', enabled: true },
  { name: 'Send email digests', component: 'core_message', nextRun: '2026-03-10 07:00', lastRun: '2026-03-09 07:00', lastResult: 'ok' as const, schedule: 'Daily at 07:00', enabled: true },
  { name: 'Backup scheduled courses', component: 'core_backup', nextRun: '2026-03-10 02:00', lastRun: '2026-03-09 02:00', lastResult: 'ok' as const, schedule: 'Daily at 02:00', enabled: true },
  { name: 'Process enrolment expirations', component: 'core_enrol', nextRun: '2026-03-10 00:00', lastRun: '2026-03-09 00:00', lastResult: 'ok' as const, schedule: 'Daily at midnight', enabled: true },
  { name: 'Sync external calendars', component: 'core_calendar', nextRun: '2026-03-09 15:00', lastRun: '2026-03-09 14:00', lastResult: 'warn' as const, schedule: 'Every 1 hour', enabled: true },
  { name: 'Check for plugin updates', component: 'core', nextRun: '2026-03-10 03:00', lastRun: '2026-03-09 03:00', lastResult: 'ok' as const, schedule: 'Daily at 03:00', enabled: true },
  { name: 'Purge expired cache entries', component: 'core_cache', nextRun: '2026-03-09 15:00', lastRun: '2026-03-09 14:00', lastResult: 'ok' as const, schedule: 'Every 1 hour', enabled: true },
  { name: 'Send badge notifications', component: 'core_badges', nextRun: '2026-03-09 14:10', lastRun: '2026-03-09 13:10', lastResult: 'ok' as const, schedule: 'Every 10 min', enabled: false },
  { name: 'Process analytics predictions', component: 'core_analytics', nextRun: '2026-03-10 04:00', lastRun: '2026-03-09 04:00', lastResult: 'fail' as const, schedule: 'Daily at 04:00', enabled: true },
];

const phpInfo = [
  { key: 'Runtime', value: 'Node.js v20.11.0' },
  { key: 'Framework', value: 'Next.js 16.0.0' },
  { key: 'ORM', value: 'Prisma 6.2.1' },
  { key: 'Memory limit', value: '512 MB' },
  { key: 'Max upload size', value: '100 MB' },
  { key: 'Max execution time', value: '30 seconds' },
  { key: 'Operating system', value: 'Darwin (macOS)' },
  { key: 'Architecture', value: 'arm64' },
  { key: 'Timezone', value: 'UTC' },
  { key: 'SSL/TLS', value: 'OpenSSL 3.2.0' },
  { key: 'Image processing', value: 'Sharp 0.33.2' },
  { key: 'Cache driver', value: 'In-memory (default)' },
];

export default function AdminServerPage() {
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpSecurity, setSmtpSecurity] = useState('tls');
  const [smtpUser, setSmtpUser] = useState('');
  const [noReplyAddress, setNoReplyAddress] = useState('noreply@example.com');

  const [dataRoot, setDataRoot] = useState('/var/moodledata');
  const [tempDir, setTempDir] = useState('/var/moodledata/temp');
  const [cacheDir, setCacheDir] = useState('/var/moodledata/cache');
  const [backupDir, setBackupDir] = useState('/var/moodledata/backup');

  return (
    <>
      <PageHeader
        title="Server information"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            {/* Environment checks */}
            <SettingsSection title="Environment checks" icon={<Server size={16} />} defaultOpen={true}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                The following checks verify that your server meets the requirements for running MoodleX.
              </p>
              <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold">Requirement</th>
                      <th className="py-2 px-3 text-left font-semibold">Current value</th>
                      <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Info</th>
                      <th className="py-2 px-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {environmentChecks.map((check) => (
                      <tr key={check.requirement} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-medium">{check.requirement}</td>
                        <td className="py-2 px-3 font-mono text-xs">{check.value}</td>
                        <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{check.info}</td>
                        <td className="py-2 px-3">
                          {check.status === 'ok' && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 size={14} /> Pass
                            </span>
                          )}
                          {check.status === 'warn' && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                              <AlertTriangle size={14} /> Warning
                            </span>
                          )}
                          {check.status === 'fail' && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-600">
                              <XCircle size={14} /> Fail
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 size={14} /> {environmentChecks.filter(c => c.status === 'ok').length} passed</span>
                <span className="inline-flex items-center gap-1 text-amber-600"><AlertTriangle size={14} /> {environmentChecks.filter(c => c.status === 'warn').length} warnings</span>
                <span className="inline-flex items-center gap-1 text-red-600"><XCircle size={14} /> {environmentChecks.filter(c => c.status === 'fail').length} failed</span>
              </div>
            </SettingsSection>

            {/* Server paths */}
            <SettingsSection title="Server paths" icon={<FolderOpen size={16} />}>
              <SettingField label="Data root" help="Directory for uploaded files, cache, and session data">
                <input type="text" className="form-control font-mono text-sm" value={dataRoot} onChange={(e) => setDataRoot(e.target.value)} />
              </SettingField>
              <SettingField label="Temp directory" help="Location for temporary files during processing">
                <input type="text" className="form-control font-mono text-sm" value={tempDir} onChange={(e) => setTempDir(e.target.value)} />
              </SettingField>
              <SettingField label="Cache directory" help="Location for cached files">
                <input type="text" className="form-control font-mono text-sm" value={cacheDir} onChange={(e) => setCacheDir(e.target.value)} />
              </SettingField>
              <SettingField label="Backup directory" help="Default location for course backups">
                <input type="text" className="form-control font-mono text-sm" value={backupDir} onChange={(e) => setBackupDir(e.target.value)} />
              </SettingField>
            </SettingsSection>

            {/* Email configuration */}
            <SettingsSection title="Email configuration" icon={<Mail size={16} />}>
              <SettingField label="SMTP hosts">
                <input type="text" className="form-control" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="e.g. smtp.gmail.com" />
              </SettingField>
              <SettingField label="SMTP port">
                <input type="text" className="form-control w-24" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
              </SettingField>
              <SettingField label="SMTP security">
                <select className="form-control w-32" value={smtpSecurity} onChange={(e) => setSmtpSecurity(e.target.value)}>
                  <option value="none">None</option>
                  <option value="ssl">SSL</option>
                  <option value="tls">TLS</option>
                </select>
              </SettingField>
              <SettingField label="SMTP username">
                <input type="text" className="form-control" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
              </SettingField>
              <SettingField label="SMTP password">
                <input type="password" className="form-control" placeholder="••••••••" />
              </SettingField>
              <SettingField label="No-reply address">
                <input type="email" className="form-control" value={noReplyAddress} onChange={(e) => setNoReplyAddress(e.target.value)} />
              </SettingField>
              <div className="flex justify-end">
                <button className="btn btn-secondary text-sm flex items-center gap-1">
                  <Mail size={14} /> Send test email
                </button>
              </div>
            </SettingsSection>

            {/* Scheduled tasks */}
            <SettingsSection title="Scheduled tasks" icon={<Clock size={16} />}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Scheduled tasks run periodically in the background. Ensure a cron job or task scheduler is configured.
              </p>
              <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold">Task name</th>
                      <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Component</th>
                      <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Schedule</th>
                      <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Next run</th>
                      <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Last run</th>
                      <th className="py-2 px-3 text-left font-semibold">Status</th>
                      <th className="py-2 px-3 w-20">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledTasks.map((task) => (
                      <tr key={task.name} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-medium text-xs">{task.name}</td>
                        <td className="py-2 px-3 text-xs text-[var(--text-muted)] font-mono hidden lg:table-cell">{task.component}</td>
                        <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{task.schedule}</td>
                        <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{task.nextRun}</td>
                        <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">{task.lastRun}</td>
                        <td className="py-2 px-3">
                          {task.lastResult === 'ok' && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 size={12} /> OK
                            </span>
                          )}
                          {task.lastResult === 'warn' && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                              <AlertTriangle size={12} /> Warn
                            </span>
                          )}
                          {task.lastResult === 'fail' && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-600">
                              <XCircle size={12} /> Fail
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {task.enabled ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600"><Play size={10} /></span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400"><Pause size={10} /></span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            {/* Server info (PHP info equivalent) */}
            <SettingsSection title="Runtime information" icon={<Cpu size={16} />}>
              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold w-1/3">Property</th>
                      <th className="py-2 px-3 text-left font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phpInfo.map((item) => (
                      <tr key={item.key} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-medium text-[var(--text-muted)]">{item.key}</td>
                        <td className="py-2 px-3 font-mono text-xs">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            {/* Save */}
            <div className="flex items-center gap-3 py-4 border-t border-[var(--border-color)]">
              <button className="btn btn-primary flex items-center gap-2">
                <Save size={16} /> Save changes
              </button>
              <Link href="/admin" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
