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

export default function PasswordPolicyPage() {
  return (
    <>
      <PageHeader
        title="Password policy"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security', href: '/admin/security' },
          { label: 'Password policy' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Password complexity">
              <SettingField label="Password policy enabled" help="Enable enforcement of password complexity rules for all users.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Minimum length" help="Minimum number of characters required in a password.">
                <input type="number" className="form-control text-sm" defaultValue={8} min={1} max={50} />
              </SettingField>

              <SettingField label="Require digits" help="Minimum number of digit characters (0-9) required.">
                <input type="number" className="form-control text-sm" defaultValue={1} min={0} max={10} />
              </SettingField>

              <SettingField label="Require lowercase" help="Minimum number of lowercase characters (a-z) required.">
                <input type="number" className="form-control text-sm" defaultValue={1} min={0} max={10} />
              </SettingField>

              <SettingField label="Require uppercase" help="Minimum number of uppercase characters (A-Z) required.">
                <input type="number" className="form-control text-sm" defaultValue={1} min={0} max={10} />
              </SettingField>

              <SettingField label="Require special characters" help="Minimum number of non-alphanumeric characters (e.g. !@#$%) required.">
                <input type="number" className="form-control text-sm" defaultValue={1} min={0} max={10} />
              </SettingField>

              <SettingField label="Max consecutive identical characters" help="Maximum number of consecutive identical characters allowed. 0 means no limit.">
                <input type="number" className="form-control text-sm" defaultValue={0} min={0} max={20} />
                <p className="text-xs text-[var(--text-muted)] mt-1">0 = no limit</p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Password rotation" defaultOpen={false}>
              <SettingField label="Force password change on first login" help="Require users to change their password the first time they log in.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Password expiry (days)" help="Number of days before a password expires and must be changed. 0 means passwords never expire.">
                <input type="number" className="form-control text-sm" defaultValue={0} min={0} max={365} />
                <p className="text-xs text-[var(--text-muted)] mt-1">0 = passwords never expire</p>
              </SettingField>

              <SettingField label="Password history count" help="Number of previous passwords that cannot be reused. 0 means no history is kept.">
                <input type="number" className="form-control text-sm" defaultValue={0} min={0} max={25} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Account lockout" defaultOpen={false}>
              <SettingField label="Lockout enabled" help="Enable locking user accounts after repeated failed login attempts.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Lockout threshold" help="Number of failed login attempts before the account is locked.">
                <input type="number" className="form-control text-sm" defaultValue={5} min={1} max={100} />
              </SettingField>

              <SettingField label="Lockout duration (minutes)" help="How long an account remains locked after reaching the threshold. 0 means manual unlock only.">
                <input type="number" className="form-control text-sm" defaultValue={30} min={0} max={1440} />
                <p className="text-xs text-[var(--text-muted)] mt-1">0 = requires manual unlock by administrator</p>
              </SettingField>

              <SettingField label="Lockout observation window (minutes)" help="Time window in which failed attempts are counted. After this period, the count resets.">
                <input type="number" className="form-control text-sm" defaultValue={30} min={1} max={1440} />
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
