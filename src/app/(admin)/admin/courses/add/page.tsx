'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  depth: number;
}

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
        type="button"
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

function AddCoursePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get('category') || '';
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [fullname, setFullname] = useState('');
  const [shortname, setShortname] = useState('');
  const [shortnameManual, setShortnameManual] = useState(false);
  const [categoryId, setCategoryId] = useState(preselectedCategory);
  const [visible, setVisible] = useState('1');
  const [startdate, setStartdate] = useState(new Date().toISOString().split('T')[0]);
  const [enddate, setEnddate] = useState('');
  const [enddateEnabled, setEnddateEnabled] = useState(false);
  const [idnumber, setIdnumber] = useState('');
  const [summary, setSummary] = useState('');
  const [format, setFormat] = useState('topics');
  const [numsections, setNumsections] = useState(10);
  const [hiddensections, setHiddensections] = useState('0');
  const [courselayout, setCourselayout] = useState('0');
  const [lang, setLang] = useState('');
  const [newsitems, setNewsitems] = useState('5');
  const [showactivitydates, setShowactivitydates] = useState('1');
  const [maxbytes, setMaxbytes] = useState('0');
  const [enablecompletion, setEnablecompletion] = useState('1');
  const [showcompletionconditions, setShowcompletionconditions] = useState('1');
  const [groupmode, setGroupmode] = useState('0');
  const [groupmodeforce, setGroupmodeforce] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate shortname from fullname
  const generateShortname = (name: string): string => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].substring(0, 8).toUpperCase();
    // Take first letter of each significant word (skip small words like "to", "of", "and", "the", "a", "in")
    const skip = new Set(['to', 'of', 'and', 'the', 'a', 'an', 'in', 'for', 'on', 'at', 'by']);
    const letters = words
      .filter((w, i) => i === 0 || !skip.has(w.toLowerCase()))
      .map((w) => w[0].toUpperCase())
      .join('');
    return letters || words[0].substring(0, 8).toUpperCase();
  };

  const handleFullnameChange = (value: string) => {
    setFullname(value);
    if (!shortnameManual) {
      setShortname(generateShortname(value));
    }
  };

  const handleShortnameChange = (value: string) => {
    setShortname(value);
    setShortnameManual(true);
  };

  // Fetch categories from database
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          const cats = data.categories.map((c: CategoryOption) => ({
            id: c.id,
            name: c.name,
            depth: c.depth,
          }));
          setCategories(cats);
          // Only auto-select first category if none preselected via URL
          if (!preselectedCategory) {
            setCategoryId(cats[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent, action: 'display' | 'return') => {
    e.preventDefault();
    setStatus(null);

    if (!fullname.trim()) {
      setStatus({ type: 'error', message: 'Course full name is required.' });
      return;
    }
    if (!shortname.trim()) {
      setStatus({ type: 'error', message: 'Course short name is required.' });
      return;
    }
    if (!categoryId) {
      setStatus({ type: 'error', message: 'Please select a course category.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: fullname.trim(),
          shortname: shortname.trim(),
          categoryId,
          visible: visible === '1',
          startdate,
          enddate: enddateEnabled && enddate ? enddate : null,
          idnumber: idnumber.trim() || null,
          summary: summary.trim() || null,
          format,
          numsections,
          lang: lang || null,
          maxbytes: parseInt(maxbytes),
          showactivitydates: showactivitydates === '1',
          enablecompletion: enablecompletion === '1',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Failed to create course.' });
        return;
      }

      setStatus({ type: 'success', message: `Course "${fullname.trim()}" created successfully.` });

      setTimeout(() => {
        if (action === 'display' && data.course?.id) {
          router.push(`/course/${data.course.id}`);
        } else {
          router.push('/admin/courses/manage');
        }
      }, 1000);
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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
          {/* Status message */}
          {status && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {status.message}
            </div>
          )}

          <form className="max-w-3xl space-y-4" onSubmit={(e) => handleSubmit(e, 'return')}>
            <SettingsSection title="General">
              <SettingField label="Course full name" required help="The full name of the course is displayed at the top of each page and in the list of courses.">
                <input
                  type="text"
                  className="form-control text-sm"
                  placeholder="e.g. Introduction to Computer Science"
                  value={fullname}
                  onChange={(e) => handleFullnameChange(e.target.value)}
                  required
                />
              </SettingField>

              <SettingField label="Course short name" help="A short name is used in several places where the long name is not suitable (e.g. in the navigation). Auto-generated from the full name, but you can edit it.">
                <input
                  type="text"
                  className="form-control text-sm"
                  placeholder="e.g. CS101"
                  value={shortname}
                  onChange={(e) => handleShortnameChange(e.target.value)}
                />
              </SettingField>

              <SettingField label="Course category" required help="The category the course belongs to.">
                <select
                  className="form-control text-sm"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {'\u00A0'.repeat(cat.depth * 2)}{cat.name}
                    </option>
                  ))}
                </select>
              </SettingField>

              <SettingField label="Course visibility" help="This setting determines whether the course appears in the list of courses. Staff can still access a hidden course via its URL.">
                <select className="form-control text-sm" value={visible} onChange={(e) => setVisible(e.target.value)}>
                  <option value="1">Show</option>
                  <option value="0">Hide</option>
                </select>
              </SettingField>

              <SettingField label="Course start date" help="This setting determines the start of the first week for a course in weekly format. It also determines the earliest date logs are available for.">
                <input
                  type="date"
                  className="form-control text-sm"
                  value={startdate}
                  onChange={(e) => setStartdate(e.target.value)}
                />
              </SettingField>

              <SettingField label="Course end date" help="The course end date is used for determining whether a course should be included in a user's list of courses. It is also used by reports.">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="form-control text-sm"
                    value={enddate}
                    onChange={(e) => setEnddate(e.target.value)}
                    disabled={!enddateEnabled}
                  />
                  <label className="flex items-center gap-1 text-sm text-[var(--text-muted)] whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={enddateEnabled}
                      onChange={(e) => setEnddateEnabled(e.target.checked)}
                    /> Enable
                  </label>
                </div>
              </SettingField>

              <SettingField label="Course ID number" help="The ID number is only used when matching this course against external systems.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={idnumber}
                  onChange={(e) => setIdnumber(e.target.value)}
                />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Description" defaultOpen={false}>
              <SettingField label="Course summary" help="The course summary is displayed in the list of courses. A course search searches course summary text in addition to course names.">
                <textarea
                  className="form-control text-sm"
                  rows={5}
                  placeholder="Enter a description of the course..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </SettingField>

              <SettingField label="Course image" help="The image is displayed in the course list and on the course dashboard.">
                <div
                  className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--moodle-primary)] hover:bg-blue-50/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                >
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="Course preview" className="max-h-32 mx-auto rounded" />
                      <p className="text-xs text-[var(--text-muted)]">{imageFile?.name}</p>
                      <button
                        type="button"
                        className="btn btn-secondary text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-[var(--text-muted)]">Drag and drop an image here, or click to browse.</p>
                      <button type="button" className="btn btn-secondary text-sm mt-2" onClick={() => fileInputRef.current?.click()}>Choose a file</button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Course format" defaultOpen={false}>
              <SettingField label="Format" help="The course format determines the layout of the course page.">
                <select className="form-control text-sm" value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="topics">Topics format</option>
                  <option value="weeks">Weekly format</option>
                  <option value="social">Social format</option>
                  <option value="singleactivity">Single activity format</option>
                </select>
              </SettingField>

              <SettingField label="Number of sections" help="The number of sections in the course. This can be changed at any time.">
                <input
                  type="number"
                  className="form-control text-sm"
                  value={numsections}
                  onChange={(e) => setNumsections(parseInt(e.target.value) || 0)}
                  min={0}
                  max={52}
                />
              </SettingField>

              <SettingField label="Hidden sections" help="How hidden sections are shown to students.">
                <select className="form-control text-sm" value={hiddensections} onChange={(e) => setHiddensections(e.target.value)}>
                  <option value="0">Hidden sections are shown as not available</option>
                  <option value="1">Hidden sections are completely invisible</option>
                </select>
              </SettingField>

              <SettingField label="Course layout" help="How to display the course content on the course page.">
                <select className="form-control text-sm" value={courselayout} onChange={(e) => setCourselayout(e.target.value)}>
                  <option value="0">Show all sections on one page</option>
                  <option value="1">Show one section per page</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Appearance" defaultOpen={false}>
              <SettingField label="Force language" help="Force the language used in the course. If not forced, users can choose their own language.">
                <select className="form-control text-sm" value={lang} onChange={(e) => setLang(e.target.value)}>
                  <option value="">Do not force</option>
                  <option value="en">English (en)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="es">Spanish (es)</option>
                </select>
              </SettingField>

              <SettingField label="News items to show" help="The number of recent discussions that appear in the latest announcements block.">
                <select className="form-control text-sm" value={newsitems} onChange={(e) => setNewsitems(e.target.value)}>
                  {[5, 4, 3, 2, 1, 0].map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </SettingField>

              <SettingField label="Show activity dates" help="Show activity dates on the course page.">
                <select className="form-control text-sm" value={showactivitydates} onChange={(e) => setShowactivitydates(e.target.value)}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Files and uploads" defaultOpen={false}>
              <SettingField label="Maximum upload size" help="This setting determines the largest size of file that can be uploaded to this course.">
                <select className="form-control text-sm" value={maxbytes} onChange={(e) => setMaxbytes(e.target.value)}>
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
                <select className="form-control text-sm" value={enablecompletion} onChange={(e) => setEnablecompletion(e.target.value)}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Show activity completion conditions" help="Show activity completion conditions on the course page.">
                <select className="form-control text-sm" value={showcompletionconditions} onChange={(e) => setShowcompletionconditions(e.target.value)}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Groups" defaultOpen={false}>
              <SettingField label="Group mode" help="This setting has 3 options: no groups, separate groups, visible groups.">
                <select className="form-control text-sm" value={groupmode} onChange={(e) => setGroupmode(e.target.value)}>
                  <option value="0">No groups</option>
                  <option value="1">Separate groups</option>
                  <option value="2">Visible groups</option>
                </select>
              </SettingField>

              <SettingField label="Force group mode" help="If group mode is forced, then the course group mode is applied to every activity and the group mode cannot be changed at activity level.">
                <select className="form-control text-sm" value={groupmodeforce} onChange={(e) => setGroupmodeforce(e.target.value)}>
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
              <button
                type="button"
                className="btn btn-primary text-sm flex items-center gap-2"
                disabled={loading}
                onClick={(e) => handleSubmit(e, 'display')}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Save and display
              </button>
              <button
                type="submit"
                className="btn btn-secondary text-sm flex items-center gap-2"
                disabled={loading}
              >
                Save and return
              </button>
              <button
                type="button"
                className="btn btn-secondary text-sm"
                onClick={() => router.push('/admin/courses/manage')}
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

export default function AddCoursePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-sm text-[var(--text-muted)]">Loading...</div>}>
      <AddCoursePageInner />
    </Suspense>
  );
}
