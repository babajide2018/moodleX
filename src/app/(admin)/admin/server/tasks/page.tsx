'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Search, Filter, Play, Pause, RotateCcw, Edit2 } from 'lucide-react';

interface ScheduledTask {
  id: number;
  name: string;
  component: string;
  nextRun: string;
  lastRun: string;
  lastSuccess: string;
  failDelay: number;
  defaultSchedule: string;
  customSchedule: string;
  enabled: boolean;
}

const demoTasks: ScheduledTask[] = [
  { id: 1, name: 'Send email notifications', component: 'core', nextRun: '2026-03-09 14:05', lastRun: '2026-03-09 14:00', lastSuccess: '2026-03-09 14:00', failDelay: 0, defaultSchedule: '*/5 * * * *', customSchedule: '', enabled: true },
  { id: 2, name: 'Clean up temp files', component: 'core', nextRun: '2026-03-10 02:00', lastRun: '2026-03-09 02:00', lastSuccess: '2026-03-09 02:00', failDelay: 0, defaultSchedule: '0 2 * * *', customSchedule: '', enabled: true },
  { id: 3, name: 'Calculate course completions', component: 'core_completion', nextRun: '2026-03-09 14:10', lastRun: '2026-03-09 14:00', lastSuccess: '2026-03-09 14:00', failDelay: 0, defaultSchedule: '*/10 * * * *', customSchedule: '', enabled: true },
  { id: 4, name: 'Grade history cleanup', component: 'core_grades', nextRun: '2026-03-10 03:00', lastRun: '2026-03-09 03:00', lastSuccess: '2026-03-09 03:00', failDelay: 0, defaultSchedule: '0 3 * * *', customSchedule: '', enabled: true },
  { id: 5, name: 'Send forum digests', component: 'mod_forum', nextRun: '2026-03-09 17:00', lastRun: '2026-03-09 16:00', lastSuccess: '2026-03-09 16:00', failDelay: 0, defaultSchedule: '0 * * * *', customSchedule: '', enabled: true },
  { id: 6, name: 'Sync external calendars', component: 'core_calendar', nextRun: '2026-03-09 15:00', lastRun: '2026-03-09 14:00', lastSuccess: '2026-03-09 14:00', failDelay: 0, defaultSchedule: '0 * * * *', customSchedule: '', enabled: true },
  { id: 7, name: 'Session cleanup', component: 'core', nextRun: '2026-03-09 14:10', lastRun: '2026-03-09 14:00', lastSuccess: '2026-03-09 14:00', failDelay: 0, defaultSchedule: '*/10 * * * *', customSchedule: '', enabled: true },
  { id: 8, name: 'Backup courses', component: 'core_backup', nextRun: '2026-03-10 04:00', lastRun: '2026-03-09 04:00', lastSuccess: '2026-03-09 04:00', failDelay: 0, defaultSchedule: '0 4 * * *', customSchedule: '', enabled: true },
  { id: 9, name: 'Process assignment submissions', component: 'mod_assign', nextRun: '2026-03-09 14:20', lastRun: '2026-03-09 14:00', lastSuccess: '2026-03-09 14:00', failDelay: 0, defaultSchedule: '*/20 * * * *', customSchedule: '', enabled: true },
  { id: 10, name: 'Update RSS feeds', component: 'block_rss_client', nextRun: '2026-03-09 14:30', lastRun: '2026-03-09 14:00', lastSuccess: '2026-03-09 14:00', failDelay: 0, defaultSchedule: '*/30 * * * *', customSchedule: '', enabled: false },
  { id: 11, name: 'Send badge notifications', component: 'core_badges', nextRun: '2026-03-09 14:05', lastRun: '2026-03-09 14:00', lastSuccess: '2026-03-09 14:00', failDelay: 0, defaultSchedule: '*/5 * * * *', customSchedule: '', enabled: true },
  { id: 12, name: 'Crawl course links', component: 'tool_crawler', nextRun: '2026-03-10 01:00', lastRun: '2026-03-09 01:00', lastSuccess: '2026-03-08 01:00', failDelay: 60, defaultSchedule: '0 1 * * *', customSchedule: '', enabled: true },
];

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState(demoTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [componentFilter, setComponentFilter] = useState('all');

  const components = Array.from(new Set(demoTasks.map(t => t.component))).sort();

  const filtered = tasks.filter(t => {
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !t.component.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (componentFilter !== 'all' && t.component !== componentFilter) return false;
    return true;
  });

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  return (
    <>
      <PageHeader
        title="Scheduled tasks"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Task configuration' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <select
                className="form-control text-sm py-1"
                value={componentFilter}
                onChange={(e) => setComponentFilter(e.target.value)}
              >
                <option value="all">All components</option>
                {components.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-[var(--text-muted)]">{filtered.length} tasks</span>
          </div>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Task name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Component</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Next run</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Last run</th>
                  <th className="py-2 px-3 text-left font-semibold hidden xl:table-cell">Last success</th>
                  <th className="py-2 px-3 text-left font-semibold hidden xl:table-cell">Fail delay</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Default schedule</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Custom schedule</th>
                  <th className="py-2 px-3 text-center font-semibold">Enabled</th>
                  <th className="py-2 px-3 text-center font-semibold w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => (
                  <tr key={task.id} className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${!task.enabled ? 'opacity-60' : ''}`}>
                    <td className="py-2 px-3">
                      <span className="text-[var(--text-link)] font-medium">{task.name}</span>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs hidden md:table-cell">{task.component}</td>
                    <td className="py-2 px-3 text-xs hidden lg:table-cell">{task.nextRun}</td>
                    <td className="py-2 px-3 text-xs hidden lg:table-cell">{task.lastRun}</td>
                    <td className="py-2 px-3 text-xs hidden xl:table-cell">{task.lastSuccess}</td>
                    <td className="py-2 px-3 text-xs hidden xl:table-cell">
                      {task.failDelay > 0 ? (
                        <span className="text-red-600 font-medium">{task.failDelay}s</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">0</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-xs font-mono hidden md:table-cell">{task.defaultSchedule}</td>
                    <td className="py-2 px-3 text-xs font-mono hidden lg:table-cell">
                      {task.customSchedule || <span className="text-[var(--text-muted)]">-</span>}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        className={`btn-icon ${task.enabled ? 'text-green-600' : 'text-[var(--text-muted)]'}`}
                        onClick={() => toggleTask(task.id)}
                        title={task.enabled ? 'Disable task' : 'Enable task'}
                      >
                        {task.enabled ? <Play size={14} /> : <Pause size={14} />}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="btn-icon" title="Edit schedule">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn-icon" title="Run now">
                          <RotateCcw size={14} />
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
