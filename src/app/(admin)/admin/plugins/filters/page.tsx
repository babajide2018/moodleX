'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Settings, ArrowUp, ArrowDown } from 'lucide-react';

interface FilterPlugin {
  id: string;
  name: string;
  status: 'off' | 'on' | 'content';
  applyTo: string;
  version: string;
  hasSettings: boolean;
}

const initialFilters: FilterPlugin[] = [
  { id: 'activitynames', name: 'Activity names auto-linking', status: 'on', applyTo: 'Content and headings', version: '2024100700', hasSettings: false },
  { id: 'algebra', name: 'Algebra notation', status: 'off', applyTo: 'Content only', version: '2024100700', hasSettings: false },
  { id: 'censor', name: 'Word censorship', status: 'off', applyTo: 'Content and headings', version: '2024100700', hasSettings: true },
  { id: 'data', name: 'Database auto-linking', status: 'off', applyTo: 'Content only', version: '2024100700', hasSettings: false },
  { id: 'emailprotect', name: 'Email protection', status: 'on', applyTo: 'Content and headings', version: '2024100700', hasSettings: false },
  { id: 'emoticon', name: 'Display emoticons as images', status: 'on', applyTo: 'Content only', version: '2024100700', hasSettings: true },
  { id: 'glossary', name: 'Glossary auto-linking', status: 'on', applyTo: 'Content only', version: '2024100700', hasSettings: false },
  { id: 'mathjaxloader', name: 'MathJax', status: 'on', applyTo: 'Content and headings', version: '2024100700', hasSettings: true },
  { id: 'mediaplugin', name: 'Multimedia plugins', status: 'on', applyTo: 'Content only', version: '2024100700', hasSettings: true },
  { id: 'multilang', name: 'Multi-language content', status: 'on', applyTo: 'Content and headings', version: '2024100700', hasSettings: false },
  { id: 'tex', name: 'TeX notation', status: 'off', applyTo: 'Content only', version: '2024100700', hasSettings: true },
  { id: 'tidy', name: 'HTML tidy', status: 'off', applyTo: 'Content only', version: '2024100700', hasSettings: false },
  { id: 'urltolink', name: 'Convert URLs into links and images', status: 'on', applyTo: 'Content only', version: '2024100700', hasSettings: true },
];

export default function ManageFiltersPage() {
  const [filters, setFilters] = useState(initialFilters);

  const changeStatus = (id: string, status: 'off' | 'on' | 'content') => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFilters((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === filters.length - 1) return;
    setFilters((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Manage filters"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Filters' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Manage text filters. Filters process text content and can auto-link glossary entries, render equations, embed multimedia, and more.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Filter</th>
                  <th className="py-2 px-3 text-center font-semibold">Active?</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Apply to</th>
                  <th className="py-2 px-3 text-center font-semibold">Order</th>
                  <th className="py-2 px-3 text-center font-semibold">Settings</th>
                </tr>
              </thead>
              <tbody>
                {filters.map((filter, index) => (
                  <tr
                    key={filter.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      filter.status === 'off' ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">{filter.name}</td>
                    <td className="py-2 px-3 text-center">
                      <select
                        className="form-control text-xs py-1 w-auto mx-auto"
                        value={filter.status}
                        onChange={(e) => changeStatus(filter.id, e.target.value as 'off' | 'on' | 'content')}
                      >
                        <option value="off">Off</option>
                        <option value="on">On</option>
                        <option value="content">Off, but available</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs hidden md:table-cell">
                      {filter.applyTo}
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
                          disabled={index === filters.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} className={index === filters.length - 1 ? 'text-gray-300' : ''} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {filter.hasSettings && (
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
