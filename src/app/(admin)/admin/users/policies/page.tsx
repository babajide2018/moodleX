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

export default function UserPoliciesPage() {
  return (
    <>
      <PageHeader
        title="User policies"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Permissions' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Role assignment">
              <SettingField label="Default role for all users" help="All logged-in users will be given the capabilities of the role specified here, at the site level, in ADDITION to any other roles they may have been given.">
                <select className="form-control text-sm">
                  <option value="authenticated">Authenticated user</option>
                  <option value="student">Student</option>
                  <option value="guest">Guest</option>
                </select>
              </SettingField>

              <SettingField label="Guest role" help="This role is automatically assigned to the guest user, and also to users who are not logged in.">
                <select className="form-control text-sm">
                  <option value="guest">Guest</option>
                </select>
              </SettingField>

              <SettingField label="Auto-login guests" help="Should visitors be logged in as guests automatically when accessing courses that allow guest access?">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Role for course creators" help="Users with this role can create new courses.">
                <select className="form-control text-sm">
                  <option value="coursecreator">Course creator</option>
                  <option value="editingteacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="User pictures" defaultOpen={false}>
              <SettingField label="Enable gravatar" help="When enabled, Moodle will use Gravatar as the default user picture source.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Gravatar default image" help="Default image if user has no Gravatar.">
                <select className="form-control text-sm">
                  <option value="mm">Mystery person</option>
                  <option value="identicon">Identicon</option>
                  <option value="monsterid">Monster</option>
                  <option value="wavatar">Wavatar</option>
                  <option value="retro">Retro</option>
                  <option value="blank">Blank</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="User browsing" defaultOpen={false}>
              <SettingField label="Allow searching by email" help="Allow users to search for others by email address.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show user profile link" help="Show a link to the user profile on the navigation bar.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
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
