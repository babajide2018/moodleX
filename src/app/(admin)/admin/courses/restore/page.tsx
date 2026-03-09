'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Upload, FileArchive, Server, FolderOpen, Info } from 'lucide-react';

interface ServerFile {
  name: string;
  size: string;
  date: string;
}

const serverFiles: ServerFile[] = [
  { name: 'backup-moodle2-course-101-intro-20240115-1430.mbz', size: '12.4 MB', date: '15 Jan 2024, 14:30' },
  { name: 'backup-moodle2-course-205-physics-20240110-0900.mbz', size: '45.2 MB', date: '10 Jan 2024, 09:00' },
  { name: 'backup-moodle2-course-310-math-20231220-1100.mbz', size: '8.7 MB', date: '20 Dec 2023, 11:00' },
  { name: 'backup-moodle2-course-410-chem-20231215-1600.mbz', size: '23.1 MB', date: '15 Dec 2023, 16:00' },
];

export default function RestoreCoursePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'server'>('upload');
  const [dragOver, setDragOver] = useState(false);

  return (
    <>
      <PageHeader
        title="Restore course"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Manage courses and categories' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="max-w-3xl">
            {/* Info box */}
            <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-800 mb-6">
              <Info size={18} className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Import a backup file</p>
                <p className="mt-1 text-blue-700">
                  Upload a Moodle backup file (.mbz) to restore a course. The backup can be restored as a new course or merged into an existing course.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-color)] mb-6">
              <button
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'upload'
                    ? 'border-[var(--moodle-primary)] text-[var(--moodle-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-link)]'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                <span className="flex items-center gap-2"><Upload size={14} /> Upload a backup file</span>
              </button>
              <button
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'server'
                    ? 'border-[var(--moodle-primary)] text-[var(--moodle-primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-link)]'
                }`}
                onClick={() => setActiveTab('server')}
              >
                <span className="flex items-center gap-2"><Server size={14} /> Choose from server files</span>
              </button>
            </div>

            {/* Upload tab */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                    dragOver
                      ? 'border-[var(--moodle-primary)] bg-blue-50'
                      : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                >
                  <FileArchive size={40} className="mx-auto text-[var(--text-muted)] mb-3" />
                  <p className="text-sm font-medium mb-1">Drag and drop a backup file here</p>
                  <p className="text-xs text-[var(--text-muted)] mb-4">Accepted format: .mbz (Moodle backup)</p>
                  <input type="file" accept=".mbz" className="hidden" id="backup-upload" />
                  <label htmlFor="backup-upload" className="btn btn-secondary text-sm cursor-pointer">
                    Choose a file
                  </label>
                  <p className="text-xs text-[var(--text-muted)] mt-3">Maximum file size: 256 MB</p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="btn btn-primary text-sm" disabled>Restore this backup</button>
                </div>
              </div>
            )}

            {/* Server files tab */}
            {activeTab === 'server' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                  <FolderOpen size={14} />
                  <span>Backup area: /moodledata/backups/</span>
                </div>

                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                        <th className="py-2 px-3 text-left w-8">
                          <input type="radio" name="serverfile" className="w-4 h-4" disabled />
                        </th>
                        <th className="py-2 px-3 text-left font-semibold">Filename</th>
                        <th className="py-2 px-3 text-left font-semibold">Size</th>
                        <th className="py-2 px-3 text-left font-semibold">Date modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serverFiles.map((file, i) => (
                        <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                          <td className="py-2 px-3">
                            <input type="radio" name="serverfile" value={file.name} className="w-4 h-4" />
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <FileArchive size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                              <span className="text-[var(--text-link)]">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-[var(--text-muted)]">{file.size}</td>
                          <td className="py-2 px-3 text-[var(--text-muted)]">{file.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-3">
                  <button className="btn btn-primary text-sm">Restore this backup</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
