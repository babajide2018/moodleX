import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import Link from 'next/link';
import { adminTabs } from '@/lib/admin-tabs';

const adminCategories = [
  {
    title: 'Site administration',
    items: [
      { label: 'Notifications', href: '/admin', description: 'Check for available updates and important notifications' },
      { label: 'Registration', href: '/admin/settings', description: 'Register your MoodleX site' },
    ],
  },
  {
    title: 'Users',
    items: [
      { label: 'Browse list of users', href: '/admin/users', description: 'View, search, and manage all user accounts' },
      { label: 'Add a new user', href: '/admin/users?action=add', description: 'Create a new user account' },
      { label: 'Cohorts', href: '/admin/users?tab=cohorts', description: 'Manage site-wide cohorts' },
      { label: 'Upload users', href: '/admin/users?action=upload', description: 'Bulk upload users from CSV' },
    ],
  },
  {
    title: 'Courses',
    items: [
      { label: 'Manage courses and categories', href: '/admin/courses', description: 'Create, edit, and organize courses' },
      { label: 'Add a new course', href: '/admin/courses?action=add', description: 'Create a new course' },
      { label: 'Course default settings', href: '/admin/courses?tab=defaults', description: 'Configure default course settings' },
      { label: 'Restore course', href: '/admin/courses?action=restore', description: 'Restore a course from backup' },
    ],
  },
  {
    title: 'Grades',
    items: [
      { label: 'Grade settings', href: '/admin/grades', description: 'Configure grading system settings' },
      { label: 'Grade category settings', href: '/admin/grades?tab=categories', description: 'Manage grade categories' },
      { label: 'Scales', href: '/admin/grades?tab=scales', description: 'Manage grading scales' },
      { label: 'Letters', href: '/admin/grades?tab=letters', description: 'Configure grade letters' },
    ],
  },
  {
    title: 'Plugins',
    items: [
      { label: 'Plugins overview', href: '/admin/plugins', description: 'View all installed plugins and their status' },
      { label: 'Manage activities', href: '/admin/plugins?tab=activities', description: 'Enable or disable activity modules' },
      { label: 'Manage blocks', href: '/admin/plugins?tab=blocks', description: 'Enable or disable blocks' },
      { label: 'Manage authentication', href: '/admin/plugins?tab=auth', description: 'Configure authentication methods' },
      { label: 'Manage enrolments', href: '/admin/plugins?tab=enrol', description: 'Configure enrollment methods' },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { label: 'Theme settings', href: '/admin/appearance', description: 'Select and configure the site theme' },
      { label: 'Navigation', href: '/admin/appearance?tab=nav', description: 'Configure navigation settings' },
      { label: 'Default Dashboard page', href: '/admin/appearance?tab=dashboard', description: 'Configure the default dashboard layout' },
    ],
  },
  {
    title: 'Server',
    items: [
      { label: 'System paths', href: '/admin/settings', description: 'Configure server paths' },
      { label: 'Email', href: '/admin/settings?tab=email', description: 'Configure outgoing email settings' },
      { label: 'Scheduled tasks', href: '/admin/settings?tab=tasks', description: 'Manage background scheduled tasks' },
      { label: 'Environment', href: '/admin/settings?tab=environment', description: 'Check server environment' },
      { label: 'PHP info', href: '/admin/settings?tab=phpinfo', description: 'View server configuration' },
    ],
  },
  {
    title: 'Security',
    items: [
      { label: 'Site security settings', href: '/admin/security', description: 'Configure security policies' },
      { label: 'IP blocker', href: '/admin/security?tab=ipblocker', description: 'Block or allow specific IP addresses' },
      { label: 'HTTP security', href: '/admin/security?tab=http', description: 'Configure HTTP security headers' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Logs', href: '/admin/reports', description: 'View activity logs' },
      { label: 'Live logs', href: '/admin/reports?tab=live', description: 'View real-time activity logs' },
      { label: 'Config changes', href: '/admin/reports?tab=config', description: 'Track configuration changes' },
    ],
  },
];

export default function AdminPage() {
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
                className="form-control pl-10"
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

          {/* Admin categories grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {adminCategories.map((category) => (
              <div
                key={category.title}
                className="border border-[var(--border-color)] rounded-lg overflow-hidden"
              >
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">{category.title}</h3>
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                  {category.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors no-underline"
                    >
                      <div className="text-sm font-medium text-[var(--text-link)]">
                        {item.label}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
