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

export default function SitePolicyPage() {
  return (
    <>
      <PageHeader
        title="HTML settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'HTML settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Allowed HTML tags">
              <SettingField label="Allowed HTML tags" help="Specify which HTML tags are allowed in user-generated content. Tags not listed here will be stripped out.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={4}
                  defaultValue="<b><i><u><em><strong><a><img><br><p><div><span><ul><ol><li><table><tr><td><th><thead><tbody><h1><h2><h3><h4><h5><h6><pre><code><blockquote><hr><sub><sup><small>"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Enter HTML tags including angle brackets, e.g. &lt;b&gt;&lt;i&gt;&lt;a&gt;</p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Media and filters" defaultOpen={false}>
              <SettingField label="Enable multimedia filters" help="Automatically convert URLs of multimedia files into embedded players.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Enable AJAX" help="Enable AJAX features such as drag-and-drop and inline editing across the site. Disabling may improve accessibility for some users.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Cache JavaScript" help="Cache JavaScript files for improved performance. This should be turned off during development.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Cache CSS" help="Cache CSS files for improved performance. This should be turned off during development.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Custom HTML" defaultOpen={false}>
              <SettingField label="Additional HTML (within HEAD)" help="HTML code that will be injected inside the &lt;head&gt; tag on every page. Use this for analytics scripts, custom meta tags, or additional CSS.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={6}
                  placeholder="<!-- Add custom HTML for <head> section -->"
                />
              </SettingField>

              <SettingField label="Additional HTML (at start of BODY)" help="HTML code that will be inserted immediately after the opening &lt;body&gt; tag. Useful for analytics tracking snippets.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={6}
                  placeholder="<!-- Add custom HTML for start of <body> -->"
                />
              </SettingField>

              <SettingField label="Additional HTML (before end of BODY)" help="HTML code that will be inserted just before the closing &lt;/body&gt; tag. Use for footer scripts or tracking pixels.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={6}
                  placeholder="<!-- Add custom HTML for end of <body> -->"
                />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Site policy" defaultOpen={false}>
              <SettingField label="Site policy URL" help="URL of the site policy that all users must agree to before using this site. Leave blank for no site policy.">
                <input type="url" className="form-control text-sm" placeholder="https://example.com/policy" />
              </SettingField>

              <SettingField label="Site policy URL for guests" help="URL of the site policy that guest users must agree to before accessing the site.">
                <input type="url" className="form-control text-sm" placeholder="https://example.com/guest-policy" />
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
