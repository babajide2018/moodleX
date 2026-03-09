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

export default function EnrolCohortSettingsPage() {
  return (
    <>
      <PageHeader
        title="Cohort sync"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Enrolments', href: '/admin/plugins/enrol' },
          { label: 'Cohort sync' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Default role assignment" help="Default role assigned to cohort members when synced to a course">
                <select className="form-control text-sm" defaultValue="student">
                  <option value="student">Student</option>
                  <option value="teacher">Non-editing teacher</option>
                  <option value="editingteacher">Teacher</option>
                  <option value="manager">Manager</option>
                </select>
              </SettingField>
              <SettingField label="Add instance to new courses" help="Add a cohort sync instance to all new courses by default">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Group mapping">
              <SettingField label="Add to group" help="Create a group for the cohort and add all cohort members to it">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No group</option>
                  <option value="1">Create new group</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  If enabled, a new group will be created in the course for each cohort, and all cohort members will be added to that group.
                </p>
              </SettingField>
              <SettingField label="Group name pattern" help="Pattern for automatic group name creation">
                <input
                  type="text"
                  className="form-control text-sm"
                  defaultValue="{$cohortname} cohort"
                  placeholder="{$cohortname} cohort"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Use {'{$cohortname}'} as a placeholder for the cohort name.
                </p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Sync settings" defaultOpen={false}>
              <SettingField label="Sync schedule" help="How often should cohort membership be synchronised">
                <select className="form-control text-sm" defaultValue="3600">
                  <option value="0">Every cron run</option>
                  <option value="3600">Every hour</option>
                  <option value="21600">Every 6 hours</option>
                  <option value="43200">Every 12 hours</option>
                  <option value="86400">Daily</option>
                </select>
              </SettingField>
              <SettingField label="Unenrol action" help="What happens when a user is removed from the cohort">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">Unenrol user from course</option>
                  <option value="1">Suspend course enrolment</option>
                  <option value="2">Suspend enrolment and remove roles</option>
                </select>
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
