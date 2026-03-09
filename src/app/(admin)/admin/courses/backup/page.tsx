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

function CheckboxField({ label, defaultChecked = true }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" defaultChecked={defaultChecked} className="w-4 h-4" />
      {label}
    </label>
  );
}

export default function BackupDefaultsPage() {
  return (
    <>
      <PageHeader
        title="General backup defaults"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Backups' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="General backup defaults">
              <p className="text-sm text-[var(--text-muted)]">
                These settings define the default options that appear when a user creates a manual backup. Locked settings cannot be changed by the user.
              </p>

              <SettingField label="Include enrolled users" help="Whether to include user account data in backups by default.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include user role assignments" help="Whether to include user role assignments in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include activities and resources" help="Whether to include activities and resources in backups by default.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include blocks" help="Whether to include blocks in backups by default.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include files" help="Whether to include files in backups by default.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include filters" help="Whether to include activity filters in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include comments" help="Whether to include user comments in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include badges" help="Whether to include badges in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include calendar events" help="Whether to include course calendar events in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include user completion details" help="Whether to include activity completion information in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include logs" help="Whether to include course logs in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include grade history" help="Whether to include grade history in backups. This does not affect the inclusion of current grades.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include question bank" help="Whether to include the question bank in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include groups and groupings" help="Whether to include groups and groupings in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include competencies" help="Whether to include course competencies in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include content bank content" help="Whether to include content bank content in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
              </SettingField>

              <SettingField label="Include custom fields" help="Whether to include course custom fields in backups.">
                <div className="flex items-center gap-3">
                  <select className="form-control text-sm flex-1">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Locked
                  </label>
                </div>
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
