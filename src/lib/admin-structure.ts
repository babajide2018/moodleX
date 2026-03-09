/**
 * Moodle Site Administration structure.
 * Matches the real Moodle 4.x admin tree hierarchy.
 * Each tab has subcategories with items (pages/links).
 */

export interface AdminItem {
  label: string;
  href: string;
  description?: string;
}

export interface AdminSubcategory {
  title: string;
  items: AdminItem[];
}

// ── General tab ──────────────────────────────────────────────
export const generalCategories: AdminSubcategory[] = [
  {
    title: 'Site administration',
    items: [
      { label: 'Notifications', href: '/admin/general/notifications', description: 'Check for available updates and important notifications' },
      { label: 'Registration', href: '/admin/general/registration', description: 'Register your site with Moodle' },
    ],
  },
  {
    title: 'Front page settings',
    items: [
      { label: 'Front page settings', href: '/admin/general/frontpage', description: 'Configure the site name, front page layout, and description' },
    ],
  },
  {
    title: 'Advanced features',
    items: [
      { label: 'Advanced features', href: '/admin/general/advanced', description: 'Enable or disable optional subsystems like badges, competencies, analytics' },
    ],
  },
];

// ── Users tab ────────────────────────────────────────────────
export const usersCategories: AdminSubcategory[] = [
  {
    title: 'Accounts',
    items: [
      { label: 'Browse list of users', href: '/admin/users/browse', description: 'View, search, and manage all user accounts' },
      { label: 'Bulk user actions', href: '/admin/users/bulk', description: 'Perform actions on multiple users at once' },
      { label: 'Add a new user', href: '/admin/users/add', description: 'Create a new user account manually' },
      { label: 'User management settings', href: '/admin/users/settings', description: 'Configure user account management preferences' },
      { label: 'User default preferences', href: '/admin/users/defaults', description: 'Set default preferences for new user accounts' },
      { label: 'User profile fields', href: '/admin/users/profilefields', description: 'Add and manage custom user profile fields' },
      { label: 'Cohorts', href: '/admin/users/cohorts', description: 'Manage site-wide cohorts (site-wide groups)' },
      { label: 'Upload users', href: '/admin/users/upload', description: 'Bulk create or update users from a CSV file' },
      { label: 'Upload user pictures', href: '/admin/users/uploadpictures', description: 'Bulk upload profile pictures for users' },
    ],
  },
  {
    title: 'Permissions',
    items: [
      { label: 'User policies', href: '/admin/users/policies', description: 'Configure role assignment, guest access, and profile sharing policies' },
      { label: 'Site administrators', href: '/admin/users/admins', description: 'Manage which users have full site administrator access' },
      { label: 'Define roles', href: '/admin/users/roles', description: 'Create and edit roles with specific capabilities' },
      { label: 'Assign system roles', href: '/admin/users/assignroles', description: 'Assign roles at the system (site-wide) level' },
      { label: 'Check system permissions', href: '/admin/users/checkpermissions', description: 'Verify what a specific user can and cannot do' },
      { label: 'Capability overview', href: '/admin/users/capabilities', description: 'View all capabilities and which roles have them' },
    ],
  },
  {
    title: 'Privacy and policies',
    items: [
      { label: 'Privacy settings', href: '/admin/users/privacy', description: 'Configure data privacy and retention settings' },
      { label: 'Policy settings', href: '/admin/users/policysettings', description: 'Set up site policy and terms of service URLs' },
    ],
  },
];

// ── Courses tab ──────────────────────────────────────────────
export const coursesCategories: AdminSubcategory[] = [
  {
    title: 'Manage courses and categories',
    items: [
      { label: 'Manage courses and categories', href: '/admin/courses/manage', description: 'Create, edit, move, and organize courses and categories' },
      { label: 'Add a new category', href: '/admin/courses/addcategory', description: 'Create a new course category' },
      { label: 'Add a new course', href: '/admin/courses/add', description: 'Create a new course' },
      { label: 'Restore course', href: '/admin/courses/restore', description: 'Restore a course from a backup file' },
      { label: 'Pending course requests', href: '/admin/courses/pending', description: 'Review and approve or reject course creation requests' },
    ],
  },
  {
    title: 'Course default settings',
    items: [
      { label: 'Course default settings', href: '/admin/courses/defaults', description: 'Set default values for new courses (format, sections, visibility)' },
      { label: 'Course request settings', href: '/admin/courses/requests', description: 'Enable course requests and configure default request category' },
      { label: 'Download course content', href: '/admin/courses/download', description: 'Configure settings for course content download' },
    ],
  },
  {
    title: 'Activity chooser',
    items: [
      { label: 'Activity chooser', href: '/admin/courses/activitychooser', description: 'Configure the activity and resource chooser modal' },
    ],
  },
  {
    title: 'Backups',
    items: [
      { label: 'General backup defaults', href: '/admin/courses/backup', description: 'Configure default settings for automated course backups' },
      { label: 'General restore defaults', href: '/admin/courses/restoredefaults', description: 'Configure default settings for course restore operations' },
      { label: 'Automated backup setup', href: '/admin/courses/automatedbackup', description: 'Schedule and manage automated backups for all courses' },
    ],
  },
];

