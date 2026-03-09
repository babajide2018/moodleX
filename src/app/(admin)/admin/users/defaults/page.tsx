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

export default function UserDefaultPreferencesPage() {
  return (
    <>
      <PageHeader
        title="User default preferences"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Email settings">
              <SettingField label="Email format" help="Default email format for new users.">
                <select className="form-control text-sm">
                  <option value="1">HTML format</option>
                  <option value="0">Plain text format</option>
                </select>
              </SettingField>

              <SettingField label="Email digest type" help="How daily email digests are sent.">
                <select className="form-control text-sm">
                  <option value="0">No digest (single email per forum post)</option>
                  <option value="1">Complete (daily email with full posts)</option>
                  <option value="2">Subjects (daily email with subjects only)</option>
                </select>
              </SettingField>

              <SettingField label="Automatic email subscribe" help="Automatically subscribe users to forums when they post.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Forum preferences" defaultOpen={false}>
              <SettingField label="Forum tracking" help="Default forum tracking setting for new users.">
                <select className="form-control text-sm">
                  <option value="1">Yes: highlight new posts</option>
                  <option value="0">No: don&apos;t keep track of posts</option>
                </select>
              </SettingField>

              <SettingField label="Forum display mode" help="How forum discussions are displayed.">
                <select className="form-control text-sm">
                  <option value="1">Display replies flat, with oldest first</option>
                  <option value="-1">Display replies flat, with newest first</option>
                  <option value="2">Display replies in threaded form</option>
                  <option value="3">Display replies in nested form</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Editor preferences" defaultOpen={false}>
              <SettingField label="Text editor" help="Default text editor for new users.">
                <select className="form-control text-sm">
                  <option value="atto">Atto HTML editor</option>
                  <option value="tinymce">TinyMCE HTML editor</option>
                  <option value="textarea">Plain text area</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Notification preferences" defaultOpen={false}>
              <SettingField label="Default notification method" help="Preferred notification delivery method.">
                <select className="form-control text-sm">
                  <option value="popup">Web (popup)</option>
                  <option value="email">Email</option>
                  <option value="both">Both web and email</option>
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
