import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { adminStructure } from '@/lib/admin-structure';

export default function AdminPage() {
  // Combine all tab categories into a single overview (like Moodle's admin search page)
  const allCategories = Object.values(adminStructure).flat();

  return (
    <>
      <PageHeader
        title="Site administration"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Site administration' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Admin search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search settings..."
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* Admin categories grid — all tabs combined */}
          <AdminCategoryGrid categories={allCategories} />
        </div>
      </div>
    </>
  );
}
