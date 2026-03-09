'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Settings, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

interface RepoPlugin {
  id: string;
  name: string;
  enabled: boolean;
  instances: number;
  version: string;
  hasSettings: boolean;
}

const initialRepos: RepoPlugin[] = [
  { id: 'areafiles', name: 'Server files', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'contentbank', name: 'Content bank', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'coursefiles', name: 'Legacy course files', enabled: false, instances: 0, version: '2024100700', hasSettings: false },
  { id: 'dropbox', name: 'Dropbox', enabled: false, instances: 0, version: '2024100700', hasSettings: true },
  { id: 'filesystem', name: 'File system', enabled: false, instances: 0, version: '2024100700', hasSettings: true },
  { id: 'flickr', name: 'Flickr', enabled: false, instances: 0, version: '2024100700', hasSettings: true },
  { id: 'flickr_public', name: 'Flickr public', enabled: true, instances: 1, version: '2024100700', hasSettings: true },
  { id: 'googledocs', name: 'Google Drive', enabled: false, instances: 0, version: '2024100700', hasSettings: true },
  { id: 'local', name: 'Embedded files', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'merlot', name: 'MERLOT', enabled: false, instances: 0, version: '2024100700', hasSettings: false },
  { id: 'nextcloud', name: 'Nextcloud', enabled: false, instances: 0, version: '2024100700', hasSettings: true },
  { id: 'onedrive', name: 'Microsoft OneDrive', enabled: false, instances: 0, version: '2024100700', hasSettings: true },
  { id: 'recent', name: 'Recent files', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'upload', name: 'Upload a file', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'url', name: 'URL downloader', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'user', name: 'Private files', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'webdav', name: 'WebDAV repository', enabled: false, instances: 0, version: '2024100700', hasSettings: false },
  { id: 'wikimedia', name: 'Wikimedia', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
  { id: 'youtube', name: 'YouTube videos', enabled: true, instances: 1, version: '2024100700', hasSettings: false },
];

export default function ManageRepositoriesPage() {
  const [repos, setRepos] = useState(initialRepos);

  const toggleEnabled = (id: string) => {
    setRepos((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setRepos((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === repos.length - 1) return;
    setRepos((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Manage repositories"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Repositories' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Manage repository plugins. Repositories allow users to access files from external sources when using the file picker.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Repository name</th>
                  <th className="py-2 px-3 text-center font-semibold">Instances</th>
                  <th className="py-2 px-3 text-center font-semibold">Enable</th>
                  <th className="py-2 px-3 text-center font-semibold">Order</th>
                  <th className="py-2 px-3 text-center font-semibold">Settings</th>
                </tr>
              </thead>
              <tbody>
                {repos.map((repo, index) => (
                  <tr
                    key={repo.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      !repo.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">{repo.name}</td>
                    <td className="py-2 px-3 text-center text-[var(--text-muted)]">{repo.instances}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleEnabled(repo.id)}
                        className="btn-icon"
                        title={repo.enabled ? 'Disable' : 'Enable'}
                      >
                        {repo.enabled ? (
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
                          disabled={index === repos.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} className={index === repos.length - 1 ? 'text-gray-300' : ''} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {repo.hasSettings && (
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
