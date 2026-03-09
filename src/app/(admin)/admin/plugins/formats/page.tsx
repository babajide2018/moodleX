'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Settings, Eye, EyeOff } from 'lucide-react';

interface CourseFormat {
  id: string;
  name: string;
  description: string;
  courses: number;
  enabled: boolean;
  version: string;
  hasSettings: boolean;
}

const initialFormats: CourseFormat[] = [
  { id: 'topics', name: 'Topics format', description: 'The course is organised into topic sections', courses: 89, enabled: true, version: '2024100700', hasSettings: true },
  { id: 'weeks', name: 'Weekly format', description: 'The course is organised week by week with a clear start and finish date', courses: 34, enabled: true, version: '2024100700', hasSettings: true },
  { id: 'social', name: 'Social format', description: 'The course is centred around a main discussion forum', courses: 5, enabled: true, version: '2024100700', hasSettings: false },
  { id: 'singleactivity', name: 'Single activity format', description: 'The course consists of a single activity, such as a quiz or SCORM package', courses: 12, enabled: true, version: '2024100700', hasSettings: true },
];

export default function ManageFormatsPage() {
  const [formats, setFormats] = useState(initialFormats);

  const toggleEnabled = (id: string) => {
    setFormats((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <>
      <PageHeader
        title="Manage course formats"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Course formats' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Manage course formats available in the system. Formats determine how a course is structured and presented to users.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Format name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Description</th>
                  <th className="py-2 px-3 text-center font-semibold">Courses using</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Version</th>
                  <th className="py-2 px-3 text-center font-semibold">Enable</th>
                  <th className="py-2 px-3 text-center font-semibold">Settings</th>
                </tr>
              </thead>
              <tbody>
                {formats.map((format) => (
                  <tr
                    key={format.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      !format.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">{format.name}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs hidden md:table-cell">
                      {format.description}
                    </td>
                    <td className="py-2 px-3 text-center text-[var(--text-muted)]">{format.courses}</td>
                    <td className="py-2 px-3 text-xs font-mono text-[var(--text-muted)] hidden lg:table-cell">
                      {format.version}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleEnabled(format.id)}
                        className="btn-icon"
                        title={format.enabled ? 'Disable' : 'Enable'}
                        disabled={format.courses > 0}
                      >
                        {format.enabled ? (
                          <Eye size={16} className={format.courses > 0 ? 'text-gray-400' : 'text-green-600'} />
                        ) : (
                          <EyeOff size={16} className="text-red-500" />
                        )}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {format.hasSettings && (
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
