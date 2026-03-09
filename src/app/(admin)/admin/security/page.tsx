import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { securityCategories } from '@/lib/admin-structure';

export default function AdminSecurityPage() {
  return (
    <>
      <PageHeader
        title="Security"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={securityCategories} />
        </div>
      </div>
    </>
  );
}
