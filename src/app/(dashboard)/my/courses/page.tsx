import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import CourseOverview from '@/components/dashboard/CourseOverview';

const dashboardTabs = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'mycourses', label: 'My courses', href: '/my/courses' },
];

export default function MyCoursesPage() {
  return (
    <>
      <PageHeader
        title="My courses"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My courses' },
        ]}
      />

      <SecondaryNavigation tabs={dashboardTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <CourseOverview />
        </div>
      </div>
    </>
  );
}
