'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

// Collapsible section component matching Moodle's admin forms
function FormSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg mb-4">
      <button
        type="button"
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-light)] rounded-t-lg hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {open && (
        <div className="p-4 border-t border-[var(--border-color)] space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Form field with label + help icon matching Moodle
function FormField({
  label,
  required,
  help,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
  error?: string;
}) {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 items-start">
      <label className="text-sm pt-2 flex items-center gap-1">
        {label}
        {required && <span className="text-[var(--moodle-danger)]">*</span>}
        {help && (
          <button
            type="button"
            className="text-[var(--text-muted)] hover:text-[var(--moodle-primary)]"
            onClick={() => setShowHelp(!showHelp)}
          >
            <Info size={13} />
          </button>
        )}
      </label>
      <div>
        {children}
        {showHelp && help && (
          <p className="text-xs text-[var(--text-muted)] mt-1 bg-[var(--bg-light)] p-2 rounded">
            {help}
          </p>
        )}
        {error && <p className="text-xs text-[var(--moodle-danger)] mt-1">{error}</p>}
      </div>
    </div>
  );
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const isNew = courseId === 'new';

  const [form, setForm] = useState({
    fullname: isNew ? '' : 'Introduction to Computer Science',
    shortname: isNew ? '' : 'CS101',
    category: '1',
    visible: true,
    startdate: '2026-03-01',
    enddate: '',
    idnumber: '',
    summary: isNew ? '' : 'An introductory course covering fundamentals of computer science.',
    format: 'topics',
    numsections: '10',
    hiddensections: '0',
    coursedisplay: '0',
    lang: '',
    maxbytes: '0',
    showgrades: true,
    showreports: false,
    showactivitydates: true,
    enablecompletion: true,
    groupmode: '0',
    groupmodeforce: false,
    defaultgroupingid: '0',
  });
  const [saving, setSaving] = useState(false);

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'settings', label: 'Settings', href: `/course/${courseId}/edit` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Save course logic
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    if (isNew) {
      router.push('/course/management');
    }
  };

  return (
    <>
      <PageHeader
        title={isNew ? 'Add a new course' : 'Edit course settings'}
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          ...(isNew ? [] : [{ label: form.shortname, href: `/course/${courseId}` }]),
          { label: isNew ? 'Add a new course' : 'Edit settings' },
        ]}
      />

      {!isNew && <SecondaryNavigation tabs={courseTabs} />}

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          <form onSubmit={handleSubmit}>
            {/* General */}
            <FormSection title="General" defaultOpen={true}>
              <FormField label="Course full name" required help="The full name of the course. It is displayed as a link on course lists on the front page and in the navigation.">
                <input
                  type="text"
                  className="form-control"
                  value={form.fullname}
                  onChange={(e) => update('fullname', e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Course short name" required help="A short name used to identify the course. Used in breadcrumbs, the navigation, and as the subject of email messages.">
                <input
                  type="text"
                  className="form-control"
                  value={form.shortname}
                  onChange={(e) => update('shortname', e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Course category" required help="The administrator may have set up several course categories.">
                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                >
                  <option value="1">Miscellaneous</option>
                  <option value="2">Computer Science</option>
                  <option value="3">Mathematics</option>
                  <option value="4">Science</option>
                  <option value="5">Humanities</option>
                  <option value="6">Business</option>
                </select>
              </FormField>

              <FormField label="Course visibility" help="This setting determines whether the course appears in the list of courses and whether students can access it.">
                <select
                  className="form-control"
                  value={form.visible ? '1' : '0'}
                  onChange={(e) => update('visible', e.target.value === '1')}
                >
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </FormField>

              <FormField label="Course start date" required help="This setting determines the start of the first week for a course in weekly format.">
                <input
                  type="date"
                  className="form-control"
                  value={form.startdate}
                  onChange={(e) => update('startdate', e.target.value)}
                />
              </FormField>

              <FormField label="Course end date" help="The end date is used for determining whether a course should be included in a user's list of courses.">
                <input
                  type="date"
                  className="form-control"
                  value={form.enddate}
                  onChange={(e) => update('enddate', e.target.value)}
                />
              </FormField>

              <FormField label="Course ID number" help="The ID number of a course is only used when matching this course against external systems.">
                <input
                  type="text"
                  className="form-control"
                  value={form.idnumber}
                  onChange={(e) => update('idnumber', e.target.value)}
                />
              </FormField>
            </FormSection>

            {/* Description */}
            <FormSection title="Description">
              <FormField label="Course summary" help="The course summary is displayed in the list of courses. A course search searches course summary text in addition to course names.">
                <textarea
                  className="form-control"
                  rows={5}
                  value={form.summary}
                  onChange={(e) => update('summary', e.target.value)}
                />
              </FormField>

              <FormField label="Course image" help="An image displayed in the course overview. If not provided, a default placeholder will be used.">
                <div className="flex items-center gap-3">
                  <div className="w-32 h-20 bg-[var(--bg-light)] border border-dashed border-[var(--border-color)] rounded flex items-center justify-center text-xs text-[var(--text-muted)]">
                    No image
                  </div>
                  <button type="button" className="btn btn-secondary text-sm">
                    Choose a file...
                  </button>
                </div>
              </FormField>
            </FormSection>

            {/* Course format */}
            <FormSection title="Course format">
              <FormField label="Format" help="The course format determines the layout of the course page.">
                <select
                  className="form-control"
                  value={form.format}
                  onChange={(e) => update('format', e.target.value)}
                >
                  <option value="topics">Topics format</option>
                  <option value="weeks">Weekly format</option>
                  <option value="social">Social format</option>
                  <option value="singleactivity">Single activity format</option>
                </select>
              </FormField>

              {(form.format === 'topics' || form.format === 'weeks') && (
                <>
                  <FormField label="Number of sections" help="This setting specifies the number of sections in the course.">
                    <select
                      className="form-control"
                      value={form.numsections}
                      onChange={(e) => update('numsections', e.target.value)}
                    >
                      {Array.from({ length: 52 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Hidden sections" help="This setting determines whether hidden sections are shown to students as not available or are completely hidden.">
                    <select
                      className="form-control"
                      value={form.hiddensections}
                      onChange={(e) => update('hiddensections', e.target.value)}
                    >
                      <option value="0">Hidden sections are shown as not available</option>
                      <option value="1">Hidden sections are completely invisible</option>
                    </select>
                  </FormField>

                  <FormField label="Course layout" help="Show all sections on one page or show one section per page.">
                    <select
                      className="form-control"
                      value={form.coursedisplay}
                      onChange={(e) => update('coursedisplay', e.target.value)}
                    >
                      <option value="0">Show all sections on one page</option>
                      <option value="1">Show one section per page</option>
                    </select>
                  </FormField>
                </>
              )}
            </FormSection>

            {/* Appearance */}
            <FormSection title="Appearance">
              <FormField label="Force language" help="If set, the Moodle interface will be displayed in this language regardless of user preferences.">
                <select
                  className="form-control"
                  value={form.lang}
                  onChange={(e) => update('lang', e.target.value)}
                >
                  <option value="">Do not force</option>
                  <option value="en">English (en)</option>
                  <option value="es">Español (es)</option>
                  <option value="fr">Français (fr)</option>
                  <option value="de">Deutsch (de)</option>
                </select>
              </FormField>

              <FormField label="Maximum upload size" help="This setting determines the largest size of file that can be uploaded to the course.">
                <select
                  className="form-control"
                  value={form.maxbytes}
                  onChange={(e) => update('maxbytes', e.target.value)}
                >
                  <option value="0">Site upload limit (default)</option>
                  <option value="2097152">2MB</option>
                  <option value="5242880">5MB</option>
                  <option value="10485760">10MB</option>
                  <option value="20971520">20MB</option>
                  <option value="52428800">50MB</option>
                  <option value="104857600">100MB</option>
                  <option value="262144000">250MB</option>
                </select>
              </FormField>

              <FormField label="Show gradebook to students">
                <select
                  className="form-control"
                  value={form.showgrades ? '1' : '0'}
                  onChange={(e) => update('showgrades', e.target.value === '1')}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </FormField>

              <FormField label="Show activity reports">
                <select
                  className="form-control"
                  value={form.showreports ? '1' : '0'}
                  onChange={(e) => update('showreports', e.target.value === '1')}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </FormField>

              <FormField label="Show activity dates">
                <select
                  className="form-control"
                  value={form.showactivitydates ? '1' : '0'}
                  onChange={(e) => update('showactivitydates', e.target.value === '1')}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </FormField>
            </FormSection>

            {/* Completion tracking */}
            <FormSection title="Completion tracking">
              <FormField label="Enable completion tracking" help="If enabled, activity completion conditions may be set in the activity settings and/or course completion conditions.">
                <select
                  className="form-control"
                  value={form.enablecompletion ? '1' : '0'}
                  onChange={(e) => update('enablecompletion', e.target.value === '1')}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </FormField>
            </FormSection>

            {/* Groups */}
            <FormSection title="Groups">
              <FormField label="Group mode" help="This setting has 3 options: No groups, Separate groups, Visible groups.">
                <select
                  className="form-control"
                  value={form.groupmode}
                  onChange={(e) => update('groupmode', e.target.value)}
                >
                  <option value="0">No groups</option>
                  <option value="1">Separate groups</option>
                  <option value="2">Visible groups</option>
                </select>
              </FormField>

              <FormField label="Force group mode" help="If group mode is forced, then the course group mode is applied to every activity in the course.">
                <select
                  className="form-control"
                  value={form.groupmodeforce ? '1' : '0'}
                  onChange={(e) => update('groupmodeforce', e.target.value === '1')}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </FormField>
            </FormSection>

            {/* Role renaming */}
            <FormSection title="Role renaming">
              <p className="text-sm text-[var(--text-muted)]">
                This setting allows the display names of roles used in the course to be changed.
                Only the displayed name is changed - role permissions are not affected.
              </p>
              <FormField label="Your word for 'Manager'">
                <input type="text" className="form-control" placeholder="" />
              </FormField>
              <FormField label="Your word for 'Teacher'">
                <input type="text" className="form-control" placeholder="" />
              </FormField>
              <FormField label="Your word for 'Non-editing teacher'">
                <input type="text" className="form-control" placeholder="" />
              </FormField>
              <FormField label="Your word for 'Student'">
                <input type="text" className="form-control" placeholder="" />
              </FormField>
            </FormSection>

            {/* Tags */}
            <FormSection title="Tags">
              <FormField label="Tags" help="Tags help categorize courses and make them easier to find.">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter tags separated by commas..."
                />
              </FormField>
            </FormSection>

            {/* Submit */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="btn btn-primary py-2 px-6"
                disabled={saving}
              >
                {saving ? 'Saving changes...' : 'Save and display'}
              </button>
              <button type="submit" className="btn btn-secondary py-2 px-6" disabled={saving}>
                Save and return
              </button>
              <button
                type="button"
                className="btn btn-secondary py-2 px-6"
                onClick={() => router.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
