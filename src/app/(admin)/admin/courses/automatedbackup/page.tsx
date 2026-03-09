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

export default function AutomatedBackupPage() {
  return (
    <>
      <PageHeader
        title="Automated backup setup"
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
            <SettingsSection title="Automated backup settings">
              <SettingField label="Active" help="Enable or disable automated course backups.">
                <select className="form-control text-sm">
                  <option value="0">Disabled</option>
                  <option value="1">Enabled</option>
                  <option value="2">Manual only (via CLI)</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Schedule">
              <SettingField label="Days to run" help="Select the days of the week the automated backup should run.">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Sunday
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Monday
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Tuesday
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Wednesday
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Thursday
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Friday
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Saturday
                  </label>
                </div>
              </SettingField>

              <SettingField label="Execute at" help="The time at which the automated backup should start. Use 24-hour format.">
                <div className="flex items-center gap-2">
                  <select className="form-control text-sm w-auto">
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i} selected={i === 2}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span className="text-sm">:</span>
                  <select className="form-control text-sm w-auto">
                    <option value="0" selected>00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Backup storage" defaultOpen={false}>
              <SettingField label="Save to" help="Where to store the automated backup files.">
                <select className="form-control text-sm">
                  <option value="course">Course backup filearea</option>
                  <option value="directory">Specified directory</option>
                  <option value="both">Course backup filearea and specified directory</option>
                </select>
              </SettingField>

              <SettingField label="Backup directory" help="The directory on the server where automated backups are saved. This directory must be writable by the web server user.">
                <input type="text" className="form-control text-sm" placeholder="/var/moodledata/backups" />
              </SettingField>

              <SettingField label="Delete backups older than" help="Delete automated backups older than the specified number of days.">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue={0} min={0} />
                  <span className="text-sm text-[var(--text-muted)]">days (0 = never delete)</span>
                </div>
              </SettingField>

              <SettingField label="Minimum number of backups kept" help="If old backups are being deleted, the minimum number of backups that will always be kept regardless of their age.">
                <input type="number" className="form-control text-sm w-24" defaultValue={1} min={0} />
              </SettingField>

              <SettingField label="Keep number of backups" help="The maximum number of backup files to keep per course. Oldest files are deleted first. Set to 0 for unlimited.">
                <input type="number" className="form-control text-sm w-24" defaultValue={1} min={0} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Course selection" defaultOpen={false}>
              <SettingField label="Skip hidden courses" help="Whether to skip courses that are hidden from students.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Skip courses not modified since" help="Skip courses that have not been modified in the specified number of days. Set to 0 to back up all courses.">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue={0} min={0} />
                  <span className="text-sm text-[var(--text-muted)]">days (0 = back up all courses)</span>
                </div>
              </SettingField>

              <SettingField label="Skip courses with a size bigger than" help="Skip courses with a total file size larger than the specified amount. Set to 0 to back up all courses.">
                <select className="form-control text-sm">
                  <option value="0">No limit</option>
                  <option value="104857600">100 MB</option>
                  <option value="268435456">256 MB</option>
                  <option value="536870912">512 MB</option>
                  <option value="1073741824">1 GB</option>
                  <option value="2147483648">2 GB</option>
                  <option value="5368709120">5 GB</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Backup contents" defaultOpen={false}>
              <p className="text-sm text-[var(--text-muted)]">
                Configure what is included in automated backups. These settings mirror the general backup defaults.
              </p>

              <SettingField label="Include enrolled users" help="Include enrolled user data in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include user role assignments" help="Include user role assignments in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include activities and resources" help="Include activities and resources in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include blocks" help="Include blocks in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include files" help="Include files in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include filters" help="Include activity filters in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include comments" help="Include user comments in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include badges" help="Include badges in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include calendar events" help="Include course calendar events in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include user completion details" help="Include activity completion details in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include logs" help="Include course logs in automated backups.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Include grade history" help="Include grade history in automated backups.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Include question bank" help="Include the question bank in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include groups and groupings" help="Include groups and groupings in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include competencies" help="Include course competencies in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include content bank content" help="Include content bank content in automated backups.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include custom fields" help="Include course custom fields in automated backups.">
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
