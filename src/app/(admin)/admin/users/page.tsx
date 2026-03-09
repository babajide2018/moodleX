import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { usersCategories } from '@/lib/admin-structure';

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Users"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={usersCategories} />
        </div>
      </div>
    </>
  );
}
