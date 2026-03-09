'use client';

import Link from 'next/link';
import { FileText, Image, FileSpreadsheet, FolderOpen, HardDrive } from 'lucide-react';

interface PrivateFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'document';
  size: string;
  modified: string;
}

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  image: Image,
  spreadsheet: FileSpreadsheet,
  document: FileText,
};

const fileColors: Record<string, string> = {
  pdf: '#ce5f5f',
  image: '#57a89a',
  spreadsheet: '#63a563',
  document: '#0f6cbf',
};

const mockFiles: PrivateFile[] = [
  { id: '1', name: 'lecture-notes.pdf', type: 'pdf', size: '2.4 MB', modified: '7 March 2026' },
  { id: '2', name: 'project-diagram.png', type: 'image', size: '890 KB', modified: '5 March 2026' },
  { id: '3', name: 'grades-tracker.xlsx', type: 'spreadsheet', size: '156 KB', modified: '1 March 2026' },
];

const totalFiles = 12;
const storageUsed = '45.2 MB';
const storageTotal = '100 MB';

export default function PrivateFiles() {
  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
        <h6 className="text-sm font-semibold m-0">Private files</h6>
      </div>
      <div className="p-3">
        {/* Storage summary */}
        <div className="flex items-center gap-2 mb-3 p-2 rounded bg-[var(--bg-light)]">
          <HardDrive size={14} className="text-[var(--text-muted)]" />
          <div className="flex-1">
            <p className="text-xs text-[var(--text-secondary)] m-0">
              {totalFiles} files &middot; {storageUsed} of {storageTotal} used
            </p>
            <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--moodle-primary)] rounded-full"
                style={{ width: '45%' }}
              />
            </div>
          </div>
        </div>

        {/* Recent files */}
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Recent files</p>
        <div className="space-y-2">
          {mockFiles.map((file) => {
            const Icon = fileIcons[file.type] || FileText;
            return (
              <div key={file.id} className="flex items-center gap-2">
                <Icon
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: fileColors[file.type] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-secondary)] m-0 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] m-0">
                    {file.size} &middot; {file.modified}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manage link */}
        <div className="mt-3 pt-3 border-t border-[var(--border-color)] text-center">
          <Link
            href="/user/files"
            className="text-xs text-[var(--moodle-primary)] hover:underline no-underline inline-flex items-center gap-1"
          >
            <FolderOpen size={12} />
            Manage private files...
          </Link>
        </div>
      </div>
    </div>
  );
}
