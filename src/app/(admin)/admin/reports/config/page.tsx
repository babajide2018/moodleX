'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Filter, Search, Download, Settings } from 'lucide-react';

interface ConfigChange {
  id: number;
  date: string;
  user: string;
  plugin: string;
  setting: string;
  newValue: string;
  oldValue: string;
}

const demoConfigChanges: ConfigChange[] = [
  {
    id: 1,
    date: '9 Mar 2026, 14:20',
    user: 'Admin User',
    plugin: 'core',
    setting: 'enablewebservices',
    newValue: '1',
    oldValue: '0',
  },
  {
    id: 2,
    date: '9 Mar 2026, 13:45',
    user: 'Admin User',
    plugin: 'core',
    setting: 'maxbytes',
    newValue: '104857600',
    oldValue: '52428800',
  },
  {
    id: 3,
    date: '9 Mar 2026, 11:30',
    user: 'Admin User',
    plugin: 'mod_forum',
    setting: 'maxattachments',
    newValue: '9',
    oldValue: '5',
  },
  {
    id: 4,
    date: '8 Mar 2026, 16:15',
    user: 'Admin User',
    plugin: 'core',
    setting: 'langmenu',
    newValue: '1',
    oldValue: '0',
  },
  {
    id: 5,
    date: '8 Mar 2026, 15:50',
    user: 'Admin User',
    plugin: 'theme_boost',
    setting: 'brandcolor',
    newValue: '#0f6cbf',
    oldValue: '#1177d1',
  },
  {
    id: 6,
    date: '8 Mar 2026, 14:30',
    user: 'Admin User',
    plugin: 'auth_email',
    setting: 'recaptcha',
    newValue: '1',
    oldValue: '0',
  },
  {
    id: 7,
    date: '8 Mar 2026, 10:00',
    user: 'Admin User',
    plugin: 'core',
    setting: 'cronclionly',
    newValue: '1',
    oldValue: '0',
  },
  {
    id: 8,
    date: '7 Mar 2026, 17:20',
    user: 'Admin User',
    plugin: 'mod_assign',
    setting: 'submissiondrafts',
    newValue: '1',
    oldValue: '0',
  },
  {
    id: 9,
    date: '7 Mar 2026, 15:40',
    user: 'Admin User',
    plugin: 'core',
    setting: 'forceloginforprofiles',
    newValue: '1',
    oldValue: '0',
  },
  {
    id: 10,
    date: '7 Mar 2026, 12:10',
    user: 'Admin User',
    plugin: 'core',
    setting: 'timezone',
    newValue: 'Europe/London',
    oldValue: 'UTC',
  },
  {
    id: 11,
    date: '6 Mar 2026, 16:30',
    user: 'Admin User',
    plugin: 'mod_quiz',
    setting: 'timelimit',
    newValue: '3600',
    oldValue: '0',
  },
  {
    id: 12,
    date: '6 Mar 2026, 11:00',
    user: 'Admin User',
    plugin: 'core',
    setting: 'passwordpolicy',
    newValue: '1',
    oldValue: '0',
  },
];

export default function ConfigChangesPage() {
  const [userFilter, setUserFilter] = useState('');
  const [settingFilter, setSettingFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = demoConfigChanges.filter((change) => {
    if (userFilter && !change.user.toLowerCase().includes(userFilter.toLowerCase())) return false;
    if (settingFilter && !change.setting.toLowerCase().includes(settingFilter.toLowerCase()) &&
        !change.plugin.toLowerCase().includes(settingFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Config changes"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Config changes' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Filter bar */}
          <div
            className="border border-[var(--border-color)] rounded-lg p-4 mb-4"
            style={{ backgroundColor: 'var(--bg-light)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-[var(--text-muted)]" />
              <span className="text-sm font-semibold">Filters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Date from</label>
                <input
                  type="date"
                  className="form-control text-sm"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Date to</label>
                <input
                  type="date"
                  className="form-control text-sm"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">User</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-control text-sm"
                    placeholder="All users"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    style={{ paddingLeft: '2rem' }}
                  />
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Setting name</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-control text-sm"
                    placeholder="Search settings..."
                    value={settingFilter}
                    onChange={(e) => setSettingFilter(e.target.value)}
                    style={{ paddingLeft: '2rem' }}
                  />
                  <Settings size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button className="btn btn-primary text-sm">Get these changes</button>
              <button className="btn text-sm flex items-center gap-1">
                <Download size={14} /> Download table data
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-[var(--text-muted)] mb-3">
            Showing {filtered.length} config change{filtered.length !== 1 ? 's' : ''}
          </div>

          {/* Config changes table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Date</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">User</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Plugin</th>
                  <th className="py-2 px-3 text-left font-semibold whitespace-nowrap">Setting</th>
                  <th className="py-2 px-3 text-left font-semibold">New value</th>
                  <th className="py-2 px-3 text-left font-semibold">Old value</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((change) => (
                  <tr
                    key={change.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
                  >
                    <td className="py-2 px-3 whitespace-nowrap text-[var(--text-muted)]">{change.date}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="text-[var(--text-link)] cursor-pointer hover:underline">{change.user}</span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {change.plugin}
                      </span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono text-xs">{change.setting}</td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 font-mono">
                        {change.newValue}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 font-mono">
                        {change.oldValue}
                      </span>
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
