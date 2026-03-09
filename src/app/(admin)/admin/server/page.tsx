import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { serverCategories } from '@/lib/admin-structure';

export default function AdminServerPage() {
  return (
    <>
      <PageHeader
        title="Server"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={serverCategories} />
        </div>
      </div>
    </>
  );
}
