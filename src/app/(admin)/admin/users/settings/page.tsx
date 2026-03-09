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

export default function UserManagementSettingsPage() {
  return (
    <>
      <PageHeader
        title="User management settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Display settings">
              <SettingField label="Full name format" help="How user full names are displayed throughout the site.">
                <select className="form-control text-sm">
                  <option value="language">Language default</option>
                  <option value="firstname_lastname">First name + Surname</option>
                  <option value="lastname_firstname">Surname + First name</option>
                </select>
              </SettingField>

              <SettingField label="Max users per page" help="Maximum number of users displayed in the user list.">
                <input type="number" className="form-control text-sm" defaultValue={100} min={10} max={5000} />
              </SettingField>

              <SettingField label="Show user identity" help="Which additional fields are shown to identify users (besides full name).">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Email address
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" /> ID number
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" /> Username
                  </label>
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Default values" defaultOpen={false}>
              <SettingField label="Default city" help="Default city used for new user accounts.">
                <input type="text" className="form-control text-sm" placeholder="e.g. London" />
              </SettingField>

              <SettingField label="Default country" help="Default country used for new user accounts.">
                <select className="form-control text-sm">
                  <option value="">Not set</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="NG">Nigeria</option>
                  <option value="IN">India</option>
                </select>
              </SettingField>

              <SettingField label="Default timezone" help="Default timezone for new user accounts.">
                <select className="form-control text-sm">
                  <option value="99">Server timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Account policies" defaultOpen={false}>
              <SettingField label="Allow extended characters in usernames" help="Allow extended UTF-8 characters in usernames.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force users to log in" help="Require authentication for all site access.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force users to log in for profiles" help="Users must be logged in to view profiles.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1" selected>Yes</option>
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
