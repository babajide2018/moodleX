'use client';

import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { ExternalLink } from 'lucide-react';

interface AdminTool {
  id: string;
  name: string;
  description: string;
  href: string;
}

const adminTools: AdminTool[] = [
  { id: 'assignmentupgrade', name: 'Assignment upgrade helper', description: 'Lists all the old assignment activities that have not yet been upgraded to the new assignment module.', href: '#' },
  { id: 'behat', name: 'Acceptance testing', description: 'Tool for generating acceptance test configuration.', href: '#' },
  { id: 'capability', name: 'Capability overview', description: 'View the capabilities for a particular role or search for a capability.', href: '#' },
  { id: 'customlang', name: 'Language customisation', description: 'Allows you to customise the language strings used on the site.', href: '#' },
  { id: 'dbtransfer', name: 'Database transfer', description: 'Transfer the database from one database server to another.', href: '#' },
  { id: 'filetypes', name: 'File types', description: 'Manage the file types recognised by the system.', href: '#' },
  { id: 'generator', name: 'Make test course', description: 'Create large courses with many activities and users for testing.', href: '#' },
  { id: 'httpsreplace', name: 'HTTPS conversion', description: 'Replace http:// links with https:// in content.', href: '#' },
  { id: 'installaddon', name: 'Install plugins', description: 'Install additional plugins from the Moodle plugins directory.', href: '#' },
  { id: 'langimport', name: 'Language packs', description: 'Import additional language packs from the Moodle language repository.', href: '#' },
  { id: 'log', name: 'Logging', description: 'Configure where Moodle logs are stored.', href: '#' },
  { id: 'lp', name: 'Learning plans', description: 'Manage learning plan templates and competency frameworks.', href: '#' },
  { id: 'messageinbound', name: 'Inbound message configuration', description: 'Configure the incoming message handler.', href: '#' },
  { id: 'mobile', name: 'Moodle app tools', description: 'Tools for managing the Moodle mobile app integration.', href: '#' },
  { id: 'monitor', name: 'Event monitoring rules', description: 'Create and manage event monitoring rules and subscriptions.', href: '#' },
  { id: 'phpunit', name: 'PHPUnit tests', description: 'Configuration tool for running PHPUnit tests.', href: '#' },
  { id: 'policy', name: 'Policies', description: 'Manage site policies that users must agree to.', href: '#' },
  { id: 'profiling', name: 'Profiling runs', description: 'View results of profiling runs for performance analysis.', href: '#' },
  { id: 'recyclebin', name: 'Recycle bin', description: 'Manage the recycle bin settings for deleted courses and activities.', href: '#' },
  { id: 'replace', name: 'DB search and replace', description: 'Search and replace text throughout the database.', href: '#' },
  { id: 'spamcleaner', name: 'Spam cleaner', description: 'Find and remove spam content from user profiles.', href: '#' },
  { id: 'task', name: 'Scheduled tasks', description: 'View and configure scheduled tasks (cron jobs).', href: '#' },
  { id: 'templatelibrary', name: 'Template library', description: 'Browse the library of available templates.', href: '#' },
  { id: 'unsupreqs', name: 'Unsupported DB changes', description: 'Check for unsupported modifications to the database schema.', href: '#' },
  { id: 'uploadcourse', name: 'Upload courses', description: 'Upload courses from a CSV file.', href: '#' },
  { id: 'uploaduser', name: 'Upload users', description: 'Upload users from a CSV file.', href: '#' },
  { id: 'xmldb', name: 'XMLDB editor', description: 'Edit database schema definition files.', href: '#' },
];

export default function AdminToolsPage() {
  return (
    <>
      <PageHeader
        title="Admin tools"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Admin tools' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Admin tools provide additional functionality for site administrators.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Tool name</th>
                  <th className="py-2 px-3 text-left font-semibold">Description</th>
                  <th className="py-2 px-3 text-center font-semibold w-20">Link</th>
                </tr>
              </thead>
              <tbody>
                {adminTools.map((tool) => (
                  <tr key={tool.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3 font-medium whitespace-nowrap">
                      <Link href={tool.href} className="text-[var(--text-link)] hover:underline">
                        {tool.name}
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs">
                      {tool.description}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Link href={tool.href} className="btn-icon" title={`Open ${tool.name}`}>
                        <ExternalLink size={14} className="text-[var(--text-link)]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
