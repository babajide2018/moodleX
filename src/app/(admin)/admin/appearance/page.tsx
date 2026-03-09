import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { appearanceCategories } from '@/lib/admin-structure';

export default function AdminAppearancePage() {
  return (
    <>
      <PageHeader
        title="Appearance"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={appearanceCategories} />
        </div>
      </div>
    </>
  );
}
