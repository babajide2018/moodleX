'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  ChevronDown,
  ChevronRight,
  Info,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  depth?: number;
}

interface CourseData {
  id: string;
  fullname: string;
  shortname: string;
  idnumber: string | null;
  summary: string | null;
  category: string;
  categoryId: string;
  format: string;
  numsections: number;
  visible: boolean;
  startdate: string;
  enddate: string | null;
  image: string | null;
  lang: string | null;
  maxbytes: number;
  showgrades: boolean;
  showreports: boolean;
  showactivitydates: boolean;
  enablecompletion: boolean;
}

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

  // Data states
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullname: '',
    shortname: '',
    category: '',
    visible: true,
    startdate: new Date().toISOString().split('T')[0],
    enddate: '',
    idnumber: '',
    summary: '',
    format: 'topics',
    numsections: '10',
    lang: '',
    maxbytes: '0',
    showgrades: true,
    showreports: false,
    showactivitydates: true,
    enablecompletion: true,
  });

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
    { key: 'reports', label: 'Reports', href: `/course/${courseId}/reports` },
    { key: 'more', label: 'More', href: `/course/${courseId}/edit` },
  ];

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Fetch course data and categories
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const requests: Promise<Response>[] = [fetch('/api/admin/categories')];

      if (!isNew) {
        requests.push(fetch(`/api/courses/${courseId}`));
      }

      const responses = await Promise.all(requests);

      // Parse categories
      if (responses[0].ok) {
        const catData = await responses[0].json();
        setCategories(catData.categories || []);
      }

      // Parse course data
      if (!isNew && responses[1]) {
        if (!responses[1].ok) {
          const data = await responses[1].json();
          throw new Error(data.error || 'Failed to fetch course');
        }

        const courseData = await responses[1].json();
        const course: CourseData = courseData.course;

        setForm({
          fullname: course.fullname,
          shortname: course.shortname,
          category: course.categoryId,
          visible: course.visible,
          startdate: course.startdate ? course.startdate.split('T')[0] : '',
          enddate: course.enddate ? course.enddate.split('T')[0] : '',
          idnumber: course.idnumber || '',
          summary: course.summary || '',
          format: course.format,
          numsections: String(course.numsections),
          lang: course.lang || '',
          maxbytes: String(course.maxbytes),
          showgrades: course.showgrades,
          showreports: course.showreports,
          showactivitydates: course.showactivitydates,
          enablecompletion: course.enablecompletion,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [courseId, isNew]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Validate form
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.fullname.trim()) {
      errors.fullname = 'Course full name is required';
    }
    if (!form.shortname.trim()) {
      errors.shortname = 'Course short name is required';
    }
    if (!form.startdate) {
      errors.startdate = 'Course start date is required';
    }
    if (form.enddate && form.startdate && new Date(form.enddate) <= new Date(form.startdate)) {
      errors.enddate = 'End date must be after start date';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, andDisplay = true) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const body = {
        fullname: form.fullname.trim(),
        shortname: form.shortname.trim(),
        idnumber: form.idnumber.trim() || null,
        categoryId: form.category || undefined,
        visible: form.visible,
        startdate: form.startdate,
        enddate: form.enddate || null,
        summary: form.summary.trim() || null,
        format: form.format,
        numsections: Number(form.numsections),
        showactivitydates: form.showactivitydates,
        enablecompletion: form.enablecompletion,
        lang: form.lang || null,
        maxbytes: Number(form.maxbytes),
        showgrades: form.showgrades,
        showreports: form.showreports,
      };

      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes('short name')) {
          setFieldErrors({ shortname: data.error });
        }
        throw new Error(data.error || 'Failed to update course');
      }

      setSaveMessage({ type: 'success', text: 'Changes saved.' });

      if (andDisplay) {
        // Navigate to course page after a brief delay to show the success message
        setTimeout(() => {
          router.push(`/course/${courseId}`);
        }, 500);
      } else {
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save course',
      });
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <PageHeader
          title={isNew ? 'Add a new course' : 'Edit course settings'}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            ...(isNew ? [] : [{ label: '...', href: `/course/${courseId}` }]),
            { label: isNew ? 'Add a new course' : 'Edit settings' },
          ]}
        />
        {!isNew && <SecondaryNavigation tabs={courseTabs} />}
        <div id="page-content" className="p-4">
          <div id="region-main">
            <div className="flex items-center justify-center py-16 text-[var(--text-muted)]">
              <Loader2 size={24} className="animate-spin mr-2" />
              <span className="text-sm">Loading course settings...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && !form.fullname) {
    return (
      <>
        <PageHeader
          title={isNew ? 'Add a new course' : 'Edit course settings'}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My courses', href: '/my/courses' },
            { label: isNew ? 'Add a new course' : 'Edit settings' },
          ]}
        />
        {!isNew && <SecondaryNavigation tabs={courseTabs} />}
        <div id="page-content" className="p-4">
          <div id="region-main">
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle size={32} className="text-[var(--moodle-danger)] mb-3" />
              <p className="text-sm text-[var(--text-muted)] mb-4">{error}</p>
              <button
                className="btn btn-primary text-sm"
                onClick={() => {
                  setLoading(true);
                  fetchData();
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={isNew ? 'Add a new course' : 'Edit course settings'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My courses', href: '/my/courses' },
          ...(isNew ? [] : [{ label: form.shortname || courseId, href: `/course/${courseId}` }]),
          { label: isNew ? 'Add a new course' : 'Edit settings' },
        ]}
      />

      {!isNew && <SecondaryNavigation tabs={courseTabs} />}

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Save message */}
          {saveMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {saveMessage.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {saveMessage.text}
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, true)}>
            {/* General */}
            <FormSection title="General" defaultOpen={true}>
              <FormField
                label="Course full name"
                required
                help="The full name of the course. It is displayed as a link on course lists on the front page and in the navigation."
                error={fieldErrors.fullname}
              >
                <input
                  type="text"
                  className="form-control"
                  value={form.fullname}
                  onChange={(e) => update('fullname', e.target.value)}
                  required
                />
              </FormField>

              <FormField
                label="Course short name"
                required
                help="A short name used to identify the course. Used in breadcrumbs, the navigation, and as the subject of email messages."
                error={fieldErrors.shortname}
              >
                <input
                  type="text"
                  className="form-control"
                  value={form.shortname}
                  onChange={(e) => update('shortname', e.target.value)}
                  required
                />
              </FormField>

              <FormField
                label="Course category"
                required
                help="The administrator may have set up several course categories."
              >
                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.depth ? '\u00A0'.repeat(cat.depth * 2) : ''}
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
              </FormField>

              <FormField
                label="Course visibility"
                help="This setting determines whether the course appears in the list of courses and whether students can access it."
              >
                <select
                  className="form-control"
                  value={form.visible ? '1' : '0'}
                  onChange={(e) => update('visible', e.target.value === '1')}
                >
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </FormField>

              <FormField
                label="Course start date"
                required
                help="This setting determines the start of the first week for a course in weekly format."
                error={fieldErrors.startdate}
              >
                <input
                  type="date"
                  className="form-control"
                  value={form.startdate}
                  onChange={(e) => update('startdate', e.target.value)}
                />
              </FormField>

              <FormField
                label="Course end date"
                help="The end date is used for determining whether a course should be included in a user's list of courses."
                error={fieldErrors.enddate}
              >
                <input
                  type="date"
                  className="form-control"
                  value={form.enddate}
                  onChange={(e) => update('enddate', e.target.value)}
                />
              </FormField>

              <FormField
                label="Course ID number"
                help="The ID number of a course is only used when matching this course against external systems."
              >
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
              <FormField
                label="Course summary"
                help="The course summary is displayed in the list of courses. A course search searches course summary text in addition to course names."
              >
                <textarea
                  className="form-control"
                  rows={5}
                  value={form.summary}
                  onChange={(e) => update('summary', e.target.value)}
                />
              </FormField>

              <FormField
                label="Course image"
                help="An image displayed in the course overview. If not provided, a default placeholder will be used."
              >
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
              <FormField
                label="Format"
                help="The course format determines the layout of the course page."
              >
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
                <FormField
                  label="Number of sections"
                  help="This setting specifies the number of sections in the course."
                >
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
              )}
            </FormSection>

            {/* Appearance */}
            <FormSection title="Appearance">
              <FormField
                label="Force language"
                help="If set, the Moodle interface will be displayed in this language regardless of user preferences."
              >
                <select
                  className="form-control"
                  value={form.lang}
                  onChange={(e) => update('lang', e.target.value)}
                >
                  <option value="">Do not force</option>
                  <option value="en">English (en)</option>
                  <option value="es">Espa&ntilde;ol (es)</option>
                  <option value="fr">Fran&ccedil;ais (fr)</option>
                  <option value="de">Deutsch (de)</option>
                  <option value="pt">Portugu&ecirc;s (pt)</option>
                  <option value="zh">Chinese (zh)</option>
                  <option value="ja">Japanese (ja)</option>
                  <option value="ar">Arabic (ar)</option>
                </select>
              </FormField>

              <FormField
                label="Maximum upload size"
                help="This setting determines the largest size of file that can be uploaded to the course."
              >
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
              <FormField
                label="Enable completion tracking"
                help="If enabled, activity completion conditions may be set in the activity settings and/or course completion conditions."
              >
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

            {/* Submit */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="btn btn-primary py-2 px-6"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save and display'
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary py-2 px-6"
                disabled={saving}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent, false)}
              >
                {saving ? 'Saving...' : 'Save and return'}
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