// ── Grades tab ───────────────────────────────────────────────
export const gradesCategories: AdminSubcategory[] = [
  {
    title: 'General settings',
    items: [
      { label: 'Grade settings', href: '/admin/grades/settings', description: 'Configure grading system, aggregation, and display settings' },
      { label: 'Grade category settings', href: '/admin/grades/categories', description: 'Set default grade category aggregation and options' },
      { label: 'Grade item settings', href: '/admin/grades/items', description: 'Configure grade item display and advanced options' },
    ],
  },
  {
    title: 'Scales',
    items: [
      { label: 'Scales', href: '/admin/grades/scales', description: 'Create and manage custom grading scales' },
      { label: 'Letters', href: '/admin/grades/letters', description: 'Configure grade letter boundaries (A, B, C, etc.)' },
      { label: 'Outcomes', href: '/admin/grades/outcomes', description: 'Manage learning outcomes and competencies used in grading' },
    ],
  },
  {
    title: 'Grade reports',
    items: [
      { label: 'Grader report', href: '/admin/grades/graderreport', description: 'Configure the grader report (gradebook) settings' },
      { label: 'Overview report', href: '/admin/grades/overviewreport', description: 'Settings for the grade overview report' },
      { label: 'User report', href: '/admin/grades/userreport', description: 'Settings for the individual user grade report' },
      { label: 'Single view', href: '/admin/grades/singleview', description: 'Settings for single grade item or user view' },
    ],
  },
  {
    title: 'Grade import/export',
    items: [
      { label: 'CSV import', href: '/admin/grades/csvimport', description: 'Import grades from CSV files' },
      { label: 'XML import', href: '/admin/grades/xmlimport', description: 'Import grades from XML files' },
      { label: 'CSV export', href: '/admin/grades/csvexport', description: 'Export grades to CSV format' },
      { label: 'Excel export', href: '/admin/grades/excelexport', description: 'Export grades to Excel format' },
      { label: 'XML export', href: '/admin/grades/xmlexport', description: 'Export grades to XML format' },
    ],
  },
];

// ── Plugins tab ──────────────────────────────────────────────
export const pluginsCategories: AdminSubcategory[] = [
  {
    title: 'Plugins overview',
    items: [
      { label: 'Plugins overview', href: '/admin/plugins/overview', description: 'View status of all installed plugins, check for updates' },
    ],
  },
  {
    title: 'Activity modules',
    items: [
      { label: 'Manage activities', href: '/admin/plugins/activities', description: 'Enable, disable, or configure activity modules' },
      { label: 'Assignment', href: '/admin/plugins/mod-assign', description: 'Configure assignment submission and feedback plugins' },
      { label: 'Forum', href: '/admin/plugins/mod-forum', description: 'Configure forum module default settings' },
      { label: 'Quiz', href: '/admin/plugins/mod-quiz', description: 'Configure quiz module default settings' },
      { label: 'Workshop', href: '/admin/plugins/mod-workshop', description: 'Configure peer assessment workshop settings' },
    ],
  },
  {
    title: 'Blocks',
    items: [
      { label: 'Manage blocks', href: '/admin/plugins/blocks', description: 'Enable, disable, or uninstall block plugins' },
    ],
  },
  {
    title: 'Authentication',
    items: [
      { label: 'Manage authentication', href: '/admin/plugins/auth', description: 'Configure authentication methods and their settings' },
      { label: 'Email-based self-registration', href: '/admin/plugins/auth-email', description: 'Allow users to register themselves via email' },
      { label: 'Manual accounts', href: '/admin/plugins/auth-manual', description: 'Settings for manually created accounts' },
    ],
  },
  {
    title: 'Enrolments',
    items: [
      { label: 'Manage enrolment plugins', href: '/admin/plugins/enrol', description: 'Enable and configure enrolment methods' },
      { label: 'Manual enrolments', href: '/admin/plugins/enrol-manual', description: 'Settings for manual course enrolments' },
      { label: 'Self enrolment', href: '/admin/plugins/enrol-self', description: 'Allow students to self-enrol in courses' },
      { label: 'Guest access', href: '/admin/plugins/enrol-guest', description: 'Configure guest access to courses' },
      { label: 'Cohort sync', href: '/admin/plugins/enrol-cohort', description: 'Synchronise cohort membership with course enrolment' },
    ],
  },
  {
    title: 'Text editors',
    items: [
      { label: 'Manage editors', href: '/admin/plugins/editors', description: 'Configure and order text editors' },
    ],
  },
  {
    title: 'Course formats',
    items: [
      { label: 'Manage course formats', href: '/admin/plugins/formats', description: 'Enable and configure course format plugins' },
    ],
  },
  {
    title: 'Filters',
    items: [
      { label: 'Manage filters', href: '/admin/plugins/filters', description: 'Enable and order content filters (e.g., MathJax, multimedia)' },
    ],
  },
  {
    title: 'Repositories',
    items: [
      { label: 'Manage repositories', href: '/admin/plugins/repositories', description: 'Configure file repositories (upload, server files, etc.)' },
    ],
  },
  {
    title: 'Question types',
    items: [
      { label: 'Manage question types', href: '/admin/plugins/qtypes', description: 'Enable and configure question types for quizzes' },
    ],
  },
  {
    title: 'Admin tools',
    items: [
      { label: 'Admin tools', href: '/admin/plugins/tools', description: 'Manage admin tool plugins' },
    ],
  },
];

