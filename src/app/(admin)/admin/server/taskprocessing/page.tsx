'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Save } from 'lucide-react';

function SettingField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {help && <span className="text-[var(--text-muted)] cursor-help" title={help}><HelpCircle size={12} /></span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

function SettingsSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-white">
      <button className="w-full flex items-center gap-2 p-4 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-color)] pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default function TaskProcessingPage() {
  const [maxCronTime, setMaxCronTime] = useState('1800');
  const [maxTasksPerCron, setMaxTasksPerCron] = useState('0');
  const [taskRunnerProcesses, setTaskRunnerProcesses] = useState('3');
  const [keepLogs, setKeepLogs] = useState('7');
  const [cronLockTimeout, setCronLockTimeout] = useState('600');

  return (
    <>
      <PageHeader
        title="Task processing"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Task configuration' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            <SettingsSection title="Task processing settings">
              <SettingField label="Maximum cron time" help="Maximum total time in seconds that the cron process should run.">
                <input
                  type="number"
                  className="form-control text-sm w-40"
                  value={maxCronTime}
                  onChange={(e) => setMaxCronTime(e.target.value)}
                  min="60"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Default: 1800 seconds (30 minutes). Set to 0 for no limit. The cron process will stop scheduling new tasks after this time.
                </p>
              </SettingField>

              <SettingField label="Maximum tasks per cron run" help="Maximum number of tasks to process in a single cron run.">
                <input
                  type="number"
                  className="form-control text-sm w-40"
                  value={maxTasksPerCron}
                  onChange={(e) => setMaxTasksPerCron(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Set to 0 for no limit. This can help prevent a single cron run from monopolizing server resources.
                </p>
              </SettingField>

              <SettingField label="Task runner processes" help="Number of concurrent task runner processes.">
                <input
                  type="number"
                  className="form-control text-sm w-40"
                  value={taskRunnerProcesses}
                  onChange={(e) => setTaskRunnerProcesses(e.target.value)}
                  min="1"
                  max="20"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Default: 3. The number of parallel cron task runner processes. Higher values can improve throughput but increase server load.
                </p>
              </SettingField>

              <SettingField label="Keep logs for (days)" help="Number of days to keep task execution logs.">
                <input
                  type="number"
                  className="form-control text-sm w-40"
                  value={keepLogs}
                  onChange={(e) => setKeepLogs(e.target.value)}
                  min="1"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Default: 7 days. Older task logs will be automatically removed.
                </p>
              </SettingField>

              <SettingField label="Cron lock timeout (seconds)" help="Maximum time in seconds to wait for the cron lock.">
                <input
                  type="number"
                  className="form-control text-sm w-40"
                  value={cronLockTimeout}
                  onChange={(e) => setCronLockTimeout(e.target.value)}
                  min="60"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Default: 600 seconds (10 minutes). If the cron lock is held for longer than this, it will be automatically released.
                </p>
              </SettingField>
            </SettingsSection>

            <div className="flex justify-end">
              <button className="btn btn-primary text-sm flex items-center gap-2">
                <Save size={16} />
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
