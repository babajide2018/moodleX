'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, FolderOpen, Save } from 'lucide-react';

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

export default function SystemPathsPage() {
  const [dataRoot, setDataRoot] = useState('/var/moodledata');
  const [tempDir, setTempDir] = useState('/var/moodledata/temp');
  const [cacheDir, setCacheDir] = useState('/var/moodledata/cache');
  const [backupDir, setBackupDir] = useState('/var/moodledata/backups');
  const [localCacheDir, setLocalCacheDir] = useState('');
  const [reverseProxyRegex, setReverseProxyRegex] = useState('');

  return (
    <>
      <PageHeader
        title="System paths"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'System paths' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            <SettingsSection title="System paths">
              <SettingField label="Data root" help="The directory where Moodle stores uploaded files. This directory must be readable AND writable by the web server user.">
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    type="text"
                    className="form-control text-sm"
                    value={dataRoot}
                    onChange={(e) => setDataRoot(e.target.value)}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  This directory should NOT be accessible directly via the web. It must be writable by the web server process.
                </p>
                {dataRoot && (
                  <p className="text-xs text-green-600 mt-1">Current value: {dataRoot}</p>
                )}
              </SettingField>

              <SettingField label="Temp directory" help="Some processes may require a directory for temporary file storage. This should be writable by the web server user.">
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    type="text"
                    className="form-control text-sm"
                    value={tempDir}
                    onChange={(e) => setTempDir(e.target.value)}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Default: {'{dataroot}'}/temp</p>
              </SettingField>

              <SettingField label="Cache directory" help="Directory for storing internal cache data. Must be writable by the web server.">
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    type="text"
                    className="form-control text-sm"
                    value={cacheDir}
                    onChange={(e) => setCacheDir(e.target.value)}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Default: {'{dataroot}'}/cache</p>
              </SettingField>

              <SettingField label="Backup directory" help="The directory where backup files will be saved.">
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} className="text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    type="text"
                    className="form-control text-sm"
                    value={backupDir}
                    onChange={(e) => setBackupDir(e.target.value)}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Default: {'{dataroot}'}/backups</p>
              </SettingField>

              <SettingField label="Local cache directory" help="A local cache directory for content that should not be shared between cluster nodes.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={localCacheDir}
                  onChange={(e) => setLocalCacheDir(e.target.value)}
                  placeholder="Leave empty to use default"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Only set this if you have multiple web servers and need a local (non-shared) cache directory.
                </p>
              </SettingField>

              <SettingField label="Reverse proxy regex" help="If your site is behind a reverse proxy, you may need to set this.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={reverseProxyRegex}
                  onChange={(e) => setReverseProxyRegex(e.target.value)}
                  placeholder="Optional"
                />
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
