'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';

interface Cohort {
  id: string;
  name: string;
  idnumber: string;
  description: string;
  members: number;
  source: string;
}

const demoCohorts: Cohort[] = [
  { id: '1', name: 'Class of 2025', idnumber: 'C2025', description: 'Students graduating in 2025', members: 142, source: 'Manual' },
  { id: '2', name: 'Engineering Department', idnumber: 'ENG', description: 'All engineering students and staff', members: 87, source: 'Manual' },
  { id: '3', name: 'Teaching Staff', idnumber: 'STAFF-T', description: 'All teaching staff members', members: 34, source: 'Manual' },
  { id: '4', name: 'Premium Users', idnumber: 'PREMIUM', description: 'Users with premium access', members: 56, source: 'Manual' },
  { id: '5', name: 'Trial Users', idnumber: 'TRIAL', description: 'Users on trial accounts', members: 23, source: 'Upload' },
];

export default function CohortsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = demoCohorts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.idnumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Cohorts"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Plus size={16} /> Add new cohort
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Search */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search cohorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">{filtered.length} cohort(s)</span>
          </div>

          {/* Table */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Name</th>
                  <th className="py-2 px-3 text-left font-semibold">Cohort ID</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Description</th>
                  <th className="py-2 px-3 text-center font-semibold">Members</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Source</th>
                  <th className="py-2 px-3 w-24 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cohort) => (
                  <tr key={cohort.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3">
                      <span className="text-[var(--text-link)] font-medium cursor-pointer hover:underline">{cohort.name}</span>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)]">{cohort.idnumber}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell text-xs">{cohort.description}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Users size={12} className="text-[var(--text-muted)]" />
                        {cohort.members}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{cohort.source}</td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn-icon" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="btn-icon text-red-500" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
