'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const demoOutcomes = [
  { id: 1, name: 'Critical Thinking', shortname: 'CT', scale: 'Default competence scale', coursesUsed: 4 },
  { id: 2, name: 'Problem Solving', shortname: 'PS', scale: 'Default competence scale', coursesUsed: 6 },
  { id: 3, name: 'Written Communication', shortname: 'WC', scale: 'Separate and Connected ways of knowing', coursesUsed: 3 },
  { id: 4, name: 'Teamwork', shortname: 'TW', scale: 'Performance', coursesUsed: 2 },
  { id: 5, name: 'Digital Literacy', shortname: 'DL', scale: 'Default competence scale', coursesUsed: 5 },
  { id: 6, name: 'Research Skills', shortname: 'RS', scale: 'Effort rating', coursesUsed: 1 },
];

export default function OutcomesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = demoOutcomes.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shortname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Outcomes"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades', href: '/admin/grades' },
          { label: 'Scales' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Plus size={16} />
            Add a new outcome
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
                placeholder="Search outcomes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="text-left p-3 font-semibold">Full name</th>
                  <th className="text-left p-3 font-semibold">Short name</th>
                  <th className="text-left p-3 font-semibold">Scale</th>
                  <th className="text-left p-3 font-semibold">Courses used</th>
                  <th className="text-right p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((outcome) => (
                  <tr key={outcome.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-3 font-medium text-[var(--text-link)]">{outcome.name}</td>
                    <td className="p-3">{outcome.shortname}</td>
                    <td className="p-3 text-[var(--text-muted)]">{outcome.scale}</td>
                    <td className="p-3">{outcome.coursesUsed}</td>
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
                      No outcomes found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Outcomes are specific descriptions of what a student is expected to be able to do or understand at the completion of an activity or course.
          </p>
        </div>
      </div>
    </>
  );
}
