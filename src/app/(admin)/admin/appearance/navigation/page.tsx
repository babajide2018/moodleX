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

export default function NavigationSettingsPage() {
  return (
    <>
      <PageHeader
        title="Navigation"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Navigation' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="General navigation">
              <SettingField label="Default home page for users" help="The default page users are taken to after login.">
                <select className="form-control text-sm">
                  <option value="home">Site home</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="mycourses">My courses</option>
                </select>
              </SettingField>

              <SettingField label="Allow guest access to Dashboard" help="If enabled, logged-out users can access the Dashboard page (but will see it as a guest).">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Home link" help="The URL that the home icon in the breadcrumb navigation links to.">
                <select className="form-control text-sm">
                  <option value="home">Site home</option>
                  <option value="dashboard">Dashboard</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Course navigation" defaultOpen={false}>
              <SettingField label="Show activity navigation" help="Show the previous/next activity navigation on activity pages.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show course full names" help="Display full course names in the navigation instead of short names.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Course limit" help="Maximum number of courses listed in the navigation tree before a &lsquo;More...&rsquo; link is shown.">
                <input type="number" className="form-control text-sm w-24" defaultValue={20} min={1} max={200} />
              </SettingField>

              <SettingField label="Course limit for enrolled courses" help="Maximum number of enrolled courses listed in the navigation.">
                <input type="number" className="form-control text-sm w-24" defaultValue={10} min={0} max={200} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Navigation appearance" defaultOpen={false}>
              <SettingField label="Show categories in navigation" help="Show course categories in the navigation block/drawer.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show all courses link" help="Display an &lsquo;All courses&rsquo; link in the navigation.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show course section links" help="Show individual section links in the course navigation.">
                <select className="form-control text-sm">
                  <option value="50">Yes, if fewer than 50 sections</option>
                  <option value="0">Never</option>
                  <option value="100">Yes, if fewer than 100 sections</option>
                </select>
              </SettingField>

              <SettingField label="Generate breadcrumb links for navigation nodes" help="Automatically generate breadcrumb links for items in the navigation.">
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
