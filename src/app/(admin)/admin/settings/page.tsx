'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  Save,
  Globe,
  Shield,
  Palette,
  Mail,
  Database,
  Server,
  Clock,
  Upload,
  ChevronDown,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SettingsSection({ title, icon, defaultOpen = false, children }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-left bg-[var(--bg-light)] hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="text-[var(--text-muted)]">{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-[var(--border-color)]">
          {children}
        </div>
      )}
    </div>
  );
}

function SettingField({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {help && (
          <span className="text-[var(--text-muted)] cursor-help" title={help}>
            <HelpCircle size={12} />
          </span>
        )}
      </label>
      <div>{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  // Front page settings
  const [siteName, setSiteName] = useState('MoodleX');
  const [shortname, setShortname] = useState('MoodleX');
  const [siteSummary, setSiteSummary] = useState('');
  const [frontpageLoggedIn, setFrontpageLoggedIn] = useState('courseoverview');

  // Security
  const [forceLogin, setForceLogin] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState(true);
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [sessionTimeout, setSessionTimeout] = useState('7200');
  const [cookieSecure, setCookieSecure] = useState(true);

  // Email
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpSecurity, setSmtpSecurity] = useState('tls');
  const [noReplyAddress, setNoReplyAddress] = useState('noreply@example.com');
  const [supportEmail, setSupportEmail] = useState('support@example.com');

  // Appearance
  const [theme, setTheme] = useState('boost');
  const [lang, setLang] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  // Users
  const [selfRegistration, setSelfRegistration] = useState('email');
  const [guestAccess, setGuestAccess] = useState(false);
  const [defaultRole, setDefaultRole] = useState('student');

  // Uploads
  const [maxUploadSize, setMaxUploadSize] = useState('104857600');
  const [userQuota, setUserQuota] = useState('524288000');

  return (
    <>
      <PageHeader
        title="Site settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Site settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          <div className="space-y-4">
            {/* Front page */}
            <SettingsSection title="Front page settings" icon={<Globe size={16} />} defaultOpen={true}>
              <SettingField label="Full site name">
                <input
                  type="text"
                  className="form-control"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </SettingField>
              <SettingField label="Short name for site">
                <input
                  type="text"
                  className="form-control w-48"
                  value={shortname}
                  onChange={(e) => setShortname(e.target.value)}
                />
              </SettingField>
              <SettingField label="Front page summary">
                <textarea
                  className="form-control min-h-[100px]"
                  value={siteSummary}
                  onChange={(e) => setSiteSummary(e.target.value)}
                  placeholder="A description shown on the front page..."
                />
              </SettingField>
              <SettingField label="Front page (logged in)" help="What shows on the front page for logged-in users">
                <select
                  className="form-control"
                  value={frontpageLoggedIn}
                  onChange={(e) => setFrontpageLoggedIn(e.target.value)}
                >
                  <option value="courseoverview">Course overview</option>
                  <option value="courselist">List of courses</option>
                  <option value="categories">List of categories</option>
                  <option value="news">News items</option>
                  <option value="none">None</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* Security */}
            <SettingsSection title="Security settings" icon={<Shield size={16} />}>
              <SettingField label="Force users to log in" help="If enabled, the front page requires login">
                <select
                  className="form-control w-32"
                  value={forceLogin ? 'yes' : 'no'}
                  onChange={(e) => setForceLogin(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Password policy" help="Enforce strong password requirements">
                <select
                  className="form-control w-32"
                  value={passwordPolicy ? 'yes' : 'no'}
                  onChange={(e) => setPasswordPolicy(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              {passwordPolicy && (
                <SettingField label="Minimum password length">
                  <input
                    type="number"
                    className="form-control w-24"
                    value={minPasswordLength}
                    onChange={(e) => setMinPasswordLength(e.target.value)}
                    min={4}
                    max={20}
                  />
                </SettingField>
              )}
              <SettingField label="Session timeout" help="How long before an inactive session expires">
                <select
                  className="form-control w-48"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                >
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="7200">2 hours</option>
                  <option value="14400">4 hours</option>
                  <option value="28800">8 hours</option>
                </select>
              </SettingField>
              <SettingField label="Secure cookies only" help="Only send cookies over HTTPS">
                <select
                  className="form-control w-32"
                  value={cookieSecure ? 'yes' : 'no'}
                  onChange={(e) => setCookieSecure(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* Email */}
            <SettingsSection title="Outgoing mail configuration" icon={<Mail size={16} />}>
              <SettingField label="SMTP hosts">
                <input
                  type="text"
                  className="form-control"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="e.g. smtp.gmail.com"
                />
              </SettingField>
              <SettingField label="SMTP port">
                <input
                  type="text"
                  className="form-control w-24"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                />
              </SettingField>
              <SettingField label="SMTP security">
                <select
                  className="form-control w-32"
                  value={smtpSecurity}
                  onChange={(e) => setSmtpSecurity(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="ssl">SSL</option>
                  <option value="tls">TLS</option>
                </select>
              </SettingField>
              <SettingField label="SMTP username">
                <input
                  type="text"
                  className="form-control"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                />
              </SettingField>
              <SettingField label="SMTP password">
                <input type="password" className="form-control" placeholder="••••••••" />
              </SettingField>
              <SettingField label="No-reply address">
                <input
                  type="email"
                  className="form-control"
                  value={noReplyAddress}
                  onChange={(e) => setNoReplyAddress(e.target.value)}
                />
              </SettingField>
              <SettingField label="Support email">
                <input
                  type="email"
                  className="form-control"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </SettingField>
            </SettingsSection>

            {/* Appearance */}
            <SettingsSection title="Appearance" icon={<Palette size={16} />}>
              <SettingField label="Theme">
                <select
                  className="form-control w-48"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="boost">Boost (default)</option>
                  <option value="classic">Classic</option>
                </select>
              </SettingField>
              <SettingField label="Default language">
                <select
                  className="form-control w-48"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="en">English (en)</option>
                  <option value="es">Español (es)</option>
                  <option value="fr">Français (fr)</option>
                  <option value="de">Deutsch (de)</option>
                  <option value="pt_br">Português - Brasil (pt_br)</option>
                </select>
              </SettingField>
              <SettingField label="Default timezone">
                <select
                  className="form-control w-48"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* User policies */}
            <SettingsSection title="User policies" icon={<Shield size={16} />}>
              <SettingField label="Self registration" help="Allow users to register their own accounts">
                <select
                  className="form-control w-48"
                  value={selfRegistration}
                  onChange={(e) => setSelfRegistration(e.target.value)}
                >
                  <option value="disabled">Disabled</option>
                  <option value="email">Email-based self-registration</option>
                </select>
              </SettingField>
              <SettingField label="Guest login button" help="Show a guest login button on the login page">
                <select
                  className="form-control w-32"
                  value={guestAccess ? 'yes' : 'no'}
                  onChange={(e) => setGuestAccess(e.target.value === 'yes')}
                >
                  <option value="no">Hide</option>
                  <option value="yes">Show</option>
                </select>
              </SettingField>
              <SettingField label="Default role" help="Default role assigned to new users">
                <select
                  className="form-control w-48"
                  value={defaultRole}
                  onChange={(e) => setDefaultRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="coursecreator">Course creator</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* File uploads */}
            <SettingsSection title="File handling" icon={<Upload size={16} />}>
              <SettingField label="Maximum upload file size">
                <select
                  className="form-control w-48"
                  value={maxUploadSize}
                  onChange={(e) => setMaxUploadSize(e.target.value)}
                >
                  <option value="10485760">10 MB</option>
                  <option value="52428800">50 MB</option>
                  <option value="104857600">100 MB</option>
                  <option value="262144000">250 MB</option>
                  <option value="524288000">500 MB</option>
                  <option value="1073741824">1 GB</option>
                </select>
              </SettingField>
              <SettingField label="User quota" help="Maximum total size of files a user can store">
                <select
                  className="form-control w-48"
                  value={userQuota}
                  onChange={(e) => setUserQuota(e.target.value)}
                >
                  <option value="104857600">100 MB</option>
                  <option value="524288000">500 MB</option>
                  <option value="1073741824">1 GB</option>
                  <option value="5368709120">5 GB</option>
                  <option value="0">Unlimited</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* Maintenance mode */}
            <SettingsSection title="Maintenance mode" icon={<Server size={16} />}>
              <SettingField label="Maintenance mode" help="When enabled, only admins can access the site">
                <select
                  className="form-control w-32"
                  value={maintenanceMode ? 'yes' : 'no'}
                  onChange={(e) => setMaintenanceMode(e.target.value === 'yes')}
                >
                  <option value="no">Disabled</option>
                  <option value="yes">Enabled</option>
                </select>
              </SettingField>
              {maintenanceMode && (
                <SettingField label="Maintenance message">
                  <textarea
                    className="form-control"
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    placeholder="This site is currently under maintenance. Please check back later."
                  />
                </SettingField>
              )}
            </SettingsSection>

            {/* Save */}
            <div className="flex items-center gap-3 py-4 border-t border-[var(--border-color)]">
              <button className="btn btn-primary flex items-center gap-2">
                <Save size={16} /> Save changes
              </button>
              <Link href="/admin" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
