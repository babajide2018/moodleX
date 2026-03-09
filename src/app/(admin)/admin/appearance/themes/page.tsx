'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Check, Paintbrush, Eye, Settings } from 'lucide-react';

const themes = [
  {
    id: 'boost',
    name: 'Boost',
    description: 'A modern, accessible theme designed to bring out the best in Moodle. Boost is a single-column layout with navigation in the navbar and drawers.',
    active: true,
    version: '4.5',
    author: 'Moodle HQ',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'A traditional Moodle theme based on the Boost theme. Classic provides a familiar three-column layout for those who prefer the original Moodle experience.',
    active: false,
    version: '4.5',
    author: 'Moodle HQ',
  },
];

export default function ThemeSelectorPage() {
  const [activeTheme, setActiveTheme] = useState('boost');

  return (
    <>
      <PageHeader
        title="Theme selector"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Themes' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Choose the default theme for your site. Users may be allowed to override this in their profile settings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`border rounded-lg overflow-hidden bg-white ${
                  activeTheme === theme.id
                    ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] ring-opacity-30'
                    : 'border-[var(--border-color)]'
                }`}
              >
                {/* Preview placeholder */}
                <div className="h-48 bg-[var(--bg-light)] flex items-center justify-center border-b border-[var(--border-color)]">
                  <div className="text-center">
                    <Paintbrush size={40} className="mx-auto text-[var(--text-muted)] mb-2" />
                    <p className="text-sm text-[var(--text-muted)]">Theme preview</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold">{theme.name}</h3>
                    {activeTheme === theme.id && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <Check size={12} /> Current theme
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--text-muted)] mb-3">{theme.description}</p>

                  <div className="text-xs text-[var(--text-muted)] mb-4 space-y-1">
                    <p>Version: {theme.version}</p>
                    <p>Author: {theme.author}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTheme === theme.id ? (
                      <button className="btn btn-primary text-sm flex items-center gap-1" disabled>
                        <Check size={14} /> In use
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary text-sm"
                        onClick={() => setActiveTheme(theme.id)}
                      >
                        Use theme
                      </button>
                    )}
                    <button className="btn btn-icon text-sm flex items-center gap-1" title="Preview">
                      <Eye size={14} /> Preview
                    </button>
                    <button className="btn btn-icon text-sm flex items-center gap-1" title="Settings">
                      <Settings size={14} /> Settings
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
