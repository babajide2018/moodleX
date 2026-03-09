'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Users, CheckCircle, Ban, Trash2, Mail, KeyRound, Search } from 'lucide-react';

const bulkActions = [
  { key: 'confirm', label: 'Confirm', description: 'Confirm user accounts that are pending email verification.', icon: CheckCircle, color: 'text-green-600' },
  { key: 'suspend', label: 'Suspend', description: 'Suspend selected user accounts. Suspended users cannot log in.', icon: Ban, color: 'text-amber-600' },
  { key: 'delete', label: 'Delete', description: 'Permanently delete selected user accounts and all associated data.', icon: Trash2, color: 'text-red-600' },
  { key: 'message', label: 'Send message', description: 'Send a message to all selected users.', icon: Mail, color: 'text-[var(--moodle-primary)]' },
  { key: 'forcepassword', label: 'Force password change', description: 'Force selected users to change their password on next login.', icon: KeyRound, color: 'text-purple-600' },
];

const demoUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com' },
  { id: '2', name: 'John Smith', email: 'john.smith@example.com' },
  { id: '3', name: 'Jane Doe', email: 'jane.doe@example.com' },
  { id: '4', name: 'Bob Wilson', email: 'bob.wilson@example.com' },
  { id: '5', name: 'Alice Brown', email: 'alice.brown@example.com' },
];

export default function BulkUserActionsPage() {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = demoUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUsers.size === filtered.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filtered.map((u) => u.id)));
    }
  };

  return (
    <>
      <PageHeader
        title="Bulk user actions"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Accounts' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* User selection */}
            <div className="border border-[var(--border-color)] rounded-lg bg-white">
              <div className="p-4 border-b border-[var(--border-color)]">
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Users size={16} /> Select users
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    className="form-control text-sm"
                    style={{ paddingLeft: '2rem' }}
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left w-8">
                        <input type="checkbox" className="w-4 h-4" checked={selectedUsers.size === filtered.length && filtered.length > 0} onChange={toggleAll} />
                      </th>
                      <th className="py-2 px-3 text-left font-semibold">Name</th>
                      <th className="py-2 px-3 text-left font-semibold">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => (
                      <tr key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3">
                          <input type="checkbox" className="w-4 h-4" checked={selectedUsers.has(user.id)} onChange={() => toggleUser(user.id)} />
                        </td>
                        <td className="py-2 px-3">{user.name}</td>
                        <td className="py-2 px-3 text-[var(--text-muted)]">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                {selectedUsers.size} of {filtered.length} users selected
              </div>
            </div>

            {/* Actions panel */}
            <div>
              <div className="border border-[var(--border-color)] rounded-lg bg-white">
                <div className="p-4 border-b border-[var(--border-color)]">
                  <h2 className="text-sm font-semibold">Available actions</h2>
                </div>
                <div className="p-2">
                  {bulkActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.key}
                        className={`w-full text-left p-3 rounded-lg text-sm hover:bg-[var(--bg-hover)] transition-colors ${selectedAction === action.key ? 'bg-blue-50 border border-[var(--moodle-primary)]' : ''}`}
                        onClick={() => setSelectedAction(action.key)}
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <Icon size={16} className={action.color} />
                          {action.label}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1 ml-6">{action.description}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-[var(--border-color)]">
                  <button
                    className="btn btn-primary text-sm w-full"
                    disabled={!selectedAction || selectedUsers.size === 0}
                  >
                    Perform action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
