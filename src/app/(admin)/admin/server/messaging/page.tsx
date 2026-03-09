'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Save } from 'lucide-react';

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

export default function MessagingOutputPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [mobileEnabled, setMobileEnabled] = useState(false);
  const [defaultProvider, setDefaultProvider] = useState('email');
  const [allowUserDisable, setAllowUserDisable] = useState(true);
  const [emailFormat, setEmailFormat] = useState('html');
  const [loggedInPref, setLoggedInPref] = useState('popup');
  const [loggedOffPref, setLoggedOffPref] = useState('email');

  return (
    <>
      <PageHeader
        title="Messaging output settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Email' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            <SettingsSection title="Message outputs">
              <SettingField label="Email output" help="Enable or disable email as a message output.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                  />
                  <span className="text-sm">Enable email notifications</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  When enabled, users can receive messages via email based on their notification preferences.
                </p>
              </SettingField>

              <SettingField label="Popup output" help="Enable or disable popup/web notifications.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={popupEnabled}
                    onChange={(e) => setPopupEnabled(e.target.checked)}
                  />
                  <span className="text-sm">Enable popup notifications</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Users will see notifications in the web interface via the notification popover.
                </p>
              </SettingField>

              <SettingField label="Mobile output" help="Enable or disable mobile push notifications.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={mobileEnabled}
                    onChange={(e) => setMobileEnabled(e.target.checked)}
                  />
                  <span className="text-sm">Enable mobile push notifications</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Requires the Moodle mobile app to be configured and registered.
                </p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Default preferences">
              <SettingField label="Default notification provider" help="The default message output when a user has not set preferences.">
                <select
                  className="form-control text-sm"
                  value={defaultProvider}
                  onChange={(e) => setDefaultProvider(e.target.value)}
                >
                  <option value="email">Email</option>
                  <option value="popup">Popup</option>
                  <option value="mobile">Mobile</option>
                </select>
              </SettingField>

              <SettingField label="When user is logged in" help="Default output when the user is currently online.">
                <select
                  className="form-control text-sm"
                  value={loggedInPref}
                  onChange={(e) => setLoggedInPref(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="popup">Popup only</option>
                  <option value="email">Email only</option>
                  <option value="both">Both popup and email</option>
                </select>
              </SettingField>

              <SettingField label="When user is logged off" help="Default output when the user is offline.">
                <select
                  className="form-control text-sm"
                  value={loggedOffPref}
                  onChange={(e) => setLoggedOffPref(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="popup">Popup only</option>
                  <option value="email">Email only</option>
                  <option value="both">Both popup and email</option>
                </select>
              </SettingField>

              <SettingField label="Allow users to disable" help="Allow users to disable specific notification outputs.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={allowUserDisable}
                    onChange={(e) => setAllowUserDisable(e.target.checked)}
                  />
                  <span className="text-sm">Users can disable notification outputs</span>
                </label>
              </SettingField>

              <SettingField label="Email format" help="The default format for email notifications.">
                <select
                  className="form-control text-sm"
                  value={emailFormat}
                  onChange={(e) => setEmailFormat(e.target.value)}
                >
                  <option value="html">HTML</option>
                  <option value="plain">Plain text</option>
                </select>
              </SettingField>
            </SettingsSection>

            <div className="flex justify-end">
              <button className="btn btn-primary text-sm flex items-center gap-2">
                <Save size={16} />
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
