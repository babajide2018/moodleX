'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [idnumber, setIdnumber] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch existing categories for parent selector
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(
            data.categories.map((c: CategoryOption & { depth: number }) => ({
              id: c.id,
              name: c.name,
              depth: c.depth,
            }))
          );
        }
      })
      .catch(() => {
        // If DB not set up yet, just show Top as the only option
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim()) {
      setStatus({ type: 'error', message: 'Category name is required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          parentId: parentId || null,
          idnumber: idnumber.trim() || null,
          description: description.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Failed to create category.' });
        return;
      }

      setStatus({ type: 'success', message: `Category "${name.trim()}" created successfully.` });

      // Clear form
      setName('');
      setParentId('');
      setIdnumber('');
      setDescription('');

      // Redirect to manage page after a brief delay
      setTimeout(() => {
        router.push('/admin/courses/manage');
      }, 1500);
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add a new category"
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

          <form className="max-w-3xl space-y-4" onSubmit={handleSubmit}>
            <SettingsSection title="General">
              <SettingField label="Parent category" help="The category under which this new category will appear.">
                <select
                  className="form-control text-sm"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="">Top</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {'\u00A0'.repeat(cat.depth * 2)}{cat.name}
                    </option>
                  ))}
                </select>
              </SettingField>

              <SettingField label="Category name" required help="The name of the new category.">
                <input
                  type="text"
                  className="form-control text-sm"
                  placeholder="e.g. Computer Science"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </SettingField>

              <SettingField label="Category ID number" help="An optional ID number used for matching with external systems. It is not displayed anywhere.">
                <input
                  type="text"
                  className="form-control text-sm"
                  value={idnumber}
                  onChange={(e) => setIdnumber(e.target.value)}
                />
              </SettingField>

              <SettingField label="Description" help="An optional description of the category.">
                <textarea
                  className="form-control text-sm"
                  rows={5}
                  placeholder="Enter a description for this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </SettingField>
            </SettingsSection>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="btn btn-primary text-sm flex items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Creating...' : 'Create category'}
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
