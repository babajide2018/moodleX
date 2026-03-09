'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Search, CheckCircle, XCircle, Minus } from 'lucide-react';

interface Capability {
  name: string;
  component: string;
  roles: Record<string, 'allow' | 'deny' | 'inherit'>;
}

const roleNames = ['Manager', 'Teacher', 'Non-editing teacher', 'Student', 'Guest'];

const demoCapabilities: Capability[] = [
  { name: 'moodle/site:config', component: 'System', roles: { Manager: 'allow', Teacher: 'deny', 'Non-editing teacher': 'deny', Student: 'deny', Guest: 'deny' } },
  { name: 'moodle/course:create', component: 'Course', roles: { Manager: 'allow', Teacher: 'deny', 'Non-editing teacher': 'deny', Student: 'deny', Guest: 'deny' } },
  { name: 'moodle/course:view', component: 'Course', roles: { Manager: 'allow', Teacher: 'allow', 'Non-editing teacher': 'allow', Student: 'allow', Guest: 'allow' } },
  { name: 'moodle/course:update', component: 'Course', roles: { Manager: 'allow', Teacher: 'allow', 'Non-editing teacher': 'deny', Student: 'deny', Guest: 'deny' } },
  { name: 'mod/forum:addinstance', component: 'Forum', roles: { Manager: 'allow', Teacher: 'allow', 'Non-editing teacher': 'deny', Student: 'deny', Guest: 'deny' } },
  { name: 'mod/forum:replypost', component: 'Forum', roles: { Manager: 'allow', Teacher: 'allow', 'Non-editing teacher': 'allow', Student: 'allow', Guest: 'deny' } },
  { name: 'mod/assign:submit', component: 'Assignment', roles: { Manager: 'inherit', Teacher: 'inherit', 'Non-editing teacher': 'inherit', Student: 'allow', Guest: 'deny' } },
  { name: 'mod/assign:grade', component: 'Assignment', roles: { Manager: 'allow', Teacher: 'allow', 'Non-editing teacher': 'allow', Student: 'deny', Guest: 'deny' } },
  { name: 'mod/quiz:attempt', component: 'Quiz', roles: { Manager: 'inherit', Teacher: 'inherit', 'Non-editing teacher': 'inherit', Student: 'allow', Guest: 'deny' } },
  { name: 'mod/quiz:manage', component: 'Quiz', roles: { Manager: 'allow', Teacher: 'allow', 'Non-editing teacher': 'deny', Student: 'deny', Guest: 'deny' } },
  { name: 'moodle/user:editprofile', component: 'User', roles: { Manager: 'allow', Teacher: 'deny', 'Non-editing teacher': 'deny', Student: 'deny', Guest: 'deny' } },
  { name: 'moodle/grade:viewall', component: 'Grade', roles: { Manager: 'allow', Teacher: 'allow', 'Non-editing teacher': 'allow', Student: 'deny', Guest: 'deny' } },
];

function PermissionBadge({ permission }: { permission: 'allow' | 'deny' | 'inherit' }) {
  if (permission === 'allow') return <CheckCircle size={14} className="text-green-600 mx-auto" />;
  if (permission === 'deny') return <XCircle size={14} className="text-red-500 mx-auto" />;
  return <Minus size={14} className="text-gray-300 mx-auto" />;
}

export default function CapabilityOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = demoCapabilities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.component.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Capability overview"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Permissions' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search capabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>

            <select
              className="form-control text-sm py-1 w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All roles</option>
              {roleNames.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <span className="text-sm text-[var(--text-muted)]">{filtered.length} capabilities</span>
          </div>

          {/* Table */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Capability</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Component</th>
                  {(roleFilter === 'all' ? roleNames : [roleFilter]).map((role) => (
                    <th key={role} className="py-2 px-3 text-center font-semibold text-xs whitespace-nowrap">{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cap) => (
                  <tr key={cap.name} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3 font-mono text-xs">{cap.name}</td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{cap.component}</td>
                    {(roleFilter === 'all' ? roleNames : [roleFilter]).map((role) => (
                      <td key={role} className="py-2 px-3 text-center">
                        <PermissionBadge permission={cap.roles[role]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-600" /> Allow</span>
            <span className="flex items-center gap-1"><XCircle size={12} className="text-red-500" /> Deny</span>
            <span className="flex items-center gap-1"><Minus size={12} className="text-gray-300" /> Inherit / Not set</span>
          </div>
        </div>
      </div>
    </>
  );
}
