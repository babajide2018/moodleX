'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Upload, Image, X } from 'lucide-react';

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

function UploadArea({ label, description, accept }: { label: string; description: string; accept: string }) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      {preview ? (
        <div className="relative inline-block border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-light)]">
          <div className="w-48 h-24 bg-white rounded flex items-center justify-center">
            <Image size={32} className="text-[var(--text-muted)]" />
          </div>
          <button
            type="button"
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
            onClick={() => setPreview(null)}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-8 text-center bg-[var(--bg-light)] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors">
          <Upload size={28} className="mx-auto text-[var(--text-muted)] mb-2" />
          <p className="text-sm text-[var(--text-muted)] mb-1">{label}</p>
          <p className="text-xs text-[var(--text-muted)]">{description}</p>
          <input type="file" className="hidden" accept={accept} />
        </div>
      )}
    </div>
  );
}

export default function LogosPage() {
  return (
    <>
      <PageHeader
        title="Logos"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Logos' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Logo">
              <SettingField label="Logo" help="Upload a full-size logo image. This logo will be displayed in the header on larger screens. The recommended size is 200px by 60px.">
                <UploadArea
                  label="Drag and drop your logo here, or click to browse"
                  description="Accepted formats: PNG, JPG, SVG. Recommended: 200x60px"
                  accept="image/png,image/jpeg,image/svg+xml"
                />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Compact logo">
              <SettingField label="Compact logo" help="Upload a compact version of the logo. This is displayed in the header on smaller screens and mobile devices. The recommended size is 50px by 50px.">
                <UploadArea
                  label="Drag and drop your compact logo here, or click to browse"
                  description="Accepted formats: PNG, JPG, SVG. Recommended: 50x50px"
                  accept="image/png,image/jpeg,image/svg+xml"
                />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Favicon">
              <SettingField label="Favicon" help="Upload a favicon for the site. The favicon is displayed in the browser tab alongside the page title. It should be a square image, ideally 16x16 or 32x32 pixels.">
                <UploadArea
                  label="Drag and drop your favicon here, or click to browse"
                  description="Accepted formats: ICO, PNG. Recommended: 32x32px"
                  accept="image/x-icon,image/png"
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
