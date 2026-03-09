'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

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
      <button className="w-full flex items-center gap-2 p-4 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors" onClick={() => setOpen(!open)}>
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

export default function AuthManualSettingsPage() {
  return (
    <>
      <PageHeader
        title="Manual accounts"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Authentication', href: '/admin/plugins/auth' },
          { label: 'Manual accounts' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="Expiration settings">
              <SettingField label="Enable password expiry" help="If enabled, user passwords will expire after the specified time period">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Password expiry period" help="Time after which passwords will expire">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="30" />
                  <select className="form-control text-sm w-auto">
                    <option value="days" selected>days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </select>
                </div>
              </SettingField>
              <SettingField label="Password expiry warning" help="Number of days before password expires to show a warning">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="10" />
                  <span className="text-sm text-[var(--text-muted)]">days</span>
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Password generation">
              <SettingField label="Password policy" help="Enforce password complexity requirements">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Minimum password length" help="Minimum number of characters required">
                <input type="number" className="form-control text-sm w-24" defaultValue="8" min="1" />
              </SettingField>
              <SettingField label="Require digits" help="Minimum number of digit characters required">
                <input type="number" className="form-control text-sm w-24" defaultValue="1" min="0" />
              </SettingField>
              <SettingField label="Require lowercase" help="Minimum number of lowercase characters required">
                <input type="number" className="form-control text-sm w-24" defaultValue="1" min="0" />
              </SettingField>
              <SettingField label="Require uppercase" help="Minimum number of uppercase characters required">
                <input type="number" className="form-control text-sm w-24" defaultValue="1" min="0" />
              </SettingField>
              <SettingField label="Require non-alphanumeric" help="Minimum number of special characters required">
                <input type="number" className="form-control text-sm w-24" defaultValue="1" min="0" />
              </SettingField>
              <SettingField label="Maximum consecutive identical characters" help="Maximum number of consecutive identical characters. 0 means unlimited.">
                <input type="number" className="form-control text-sm w-24" defaultValue="0" min="0" />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Account creation defaults" defaultOpen={false}>
              <SettingField label="Force password change" help="Force users to change their password on first login">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Default country" help="Default country for new user accounts">
                <select className="form-control text-sm" defaultValue="">
                  <option value="">Select a country...</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IN">India</option>
                  <option value="NG">Nigeria</option>
                </select>
              </SettingField>
              <SettingField label="Default timezone" help="Default timezone for new user accounts">
                <select className="form-control text-sm" defaultValue="99">
                  <option value="99">Server timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </select>
              </SettingField>
            </SettingsSection>

            <div className="flex items-center gap-3 pt-2">
              <button type="button" className="btn btn-primary text-sm">Save changes</button>
              <button type="button" className="btn text-sm border border-[var(--border-color)]">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
