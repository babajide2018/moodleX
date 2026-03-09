'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  Search,
  UserPlus,
  Upload,
  Download,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Shield,
  Ban,
  CheckCircle2,
  Mail,
  Key,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface AdminUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  confirmed: boolean;
  suspended: boolean;
  lastaccess: string | null;
  createdAt: string;
  enrollmentCount: number;
}

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  coursecreator: 'Course creator',
  editingteacher: 'Teacher',
  teacher: 'Non-editing teacher',
  student: 'Student',
  guest: 'Guest',
};

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-red-50 text-red-700',
  coursecreator: 'bg-purple-50 text-purple-700',
  editingteacher: 'bg-orange-50 text-orange-700',
  teacher: 'bg-amber-50 text-amber-700',
  student: 'bg-blue-50 text-blue-700',
  guest: 'bg-gray-50 text-gray-600',
};

function formatLastAccess(lastaccess: string | null): string {
  if (!lastaccess) return 'Never';
  const date = new Date(lastaccess);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to fetch users (${res.status})`);
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!`${u.firstname} ${u.lastname}`.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q) &&
          !u.username.toLowerCase().includes(q)) return false;
    }
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter === 'active' && u.suspended) return false;
    if (statusFilter === 'suspended' && !u.suspended) return false;
    if (statusFilter === 'unconfirmed' && u.confirmed) return false;
    return true;
  });

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

  // Compute stats from fetched data
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.suspended).length;
  const suspendedUsers = users.filter((u) => u.suspended).length;
  const unconfirmedUsers = users.filter((u) => !u.confirmed).length;
  const loggedInUsers = users.filter((u) => u.lastaccess !== null).length;

  return (
    <>
      <PageHeader
        title="User management"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Users' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              className="btn btn-primary text-sm flex items-center gap-1"
              onClick={() => setShowAddUser(true)}
            >
              <UserPlus size={16} /> Add a new user
            </button>
            <button className="btn btn-secondary text-sm flex items-center gap-1">
              <Upload size={14} /> Upload users
            </button>
          </div>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-[var(--moodle-primary)]" />
              <span className="ml-3 text-sm text-[var(--text-muted)]">Loading users...</span>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 mb-6">
              <AlertCircle size={20} />
              <div>
                <div className="font-medium text-sm">Failed to load users</div>
                <div className="text-xs mt-0.5">{error}</div>
              </div>
            </div>
          )}

          {/* Content - show when loaded (even if empty) */}
          {!loading && !error && (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{totalUsers}</div>
                  <div className="text-xs text-[var(--text-muted)]">Total users</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{activeUsers}</div>
                  <div className="text-xs text-[var(--text-muted)]">Active</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-red-600">{suspendedUsers}</div>
                  <div className="text-xs text-[var(--text-muted)]">Suspended</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-600">{unconfirmedUsers}</div>
                  <div className="text-xs text-[var(--text-muted)]">Unconfirmed</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[var(--moodle-primary)]">{loggedInUsers}</div>
                  <div className="text-xs text-[var(--text-muted)]">Ever logged in</div>
                </div>
              </div>

              {/* Filters bar */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <input
                    type="text"
                    className="form-control text-sm pl-8"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-[var(--text-muted)]" />
                  <select
                    className="form-control text-sm py-1"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All roles</option>
                    {Object.entries(roleLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>

                  <select
                    className="form-control text-sm py-1"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="unconfirmed">Unconfirmed</option>
                  </select>
                </div>

                <span className="text-sm text-[var(--text-muted)]">
                  {filtered.length} users
                </span>
              </div>

              {/* Users table */}
              {filtered.length === 0 ? (
                <div className="border border-[var(--border-color)] rounded-lg p-8 text-center">
                  <div className="text-[var(--text-muted)] text-sm">
                    {users.length === 0
                      ? 'No users found. Add your first user to get started.'
                      : 'No users match the current filters.'}
                  </div>
                </div>
              ) : (
                <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                        <th className="py-2 px-3 text-left w-8">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selectedUsers.size === filtered.length && filtered.length > 0}
                            onChange={toggleAll}
                          />
                        </th>
                        <th className="py-2 px-3 text-left font-semibold">Full name</th>
                        <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Username</th>
                        <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Email</th>
                        <th className="py-2 px-3 text-left font-semibold">Role</th>
                        <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Last access</th>
                        <th className="py-2 px-3 text-left font-semibold">Status</th>
                        <th className="py-2 px-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user) => (
                        <tr key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                          <td className="py-2 px-3">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedUsers.has(user.id)}
                              onChange={() => toggleUser(user.id)}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {user.firstname[0]}{user.lastname[0]}
                              </div>
                              <Link
                                href={`/user/${user.id}`}
                                className="text-[var(--text-link)] font-medium hover:underline"
                              >
                                {user.firstname} {user.lastname}
                              </Link>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-[var(--text-muted)] hidden md:table-cell text-xs">
                            {user.username}
                          </td>
                          <td className="py-2 px-3 text-[var(--text-muted)] hidden lg:table-cell text-xs">
                            {user.email}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded ${roleBadgeColors[user.role] || 'bg-gray-50 text-gray-600'}`}>
                              {roleLabels[user.role] || user.role}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
                            {formatLastAccess(user.lastaccess)}
                          </td>
                          <td className="py-2 px-3">
                            {user.suspended ? (
                              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">
                                Suspended
                              </span>
                            ) : !user.confirmed ? (
                              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                                Unconfirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <button className="btn-icon">
                              <MoreVertical size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bulk actions */}
              {selectedUsers.size > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-[var(--text-muted)]">
                    With {selectedUsers.size} selected:
                  </span>
                  <select className="form-control text-sm py-1 w-auto">
                    <option value="">Choose...</option>
                    <option value="confirm">Confirm</option>
                    <option value="suspend">Suspend</option>
                    <option value="unsuspend">Unsuspend</option>
                    <option value="delete">Delete</option>
                    <option value="message">Send message</option>
                    <option value="resetpassword">Force password change</option>
                  </select>
                  <button className="btn btn-secondary text-sm">Go</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add user modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/40 z-[1060] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-base">Add a new user</h3>
              <button className="btn-icon" onClick={() => setShowAddUser(false)}>&times;</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="form-label text-sm">Username <span className="text-red-500">*</span></label>
                <input type="text" className="form-control" />
              </div>
              <div>
                <label className="form-label text-sm">Password <span className="text-red-500">*</span></label>
                <input type="password" className="form-control" />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Must be at least 8 characters, with uppercase, lowercase, digit, and special character.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-sm">First name <span className="text-red-500">*</span></label>
                  <input type="text" className="form-control" />
                </div>
                <div>
                  <label className="form-label text-sm">Surname <span className="text-red-500">*</span></label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div>
                <label className="form-label text-sm">Email address <span className="text-red-500">*</span></label>
                <input type="email" className="form-control" />
              </div>
              <div>
                <label className="form-label text-sm">System role</label>
                <select className="form-control">
                  <option value="student">Student</option>
                  <option value="teacher">Non-editing teacher</option>
                  <option value="editingteacher">Teacher</option>
                  <option value="coursecreator">Course creator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-sm">City/town</label>
                  <input type="text" className="form-control" />
                </div>
                <div>
                  <label className="form-label text-sm">Country</label>
                  <select className="form-control">
                    <option value="">Select a country...</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
              <button className="btn btn-secondary" onClick={() => setShowAddUser(false)}>Cancel</button>
              <button className="btn btn-primary">Create user</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
