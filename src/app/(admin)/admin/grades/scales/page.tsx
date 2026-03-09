'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const demoScales = [
  { id: 1, name: 'Separate and Connected ways of knowing', standard: true, itemsUsed: 3, description: 'Separate knowing, Mostly separate knowing, Mostly connected knowing, Connected knowing' },
  { id: 2, name: 'Default competence scale', standard: true, itemsUsed: 0, description: 'Not yet competent, Competent' },
  { id: 3, name: 'Pass/Fail', standard: false, itemsUsed: 5, description: 'Fail, Pass' },
  { id: 4, name: 'Effort rating', standard: false, itemsUsed: 2, description: 'Minimal effort, Some effort, Good effort, Outstanding effort' },
  { id: 5, name: 'Performance', standard: false, itemsUsed: 1, description: 'Below expectations, Meets expectations, Exceeds expectations' },
];

export default function ScalesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = demoScales.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Scales"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades', href: '/admin/grades' },
          { label: 'Scales' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Plus size={16} />
            Add a new scale
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="mb-4 flex items-center gap-2 max-w-sm">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                className="form-control text-sm pl-9"
                placeholder="Search scales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="text-left p-3 font-semibold">Scale</th>
                  <th className="text-left p-3 font-semibold">Items used</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Scale values</th>
                  <th className="text-right p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((scale) => (
                  <tr key={scale.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-3 font-medium text-[var(--text-link)]">{scale.name}</td>
                    <td className="p-3">{scale.itemsUsed}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        scale.standard
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {scale.standard ? 'Standard' : 'Custom'}
                      </span>
                    </td>
                    <td className="p-3 text-[var(--text-muted)]">{scale.description}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn-icon p-1 rounded hover:bg-[var(--bg-hover)]" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="btn-icon p-1 rounded hover:bg-[var(--bg-hover)] text-red-600" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[var(--text-muted)]">
                      No scales found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Scales provide an alternative to numeric grading. Standard scales are available site-wide; custom scales are created by teachers within individual courses.
          </p>
        </div>
      </div>
    </>
  );
}
