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

export default function DownloadCourseContentPage() {
  return (
    <>
      <PageHeader
        title="Download course content"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Course default settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Download course content">
              <SettingField label="Enable download course content" help="Allow teachers to download course content as a zip file. This includes all files and content added to course activities and resources.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes, with site-wide default on</option>
                  <option value="2">Yes, with site-wide default off</option>
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  When enabled, teachers can download all course content as a zip file from the course page. The download includes
                  files, activity descriptions, and other text content.
                </p>
              </SettingField>

              <SettingField label="Maximum download file size" help="The maximum total file size for a course content download. Files exceeding this limit will be excluded from the download.">
                <select className="form-control text-sm">
                  <option value="52428800">50 MB</option>
                  <option value="104857600">100 MB</option>
                  <option value="268435456">256 MB</option>
                  <option value="536870912">512 MB</option>
                  <option value="1073741824" selected>1 GB</option>
                  <option value="2147483648">2 GB</option>
                  <option value="0">Unlimited</option>
                </select>
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
