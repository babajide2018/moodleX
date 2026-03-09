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

export default function PolicySettingsPage() {
  return (
    <>
      <PageHeader
        title="Policy settings"
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
            <SettingsSection title="Site policies">
              <SettingField label="Site policy URL" help="URL of the site policy that all users must agree to. Leave blank to disable.">
                <input type="url" className="form-control text-sm" placeholder="https://example.com/policy" />
              </SettingField>

              <SettingField label="Site policy URL for guests" help="URL of the site policy that guests must agree to. Leave blank to use the main site policy URL.">
                <input type="url" className="form-control text-sm" placeholder="https://example.com/guest-policy" />
              </SettingField>

              <SettingField label="Policy handler" help="The plugin that handles site policy management.">
                <select className="form-control text-sm">
                  <option value="">Core (URL-based)</option>
                  <option value="tool_policy">Policies plugin (tool_policy)</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Terms of service" defaultOpen={false}>
              <SettingField label="Require terms acceptance" help="Require users to accept terms of service before using the site.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Terms of service content" help="Enter the terms of service text that users must agree to.">
                <textarea
                  className="form-control text-sm"
                  rows={6}
                  defaultValue="By using this site, you agree to comply with all applicable rules and policies. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
                />
              </SettingField>

              <SettingField label="Terms version" help="Increment this to force all users to re-accept the terms.">
                <input type="number" className="form-control text-sm w-24" defaultValue={1} min={1} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Consent settings" defaultOpen={false}>
              <SettingField label="Age of digital consent" help="The age at which digital consent can be given by the user. Below this age, parental consent is required.">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-20" defaultValue={16} min={13} max={18} />
                  <span className="text-xs text-[var(--text-muted)]">years</span>
                </div>
              </SettingField>

              <SettingField label="Allow minor accounts" help="Allow users under the age of digital consent to create accounts.">
                <select className="form-control text-sm">
                  <option value="0">No - Do not allow minor accounts</option>
                  <option value="1">Yes - Require parental consent</option>
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
