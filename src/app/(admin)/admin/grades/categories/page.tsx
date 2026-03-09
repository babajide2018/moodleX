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

export default function GradeCategorySettingsPage() {
  return (
    <>
      <PageHeader
        title="Grade category settings"
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
            <SettingsSection title="Default grade category settings">
              <SettingField label="Aggregation" help="The aggregation determines how grades in a category are combined.">
                <select className="form-control text-sm">
                  <option value="mean">Mean of grades</option>
                  <option value="weighted_mean">Weighted mean of grades</option>
                  <option value="simple_weighted_mean">Simple weighted mean of grades</option>
                  <option value="mean_extra_credit">Mean of grades (with extra credits)</option>
                  <option value="median">Median of grades</option>
                  <option value="lowest">Lowest grade</option>
                  <option value="highest">Highest grade</option>
                  <option value="mode">Mode of grades</option>
                  <option value="natural">Natural</option>
                </select>
              </SettingField>

              <SettingField label="Aggregate only non-empty grades" help="Empty grades are not aggregated.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Include outcomes in aggregation" help="If enabled, outcomes are included in the aggregation.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Keep and drop settings" defaultOpen={false}>
              <SettingField label="Keep the highest" help="If set, only the specified number of highest grades will be kept.">
                <input type="number" className="form-control text-sm" defaultValue={0} min={0} />
              </SettingField>

              <SettingField label="Drop the lowest" help="If set, the specified number of lowest grades will be dropped.">
                <input type="number" className="form-control text-sm" defaultValue={0} min={0} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Force settings" defaultOpen={false}>
              <SettingField label="Force aggregation" help="If enabled, the aggregation type cannot be changed at the course level.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force keep highest" help="If enabled, the keep highest setting cannot be changed at the course level.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Force drop lowest" help="If enabled, the drop lowest setting cannot be changed at the course level.">
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
