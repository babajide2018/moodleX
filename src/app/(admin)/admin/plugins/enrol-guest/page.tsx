'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

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

export default function EnrolGuestSettingsPage() {
  return (
    <>
      <PageHeader
        title="Guest access"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Enrolments', href: '/admin/plugins/enrol' },
          { label: 'Guest access' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Add instance to new courses" help="Add a guest access instance to all new courses by default">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Allow guest access" help="Allow guest access to courses by default">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  When enabled, courses will allow guest users to view content without being enrolled.
                </p>
              </SettingField>
              <SettingField label="Require guest access password" help="Require guests to enter a password to access the course">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Default status">
              <SettingField label="Default status in new courses" help="Default guest access status when added to new courses">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">Disabled</option>
                  <option value="1">Enabled</option>
                </select>
              </SettingField>
              <SettingField label="Guest login button" help="Show the guest login button on the login page">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">Hide</option>
                  <option value="1">Show</option>
                </select>
              </SettingField>
              <SettingField label="Auto-login guests" help="Automatically log in visitors as guests">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  If enabled, visitors who are not logged in will automatically be logged in as a guest user.
                </p>
              </SettingField>
            </SettingsSection>

            <div className="flex items-center gap-3 pt-2">
              <button type="button" className="btn btn-primary text-sm">Save changes</button>
              <button type="button" className="btn text-sm border border-[var(--border-color)]">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
