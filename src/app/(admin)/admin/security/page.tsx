'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Save,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Globe,
  Key,
  MonitorSmartphone,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bot,
} from 'lucide-react';
import { adminTabs } from '@/lib/admin-tabs';

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

function SettingField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
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

interface SecurityCheck {
  label: string;
  status: 'ok' | 'warning' | 'critical';
  detail: string;
}

const securityOverview: SecurityCheck[] = [
  { label: 'HTTPS enabled', status: 'ok', detail: 'All traffic is encrypted via HTTPS' },
  { label: 'Password policy', status: 'ok', detail: 'Strong password policy enforced' },
  { label: 'Admin account security', status: 'ok', detail: 'Default admin password has been changed' },
  { label: 'Session handling', status: 'ok', detail: 'Sessions expire after 2 hours of inactivity' },
  { label: 'Secure cookies', status: 'ok', detail: 'Cookies are sent over HTTPS only' },
  { label: 'Debug mode', status: 'ok', detail: 'Debug messages are hidden from users' },
  { label: 'Register globals', status: 'ok', detail: 'Global variable registration is disabled' },
  { label: 'Open user profiles', status: 'warning', detail: 'User profiles are accessible to all authenticated users' },
  { label: 'Cron password', status: 'warning', detail: 'Cron script is not password protected' },
  { label: 'XSS trusted users', status: 'ok', detail: 'No extra users have unfiltered content permission' },
  { label: 'Backup auto-deletion', status: 'warning', detail: 'Old backups are not automatically deleted' },
  { label: 'Anti-virus scanner', status: 'critical', detail: 'No anti-virus scanner configured for file uploads' },
];

