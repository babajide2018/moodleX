'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Save, Eye, EyeOff } from 'lucide-react';

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

export default function IncomingMailPage() {
  const [mailServerType, setMailServerType] = useState('imap');
  const [mailServer, setMailServer] = useState('');
  const [mailPort, setMailPort] = useState('993');
  const [mailUser, setMailUser] = useState('');
  const [mailPass, setMailPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mailFolder, setMailFolder] = useState('INBOX');
  const [mailSecurity, setMailSecurity] = useState('ssl');
  const [mailValidateCert, setMailValidateCert] = useState(true);

  return (
    <>
      <PageHeader
        title="Incoming mail configuration"
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
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-800">
              Incoming mail allows the system to process emails sent to specific addresses and route them to the appropriate handlers (e.g., forum replies via email).
            </div>

            <SettingsSection title="Mail server configuration">
              <SettingField label="Mail server type" help="Choose the type of mail server protocol to use.">
                <select
                  className="form-control text-sm"
                  value={mailServerType}
                  onChange={(e) => setMailServerType(e.target.value)}
                >
                  <option value="imap">IMAP</option>
                  <option value="pop3">POP3</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  IMAP is recommended as it allows more flexibility in managing messages on the server.
                </p>
              </SettingField>

              <SettingField label="Server" help="The hostname or IP address of the mail server.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={mailServer}
                  onChange={(e) => setMailServer(e.target.value)}
                  placeholder="imap.example.com"
                />
              </SettingField>

              <SettingField label="Port" help="The port number of the mail server.">
                <input
                  type="number"
                  className="form-control text-sm w-32"
                  value={mailPort}
                  onChange={(e) => setMailPort(e.target.value)}
                  min="1"
                  max="65535"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Common ports: IMAP (143), IMAPS (993), POP3 (110), POP3S (995)
                </p>
              </SettingField>

              <SettingField label="Security" help="Choose the type of security used for the connection.">
                <select
                  className="form-control text-sm"
                  value={mailSecurity}
                  onChange={(e) => setMailSecurity(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="ssl">SSL/TLS</option>
                  <option value="tls">STARTTLS</option>
                </select>
              </SettingField>

              <SettingField label="Validate certificate" help="Whether to validate the SSL certificate of the mail server.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={mailValidateCert}
                    onChange={(e) => setMailValidateCert(e.target.checked)}
                  />
                  <span className="text-sm">Validate SSL certificate</span>
                </label>
              </SettingField>

              <SettingField label="Username" help="The username used to connect to the mail server.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={mailUser}
                  onChange={(e) => setMailUser(e.target.value)}
                  placeholder="user@example.com"
                  autoComplete="off"
                />
              </SettingField>

              <SettingField label="Password" help="The password used to connect to the mail server.">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control text-sm pr-10"
                    value={mailPass}
                    onChange={(e) => setMailPass(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-link)]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </SettingField>

              <SettingField label="Folder" help="The mailbox folder to check for incoming messages.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={mailFolder}
                  onChange={(e) => setMailFolder(e.target.value)}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Default: INBOX. Only applicable for IMAP connections.
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
