'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

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
      <button
        className="w-full flex items-center gap-2 p-4 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setOpen(!open)}
      >
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

export default function HTTPSecurityPage() {
  return (
    <>
      <PageHeader
        title="HTTP security"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security', href: '/admin/security' },
          { label: 'HTTP security' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="HTTPS">
              <SettingField label="Use HTTPS" help="Force all connections to use HTTPS. Requires a valid SSL certificate configured on your server.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Enable HSTS" help="Enable HTTP Strict Transport Security. Tells browsers to only connect via HTTPS for the specified duration.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="HSTS max age" help="Maximum time (in seconds) that browsers should remember to only connect via HTTPS. Recommended: 31536000 (1 year).">
                <input type="number" className="form-control text-sm" defaultValue={31536000} min={0} />
                <p className="text-xs text-[var(--text-muted)] mt-1">Default: 31536000 seconds (1 year)</p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Frame embedding" defaultOpen={false}>
              <SettingField label="Frame embedding policy" help="Controls whether the site can be embedded in iframes on other sites. DENY prevents all framing, SAMEORIGIN allows framing from the same domain.">
                <select className="form-control text-sm">
                  <option value="allow">Allow from anywhere</option>
                  <option value="sameorigin">SAMEORIGIN - Allow from same domain only</option>
                  <option value="deny">DENY - Prevent all framing</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Cookies" defaultOpen={false}>
              <SettingField label="Cookie secure flag" help="If enabled, cookies will only be sent over HTTPS connections. Requires HTTPS to be enabled.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Cookie HTTP only" help="If enabled, cookies are not accessible via JavaScript, reducing XSS risk.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Cookie SameSite attribute" help="Controls whether cookies are sent with cross-site requests.">
                <select className="form-control text-sm">
                  <option value="Lax">Lax (recommended)</option>
                  <option value="Strict">Strict</option>
                  <option value="None">None</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Security headers" defaultOpen={false}>
              <SettingField label="Referrer policy" help="Controls how much referrer information is sent with requests from this site.">
                <select className="form-control text-sm">
                  <option value="no-referrer-when-downgrade">no-referrer-when-downgrade (default)</option>
                  <option value="no-referrer">no-referrer</option>
                  <option value="origin">origin</option>
                  <option value="origin-when-cross-origin">origin-when-cross-origin</option>
                  <option value="same-origin">same-origin</option>
                  <option value="strict-origin">strict-origin</option>
                  <option value="strict-origin-when-cross-origin">strict-origin-when-cross-origin</option>
                  <option value="unsafe-url">unsafe-url</option>
                </select>
              </SettingField>

              <SettingField label="Content Security Policy" help="Specify a Content Security Policy header to control which resources the browser is allowed to load. Leave empty to disable.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={4}
                  placeholder={"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Leave empty to not send a Content-Security-Policy header. Use with caution as incorrect policies can break site functionality.
                </p>
              </SettingField>

              <SettingField label="X-Content-Type-Options" help="Prevents browsers from MIME-sniffing a response away from the declared content-type.">
                <select className="form-control text-sm">
                  <option value="1">Send nosniff header (recommended)</option>
                  <option value="0">Do not send</option>
                </select>
              </SettingField>
            </SettingsSection>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
