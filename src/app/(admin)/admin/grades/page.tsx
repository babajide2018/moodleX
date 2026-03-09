import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { gradesCategories } from '@/lib/admin-structure';

export default function AdminGradesPage() {
  return (
    <>
      <PageHeader
        title="Grades"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={gradesCategories} />
        </div>
      </div>
    </>
  );
}
