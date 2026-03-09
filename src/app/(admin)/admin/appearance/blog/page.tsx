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

export default function BlogSettingsPage() {
  return (
    <>
      <PageHeader
        title="Blog"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Blog' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Blog settings">
              <SettingField label="Enable blog system" help="Enable or disable the blog system for the entire site. When disabled, blog entries that were previously created are no longer accessible.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Blog visibility" help="Controls the default visibility level for new blog entries.">
                <select className="form-control text-sm">
                  <option value="all">The world can read entries set to be world-accessible</option>
                  <option value="site">All site users can see all blog entries</option>
                  <option value="personal">Users can only see their own blog</option>
                </select>
              </SettingField>

              <SettingField label="Enable external blogs" help="Allow users to specify external blog feeds. These external blogs are checked regularly and new entries are copied into the local blog for that user.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="External blog cron schedule" help="How often Moodle checks the external blogs for new entries.">
                <select className="form-control text-sm">
                  <option value="86400">Once a day</option>
                  <option value="43200">Twice a day</option>
                  <option value="3600">Once an hour</option>
                </select>
              </SettingField>

              <SettingField label="Maximum external blogs per user" help="The maximum number of external blog feeds a user can link.">
                <input type="number" className="form-control text-sm w-24" defaultValue={5} min={1} max={50} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Display settings" defaultOpen={false}>
              <SettingField label="Show comments" help="Enable comments on blog entries. Users will be able to add comments to each blog entry.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Blog entries per page" help="The number of blog entries to show on a single page.">
                <input type="number" className="form-control text-sm w-24" defaultValue={10} min={1} max={100} />
              </SettingField>

              <SettingField label="Enable associations" help="Enables the association of blog entries with courses and course modules.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show blog menu block" help="Show the blog menu block by default on the site.">
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
