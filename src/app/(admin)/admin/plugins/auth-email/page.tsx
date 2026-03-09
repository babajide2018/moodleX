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

export default function AuthEmailSettingsPage() {
  return (
    <>
      <PageHeader
        title="Email-based self-registration"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Authentication', href: '/admin/plugins/auth' },
          { label: 'Email-based self-registration' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Enable reCAPTCHA" help="Add a reCAPTCHA element to the sign-up page to protect against spammers">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  You must configure reCAPTCHA site and secret keys in the security settings first.
                </p>
              </SettingField>
              <SettingField label="reCAPTCHA site key" help="Site key for Google reCAPTCHA">
                <input type="text" className="form-control text-sm" placeholder="Enter reCAPTCHA site key" />
              </SettingField>
              <SettingField label="reCAPTCHA secret key" help="Secret key for Google reCAPTCHA">
                <input type="password" className="form-control text-sm" placeholder="Enter reCAPTCHA secret key" />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Email domains">
              <SettingField label="Allowed email domains" help="Restrict self-registration to email addresses from specific domains. One domain per line.">
                <textarea
                  className="form-control text-sm"
                  rows={4}
                  placeholder={"example.com\nuniversity.edu\nschool.org"}
                  defaultValue=""
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Leave blank to allow all email domains. Enter one domain per line (e.g., example.com).
                </p>
              </SettingField>
              <SettingField label="Denied email domains" help="Prevent self-registration from specific email domains. One domain per line.">
                <textarea
                  className="form-control text-sm"
                  rows={4}
                  placeholder={"tempmail.com\nguerrillamail.com"}
                  defaultValue=""
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Email addresses from these domains will be rejected during registration.
                </p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Instructions">
              <SettingField label="Sign-up instructions" help="Instructions displayed on the sign-up page">
                <textarea
                  className="form-control text-sm"
                  rows={4}
                  defaultValue="Create a new account by filling in the form below. An email will be sent to you with instructions to confirm your account."
                />
              </SettingField>
              <SettingField label="Confirmation email subject" help="Subject line for the confirmation email">
                <input
                  type="text"
                  className="form-control text-sm"
                  defaultValue="{$sitename}: account confirmation"
                />
              </SettingField>
              <SettingField label="Confirmation email body" help="Body text for the confirmation email. Use placeholders: {$fullname}, {$sitename}, {$link}">
                <textarea
                  className="form-control text-sm"
                  rows={6}
                  defaultValue={`Hi {$fullname},

A new account has been requested at {$sitename} using your email address.

To confirm your new account, please go to this web address:

{$link}

If you need help, please contact the site administrator.`}
                />
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
