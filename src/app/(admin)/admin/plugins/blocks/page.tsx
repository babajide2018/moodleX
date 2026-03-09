'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Settings, Trash2, Eye, EyeOff } from 'lucide-react';

interface BlockInfo {
  id: string;
  name: string;
  instances: number;
  version: string;
  enabled: boolean;
  hasSettings: boolean;
  protected: boolean;
}

const initialBlocks: BlockInfo[] = [
  { id: 'activity_modules', name: 'Activities', instances: 0, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'admin_bookmarks', name: 'Admin bookmarks', instances: 2, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'badges', name: 'Latest badges', instances: 5, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'blog_menu', name: 'Blog menu', instances: 1, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'calendar_month', name: 'Calendar', instances: 45, version: '2024100700', enabled: true, hasSettings: false, protected: true },
  { id: 'calendar_upcoming', name: 'Upcoming events', instances: 34, version: '2024100700', enabled: true, hasSettings: false, protected: true },
  { id: 'comments', name: 'Comments', instances: 3, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'completionstatus', name: 'Course completion status', instances: 12, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'course_list', name: 'Courses', instances: 8, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'globalsearch', name: 'Global search', instances: 1, version: '2024100700', enabled: true, hasSettings: true, protected: false },
  { id: 'html', name: 'HTML', instances: 67, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'login', name: 'Login', instances: 1, version: '2024100700', enabled: true, hasSettings: false, protected: true },
  { id: 'mentees', name: 'Mentees', instances: 0, version: '2024100700', enabled: false, hasSettings: false, protected: false },
  { id: 'myoverview', name: 'Course overview', instances: 120, version: '2024100700', enabled: true, hasSettings: false, protected: true },
  { id: 'navigation', name: 'Navigation', instances: 0, version: '2024100700', enabled: true, hasSettings: false, protected: true },
  { id: 'news_items', name: 'Latest announcements', instances: 23, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'online_users', name: 'Online users', instances: 15, version: '2024100700', enabled: true, hasSettings: true, protected: false },
  { id: 'private_files', name: 'Private files', instances: 4, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'recent_activity', name: 'Recent activity', instances: 18, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'recentlyaccesseditems', name: 'Recently accessed items', instances: 89, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'search_forums', name: 'Search forums', instances: 2, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'section_links', name: 'Section links', instances: 6, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'settings', name: 'Settings', instances: 0, version: '2024100700', enabled: true, hasSettings: false, protected: true },
  { id: 'site_main_menu', name: 'Main menu', instances: 1, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'social_activities', name: 'Social activities', instances: 0, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'starredcourses', name: 'Starred courses', instances: 56, version: '2024100700', enabled: true, hasSettings: false, protected: false },
  { id: 'tag_flickr', name: 'Flickr', instances: 0, version: '2024100700', enabled: false, hasSettings: true, protected: false },
  { id: 'tag_youtube', name: 'YouTube', instances: 0, version: '2024100700', enabled: false, hasSettings: true, protected: false },
  { id: 'timeline', name: 'Timeline', instances: 110, version: '2024100700', enabled: true, hasSettings: false, protected: true },
];

export default function ManageBlocksPage() {
  const [blocks, setBlocks] = useState(initialBlocks);

  const toggleEnabled = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  return (
    <>
      <PageHeader
        title="Manage blocks"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Blocks' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            This table shows all installed blocks. You can enable or disable them and access their settings.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Block name</th>
                  <th className="py-2 px-3 text-left font-semibold">Instances</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Version</th>
                  <th className="py-2 px-3 text-center font-semibold">Enabled</th>
                  <th className="py-2 px-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((block) => (
                  <tr
                    key={block.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      !block.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">{block.name}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)]">{block.instances}</td>
                    <td className="py-2 px-3 text-xs font-mono text-[var(--text-muted)] hidden md:table-cell">
                      {block.version}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleEnabled(block.id)}
                        className="btn-icon"
                        title={block.enabled ? 'Disable' : 'Enable'}
                        disabled={block.protected}
                      >
                        {block.enabled ? (
                          <Eye size={16} className={block.protected ? 'text-gray-400' : 'text-green-600'} />
                        ) : (
                          <EyeOff size={16} className="text-red-500" />
                        )}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {block.hasSettings && (
                          <Link href="#" className="btn-icon" title="Settings">
                            <Settings size={14} className="text-[var(--text-muted)]" />
                          </Link>
                        )}
                        {!block.protected && block.instances === 0 && (
                          <button className="btn-icon" title="Delete">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        )}
                      </div>
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
