'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Activity,
  FileText,
  Settings,
  Users,
  LogIn,
  Eye,
  Edit3,
  Trash2,
  BookOpen,
  Calendar,
  RefreshCw,
  Loader2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { adminTabs } from '@/lib/admin-tabs';

interface SiteStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalForumPosts: number;
  totalBadgesIssued: number;
  totalEvents: number;
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'config' | 'activity'>('logs');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/stats');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed to fetch stats (${res.status})`);
        }
        const data = await res.json();
        setStats(data.stats || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports' },
        ]}
        actions={
          <button className="btn btn-secondary text-sm flex items-center gap-1">
            <Download size={14} /> Export logs
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-[var(--moodle-primary)]" />
              <span className="ml-3 text-sm text-[var(--text-muted)]">Loading reports...</span>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 mb-6">
              <AlertCircle size={20} />
              <div>
                <div className="font-medium text-sm">Failed to load reports</div>
                <div className="text-xs mt-0.5">{error}</div>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && stats && (
            <>
              {/* Stats cards - real data from DB */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-[var(--moodle-primary)]">{stats.totalUsers}</div>
                  <div className="text-xs text-[var(--text-muted)]">Total users</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{stats.totalCourses}</div>
                  <div className="text-xs text-[var(--text-muted)]">Total courses</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-600">{stats.totalEnrollments}</div>
                  <div className="text-xs text-[var(--text-muted)]">Enrolments</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.totalForumPosts}</div>
                  <div className="text-xs text-[var(--text-muted)]">Forum posts</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-indigo-600">{stats.totalBadgesIssued}</div>
                  <div className="text-xs text-[var(--text-muted)]">Badges issued</div>
                </div>
                <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{stats.totalEvents}</div>
                  <div className="text-xs text-[var(--text-muted)]">Calendar events</div>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 mb-4 border-b border-[var(--border-color)]">
                {[
                  { key: 'logs' as const, label: 'Logs', icon: <FileText size={14} /> },
                  { key: 'config' as const, label: 'Config changes', icon: <Settings size={14} /> },
                  { key: 'activity' as const, label: 'Activity report', icon: <Activity size={14} /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === tab.key
                        ? 'border-[var(--moodle-primary)] text-[var(--moodle-primary)]'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Logs tab */}
              {activeTab === 'logs' && (
                <>
                  {/* Filters bar */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                      <input
                        type="text"
                        className="form-control text-sm pl-8"
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[var(--text-muted)]" />
                      <input type="date" className="form-control text-sm py-1" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                      <span className="text-xs text-[var(--text-muted)]">to</span>
                      <input type="date" className="form-control text-sm py-1" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                  </div>

                  {/* Logs table - empty state since no log API exists yet */}
                  <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                          <th className="py-2 px-3 text-left font-semibold">Time</th>
                          <th className="py-2 px-3 text-left font-semibold">User</th>
                          <th className="py-2 px-3 text-left font-semibold">Action</th>
                          <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Target</th>
                          <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Component</th>
                          <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Database size={32} className="text-[var(--text-muted)] opacity-40" />
                              <div className="text-sm text-[var(--text-muted)]">No log data available</div>
                              <div className="text-xs text-[var(--text-muted)]">
                                Log entries will appear here once the logging system is configured and events are recorded.
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Config changes tab */}
              {activeTab === 'config' && (
                <>
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    A record of all configuration changes made to the site, including who made the change and when.
                  </p>
                  <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                          <th className="py-2 px-3 text-left font-semibold">Setting</th>
                          <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Plugin</th>
                          <th className="py-2 px-3 text-left font-semibold">Old value</th>
                          <th className="py-2 px-3 text-left font-semibold">New value</th>
                          <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Changed by</th>
                          <th className="py-2 px-3 text-left font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Database size={32} className="text-[var(--text-muted)] opacity-40" />
                              <div className="text-sm text-[var(--text-muted)]">No configuration changes recorded</div>
                              <div className="text-xs text-[var(--text-muted)]">
                                Configuration change history will appear here once the audit logging system is set up.
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Activity report tab */}
              {activeTab === 'activity' && (
                <>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    Summary of site activity based on current database records.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-[var(--border-color)] rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-3">Site overview</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Registered users', count: stats.totalUsers, color: 'bg-blue-500', max: Math.max(stats.totalUsers, stats.totalCourses, stats.totalEnrollments, stats.totalForumPosts, 1) },
                          { label: 'Courses', count: stats.totalCourses, color: 'bg-green-500', max: Math.max(stats.totalUsers, stats.totalCourses, stats.totalEnrollments, stats.totalForumPosts, 1) },
                          { label: 'Enrolments', count: stats.totalEnrollments, color: 'bg-amber-500', max: Math.max(stats.totalUsers, stats.totalCourses, stats.totalEnrollments, stats.totalForumPosts, 1) },
                          { label: 'Forum posts', count: stats.totalForumPosts, color: 'bg-purple-500', max: Math.max(stats.totalUsers, stats.totalCourses, stats.totalEnrollments, stats.totalForumPosts, 1) },
                          { label: 'Badges issued', count: stats.totalBadgesIssued, color: 'bg-indigo-500', max: Math.max(stats.totalUsers, stats.totalCourses, stats.totalEnrollments, stats.totalForumPosts, 1) },
                          { label: 'Calendar events', count: stats.totalEvents, color: 'bg-red-500', max: Math.max(stats.totalUsers, stats.totalCourses, stats.totalEnrollments, stats.totalForumPosts, 1) },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{item.label}</span>
                              <span className="text-[var(--text-muted)]">{item.count}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-full`}
                                style={{ width: `${item.max > 0 ? Math.max((item.count / item.max) * 100, item.count > 0 ? 4 : 0) : 0}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-[var(--border-color)] rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-3">Quick stats</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-sm">
                            <Users size={14} className="text-[var(--moodle-primary)]" />
                            <span>Users</span>
                          </div>
                          <span className="text-sm font-semibold">{stats.totalUsers}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen size={14} className="text-green-600" />
                            <span>Courses</span>
                          </div>
                          <span className="text-sm font-semibold">{stats.totalCourses}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-sm">
                            <LogIn size={14} className="text-amber-600" />
                            <span>Enrolments</span>
                          </div>
                          <span className="text-sm font-semibold">{stats.totalEnrollments}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText size={14} className="text-purple-600" />
                            <span>Forum posts</span>
                          </div>
                          <span className="text-sm font-semibold">{stats.totalForumPosts}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                          <div className="flex items-center gap-2 text-sm">
                            <Activity size={14} className="text-indigo-600" />
                            <span>Badges issued</span>
                          </div>
                          <span className="text-sm font-semibold">{stats.totalBadgesIssued}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-red-600" />
                            <span>Calendar events</span>
                          </div>
                          <span className="text-sm font-semibold">{stats.totalEvents}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 border border-[var(--border-color)] rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-3">Activity log</h3>
                      <div className="flex flex-col items-center gap-2 py-6">
                        <Database size={32} className="text-[var(--text-muted)] opacity-40" />
                        <div className="text-sm text-[var(--text-muted)]">Detailed activity data not yet available</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          Per-user and per-course activity reports will be available once the event logging system is implemented.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
