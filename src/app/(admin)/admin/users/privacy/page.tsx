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

export default function PrivacySettingsPage() {
  return (
    <>
      <PageHeader
        title="Privacy settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Privacy and policies' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Data retention">
              <SettingField label="Data retention summary" help="A summary of the default retention periods for different categories of data.">
                <div className="border border-[var(--border-color)] rounded p-3 bg-[var(--bg-light)] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span>User accounts</span>
                    <span className="text-[var(--text-muted)]">No retention period set</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Course data</span>
                    <span className="text-[var(--text-muted)]">No retention period set</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activity data</span>
                    <span className="text-[var(--text-muted)]">No retention period set</span>
                  </div>
                </div>
              </SettingField>

              <SettingField label="Default retention period" help="The default retention period to apply when no specific period has been set.">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-20" defaultValue={0} min={0} />
                  <select className="form-control text-sm w-auto">
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                  <span className="text-xs text-[var(--text-muted)]">(0 = no expiry)</span>
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Data requests" defaultOpen={false}>
              <SettingField label="Data request email" help="Email address to send data request notifications.">
                <input type="email" className="form-control text-sm" placeholder="dpo@example.com" />
              </SettingField>

              <SettingField label="Show data request link" help="Show a link for users to make data requests in their profile.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Auto-approve data requests" help="Automatically approve data export requests.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Data export" defaultOpen={false}>
              <SettingField label="Export file format" help="Format for user data exports.">
                <select className="form-control text-sm">
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                </select>
              </SettingField>

              <SettingField label="Export file size limit" help="Maximum size for exported data files.">
                <select className="form-control text-sm">
                  <option value="52428800">50 MB</option>
                  <option value="104857600">100 MB</option>
                  <option value="524288000">500 MB</option>
                  <option value="1073741824">1 GB</option>
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
