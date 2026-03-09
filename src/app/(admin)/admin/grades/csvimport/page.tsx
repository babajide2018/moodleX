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

export default function CSVImportSettingsPage() {
  return (
    <>
      <PageHeader
        title="CSV import settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades', href: '/admin/grades' },
          { label: 'Grade import/export' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="CSV import settings">
              <SettingField label="Separator" help="The character used to separate fields in the CSV file.">
                <select className="form-control text-sm">
                  <option value="comma">Comma (,)</option>
                  <option value="semicolon">Semicolon (;)</option>
                  <option value="colon">Colon (:)</option>
                  <option value="tab">Tab</option>
                </select>
              </SettingField>

              <SettingField label="Encoding" help="The character encoding of the CSV file.">
                <select className="form-control text-sm">
                  <option value="UTF-8">UTF-8</option>
                  <option value="ASCII">ASCII</option>
                  <option value="ISO-8859-1">ISO-8859-1</option>
                  <option value="Windows-1252">Windows-1252</option>
                  <option value="EUC-JP">EUC-JP</option>
                  <option value="SHIFT-JIS">SHIFT-JIS</option>
                </select>
              </SettingField>

              <SettingField label="Preview rows" help="Number of rows to preview when importing grades.">
                <select className="form-control text-sm">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </SettingField>

              <SettingField label="Verbose scales" help="When importing scales, use the full scale name rather than the scale value.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Mapping defaults" defaultOpen={false}>
              <SettingField label="Map from" help="Default field to match imported data to users.">
                <select className="form-control text-sm">
                  <option value="email">Email address</option>
                  <option value="username">Username</option>
                  <option value="idnumber">ID number</option>
                </select>
              </SettingField>

              <SettingField label="Force import" help="If enabled, existing grades will be overwritten during import.">
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
