import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { pluginsCategories } from '@/lib/admin-structure';

export default function AdminPluginsPage() {
  return (
    <>
      <PageHeader
        title="Plugins"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={pluginsCategories} />
        </div>
      </div>
    </>
  );
}
