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

export default function RestoreDefaultsPage() {
  return (
    <>
      <PageHeader
        title="General restore defaults"
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
            <SettingsSection title="General restore defaults">
              <p className="text-sm text-[var(--text-muted)]">
                These settings define the default options that appear when restoring a course backup. Locked settings cannot be changed by the user during restore.
              </p>

              <SettingField label="Include enrolled users" help="Whether to restore enrolled user data by default.">
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

              <SettingField label="Include user role assignments" help="Whether to restore user role assignments by default.">
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

              <SettingField label="Include activities and resources" help="Whether to restore activities and resources by default.">
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

              <SettingField label="Include blocks" help="Whether to restore blocks by default.">
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

              <SettingField label="Include files" help="Whether to restore files by default.">
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

              <SettingField label="Include filters" help="Whether to restore activity filters by default.">
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

              <SettingField label="Include comments" help="Whether to restore user comments by default.">
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

              <SettingField label="Include badges" help="Whether to restore badges by default.">
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

              <SettingField label="Include calendar events" help="Whether to restore course calendar events by default.">
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

              <SettingField label="Include user completion details" help="Whether to restore activity completion details by default.">
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

              <SettingField label="Include logs" help="Whether to restore course logs by default.">
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

              <SettingField label="Include grade history" help="Whether to restore grade history by default.">
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

              <SettingField label="Include groups and groupings" help="Whether to restore groups and groupings by default.">
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

              <SettingField label="Include competencies" help="Whether to restore course competencies by default.">
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

              <SettingField label="Include content bank content" help="Whether to restore content bank content by default.">
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

              <SettingField label="Include custom fields" help="Whether to restore course custom fields by default.">
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
