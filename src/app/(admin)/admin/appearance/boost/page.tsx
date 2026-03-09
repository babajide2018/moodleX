'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Upload } from 'lucide-react';

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

export default function BoostThemeSettingsPage() {
  const [brandColour, setBrandColour] = useState('#0f6cbf');

  return (
    <>
      <PageHeader
        title="Boost"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Themes' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Preset" help="Choose a theme preset to broadly change the look of the theme.">
                <select className="form-control text-sm">
                  <option value="default">Default</option>
                  <option value="plain">Plain</option>
                </select>
              </SettingField>

              <SettingField label="Additional preset files" help="Upload additional preset files to add more design options.">
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center bg-[var(--bg-light)]">
                  <Upload size={24} className="mx-auto text-[var(--text-muted)] mb-2" />
                  <p className="text-sm text-[var(--text-muted)]">Drag and drop preset files here, or click to browse</p>
                  <input type="file" className="hidden" accept=".scss" />
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Colours">
              <SettingField label="Brand colour" help="The main accent colour used across the theme for links, buttons, and navigation.">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColour}
                    onChange={(e) => setBrandColour(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-[var(--border-color)]"
                  />
                  <input
                    type="text"
                    value={brandColour}
                    onChange={(e) => setBrandColour(e.target.value)}
                    className="form-control text-sm w-32"
                    placeholder="#0f6cbf"
                  />
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Background image" defaultOpen={false}>
              <SettingField label="Background image" help="Upload a background image for the site. It will be stretched to fill the browser window.">
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-8 text-center bg-[var(--bg-light)]">
                  <Upload size={32} className="mx-auto text-[var(--text-muted)] mb-2" />
                  <p className="text-sm text-[var(--text-muted)] mb-1">Drag and drop an image here, or click to browse</p>
                  <p className="text-xs text-[var(--text-muted)]">Recommended: JPG or PNG, at least 1920x1080 pixels</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </SettingField>

              <SettingField label="Login page background" help="Upload a background image specifically for the login page.">
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-8 text-center bg-[var(--bg-light)]">
                  <Upload size={32} className="mx-auto text-[var(--text-muted)] mb-2" />
                  <p className="text-sm text-[var(--text-muted)] mb-1">Drag and drop an image here, or click to browse</p>
                  <p className="text-xs text-[var(--text-muted)]">Recommended: JPG or PNG, at least 1920x1080 pixels</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Advanced settings" defaultOpen={false}>
              <SettingField label="Raw initial SCSS" help="SCSS code entered here will be injected before everything else. Use this to define variables.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={6}
                  placeholder="// Enter raw SCSS code to be injected before compilation..."
                />
              </SettingField>

              <SettingField label="Raw SCSS" help="SCSS code entered here will be appended after everything else. Use this to override styles.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={8}
                  placeholder="// Enter raw SCSS code to be appended after compilation..."
                />
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
