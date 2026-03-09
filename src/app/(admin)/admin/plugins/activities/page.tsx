'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  Settings,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ActivityModule {
  id: string;
  name: string;
  icon: string;
  activities: number;
  version: string;
  enabled: boolean;
  settingsHref: string;
}

const initialModules: ActivityModule[] = [
  { id: 'assign', name: 'Assignment', icon: '📝', activities: 47, version: '2024100700', enabled: true, settingsHref: '/admin/plugins/mod-assign' },
  { id: 'bigbluebuttonbn', name: 'BigBlueButton', icon: '📹', activities: 3, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'book', name: 'Book', icon: '📖', activities: 12, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'chat', name: 'Chat', icon: '💬', activities: 5, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'choice', name: 'Choice', icon: '🗳️', activities: 8, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'data', name: 'Database', icon: '🗄️', activities: 2, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'feedback', name: 'Feedback', icon: '📋', activities: 6, version: '2024100700', enabled: false, settingsHref: '#' },
  { id: 'folder', name: 'Folder', icon: '📁', activities: 15, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'forum', name: 'Forum', icon: '💭', activities: 34, version: '2024100700', enabled: true, settingsHref: '/admin/plugins/mod-forum' },
  { id: 'glossary', name: 'Glossary', icon: '📘', activities: 4, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'h5pactivity', name: 'H5P', icon: '🎮', activities: 10, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'imscp', name: 'IMS content package', icon: '📦', activities: 1, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'label', name: 'Text and media area', icon: '🏷️', activities: 89, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'lesson', name: 'Lesson', icon: '📚', activities: 7, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'lti', name: 'External tool', icon: '🔗', activities: 3, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'page', name: 'Page', icon: '📄', activities: 56, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'quiz', name: 'Quiz', icon: '❓', activities: 28, version: '2024100700', enabled: true, settingsHref: '/admin/plugins/mod-quiz' },
  { id: 'resource', name: 'File', icon: '📎', activities: 123, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'scorm', name: 'SCORM package', icon: '📀', activities: 4, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'survey', name: 'Survey', icon: '📊', activities: 2, version: '2024100700', enabled: false, settingsHref: '#' },
  { id: 'url', name: 'URL', icon: '🌐', activities: 67, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'wiki', name: 'Wiki', icon: '📝', activities: 3, version: '2024100700', enabled: true, settingsHref: '#' },
  { id: 'workshop', name: 'Workshop', icon: '🔧', activities: 2, version: '2024100700', enabled: true, settingsHref: '/admin/plugins/mod-workshop' },
];

export default function ManageActivitiesPage() {
  const [modules, setModules] = useState(initialModules);

  const toggleEnabled = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setModules((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === modules.length - 1) return;
    setModules((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Manage activities"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Activity modules' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            This page allows you to manage installed activity modules. You can enable/disable modules and change their display order.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Activity module</th>
                  <th className="py-2 px-3 text-left font-semibold">Activities</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Version</th>
                  <th className="py-2 px-3 text-center font-semibold">Enabled</th>
                  <th className="py-2 px-3 text-center font-semibold">Order</th>
                  <th className="py-2 px-3 text-center font-semibold">Settings</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((mod, index) => (
                  <tr
                    key={mod.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      !mod.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">
                      <span className="mr-2">{mod.icon}</span>
                      {mod.name}
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)]">{mod.activities}</td>
                    <td className="py-2 px-3 text-xs font-mono text-[var(--text-muted)] hidden md:table-cell">
                      {mod.version}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleEnabled(mod.id)}
                        className="btn-icon"
                        title={mod.enabled ? 'Disable' : 'Enable'}
                      >
                        {mod.enabled ? (
                          <Eye size={16} className="text-green-600" />
                        ) : (
                          <EyeOff size={16} className="text-red-500" />
                        )}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveUp(index)}
                          className="btn-icon"
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp size={14} className={index === 0 ? 'text-gray-300' : ''} />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          className="btn-icon"
                          disabled={index === modules.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} className={index === modules.length - 1 ? 'text-gray-300' : ''} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Link href={mod.settingsHref} className="btn-icon" title="Settings">
                        <Settings size={14} className="text-[var(--text-muted)]" />
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
