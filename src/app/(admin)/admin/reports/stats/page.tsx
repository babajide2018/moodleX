'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { BarChart3, TrendingUp, Download } from 'lucide-react';

interface StatRow {
  period: string;
  logins: number;
  courseViews: number;
  posts: number;
  uploads: number;
}

const weeklyStats: StatRow[] = [
  { period: 'Week of 3 Mar 2026', logins: 342, courseViews: 1245, posts: 89, uploads: 23 },
  { period: 'Week of 24 Feb 2026', logins: 315, courseViews: 1180, posts: 76, uploads: 18 },
  { period: 'Week of 17 Feb 2026', logins: 298, courseViews: 1090, posts: 82, uploads: 21 },
  { period: 'Week of 10 Feb 2026', logins: 278, courseViews: 1025, posts: 71, uploads: 15 },
  { period: 'Week of 3 Feb 2026', logins: 305, courseViews: 1150, posts: 95, uploads: 27 },
  { period: 'Week of 27 Jan 2026', logins: 290, courseViews: 1078, posts: 68, uploads: 14 },
  { period: 'Week of 20 Jan 2026', logins: 256, courseViews: 945, posts: 54, uploads: 11 },
  { period: 'Week of 13 Jan 2026', logins: 312, courseViews: 1200, posts: 88, uploads: 25 },
];

const monthlyStats: StatRow[] = [
  { period: 'March 2026', logins: 342, courseViews: 1245, posts: 89, uploads: 23 },
  { period: 'February 2026', logins: 1196, courseViews: 4445, posts: 324, uploads: 81 },
  { period: 'January 2026', logins: 1158, courseViews: 4223, posts: 298, uploads: 75 },
  { period: 'December 2025', logins: 890, courseViews: 3100, posts: 210, uploads: 52 },
  { period: 'November 2025', logins: 1245, courseViews: 4680, posts: 356, uploads: 94 },
  { period: 'October 2025', logins: 1310, courseViews: 4890, posts: 378, uploads: 101 },
];

const dailyStats: StatRow[] = [
  { period: '9 Mar 2026', logins: 52, courseViews: 198, posts: 14, uploads: 4 },
  { period: '8 Mar 2026', logins: 48, courseViews: 175, posts: 11, uploads: 3 },
  { period: '7 Mar 2026', logins: 55, courseViews: 210, posts: 18, uploads: 5 },
  { period: '6 Mar 2026', logins: 43, courseViews: 162, posts: 9, uploads: 2 },
  { period: '5 Mar 2026', logins: 60, courseViews: 225, posts: 16, uploads: 4 },
  { period: '4 Mar 2026', logins: 47, courseViews: 180, posts: 12, uploads: 3 },
  { period: '3 Mar 2026', logins: 37, courseViews: 95, posts: 9, uploads: 2 },
];

const statData: Record<string, StatRow[]> = {
  daily: dailyStats,
  weekly: weeklyStats,
  monthly: monthlyStats,
};

export default function StatisticsPage() {
  const [period, setPeriod] = useState('weekly');

  const stats = statData[period] || weeklyStats;
  const totalLogins = stats.reduce((s, r) => s + r.logins, 0);
  const totalViews = stats.reduce((s, r) => s + r.courseViews, 0);
  const totalPosts = stats.reduce((s, r) => s + r.posts, 0);
  const totalUploads = stats.reduce((s, r) => s + r.uploads, 0);

  // Simple bar chart using max values
  const maxLogins = Math.max(...stats.map((s) => s.logins));

  return (
    <>
      <PageHeader
        title="Statistics"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Statistics' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Period selector */}
          <div
            className="border border-[var(--border-color)] rounded-lg p-4 mb-4"
            style={{ backgroundColor: 'var(--bg-light)' }}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={16} className="text-[var(--text-muted)]" />
              <label className="text-sm font-semibold">Stat period:</label>
              <select
                className="form-control text-sm w-auto"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button className="btn btn-primary text-sm">View</button>
              <button className="btn text-sm flex items-center gap-1 ml-auto">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{totalLogins.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">Total logins</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[var(--text-link)]">{totalViews.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">Course views</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{totalPosts.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">Posts</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-amber-600">{totalUploads.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">Uploads</div>
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="border border-[var(--border-color)] rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-[var(--text-muted)]" />
              <span className="text-sm font-semibold">Logins over time</span>
            </div>
            <div className="flex items-end gap-2 h-40">
              {stats.map((row, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-[var(--text-muted)]">{row.logins}</span>
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(row.logins / maxLogins) * 100}%`,
                      backgroundColor: 'var(--moodle-primary, #0f6cbf)',
                      minHeight: '4px',
                    }}
                  />
                  <span className="text-[10px] text-[var(--text-muted)] truncate max-w-full text-center">
                    {period === 'daily'
                      ? row.period.replace(' 2026', '').replace(' Mar', '/3').replace(' Feb', '/2').replace(' Jan', '/1')
                      : period === 'weekly'
                      ? row.period.replace('Week of ', '').slice(0, 6)
                      : row.period.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Period</th>
                  <th className="py-2 px-3 text-right font-semibold">Logins</th>
                  <th className="py-2 px-3 text-right font-semibold">Course views</th>
                  <th className="py-2 px-3 text-right font-semibold">Posts</th>
                  <th className="py-2 px-3 text-right font-semibold">Uploads</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
                  >
                    <td className="py-2 px-3 font-medium">{row.period}</td>
                    <td className="py-2 px-3 text-right">{row.logins.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">{row.courseViews.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">{row.posts.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">{row.uploads.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-[var(--bg-light)] border-t-2 border-[var(--border-color)] font-semibold">
                  <td className="py-2 px-3">Total</td>
                  <td className="py-2 px-3 text-right">{totalLogins.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{totalViews.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{totalPosts.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{totalUploads.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
