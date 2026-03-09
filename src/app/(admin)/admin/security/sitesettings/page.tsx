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

export default function SiteSecuritySettingsPage() {
  return (
    <>
      <PageHeader
        title="Site security settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security', href: '/admin/security' },
          { label: 'Site security settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Username protection">
              <SettingField label="Protect usernames" help="If enabled, the forgotten password form will not reveal whether a username or email address was recognized.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force login" help="Require users to log in before accessing any page on the site.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force login for profiles" help="Users must be logged in to view user profiles.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="HTTPS and transport security" defaultOpen={false}>
              <SettingField label="Force HTTPS" help="Force the use of HTTPS across the entire site. Requires a valid SSL certificate.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Data protection" defaultOpen={false}>
              <SettingField label="Credit card number masking" help="Automatically mask credit card numbers found in activity text.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Hide activity dates from students" help="Hide activity opening and closing dates from students on the course page.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Upload limits" defaultOpen={false}>
              <SettingField label="Maximum uploaded file size" help="The maximum size of a file that can be uploaded to the site. Server-level settings may further limit this.">
                <select className="form-control text-sm">
                  <option value="0">Site upload limit (server setting)</option>
                  <option value="2097152">2 MB</option>
                  <option value="5242880">5 MB</option>
                  <option value="10485760">10 MB</option>
                  <option value="20971520">20 MB</option>
                  <option value="52428800">50 MB</option>
                  <option value="104857600">100 MB</option>
                  <option value="262144000">250 MB</option>
                  <option value="524288000">500 MB</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Cron security" defaultOpen={false}>
              <SettingField label="Enable web cron" help="Allow cron to be triggered via a web browser request. This is less secure than CLI cron.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Cron password" help="If set, the cron.php script will require this password as a URL parameter.">
                <input type="text" className="form-control text-sm" placeholder="Leave empty to disable" />
              </SettingField>

              <SettingField label="Cron execution via CLI only" help="If enabled, cron can only be executed from the command line, not via the web.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Token security" defaultOpen={false}>
              <SettingField label="Allow token authentication in URL" help="Allow authentication tokens to be passed as URL parameters. This is less secure.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Disable user token cleanup" help="Disable automatic cleanup of expired user tokens.">
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