export default function AdminSecurityPage() {
  // Password policy
  const [passwordEnabled, setPasswordEnabled] = useState(true);
  const [minLength, setMinLength] = useState('8');
  const [requireDigits, setRequireDigits] = useState(true);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireSpecial, setRequireSpecial] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [maxConsecutiveIdentical, setMaxConsecutiveIdentical] = useState('3');
  const [passwordRotation, setPasswordRotation] = useState('0');

  // IP blocker
  const [allowedIPs, setAllowedIPs] = useState<string[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<string[]>(['10.0.0.200', '192.168.1.250']);
  const [newAllowedIP, setNewAllowedIP] = useState('');
  const [newBlockedIP, setNewBlockedIP] = useState('');

  // HTTP security
  const [forceHTTPS, setForceHTTPS] = useState(true);
  const [secureCookies, setSecureCookies] = useState(true);
  const [strictTransportSecurity, setStrictTransportSecurity] = useState(true);
  const [frameEmbedding, setFrameEmbedding] = useState('deny');
  const [contentTypeNosniff, setContentTypeNosniff] = useState(true);
  const [referrerPolicy, setReferrerPolicy] = useState('strict-origin-when-cross-origin');

  // Session handling
  const [sessionTimeout, setSessionTimeout] = useState('7200');
  const [sessionIPValidation, setSessionIPValidation] = useState(false);
  const [cookiePrefix, setCookiePrefix] = useState('MoodleSession');
  const [logoutRedirect, setLogoutRedirect] = useState('');

  // CAPTCHA
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const [captchaType, setCaptchaType] = useState('recaptcha_v2');
  const [captchaSiteKey, setCaptchaSiteKey] = useState('');
  const [captchaSecretKey, setCaptchaSecretKey] = useState('');
  const [captchaOnLogin, setCaptchaOnLogin] = useState(false);
  const [captchaOnSignup, setCaptchaOnSignup] = useState(true);

  const addAllowedIP = () => {
    if (newAllowedIP.trim()) {
      setAllowedIPs([...allowedIPs, newAllowedIP.trim()]);
      setNewAllowedIP('');
    }
  };

  const addBlockedIP = () => {
    if (newBlockedIP.trim()) {
      setBlockedIPs([...blockedIPs, newBlockedIP.trim()]);
      setNewBlockedIP('');
    }
  };

  const removeAllowedIP = (ip: string) => setAllowedIPs(allowedIPs.filter((i) => i !== ip));
  const removeBlockedIP = (ip: string) => setBlockedIPs(blockedIPs.filter((i) => i !== ip));

  const okCount = securityOverview.filter((c) => c.status === 'ok').length;
  const warnCount = securityOverview.filter((c) => c.status === 'warning').length;
  const critCount = securityOverview.filter((c) => c.status === 'critical').length;

  return (
    <>
      <PageHeader
        title="Security settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          <div className="space-y-4">
            {/* Security overview */}
            <SettingsSection title="Site security overview" icon={<Shield size={16} />} defaultOpen={true}>
              <div className="flex items-center gap-4 mb-4">
                <span className="inline-flex items-center gap-1 text-sm text-green-600"><CheckCircle2 size={14} /> {okCount} OK</span>
                <span className="inline-flex items-center gap-1 text-sm text-amber-600"><AlertTriangle size={14} /> {warnCount} Warnings</span>
                <span className="inline-flex items-center gap-1 text-sm text-red-600"><XCircle size={14} /> {critCount} Critical</span>
              </div>
              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold">Check</th>
                      <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Detail</th>
                      <th className="py-2 px-3 text-left font-semibold w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityOverview.map((check) => (
                      <tr key={check.label} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-medium">{check.label}</td>
                        <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{check.detail}</td>
                        <td className="py-2 px-3">
                          {check.status === 'ok' && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                              <ShieldCheck size={12} /> OK
                            </span>
                          )}
                          {check.status === 'warning' && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                              <ShieldAlert size={12} /> Warn
                            </span>
                          )}
                          {check.status === 'critical' && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">
                              <ShieldX size={12} /> Critical
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            {/* Password policy */}
            <SettingsSection title="Password policy" icon={<Key size={16} />}>
              <SettingField label="Password policy" help="Enforce requirements for password complexity">
                <select
                  className="form-control w-32"
                  value={passwordEnabled ? 'yes' : 'no'}
                  onChange={(e) => setPasswordEnabled(e.target.value === 'yes')}
                >
                  <option value="yes">Enabled</option>
                  <option value="no">Disabled</option>
                </select>
              </SettingField>
              {passwordEnabled && (
                <>
                  <SettingField label="Minimum length" help="Minimum number of characters required">
                    <input
                      type="number"
                      className="form-control w-24"
                      value={minLength}
                      onChange={(e) => setMinLength(e.target.value)}
                      min={4}
                      max={30}
                    />
                  </SettingField>
                  <SettingField label="Require digits" help="Password must contain at least one digit">
                    <select className="form-control w-32" value={requireDigits ? 'yes' : 'no'} onChange={(e) => setRequireDigits(e.target.value === 'yes')}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </SettingField>
                  <SettingField label="Require uppercase" help="Password must contain at least one uppercase letter">
                    <select className="form-control w-32" value={requireUppercase ? 'yes' : 'no'} onChange={(e) => setRequireUppercase(e.target.value === 'yes')}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </SettingField>
                  <SettingField label="Require lowercase" help="Password must contain at least one lowercase letter">
                    <select className="form-control w-32" value={requireLowercase ? 'yes' : 'no'} onChange={(e) => setRequireLowercase(e.target.value === 'yes')}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </SettingField>
                  <SettingField label="Require special characters" help="Password must contain at least one special character (!@#$% etc.)">
                    <select className="form-control w-32" value={requireSpecial ? 'yes' : 'no'} onChange={(e) => setRequireSpecial(e.target.value === 'yes')}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </SettingField>
                  <SettingField label="Max consecutive identical" help="Maximum number of consecutive identical characters">
                    <input
                      type="number"
                      className="form-control w-24"
                      value={maxConsecutiveIdentical}
                      onChange={(e) => setMaxConsecutiveIdentical(e.target.value)}
                      min={0}
                      max={10}
                    />
                  </SettingField>
                  <SettingField label="Password rotation (days)" help="Force password change after this many days (0 to disable)">
                    <select className="form-control w-48" value={passwordRotation} onChange={(e) => setPasswordRotation(e.target.value)}>
                      <option value="0">Disabled</option>
                      <option value="30">Every 30 days</option>
                      <option value="60">Every 60 days</option>
                      <option value="90">Every 90 days</option>
                      <option value="180">Every 180 days</option>
                      <option value="365">Every 365 days</option>
                    </select>
                  </SettingField>
                </>
              )}
            </SettingsSection>

            {/* IP blocker */}
            <SettingsSection title="IP blocker" icon={<Globe size={16} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allowed IPs */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Allowed IP list</h4>
                  <p className="text-xs text-[var(--text-muted)] mb-3">
                    If set, only these IP addresses will be allowed to access the site. Leave empty to allow all.
                  </p>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control text-sm flex-1"
                      placeholder="e.g. 192.168.1.0/24"
                      value={newAllowedIP}
                      onChange={(e) => setNewAllowedIP(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addAllowedIP()}
                    />
                    <button className="btn btn-primary text-sm flex items-center gap-1" onClick={addAllowedIP}>
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  {allowedIPs.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] italic py-2">No allowed IPs configured (all IPs permitted)</p>
                  ) : (
                    <div className="space-y-1">
                      {allowedIPs.map((ip) => (
                        <div key={ip} className="flex items-center justify-between px-3 py-1.5 bg-green-50 border border-green-200 rounded text-xs">
                          <span className="font-mono">{ip}</span>
                          <button onClick={() => removeAllowedIP(ip)} className="text-red-500 hover:text-red-700"><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Blocked IPs */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Blocked IP list</h4>
                  <p className="text-xs text-[var(--text-muted)] mb-3">
                    These IP addresses will be denied access to the site.
                  </p>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control text-sm flex-1"
                      placeholder="e.g. 10.0.0.200"
                      value={newBlockedIP}
                      onChange={(e) => setNewBlockedIP(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addBlockedIP()}
                    />
                    <button className="btn btn-primary text-sm flex items-center gap-1" onClick={addBlockedIP}>
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  {blockedIPs.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] italic py-2">No blocked IPs configured</p>
                  ) : (
                    <div className="space-y-1">
                      {blockedIPs.map((ip) => (
                        <div key={ip} className="flex items-center justify-between px-3 py-1.5 bg-red-50 border border-red-200 rounded text-xs">
                          <span className="font-mono">{ip}</span>
                          <button onClick={() => removeBlockedIP(ip)} className="text-red-500 hover:text-red-700"><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SettingsSection>

            {/* HTTP security */}
            <SettingsSection title="HTTP security" icon={<Lock size={16} />}>
              <SettingField label="Force HTTPS" help="Redirect all HTTP requests to HTTPS">
                <select className="form-control w-32" value={forceHTTPS ? 'yes' : 'no'} onChange={(e) => setForceHTTPS(e.target.value === 'yes')}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              <SettingField label="Secure cookies" help="Only transmit cookies over secure HTTPS connections">
                <select className="form-control w-32" value={secureCookies ? 'yes' : 'no'} onChange={(e) => setSecureCookies(e.target.value === 'yes')}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              <SettingField label="Strict Transport Security" help="Tell browsers to only use HTTPS for this site">
                <select className="form-control w-32" value={strictTransportSecurity ? 'yes' : 'no'} onChange={(e) => setStrictTransportSecurity(e.target.value === 'yes')}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              <SettingField label="Frame embedding policy" help="Control whether the site can be embedded in iframes">
                <select className="form-control w-48" value={frameEmbedding} onChange={(e) => setFrameEmbedding(e.target.value)}>
                  <option value="deny">Deny all (most secure)</option>
                  <option value="sameorigin">Same origin only</option>
                  <option value="allow">Allow all (not recommended)</option>
                </select>
              </SettingField>
              <SettingField label="Content-Type nosniff" help="Prevent browsers from MIME-type sniffing">
                <select className="form-control w-32" value={contentTypeNosniff ? 'yes' : 'no'} onChange={(e) => setContentTypeNosniff(e.target.value === 'yes')}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              <SettingField label="Referrer policy" help="Control how much referrer information is sent with requests">
                <select className="form-control w-64" value={referrerPolicy} onChange={(e) => setReferrerPolicy(e.target.value)}>
                  <option value="no-referrer">No referrer</option>
                  <option value="no-referrer-when-downgrade">No referrer when downgrade</option>
                  <option value="origin">Origin only</option>
                  <option value="origin-when-cross-origin">Origin when cross-origin</option>
                  <option value="same-origin">Same origin</option>
                  <option value="strict-origin">Strict origin</option>
                  <option value="strict-origin-when-cross-origin">Strict origin when cross-origin</option>
                  <option value="unsafe-url">Unsafe URL (not recommended)</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* Session handling */}
            <SettingsSection title="Session handling" icon={<MonitorSmartphone size={16} />}>
              <SettingField label="Session timeout" help="How long before an inactive session expires">
                <select className="form-control w-48" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}>
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="7200">2 hours</option>
                  <option value="14400">4 hours</option>
                  <option value="28800">8 hours</option>
                  <option value="86400">24 hours</option>
                </select>
              </SettingField>
              <SettingField label="IP address validation" help="Verify that session IP matches the original login IP">
                <select className="form-control w-32" value={sessionIPValidation ? 'yes' : 'no'} onChange={(e) => setSessionIPValidation(e.target.value === 'yes')}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                {sessionIPValidation && (
                  <p className="text-xs text-amber-600 mt-1">
                    Warning: Enabling IP validation may cause issues for users on mobile networks or VPNs.
                  </p>
                )}
              </SettingField>
              <SettingField label="Cookie prefix" help="Prefix used for session cookie names">
                <input
                  type="text"
                  className="form-control w-48 font-mono text-sm"
                  value={cookiePrefix}
                  onChange={(e) => setCookiePrefix(e.target.value)}
                />
              </SettingField>
              <SettingField label="Logout redirect URL" help="Redirect users to this URL after logging out (leave empty for default)">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={logoutRedirect}
                  onChange={(e) => setLogoutRedirect(e.target.value)}
                  placeholder="https://example.com"
                />
              </SettingField>
            </SettingsSection>

            {/* CAPTCHA */}
            <SettingsSection title="CAPTCHA settings" icon={<Bot size={16} />}>
              <SettingField label="Enable CAPTCHA" help="Use CAPTCHA to prevent automated abuse">
                <select className="form-control w-32" value={captchaEnabled ? 'yes' : 'no'} onChange={(e) => setCaptchaEnabled(e.target.value === 'yes')}>
                  <option value="no">Disabled</option>
                  <option value="yes">Enabled</option>
                </select>
              </SettingField>
              {captchaEnabled && (
                <>
                  <SettingField label="CAPTCHA type">
                    <select className="form-control w-48" value={captchaType} onChange={(e) => setCaptchaType(e.target.value)}>
                      <option value="recaptcha_v2">reCAPTCHA v2</option>
                      <option value="recaptcha_v3">reCAPTCHA v3</option>
                      <option value="hcaptcha">hCaptcha</option>
                      <option value="turnstile">Cloudflare Turnstile</option>
                    </select>
                  </SettingField>
                  <SettingField label="Site key" help="The public key from your CAPTCHA provider">
                    <input
                      type="text"
                      className="form-control font-mono text-sm"
                      value={captchaSiteKey}
                      onChange={(e) => setCaptchaSiteKey(e.target.value)}
                      placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    />
                  </SettingField>
                  <SettingField label="Secret key" help="The secret key from your CAPTCHA provider">
                    <input
                      type="password"
                      className="form-control font-mono text-sm"
                      value={captchaSecretKey}
                      onChange={(e) => setCaptchaSecretKey(e.target.value)}
                      placeholder="••••••••••••••••"
                    />
                  </SettingField>
                  <SettingField label="Show on login page" help="Require CAPTCHA on the login page">
                    <select className="form-control w-32" value={captchaOnLogin ? 'yes' : 'no'} onChange={(e) => setCaptchaOnLogin(e.target.value === 'yes')}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </SettingField>
                  <SettingField label="Show on signup page" help="Require CAPTCHA on the self-registration page">
                    <select className="form-control w-32" value={captchaOnSignup ? 'yes' : 'no'} onChange={(e) => setCaptchaOnSignup(e.target.value === 'yes')}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </SettingField>
                </>
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
