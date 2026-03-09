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

export default function NotificationSettingsPage() {
  return (
    <>
      <PageHeader
        title="Notification settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security', href: '/admin/security' },
          { label: 'Notifications' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Login failure notifications">
              <SettingField label="Display login failures to" help="Select who can see notifications about failed login attempts on the site.">
                <select className="form-control text-sm">
                  <option value="0">Nobody</option>
                  <option value="1">Administrators only</option>
                  <option value="2">Everybody</option>
                </select>
              </SettingField>

              <SettingField label="Email login failures" help="Send email notifications when login failures exceed the threshold.">
                <select className="form-control text-sm">
                  <option value="0">Never</option>
                  <option value="1">Administrators only</option>
                  <option value="2">Administrators and the affected user</option>
                </select>
              </SettingField>

              <SettingField label="Threshold for email notification" help="Number of failed login attempts (per user or per IP) that triggers an email notification.">
                <input type="number" className="form-control text-sm" defaultValue={10} min={1} max={1000} />
                <p className="text-xs text-[var(--text-muted)] mt-1">Email is sent once the failed login count reaches this number within a single observation window.</p>
              </SettingField>

              <SettingField label="Notification observation window (minutes)" help="Time window in which failed login attempts are counted for notification purposes.">
                <input type="number" className="form-control text-sm" defaultValue={60} min={5} max={1440} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Additional notifications" defaultOpen={false}>
              <SettingField label="Notify admins of new registrations" help="Send a notification to administrators when a new user registers on the site.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Notify on suspected account compromise" help="Automatically notify administrators when an account is suspected of being compromised (e.g. login from unusual location).">
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
