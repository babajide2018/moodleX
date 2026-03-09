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

export default function SupportContactPage() {
  const [supportName, setSupportName] = useState('Support');
  const [supportEmail, setSupportEmail] = useState('support@example.com');
  const [supportPage, setSupportPage] = useState('');

  return (
    <>
      <PageHeader
        title="Support contact"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Support contact' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            <SettingsSection title="Support contact">
              <SettingField label="Support name" help="The name of the person or organization providing support.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  placeholder="Support"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  The name displayed in emails sent to users from the support contact.
                </p>
              </SettingField>

              <SettingField label="Support email" help="The email address for user support requests.">
                <input
                  type="email"
                  className="form-control text-sm"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@example.com"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  This email address is used in emails sent to users who need support. Leave empty to disable the link to support.
                </p>
              </SettingField>

              <SettingField label="Support page" help="A URL for a custom support page.">
                <input
                  type="url"
                  className="form-control text-sm"
                  value={supportPage}
                  onChange={(e) => setSupportPage(e.target.value)}
                  placeholder="https://support.example.com"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  If set, this URL will be used instead of the built-in support form. Users will be directed to this page when they click &quot;Contact site support&quot;.
                </p>
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
