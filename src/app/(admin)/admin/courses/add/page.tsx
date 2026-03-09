'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

function SettingField({ label, help, required, children }: { label: string; help?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
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

export default function AddCoursePage() {
  return (
    <>
      <PageHeader
        title="Add a new course"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Manage courses and categories' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="General">
              <SettingField label="Course full name" required help="The full name of the course is displayed at the top of each page and in the list of courses.">
                <input type="text" className="form-control text-sm" placeholder="e.g. Introduction to Computer Science" />
              </SettingField>

              <SettingField label="Course short name" required help="A short name is used in several places where the long name is not suitable (e.g. in the navigation).">
                <input type="text" className="form-control text-sm" placeholder="e.g. CS101" />
              </SettingField>

              <SettingField label="Course category" required help="The category the course belongs to.">
                <select className="form-control text-sm">
                  <option value="1">Miscellaneous</option>
                  <option value="2">Science</option>
                  <option value="3">&nbsp;&nbsp;Biology</option>
                  <option value="4">Mathematics</option>
                  <option value="5">Arts &amp; Humanities</option>
                </select>
              </SettingField>

              <SettingField label="Course visibility" help="This setting determines whether the course appears in the list of courses. Staff can still access a hidden course via its URL.">
                <select className="form-control text-sm">
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Course start date" help="This setting determines the start of the first week for a course in weekly format. It also determines the earliest date logs are available for.">
                <input type="date" className="form-control text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
              </SettingField>

              <SettingField label="Course end date" help="The course end date is used for determining whether a course should be included in a user&apos;s list of courses. It is also used by reports.">
                <div className="flex items-center gap-2">
                  <input type="date" className="form-control text-sm" />
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input type="checkbox" className="w-4 h-4" /> Enable
                  </label>
                </div>
              </SettingField>

              <SettingField label="Course ID number" help="The ID number is only used when matching this course against external systems.">
                <input type="text" className="form-control text-sm" />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Description" defaultOpen={false}>
              <SettingField label="Course summary" help="The course summary is displayed in the list of courses. A course search searches course summary text in addition to course names.">
                <textarea className="form-control text-sm" rows={5} placeholder="Enter a description of the course..." />
              </SettingField>

              <SettingField label="Course image" help="The image is displayed in the course list and on the course dashboard.">
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center">
                  <p className="text-sm text-[var(--text-muted)]">Drag and drop an image here, or click to browse.</p>
                  <input type="file" accept="image/*" className="hidden" />
                  <button type="button" className="btn btn-secondary text-sm mt-2">Choose a file</button>
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Course format" defaultOpen={false}>
              <SettingField label="Format" help="The course format determines the layout of the course page.">
                <select className="form-control text-sm">
                  <option value="topics">Topics format</option>
                  <option value="weeks">Weekly format</option>
                  <option value="social">Social format</option>
                  <option value="singleactivity">Single activity format</option>
                </select>
              </SettingField>

              <SettingField label="Number of sections" help="The number of sections in the course. This can be changed at any time.">
                <input type="number" className="form-control text-sm" defaultValue={10} min={0} max={52} />
              </SettingField>

              <SettingField label="Hidden sections" help="How hidden sections are shown to students.">
                <select className="form-control text-sm">
                  <option value="0">Hidden sections are shown as not available</option>
                  <option value="1">Hidden sections are completely invisible</option>
                </select>
              </SettingField>

              <SettingField label="Course layout" help="How to display the course content on the course page.">
                <select className="form-control text-sm">
                  <option value="0">Show all sections on one page</option>
                  <option value="1">Show one section per page</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Appearance" defaultOpen={false}>
              <SettingField label="Force language" help="Force the language used in the course. If not forced, users can choose their own language.">
                <select className="form-control text-sm">
                  <option value="">Do not force</option>
                  <option value="en">English (en)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="es">Spanish (es)</option>
                </select>
              </SettingField>

              <SettingField label="News items to show" help="The number of recent discussions that appear in the latest announcements block.">
                <select className="form-control text-sm">
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                  <option value="0">0</option>
                </select>
              </SettingField>

              <SettingField label="Show activity dates" help="Show activity dates on the course page.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Files and uploads" defaultOpen={false}>
              <SettingField label="Maximum upload size" help="This setting determines the largest size of file that can be uploaded to this course.">
                <select className="form-control text-sm">
                  <option value="0">Site upload limit (e.g. 256 MB)</option>
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
              <SettingField label="Enable completion tracking" help="If enabled, activity completion conditions may be set in the activity settings and/or course completion conditions.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show activity completion conditions" help="Show activity completion conditions on the course page.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Groups" defaultOpen={false}>
              <SettingField label="Group mode" help="This setting has 3 options: no groups, separate groups, visible groups.">
                <select className="form-control text-sm">
                  <option value="0">No groups</option>
                  <option value="1">Separate groups</option>
                  <option value="2">Visible groups</option>
                </select>
              </SettingField>

              <SettingField label="Force group mode" help="If group mode is forced, then the course group mode is applied to every activity and the group mode cannot be changed at activity level.">
                <select className="form-control text-sm">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>

              <SettingField label="Default grouping" help="If groupings are enabled, set a default grouping for course activities and resources.">
                <select className="form-control text-sm">
                  <option value="0">None</option>
                </select>
              </SettingField>
            </SettingsSection>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm">Save and display</button>
              <button type="button" className="btn btn-secondary text-sm">Save and return</button>
              <button type="button" className="btn btn-secondary text-sm" onClick={() => window.history.back()}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
