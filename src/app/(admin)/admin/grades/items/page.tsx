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

export default function GradeItemSettingsPage() {
  return (
    <>
      <PageHeader
        title="Grade item settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades', href: '/admin/grades' },
          { label: 'General settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Grade item display">
              <SettingField label="Grade display type" help="Specifies how grades are displayed in the grader and user reports.">
                <select className="form-control text-sm">
                  <option value="real">Real</option>
                  <option value="percentage">Percentage</option>
                  <option value="letter">Letter</option>
                  <option value="real_percentage">Real (percentage)</option>
                  <option value="real_letter">Real (letter)</option>
                  <option value="letter_real">Letter (real)</option>
                  <option value="letter_percentage">Letter (percentage)</option>
                  <option value="percentage_letter">Percentage (letter)</option>
                  <option value="percentage_real">Percentage (real)</option>
                </select>
              </SettingField>

              <SettingField label="Overall decimal points" help="The number of decimal points to display for each grade.">
                <select className="form-control text-sm">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Advanced grade item options" defaultOpen={false}>
              <SettingField label="Item info" help="Show the item info column in the grade item.">
                <select className="form-control text-sm">
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                </select>
              </SettingField>

              <SettingField label="ID number" help="Show the ID number field in the grade item settings.">
                <select className="form-control text-sm">
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Grade type" help="Specify the grade type used for the grade item.">
                <select className="form-control text-sm">
                  <option value="value">Value</option>
                  <option value="scale">Scale</option>
                  <option value="text">Text</option>
                  <option value="none">None</option>
                </select>
              </SettingField>

              <SettingField label="Maximum grade" help="The maximum grade value for this item.">
                <input type="number" className="form-control text-sm" defaultValue={100} min={0} />
              </SettingField>

              <SettingField label="Minimum grade" help="The minimum grade value for this item.">
                <input type="number" className="form-control text-sm" defaultValue={0} min={0} />
              </SettingField>

              <SettingField label="Hidden" help="Grade items can be hidden from students.">
                <select className="form-control text-sm">
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Locked" help="Locked grade items cannot be changed by activities.">
                <select className="form-control text-sm">
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Weight adjusted" help="Show the weight adjusted option in grade item settings.">
                <select className="form-control text-sm">
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
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
