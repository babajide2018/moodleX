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

export default function CaptchaSettingsPage() {
  const [captchaType, setCaptchaType] = useState('none');

  return (
    <>
      <PageHeader
        title="CAPTCHA settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security', href: '/admin/security' },
          { label: 'Anti-spam' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="CAPTCHA type">
              <SettingField label="CAPTCHA type" help="Select the CAPTCHA service to use for form protection against automated submissions.">
                <select
                  className="form-control text-sm"
                  value={captchaType}
                  onChange={(e) => setCaptchaType(e.target.value)}
                >
                  <option value="none">None (CAPTCHA disabled)</option>
                  <option value="recaptchav2">reCAPTCHA v2 (checkbox)</option>
                  <option value="recaptchav3">reCAPTCHA v3 (invisible / score-based)</option>
                  <option value="hcaptcha">hCaptcha</option>
                  <option value="turnstile">Cloudflare Turnstile</option>
                </select>
              </SettingField>

              {captchaType === 'none' && (
                <div className="p-3 bg-[var(--bg-light)] rounded-md text-sm text-[var(--text-muted)] border border-[var(--border-color)]">
                  CAPTCHA is currently disabled. Forms such as registration and login will not be protected from automated spam.
                </div>
              )}
            </SettingsSection>

            {captchaType !== 'none' && (
              <>
                <SettingsSection title="API keys">
                  <SettingField
                    label="Site key"
                    help={`The public site key provided by your ${captchaType === 'recaptchav2' || captchaType === 'recaptchav3' ? 'Google reCAPTCHA' : captchaType === 'hcaptcha' ? 'hCaptcha' : 'Cloudflare Turnstile'} account.`}
                  >
                    <input type="text" className="form-control text-sm" placeholder="Enter site key" />
                  </SettingField>

                  <SettingField
                    label="Secret key"
                    help={`The secret key used for server-side verification from your ${captchaType === 'recaptchav2' || captchaType === 'recaptchav3' ? 'Google reCAPTCHA' : captchaType === 'hcaptcha' ? 'hCaptcha' : 'Cloudflare Turnstile'} account.`}
                  >
                    <input type="password" className="form-control text-sm" placeholder="Enter secret key" />
                  </SettingField>

                  <SettingField label="Verification URL" help="The API endpoint used to verify CAPTCHA responses. Usually auto-configured based on CAPTCHA type.">
                    <input
                      type="url"
                      className="form-control text-sm font-mono"
                      defaultValue={
                        captchaType === 'recaptchav2' || captchaType === 'recaptchav3'
                          ? 'https://www.google.com/recaptcha/api/siteverify'
                          : captchaType === 'hcaptcha'
                          ? 'https://hcaptcha.com/siteverify'
                          : 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
                      }
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">Only change this if you are using a custom proxy or endpoint.</p>
                  </SettingField>
                </SettingsSection>

                {captchaType === 'recaptchav3' && (
                  <SettingsSection title="reCAPTCHA v3 settings">
                    <SettingField label="Score threshold" help="Minimum score (0.0 to 1.0) required to pass verification. A score of 1.0 is very likely a human, 0.0 is very likely a bot. Recommended: 0.5.">
                      <input
                        type="number"
                        className="form-control text-sm"
                        defaultValue={0.5}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <p className="text-xs text-[var(--text-muted)] mt-1">0.0 = most permissive (accepts bots), 1.0 = most strict (may reject humans). Recommended: 0.5</p>
                    </SettingField>

                    <SettingField label="Action name" help="A label to identify this CAPTCHA action in the reCAPTCHA admin console.">
                      <input type="text" className="form-control text-sm" defaultValue="moodle_form" />
                    </SettingField>
                  </SettingsSection>
                )}

                <SettingsSection title="Usage settings" defaultOpen={false}>
                  <SettingField label="Enable on login form" help="Show CAPTCHA on the login page.">
                    <select className="form-control text-sm">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </SettingField>

                  <SettingField label="Enable on signup form" help="Show CAPTCHA on the user registration page.">
                    <select className="form-control text-sm">
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </SettingField>

                  <SettingField label="Enable on forgot password form" help="Show CAPTCHA on the forgotten password page.">
                    <select className="form-control text-sm">
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </SettingField>

                  <SettingField label="Enable on contact form" help="Show CAPTCHA on public contact forms.">
                    <select className="form-control text-sm">
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </SettingField>
                </SettingsSection>
              </>
            )}

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
