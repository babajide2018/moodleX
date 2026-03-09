'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Shield, UserPlus, Trash2, Search } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  lastAccess: string;
  primary: boolean;
}

const demoAdmins: AdminUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', username: 'admin', lastAccess: '2 minutes ago', primary: true },
  { id: '2', name: 'Jane Manager', email: 'jane.manager@example.com', username: 'jmanager', lastAccess: '1 hour ago', primary: false },
  { id: '3', name: 'Bob Superadmin', email: 'bob.super@example.com', username: 'bsuper', lastAccess: '3 days ago', primary: false },
];

export default function SiteAdminsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [admins] = useState<AdminUser[]>(demoAdmins);

  return (
    <>
      <PageHeader
        title="Site administrators"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Permissions' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Warning */}
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 text-sm text-amber-800 mb-6 flex items-start gap-2">
            <Shield size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>Warning:</strong> Site administrators have full access to the entire site. Only assign this role to trusted users. The primary admin account cannot be removed from this list.
            </div>
          </div>

          {/* Current admins */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white mb-6">
            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Shield size={16} className="text-red-600" />
                Current site administrators ({admins.length})
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Username</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Email</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Last access</th>
                  <th className="py-2 px-3 w-20 text-right font-semibold">Remove</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-medium">{admin.name}</span>
                          {admin.primary && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">Primary</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell">{admin.username}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell">{admin.email}</td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">{admin.lastAccess}</td>
                    <td className="py-2 px-3 text-right">
                      {admin.primary ? (
                        <span className="text-xs text-[var(--text-muted)]">N/A</span>
                      ) : (
                        <button className="btn-icon text-red-500" title="Remove admin">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add admin */}
          <div className="border border-[var(--border-color)] rounded-lg bg-white p-6">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <UserPlus size={16} /> Add site administrator
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  className="form-control text-sm"
                  style={{ paddingLeft: '2rem' }}
                  placeholder="Search for a user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
              <button className="btn btn-primary text-sm">Add</button>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Search by name, username, or email address to add a new site administrator.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
