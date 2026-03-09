'use client';

import { useState, useRef } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Upload, FileArchive, HelpCircle } from 'lucide-react';

export default function UploadPicturesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.zip')) {
      setFile(dropped);
    }
  };

  return (
    <>
      <PageHeader
        title="Upload user pictures"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-2xl space-y-6">
            {/* Info */}
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              Upload a ZIP file containing user profile pictures. Files should be named using the username (e.g. <code className="bg-blue-100 px-1 rounded">jsmith.jpg</code>). Supported formats: JPG, PNG, GIF.
            </div>

            {/* File upload */}
            <div className="border border-[var(--border-color)] rounded-lg bg-white p-6">
              <h2 className="text-sm font-semibold mb-4">ZIP file</h2>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragging ? 'border-[var(--moodle-primary)] bg-blue-50' : 'border-[var(--border-color)] hover:border-[var(--moodle-primary)]'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileArchive size={24} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto text-[var(--text-muted)] mb-2" />
                    <p className="text-sm font-medium">Drag and drop a ZIP file here</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">or click to browse</p>
                  </>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="border border-[var(--border-color)] rounded-lg bg-white p-6 space-y-4">
              <h2 className="text-sm font-semibold mb-2">Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-center">
                <label className="text-sm font-medium flex items-center gap-1">
                  Overwrite existing
                  <span className="text-[var(--text-muted)] cursor-help" title="Overwrite existing user pictures with uploaded ones."><HelpCircle size={12} /></span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  Yes, overwrite existing pictures
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">File naming</label>
                <select className="form-control text-sm">
                  <option value="username">Username (jsmith.jpg)</option>
                  <option value="idnumber">ID number (12345.jpg)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm" disabled={!file}>Upload pictures</button>
              <button type="button" className="btn btn-secondary text-sm" onClick={() => setFile(null)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
