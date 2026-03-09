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

export default function SitePoliciesPage() {
  return (
    <>
      <PageHeader
        title="Site policies"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security', href: '/admin/security' },
          { label: 'Site policies' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Access control">
              <SettingField label="Force login" help="Require all users to log in before accessing any part of the site, including the front page.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force login for profiles" help="Require users to log in before viewing any user profile pages.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force HTTPS for logins" help="Use a secure HTTPS connection for the login page only.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Open to Google" help="Allow Google to access the site as a guest user for indexing. Visitors arriving from a Google search will be automatically logged in as a guest.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="File handling" defaultOpen={false}>
              <SettingField label="Maximum uploaded files" help="Maximum number of files that can be uploaded in a single form submission.">
                <input type="number" className="form-control text-sm" defaultValue={20} min={1} max={100} />
              </SettingField>

              <SettingField label="User quota" help="Maximum total size of files a user can store on the site (in bytes). 0 means unlimited.">
                <select className="form-control text-sm">
                  <option value="0">Unlimited</option>
                  <option value="10485760">10 MB</option>
                  <option value="52428800">50 MB</option>
                  <option value="104857600">100 MB</option>
                  <option value="262144000">250 MB</option>
                  <option value="524288000">500 MB</option>
                  <option value="1073741824">1 GB</option>
                  <option value="2147483648">2 GB</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Cron security" defaultOpen={false}>
              <SettingField label="Cron remote access IP" help="A comma-separated list of IP addresses from which the cron script may be accessed via the web. Leave empty to block all web-based cron access.">
                <input type="text" className="form-control text-sm" placeholder="e.g. 127.0.0.1, 10.0.0.1" />
              </SettingField>

              <SettingField label="Cron password for remote access" help="If set, the cron script will require this password as a URL parameter when accessed from allowed IPs.">
                <input type="text" className="form-control text-sm" placeholder="Leave empty to disable" />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Privacy and indexing" defaultOpen={false}>
              <SettingField label="Profile visible to logged-in users only" help="User profiles are only visible to logged-in users, not guests or search engines.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Allow indexing by search engines" help="Allow search engines to index the site. Disabling this adds noindex meta tags to pages.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Enable sitemap" help="Generate an XML sitemap for search engine discovery.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
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
