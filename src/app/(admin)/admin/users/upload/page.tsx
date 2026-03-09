'use client';

import { useState, useRef } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Upload, FileSpreadsheet, HelpCircle } from 'lucide-react';

export default function UploadUsersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.csv') || dropped.name.endsWith('.txt'))) {
      setFile(dropped);
    }
  };

  return (
    <>
      <PageHeader
        title="Upload users"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-6">
            {/* File upload area */}
            <div className="border border-[var(--border-color)] rounded-lg bg-white p-6">
              <h2 className="text-sm font-semibold mb-4">File</h2>

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
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileSpreadsheet size={24} className="text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto text-[var(--text-muted)] mb-2" />
                    <p className="text-sm font-medium">Drag and drop a CSV file here</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">or click to browse</p>
                  </>
                )}
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-3 flex items-center gap-1">
                <HelpCircle size={12} />
                The file must be a CSV file with columns: username, password, firstname, lastname, email. Additional optional columns: city, country, role, cohort.
              </p>
            </div>

            {/* CSV settings */}
            <div className="border border-[var(--border-color)] rounded-lg bg-white p-6 space-y-4">
              <h2 className="text-sm font-semibold mb-2">CSV settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">CSV delimiter</label>
                <select className="form-control text-sm">
                  <option value="comma">Comma (,)</option>
                  <option value="semicolon">Semicolon (;)</option>
                  <option value="colon">Colon (:)</option>
                  <option value="tab">Tab</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">Encoding</label>
                <select className="form-control text-sm">
                  <option value="UTF-8">UTF-8</option>
                  <option value="ISO-8859-1">ISO-8859-1</option>
                  <option value="Windows-1252">Windows-1252</option>
                </select>
              </div>
            </div>

            {/* Upload settings */}
            <div className="border border-[var(--border-color)] rounded-lg bg-white p-6 space-y-4">
              <h2 className="text-sm font-semibold mb-2">Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">Upload type</label>
                <select className="form-control text-sm">
                  <option value="addnew">Add new only, skip existing users</option>
                  <option value="addupdate">Add new and update existing users</option>
                  <option value="update">Update existing users only</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">On duplicate</label>
                <select className="form-control text-sm">
                  <option value="skip">Skip</option>
                  <option value="update">Update</option>
                  <option value="rename">Create with new username</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">New user password</label>
                <select className="form-control text-sm">
                  <option value="field">From field in file</option>
                  <option value="create">Create password and notify user</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">Force password change</label>
                <select className="form-control text-sm">
                  <option value="none">None</option>
                  <option value="weak">For weak passwords</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            {/* Preview placeholder */}
            {file && (
              <div className="border border-[var(--border-color)] rounded-lg bg-white p-6">
                <h2 className="text-sm font-semibold mb-3">Preview</h2>
                <div className="bg-[var(--bg-light)] rounded p-4 text-center text-sm text-[var(--text-muted)]">
                  Click &quot;Upload users&quot; to preview and process the uploaded file.
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm" disabled={!file}>Upload users</button>
              <button type="button" className="btn btn-secondary text-sm" onClick={() => setFile(null)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
