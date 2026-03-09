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

export default function OutgoingMailPage() {
  const [smtpHosts, setSmtpHosts] = useState('');
  const [smtpSecurity, setSmtpSecurity] = useState('none');
  const [smtpPort, setSmtpPort] = useState('25');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [noReplyAddress, setNoReplyAddress] = useState('noreply@example.com');
  const [charset, setCharset] = useState('UTF-8');
  const [envelopeSender, setEnvelopeSender] = useState('');
  const [smtpMaxBulk, setSmtpMaxBulk] = useState('10');

  return (
    <>
      <PageHeader
        title="Outgoing mail configuration"
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
            <SettingsSection title="SMTP settings">
              <SettingField label="SMTP hosts" help="Enter the SMTP server hostname, e.g. mail.example.com or smtp.gmail.com">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={smtpHosts}
                  onChange={(e) => setSmtpHosts(e.target.value)}
                  placeholder="mail.example.com"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Give the full hostname of the SMTP server. If using a non-default port, use the format host:port (e.g., smtp.example.com:587). Separate multiple hosts with semicolons.
                </p>
              </SettingField>

              <SettingField label="SMTP security" help="Choose the type of security used for SMTP connections.">
                <select
                  className="form-control text-sm"
                  value={smtpSecurity}
                  onChange={(e) => setSmtpSecurity(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="ssl">SSL</option>
                  <option value="tls">TLS</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  TLS is recommended if your SMTP server supports it.
                </p>
              </SettingField>

              <SettingField label="SMTP port" help="Specify the port if different from the security default (25 for none, 465 for SSL, 587 for TLS).">
                <input
                  type="number"
                  className="form-control text-sm w-32"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  min="1"
                  max="65535"
                />
              </SettingField>

              <SettingField label="SMTP username" help="Enter a username if your SMTP server requires authentication.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="Optional"
                  autoComplete="off"
                />
              </SettingField>

              <SettingField label="SMTP password" help="Enter the password for SMTP authentication.">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control text-sm pr-10"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Optional"
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

              <SettingField label="SMTP max bulk per message" help="Maximum number of recipients per SMTP message.">
                <input
                  type="number"
                  className="form-control text-sm w-32"
                  value={smtpMaxBulk}
                  onChange={(e) => setSmtpMaxBulk(e.target.value)}
                  min="1"
                />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="General email settings">
              <SettingField label="No-reply address" help="Email address used in the 'From' field when no reply is expected.">
                <input
                  type="email"
                  className="form-control text-sm"
                  value={noReplyAddress}
                  onChange={(e) => setNoReplyAddress(e.target.value)}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Emails are sent from this address when no specific reply-to address is needed. This should be an address that is not monitored.
                </p>
              </SettingField>

              <SettingField label="Email character set" help="The character set to use in outgoing email.">
                <select
                  className="form-control text-sm"
                  value={charset}
                  onChange={(e) => setCharset(e.target.value)}
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="ISO-8859-1">ISO-8859-1</option>
                  <option value="Windows-1252">Windows-1252</option>
                </select>
              </SettingField>

              <SettingField label="Envelope sender" help="If set, this address is used as the envelope sender (Return-Path) header on outgoing mail.">
                <input
                  type="email"
                  className="form-control text-sm"
                  value={envelopeSender}
                  onChange={(e) => setEnvelopeSender(e.target.value)}
                  placeholder="Optional - leave empty to use noreply address"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Bounce notifications will be sent to this address. Leave empty if you are not sure.
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
