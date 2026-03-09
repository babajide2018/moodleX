'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Settings, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

interface EditorPlugin {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  version: string;
  hasSettings: boolean;
}

const initialEditors: EditorPlugin[] = [
  { id: 'tiny', name: 'TinyMCE editor', description: 'Full-featured rich text editor with plugins and toolbars', enabled: true, version: '2024100700', hasSettings: true },
  { id: 'atto', name: 'Atto HTML editor', description: 'Lightweight HTML editor designed for Moodle', enabled: true, version: '2024100700', hasSettings: true },
  { id: 'textarea', name: 'Plain text area', description: 'Simple text area with no formatting options', enabled: true, version: '2024100700', hasSettings: false },
  { id: 'marklar', name: 'Marklar', description: 'Markdown editor with live preview', enabled: false, version: '2024100700', hasSettings: true },
];

export default function ManageEditorsPage() {
  const [editors, setEditors] = useState(initialEditors);

  const toggleEnabled = (id: string) => {
    setEditors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setEditors((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === editors.length - 1) return;
    setEditors((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Manage editors"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Text editors' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Manage text editors and their order. The first enabled editor in the list will be the default editor for users who have not set a preference.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Editor name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Description</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Version</th>
                  <th className="py-2 px-3 text-center font-semibold">Enable</th>
                  <th className="py-2 px-3 text-center font-semibold">Order</th>
                  <th className="py-2 px-3 text-center font-semibold">Settings</th>
                </tr>
              </thead>
              <tbody>
                {editors.map((editor, index) => (
                  <tr
                    key={editor.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      !editor.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">
                      {editor.name}
                      {index === 0 && editor.enabled && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700">Default</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs hidden md:table-cell">
                      {editor.description}
                    </td>
                    <td className="py-2 px-3 text-xs font-mono text-[var(--text-muted)] hidden lg:table-cell">
                      {editor.version}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleEnabled(editor.id)}
                        className="btn-icon"
                        title={editor.enabled ? 'Disable' : 'Enable'}
                      >
                        {editor.enabled ? (
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
                          disabled={index === editors.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} className={index === editors.length - 1 ? 'text-gray-300' : ''} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {editor.hasSettings && (
                        <Link href="#" className="btn-icon" title="Settings">
                          <Settings size={14} className="text-[var(--text-muted)]" />
                        </Link>
                      )}
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
