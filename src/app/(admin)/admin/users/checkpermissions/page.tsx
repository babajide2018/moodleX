'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface CapabilityResult {
  capability: string;
  component: string;
  permission: 'allow' | 'deny' | 'inherit';
  source: string;
}

const demoCapabilities: CapabilityResult[] = [
  { capability: 'moodle/site:config', component: 'System', permission: 'deny', source: 'Student role' },
  { capability: 'moodle/course:view', component: 'Course', permission: 'allow', source: 'Student role' },
  { capability: 'moodle/course:create', component: 'Course', permission: 'deny', source: 'Student role' },
  { capability: 'mod/forum:addinstance', component: 'Forum', permission: 'deny', source: 'Student role' },
  { capability: 'mod/forum:replypost', component: 'Forum', permission: 'allow', source: 'Student role' },
  { capability: 'mod/forum:startdiscussion', component: 'Forum', permission: 'allow', source: 'Student role' },
  { capability: 'mod/assign:submit', component: 'Assignment', permission: 'allow', source: 'Student role' },
  { capability: 'mod/assign:grade', component: 'Assignment', permission: 'deny', source: 'Student role' },
  { capability: 'mod/quiz:attempt', component: 'Quiz', permission: 'allow', source: 'Student role' },
  { capability: 'moodle/user:editprofile', component: 'User', permission: 'allow', source: 'Authenticated user role' },
];

export default function CheckPermissionsPage() {
  const [userSearch, setUserSearch] = useState('');
  const [capabilityFilter, setCapabilityFilter] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filtered = demoCapabilities.filter((c) =>
    c.capability.toLowerCase().includes(capabilityFilter.toLowerCase()) ||
    c.component.toLowerCase().includes(capabilityFilter.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Check system permissions"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Permissions' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Search form */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white p-6 mb-6">
            <h2 className="text-sm font-semibold mb-4">Check permissions for a user</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">User</label>
                <div className="relative max-w-sm">
                  <input
                    type="text"
                    className="form-control text-sm"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="Search for a user..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 items-start">
                <label className="text-sm font-medium pt-2">Filter capabilities</label>
                <div className="relative max-w-sm">
                  <input
                    type="text"
                    className="form-control text-sm"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="e.g. mod/forum or moodle/course"
                    value={capabilityFilter}
                    onChange={(e) => setCapabilityFilter(e.target.value)}
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </div>

              <button
                className="btn btn-primary text-sm"
                onClick={() => setShowResults(true)}
              >
                Show this user&apos;s permissions
              </button>
            </div>
          </div>

          {/* Results */}
          {showResults && (
            <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-x-auto">
              <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
                <h2 className="text-sm font-semibold">
                  Permissions for: <span className="text-[var(--moodle-primary)]">{userSearch || 'Demo Student'}</span>
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">{filtered.length} capabilities shown</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="py-2 px-3 text-left font-semibold">Capability</th>
                    <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Component</th>
                    <th className="py-2 px-3 text-center font-semibold">Permission</th>
                    <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cap) => (
                    <tr key={cap.capability} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                      <td className="py-2 px-3 font-mono text-xs">{cap.capability}</td>
                      <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{cap.component}</td>
                      <td className="py-2 px-3 text-center">
                        {cap.permission === 'allow' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            <CheckCircle size={12} /> Allow
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded">
                            <XCircle size={12} /> Deny
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{cap.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
