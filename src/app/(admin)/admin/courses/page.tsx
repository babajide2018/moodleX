import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import AdminCategoryGrid from '@/components/admin/AdminCategoryGrid';
import { adminTabs } from '@/lib/admin-tabs';
import { coursesCategories } from '@/lib/admin-structure';

export default function AdminCoursesPage() {
  return (
    <>
      <PageHeader
        title="Courses"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <AdminCategoryGrid categories={coursesCategories} />
        </div>
      </div>
    </>
  );
}
