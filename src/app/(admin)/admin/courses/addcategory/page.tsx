'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

function SettingField({ label, help, required, children }: { label: string; help?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
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

export default function AddCategoryPage() {
  return (
    <>
      <PageHeader
        title="Add a new category"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Manage courses and categories' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="General">
              <SettingField label="Parent category" help="The category under which this new category will appear.">
                <select className="form-control text-sm">
                  <option value="0">Top</option>
                  <option value="1">Miscellaneous</option>
                  <option value="2">Science</option>
                  <option value="3">&nbsp;&nbsp;Biology</option>
                  <option value="4">Mathematics</option>
                  <option value="5">Arts &amp; Humanities</option>
                </select>
              </SettingField>

              <SettingField label="Category name" required help="The name of the new category.">
                <input type="text" className="form-control text-sm" placeholder="e.g. Computer Science" />
              </SettingField>

              <SettingField label="Category ID number" help="An optional ID number used for matching with external systems. It is not displayed anywhere.">
                <input type="text" className="form-control text-sm" placeholder="" />
              </SettingField>

              <SettingField label="Description" help="An optional description of the category.">
                <textarea className="form-control text-sm" rows={5} placeholder="Enter a description for this category..." />
              </SettingField>
            </SettingsSection>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm">Create category</button>
              <button type="button" className="btn btn-secondary text-sm" onClick={() => window.history.back()}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
