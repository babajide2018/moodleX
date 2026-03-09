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

export default function CourseDefaultsPage() {
  return (
    <>
      <PageHeader
        title="Course default settings"
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
            <SettingsSection title="Course format">
              <SettingField label="Format" help="The default course format.">
                <select className="form-control text-sm">
                  <option value="topics">Topics format</option>
                  <option value="weeks">Weekly format</option>
                  <option value="social">Social format</option>
                  <option value="singleactivity">Single activity format</option>
                </select>
              </SettingField>

              <SettingField label="Number of sections" help="The default number of sections in a new course.">
                <input type="number" className="form-control text-sm" defaultValue={10} min={0} max={52} />
              </SettingField>

              <SettingField label="Hidden sections" help="Whether hidden sections are shown as collapsed (not available) or completely invisible.">
                <select className="form-control text-sm">
                  <option value="0">Hidden sections are shown as not available</option>
                  <option value="1">Hidden sections are completely invisible</option>
                </select>
              </SettingField>

              <SettingField label="Course layout" help="Whether to show the whole course on one page or split it into several pages.">
                <select className="form-control text-sm">
                  <option value="0">Show all sections on one page</option>
                  <option value="1">Show one section per page</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Appearance" defaultOpen={false}>
              <SettingField label="Course visibility" help="The default visibility for new courses.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Force language" help="Force the display language in courses. Leave empty to not force.">
                <select className="form-control text-sm">
                  <option value="">Do not force</option>
                  <option value="en">English (en)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="es">Spanish (es)</option>
                </select>
              </SettingField>

              <SettingField label="Number of announcements" help="The default number of news items shown in the latest announcements block.">
                <select className="form-control text-sm">
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                  <option value="0">0</option>
                </select>
              </SettingField>

              <SettingField label="Show activity dates" help="Whether to show activity dates on the course page by default.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Files and uploads" defaultOpen={false}>
              <SettingField label="Maximum upload size" help="The largest file size that can be uploaded to courses.">
                <select className="form-control text-sm">
                  <option value="0">Site upload limit</option>
                  <option value="2097152">2 MB</option>
                  <option value="5242880">5 MB</option>
                  <option value="10485760">10 MB</option>
                  <option value="52428800">50 MB</option>
                  <option value="104857600">100 MB</option>
                  <option value="268435456">256 MB</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Completion tracking" defaultOpen={false}>
              <SettingField label="Completion tracking" help="Whether completion tracking is enabled by default in new courses.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show activity completion conditions" help="Whether activity completion conditions are shown on the course page by default.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Groups" defaultOpen={false}>
              <SettingField label="Group mode" help="The default group mode for new courses.">
                <select className="form-control text-sm">
                  <option value="0">No groups</option>
                  <option value="1">Separate groups</option>
                  <option value="2">Visible groups</option>
                </select>
              </SettingField>

              <SettingField label="Force group mode" help="Whether the course-level group mode is forced for all activities.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
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
