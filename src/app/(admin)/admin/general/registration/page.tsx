'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

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

const countries = [
  '', 'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh',
  'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia', 'Czech Republic', 'Denmark',
  'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Japan', 'Kenya', 'Malaysia', 'Mexico', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain',
  'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Vietnam',
];

const languages = [
  { value: 'en', label: 'English (en)' },
  { value: 'es', label: 'Spanish (es)' },
  { value: 'fr', label: 'French (fr)' },
  { value: 'de', label: 'German (de)' },
  { value: 'pt', label: 'Portuguese (pt)' },
  { value: 'it', label: 'Italian (it)' },
  { value: 'nl', label: 'Dutch (nl)' },
  { value: 'ja', label: 'Japanese (ja)' },
  { value: 'zh', label: 'Chinese (zh)' },
  { value: 'ar', label: 'Arabic (ar)' },
  { value: 'ru', label: 'Russian (ru)' },
  { value: 'ko', label: 'Korean (ko)' },
  { value: 'hi', label: 'Hindi (hi)' },
];

export default function RegistrationPage() {
  const [registered, setRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    siteUrl: 'http://localhost:3000',
    siteName: 'My Moodle Site',
    siteDescription: '',
    language: 'en',
    country: '',
    adminEmail: 'admin@example.com',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRegistered(true);
    setSubmitting(false);
  };

  return (
    <>
      <PageHeader
        title="Registration"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'General', href: '/admin' },
          { label: 'Site administration' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Registration status */}
          <div
            className={`border rounded-lg p-4 mb-6 flex items-start gap-3 ${
              registered
                ? 'border-green-200 bg-green-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            {registered ? (
              <CheckCircle2 size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="text-sm font-semibold">
                {registered ? 'Site is registered' : 'Site is not registered'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {registered
                  ? 'Your site is registered with Moodle.net. You will receive important security notifications and your site contributes to Moodle usage statistics.'
                  : 'Registering your site with Moodle.net allows you to receive security alerts and helps the Moodle community understand how Moodle is used worldwide.'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-3">
              Moodle.net is a community hub for Moodle sites. Registering your site lets you publish
              and share courses, receive security notifications, and contribute to Moodle usage statistics
              that help the development community prioritise improvements.
            </p>
            <a
              href="#"
              className="text-sm text-[var(--text-link)] hover:underline flex items-center gap-1"
            >
              Learn more about Moodle.net registration <ExternalLink size={12} />
            </a>
          </div>

          {/* Registration form */}
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <SettingsSection title="Site information">
                <SettingField label="Site URL" help="The full URL of your Moodle site">
                  <input
                    type="url"
                    className="form-control text-sm"
                    value={formData.siteUrl}
                    onChange={(e) => handleChange('siteUrl', e.target.value)}
                  />
                </SettingField>

                <SettingField label="Site name" help="The full name of your site, displayed on the front page and in emails">
                  <input
                    type="text"
                    className="form-control text-sm"
                    value={formData.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                  />
                </SettingField>

                <SettingField label="Site description" help="A short summary describing your site and its purpose">
                  <textarea
                    className="form-control text-sm"
                    rows={3}
                    value={formData.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    placeholder="Describe your Moodle site..."
                  />
                </SettingField>

                <SettingField label="Language" help="The primary language used on your site">
                  <select
                    className="form-control text-sm"
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </SettingField>

                <SettingField label="Country" help="The country where your site is primarily based">
                  <select
                    className="form-control text-sm"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                  >
                    <option value="">Select a country...</option>
                    {countries.filter(Boolean).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </SettingField>

                <SettingField label="Admin email" help="The email address of the main site administrator">
                  <input
                    type="email"
                    className="form-control text-sm"
                    value={formData.adminEmail}
                    onChange={(e) => handleChange('adminEmail', e.target.value)}
                  />
                </SettingField>
              </SettingsSection>

              {/* Privacy note */}
              <SettingsSection title="Privacy information" defaultOpen={false}>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-light)] border border-[var(--border-color)]">
                  <ShieldCheck size={20} className="text-[var(--moodle-primary)] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600 space-y-2">
                    <p>
                      <strong>What data is shared when you register:</strong>
                    </p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>Your site URL, name, and description</li>
                      <li>The primary language and country of your site</li>
                      <li>The administrator&apos;s email address (for security notifications only)</li>
                      <li>Your Moodle version and basic server environment information</li>
                      <li>Approximate number of users, courses, and enrolments (aggregated counts only)</li>
                    </ul>
                    <p>
                      <strong>What is NOT shared:</strong>
                    </p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>Personal information about your users (names, emails, grades, etc.)</li>
                      <li>Course content, files, or activities</li>
                      <li>Database credentials or server configuration details</li>
                      <li>Any user-generated content</li>
                    </ul>
                    <p className="mt-2">
                      Your registration data is used only to provide security notifications and to compile
                      anonymous, aggregate usage statistics for the Moodle community. You can unregister
                      at any time.
                    </p>
                  </div>
                </div>
              </SettingsSection>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                className="btn btn-primary text-sm flex items-center gap-2"
                disabled={submitting || registered}
              >
                {submitting ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Registering...
                  </>
                ) : registered ? (
                  <>
                    <CheckCircle2 size={16} /> Registered
                  </>
                ) : (
                  <>
                    <Globe size={16} /> Register with Moodle.net
                  </>
                )}
              </button>
              {registered && (
                <button
                  type="button"
                  className="btn btn-secondary text-sm flex items-center gap-2"
                  onClick={() => {
                    // Simulate sending updated info
                    alert('Registration information updated.');
                  }}
                >
                  <Send size={14} /> Update registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
