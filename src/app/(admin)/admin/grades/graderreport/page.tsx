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

export default function GraderReportSettingsPage() {
  return (
    <>
      <PageHeader
        title="Grader report settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades', href: '/admin/grades' },
          { label: 'Grade reports' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Show averages" help="Show column averages in the grader report.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Quick grading" help="Allow grading directly in the grader report.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show quick feedback" help="Add a text input column for each grade for quick feedback.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Students per page" help="The number of students to display per page in the grader report.">
                <input type="number" className="form-control text-sm" defaultValue={20} min={1} max={500} />
              </SettingField>

              <SettingField label="Aggregation position" help="Whether the category and course total columns are displayed first or last.">
                <select className="form-control text-sm">
                  <option value="first">First</option>
                  <option value="last">Last</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Show/hide toggles" defaultOpen={false}>
              <SettingField label="Show calculations" help="Show whether a grade item has a calculation, indicated with a calculator icon.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Show icons" help="Show grade editing icons next to each grade.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Show locks" help="Show whether a grade item is locked.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Show user pictures" help="Display user profile pictures in the grader report.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Show activity icons" help="Show activity icons next to activity names.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Show ranges" help="Show the range row in the grader report.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Special rows" defaultOpen={false}>
              <SettingField label="Averages include all grades" help="Whether averages should include all grade entries or only those visible to students.">
                <select className="form-control text-sm">
                  <option value="0">Non-empty grades only</option>
                  <option value="1">All grades</option>
                </select>
              </SettingField>

              <SettingField label="Show number of grades in averages" help="Display the number of grades used to calculate each average in brackets.">
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
