import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { reportsCategories } from '@/lib/admin-structure';

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={reportsCategories} />
        </div>
      </div>
    </>
  );
}
