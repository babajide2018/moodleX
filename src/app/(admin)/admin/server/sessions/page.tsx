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

export default function SessionHandlingPage() {
  const [sessionDriver, setSessionDriver] = useState('database');
  const [sessionTimeout, setSessionTimeout] = useState('7200');
  const [cookiePrefix, setCookiePrefix] = useState('MoodleSession');
  const [cookiePath, setCookiePath] = useState('/');
  const [cookieDomain, setCookieDomain] = useState('');
  const [secureCookies, setSecureCookies] = useState(false);
  const [cookieHttpOnly, setCookieHttpOnly] = useState(true);

  return (
    <>
      <PageHeader
        title="Session handling"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Session handling' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            <SettingsSection title="Session handling">
              <SettingField label="Session driver" help="Choose where session data will be stored.">
                <select
                  className="form-control text-sm"
                  value={sessionDriver}
                  onChange={(e) => setSessionDriver(e.target.value)}
                >
                  <option value="file">File</option>
                  <option value="database">Database</option>
                  <option value="redis">Redis</option>
                  <option value="memcached">Memcached</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Database is recommended for most installations. File-based sessions are simpler but may not work well in clustered environments.
                </p>
              </SettingField>

              <SettingField label="Session timeout (seconds)" help="Time in seconds before an inactive session expires.">
                <input
                  type="number"
                  className="form-control text-sm"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  min="300"
                  max="86400"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Default: 7200 (2 hours). Sessions will be automatically destroyed after this period of inactivity.
                </p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Cookie settings">
              <SettingField label="Cookie prefix" help="Prefix used for session cookie names.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={cookiePrefix}
                  onChange={(e) => setCookiePrefix(e.target.value)}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  This is useful if you have more than one copy of Moodle running on the same web server.
                </p>
              </SettingField>

              <SettingField label="Cookie path" help="The path on the server in which the cookie will be available.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={cookiePath}
                  onChange={(e) => setCookiePath(e.target.value)}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Set to &apos;/&apos; for the whole domain. Normally this does not need to be changed.
                </p>
              </SettingField>

              <SettingField label="Cookie domain" help="The domain that the cookie is available to.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={cookieDomain}
                  onChange={(e) => setCookieDomain(e.target.value)}
                  placeholder=".example.com"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Leave empty for the current domain. Use a leading dot (e.g., .example.com) to share cookies across subdomains.
                </p>
              </SettingField>

              <SettingField label="Secure cookies only" help="If enabled, cookies will only be sent over HTTPS connections.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={secureCookies}
                    onChange={(e) => setSecureCookies(e.target.checked)}
                  />
                  <span className="text-sm">Enable secure cookies</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Requires HTTPS to be enabled on your site. Recommended for production environments.
                </p>
              </SettingField>

              <SettingField label="HTTP only cookies" help="If enabled, cookies are not accessible by scripting languages like JavaScript.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={cookieHttpOnly}
                    onChange={(e) => setCookieHttpOnly(e.target.checked)}
                  />
                  <span className="text-sm">Enable HTTP only cookies</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Recommended. Helps prevent XSS attacks from accessing session cookies.
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
