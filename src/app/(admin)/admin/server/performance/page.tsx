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

export default function PerformanceSettingsPage() {
  const [themeDesignerMode, setThemeDesignerMode] = useState(false);
  const [cacheJs, setCacheJs] = useState(true);
  const [cacheCss, setCacheCss] = useState(true);
  const [cacheTemplates, setCacheTemplates] = useState(true);
  const [enableStats, setEnableStats] = useState(false);
  const [debugMode, setDebugMode] = useState('none');
  const [perfdebug, setPerfdebug] = useState(false);
  const [dbSessions, setDbSessions] = useState(true);

  return (
    <>
      <PageHeader
        title="Performance settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Performance' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            <SettingsSection title="Caching">
              <SettingField label="Theme designer mode" help="When enabled, themes are not cached and CSS/JS are regenerated on every page load. This impacts performance significantly.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={themeDesignerMode}
                    onChange={(e) => setThemeDesignerMode(e.target.checked)}
                  />
                  <span className="text-sm">Enable theme designer mode</span>
                </label>
                <p className="text-xs text-red-600 mt-1">
                  Warning: Only enable during theme development. This severely impacts performance.
                </p>
              </SettingField>

              <SettingField label="Cache JavaScript" help="Enable JavaScript caching and minification for improved performance.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={cacheJs}
                    onChange={(e) => setCacheJs(e.target.checked)}
                  />
                  <span className="text-sm">Cache and minify JavaScript</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Recommended for production. Combines and minifies JavaScript files to reduce HTTP requests.
                </p>
              </SettingField>

              <SettingField label="Cache CSS" help="Enable CSS caching and minification.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={cacheCss}
                    onChange={(e) => setCacheCss(e.target.checked)}
                  />
                  <span className="text-sm">Cache and minify CSS</span>
                </label>
              </SettingField>

              <SettingField label="Cache templates" help="Enable caching of compiled templates.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={cacheTemplates}
                    onChange={(e) => setCacheTemplates(e.target.checked)}
                  />
                  <span className="text-sm">Cache compiled templates</span>
                </label>
              </SettingField>

              <SettingField label="Database sessions" help="Use the database to store session data instead of files.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={dbSessions}
                    onChange={(e) => setDbSessions(e.target.checked)}
                  />
                  <span className="text-sm">Store sessions in database</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Recommended for clustered environments where session files cannot be shared.
                </p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Debugging">
              <SettingField label="Debug messages" help="Set the level of debug messages to display.">
                <select
                  className="form-control text-sm"
                  value={debugMode}
                  onChange={(e) => setDebugMode(e.target.value)}
                >
                  <option value="none">NONE: Do not show any errors</option>
                  <option value="minimal">MINIMAL: Show fatal errors only</option>
                  <option value="normal">NORMAL: Show errors and warnings</option>
                  <option value="all">ALL: Show all reasonable errors</option>
                  <option value="developer">DEVELOPER: Extra debug messages for developers</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Set to NONE for production sites. DEVELOPER mode shows all PHP notices and debug info.
                </p>
              </SettingField>

              <SettingField label="Performance info" help="Show performance information in the page footer.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={perfdebug}
                    onChange={(e) => setPerfdebug(e.target.checked)}
                  />
                  <span className="text-sm">Show performance info in footer</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Displays page load time, memory usage, and database query count in the page footer.
                </p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Statistics">
              <SettingField label="Enable statistics" help="Enable the processing of site statistics. This may impact performance on large sites.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={enableStats}
                    onChange={(e) => setEnableStats(e.target.checked)}
                  />
                  <span className="text-sm">Enable statistics</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Statistics are processed by cron. Enabling this on large sites may significantly increase cron processing time.
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