// ── Appearance tab ───────────────────────────────────────────
export const appearanceCategories: AdminSubcategory[] = [
  {
    title: 'Themes',
    items: [
      { label: 'Theme selector', href: '/admin/appearance/themes', description: 'Choose and preview the site theme' },
      { label: 'Theme settings', href: '/admin/appearance/themesettings', description: 'Configure global theme options (designer mode, device detection)' },
      { label: 'Boost', href: '/admin/appearance/boost', description: 'Configure Boost theme (branding, colours, custom SCSS)' },
    ],
  },
  {
    title: 'Logos',
    items: [
      { label: 'Logos', href: '/admin/appearance/logos', description: 'Upload site logo, compact logo, and favicon' },
    ],
  },
  {
    title: 'Course colours',
    items: [
      { label: 'Course colours', href: '/admin/appearance/coursecolours', description: 'Configure the colour palette for course placeholder images' },
    ],
  },
  {
    title: 'Calendar',
    items: [
      { label: 'Calendar', href: '/admin/appearance/calendar', description: 'Configure calendar type, weekend days, time format, and export settings' },
    ],
  },
  {
    title: 'Blog',
    items: [
      { label: 'Blog settings', href: '/admin/appearance/blog', description: 'Configure blog visibility, external blogs, and comments' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { label: 'Navigation settings', href: '/admin/appearance/navigation', description: 'Configure default home page, navigation elements, and course limits' },
    ],
  },
  {
    title: 'HTML settings',
    items: [
      { label: 'Site policy', href: '/admin/appearance/sitepolicy', description: 'Configure site-level formatting and HTML settings' },
    ],
  },
  {
    title: 'Default Dashboard page',
    items: [
      { label: 'Dashboard settings', href: '/admin/appearance/dashboard', description: 'Configure the default dashboard layout and blocks' },
    ],
  },
  {
    title: 'Default profile page',
    items: [
      { label: 'Profile page defaults', href: '/admin/appearance/profile', description: 'Configure default user profile page layout' },
    ],
  },
];

// ── Server tab ───────────────────────────────────────────────
export const serverCategories: AdminSubcategory[] = [
  {
    title: 'System paths',
    items: [
      { label: 'System paths', href: '/admin/server/paths', description: 'Configure server paths (data root, temp, cache, backup directories)' },
    ],
  },
  {
    title: 'Support contact',
    items: [
      { label: 'Support contact', href: '/admin/server/support', description: 'Set support name, email, and page URL' },
    ],
  },
  {
    title: 'Session handling',
    items: [
      { label: 'Session handling', href: '/admin/server/sessions', description: 'Configure session timeout, cookie settings, and database sessions' },
    ],
  },
  {
    title: 'Email',
    items: [
      { label: 'Outgoing mail configuration', href: '/admin/server/email', description: 'Configure SMTP server, port, security, and authentication' },
      { label: 'Incoming mail configuration', href: '/admin/server/incomingmail', description: 'Configure incoming mail handling settings' },
      { label: 'Messaging output settings', href: '/admin/server/messaging', description: 'Configure email, mobile, and popup message output' },
    ],
  },
  {
    title: 'Task configuration',
    items: [
      { label: 'Scheduled tasks', href: '/admin/server/tasks', description: 'View and configure all scheduled background tasks' },
      { label: 'Task processing', href: '/admin/server/taskprocessing', description: 'Configure task runner concurrency and limits' },
      { label: 'Task logs', href: '/admin/server/tasklogs', description: 'View logs from scheduled task execution' },
    ],
  },
  {
    title: 'Web services',
    items: [
      { label: 'Overview', href: '/admin/server/webservices', description: 'Web services configuration overview and setup wizard' },
      { label: 'External services', href: '/admin/server/externalservices', description: 'Manage external service definitions' },
      { label: 'Manage tokens', href: '/admin/server/tokens', description: 'Create and manage web service tokens' },
      { label: 'Manage protocols', href: '/admin/server/protocols', description: 'Enable REST, SOAP, or XML-RPC protocols' },
    ],
  },
  {
    title: 'Performance',
    items: [
      { label: 'Caching', href: '/admin/server/caching', description: 'Configure application, session, and request caches' },
      { label: 'Performance settings', href: '/admin/server/performance', description: 'Configure performance options like theme caching and JavaScript minification' },
    ],
  },
  {
    title: 'Environment',
    items: [
      { label: 'Environment', href: '/admin/server/environment', description: 'Check server environment and software requirements' },
      { label: 'PHP info', href: '/admin/server/phpinfo', description: 'View runtime environment information' },
    ],
  },
];

// ── Reports tab ──────────────────────────────────────────────
export const reportsCategories: AdminSubcategory[] = [
  {
    title: 'Reports',
    items: [
      { label: 'Logs', href: '/admin/reports/logs', description: 'View detailed activity logs for users, courses, and the site' },
      { label: 'Live logs', href: '/admin/reports/live', description: 'View real-time activity logs as they happen' },
      { label: 'Activity report', href: '/admin/reports/activity', description: 'Course activity summary report' },
      { label: 'Participation report', href: '/admin/reports/participation', description: 'Activity participation report for students and teachers' },
    ],
  },
  {
    title: 'Config changes',
    items: [
      { label: 'Config changes', href: '/admin/reports/config', description: 'Track and review all admin configuration changes' },
    ],
  },
  {
    title: 'Security',
    items: [
      { label: 'Security overview', href: '/admin/reports/security', description: 'Review site security checks and recommendations' },
    ],
  },
  {
    title: 'Statistics',
    items: [
      { label: 'Statistics', href: '/admin/reports/stats', description: 'View site usage statistics and trends' },
    ],
  },
  {
    title: 'Backups',
    items: [
      { label: 'Backup logs', href: '/admin/reports/backups', description: 'View automated backup execution logs' },
    ],
  },
];

// ── Security tab ─────────────────────────────────────────────
export const securityCategories: AdminSubcategory[] = [
  {
    title: 'Site security settings',
    items: [
      { label: 'Site security settings', href: '/admin/security/sitesettings', description: 'Configure core security policies for the site' },
    ],
  },
  {
    title: 'IP blocker',
    items: [
      { label: 'IP blocker', href: '/admin/security/ipblocker', description: 'Block or allow access from specific IP addresses or ranges' },
    ],
  },
  {
    title: 'Site policies',
    items: [
      { label: 'Site policies', href: '/admin/security/sitepolicies', description: 'Configure force login, user quotas, cron security, and indexing' },
    ],
  },
  {
    title: 'HTTP security',
    items: [
      { label: 'HTTP security', href: '/admin/security/http', description: 'Configure HTTPS, HSTS, frame embedding, and security headers' },
    ],
  },
  {
    title: 'Password policy',
    items: [
      { label: 'Password policy', href: '/admin/security/password', description: 'Set password strength requirements, lockout, and rotation rules' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { label: 'Notification settings', href: '/admin/security/notifications', description: 'Configure login failure notifications and alert thresholds' },
    ],
  },
  {
    title: 'Anti-spam',
    items: [
      { label: 'CAPTCHA settings', href: '/admin/security/captcha', description: 'Configure reCAPTCHA, hCaptcha, or Turnstile for form protection' },
    ],
  },
];

/**
 * Map of tab key → categories for that tab
 */
export const adminStructure: Record<string, AdminSubcategory[]> = {
  general: generalCategories,
  users: usersCategories,
  courses: coursesCategories,
  grades: gradesCategories,
  plugins: pluginsCategories,
  appearance: appearanceCategories,
  server: serverCategories,
  reports: reportsCategories,
  security: securityCategories,
};
