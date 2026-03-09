'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Save,
  RotateCcw,
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

const frontPageItems = [
  { value: 'none', label: 'None' },
  { value: 'enrolled', label: 'Enrolled courses' },
  { value: 'news', label: 'News items' },
  { value: 'categories', label: 'List of categories' },
  { value: 'combo', label: 'Combo list (categories and courses)' },
];

export default function FrontPageSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: 'Moodle LMS',
    shortName: 'Moodle',
    siteDescription: '',
    frontPageLoggedIn1: 'enrolled',
    frontPageLoggedIn2: 'news',
    frontPageLoggedIn3: 'none',
    frontPageGuest1: 'categories',
    frontPageGuest2: 'news',
    frontPageGuest3: 'none',
    maxNewsItems: '5',
    topicSection: true,
    commentsOnFrontPage: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Front page settings saved successfully.');
  };

  const handleReset = () => {
    setFormData({
      siteName: 'Moodle LMS',
      shortName: 'Moodle',
      siteDescription: '',
      frontPageLoggedIn1: 'enrolled',
      frontPageLoggedIn2: 'news',
      frontPageLoggedIn3: 'none',
      frontPageGuest1: 'categories',
      frontPageGuest2: 'news',
      frontPageGuest3: 'none',
      maxNewsItems: '5',
      topicSection: true,
      commentsOnFrontPage: false,
    });
  };

  return (
    <>
      <PageHeader
        title="Front page settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'General', href: '/admin' },
          { label: 'Front page settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form onSubmit={handleSave}>
            <div className="space-y-4">
              {/* Site identity */}
              <SettingsSection title="Site identity">
                <SettingField
                  label="Full site name"
                  help="The full name of the site. This is displayed on the front page and in browser title bars."
                >
                  <input
                    type="text"
                    className="form-control text-sm"
                    value={formData.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                  />
                </SettingField>

                <SettingField
                  label="Short name for site"
                  help="A short name for the site, used in navigation and email subjects."
                >
                  <input
                    type="text"
                    className="form-control text-sm"
                    value={formData.shortName}
                    onChange={(e) => handleChange('shortName', e.target.value)}
                  />
                </SettingField>

                <SettingField
                  label="Front page site description"
                  help="A description of the site, shown on the front page. May be displayed in search engine results."
                >
                  <textarea
                    className="form-control text-sm"
                    rows={4}
                    value={formData.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    placeholder="Enter a description for your site..."
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    HTML is allowed. This will be displayed on the site front page.
                  </p>
                </SettingField>
              </SettingsSection>

              {/* Front page items for logged-in users */}
              <SettingsSection title="Front page items when logged in">
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  Select the items to display on the front page for logged-in users. Items are
                  displayed in the order selected below.
                </p>

                <SettingField label="First item" help="The first item displayed on the front page for logged-in users">
                  <select
                    className="form-control text-sm"
                    value={formData.frontPageLoggedIn1}
                    onChange={(e) => handleChange('frontPageLoggedIn1', e.target.value)}
                  >
                    {frontPageItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </SettingField>

                <SettingField label="Second item" help="The second item displayed on the front page for logged-in users">
                  <select
                    className="form-control text-sm"
                    value={formData.frontPageLoggedIn2}
                    onChange={(e) => handleChange('frontPageLoggedIn2', e.target.value)}
                  >
                    {frontPageItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </SettingField>

                <SettingField label="Third item" help="The third item displayed on the front page for logged-in users">
                  <select
                    className="form-control text-sm"
                    value={formData.frontPageLoggedIn3}
                    onChange={(e) => handleChange('frontPageLoggedIn3', e.target.value)}
                  >
                    {frontPageItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </SettingField>
              </SettingsSection>

              {/* Front page items for guests */}
              <SettingsSection title="Front page items for guests">
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  Select the items to display on the front page for visitors who are not logged in.
                </p>

                <SettingField label="First item" help="The first item displayed on the front page for guests">
                  <select
                    className="form-control text-sm"
                    value={formData.frontPageGuest1}
                    onChange={(e) => handleChange('frontPageGuest1', e.target.value)}
                  >
                    {frontPageItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </SettingField>

                <SettingField label="Second item" help="The second item displayed on the front page for guests">
                  <select
                    className="form-control text-sm"
                    value={formData.frontPageGuest2}
                    onChange={(e) => handleChange('frontPageGuest2', e.target.value)}
                  >
                    {frontPageItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </SettingField>

                <SettingField label="Third item" help="The third item displayed on the front page for guests">
                  <select
                    className="form-control text-sm"
                    value={formData.frontPageGuest3}
                    onChange={(e) => handleChange('frontPageGuest3', e.target.value)}
                  >
                    {frontPageItems.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </SettingField>
              </SettingsSection>

              {/* Additional settings */}
              <SettingsSection title="Additional settings">
                <SettingField
                  label="News items to show"
                  help="The maximum number of news items to display on the site front page."
                >
                  <select
                    className="form-control text-sm w-auto"
                    value={formData.maxNewsItems}
                    onChange={(e) => handleChange('maxNewsItems', e.target.value)}
                  >
                    {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </SettingField>

                <SettingField
                  label="Include a topic section"
                  help="Include a topic section on the front page. This provides a space for content on the main page of the site."
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={formData.topicSection}
                      onChange={(e) => handleChange('topicSection', e.target.checked)}
                    />
                    <span className="text-sm">Enable topic section on front page</span>
                  </label>
                </SettingField>

                <SettingField
                  label="Comments on front page"
                  help="Allow users to add comments to the site front page."
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={formData.commentsOnFrontPage}
                      onChange={(e) => handleChange('commentsOnFrontPage', e.target.checked)}
                    />
                    <span className="text-sm">Enable comments on the front page</span>
                  </label>
                </SettingField>
              </SettingsSection>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm flex items-center gap-2">
                <Save size={16} /> Save changes
              </button>
              <button
                type="button"
                className="btn btn-secondary text-sm flex items-center gap-2"
                onClick={handleReset}
              >
                <RotateCcw size={14} /> Reset to defaults
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
