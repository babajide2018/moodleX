'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Search,
  Upload,
  ChevronDown,
  ChevronRight,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Puzzle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { adminTabs } from '@/lib/admin-tabs';

interface Plugin {
  name: string;
  component: string;
  version: string;
  enabled: boolean;
  settings: boolean;
  status: 'ok' | 'update' | 'missing';
}

interface PluginSection {
  title: string;
  key: string;
  plugins: Plugin[];
}

const initialSections: PluginSection[] = [
  {
    title: 'Activity modules',
    key: 'activities',
    plugins: [
      { name: 'Assignment', component: 'mod_assign', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Book', component: 'mod_book', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Chat', component: 'mod_chat', version: '2024100700', enabled: false, settings: true, status: 'ok' },
      { name: 'Choice', component: 'mod_choice', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Database', component: 'mod_data', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'Forum', component: 'mod_forum', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Glossary', component: 'mod_glossary', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Quiz', component: 'mod_quiz', version: '2024100700', enabled: true, settings: true, status: 'ok' },
    ],
  },
  {
    title: 'Blocks',
    key: 'blocks',
    plugins: [
      { name: 'Calendar', component: 'block_calendar_month', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'HTML', component: 'block_html', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'Online users', component: 'block_online_users', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Recent activity', component: 'block_recent_activity', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'Timeline', component: 'block_timeline', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'RSS feeds', component: 'block_rss_client', version: '2024100700', enabled: false, settings: true, status: 'ok' },
    ],
  },
  {
    title: 'Authentication',
    key: 'auth',
    plugins: [
      { name: 'Manual accounts', component: 'auth_manual', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Email-based self-registration', component: 'auth_email', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'No login', component: 'auth_nologin', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'LDAP server', component: 'auth_ldap', version: '2024100700', enabled: false, settings: true, status: 'ok' },
      { name: 'OAuth 2', component: 'auth_oauth2', version: '2024100700', enabled: false, settings: true, status: 'ok' },
      { name: 'Shibboleth', component: 'auth_shibboleth', version: '2024100700', enabled: false, settings: true, status: 'ok' },
    ],
  },
  {
    title: 'Enrolment methods',
    key: 'enrol',
    plugins: [
      { name: 'Manual enrolments', component: 'enrol_manual', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Self enrolment', component: 'enrol_self', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Guest access', component: 'enrol_guest', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Cohort sync', component: 'enrol_cohort', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'PayPal', component: 'enrol_paypal', version: '2024100700', enabled: false, settings: true, status: 'ok' },
      { name: 'Flat file (CSV)', component: 'enrol_flatfile', version: '2024100700', enabled: false, settings: true, status: 'ok' },
    ],
  },
  {
    title: 'Filters',
    key: 'filters',
    plugins: [
      { name: 'Display emoticons as images', component: 'filter_emoticon', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'Convert URLs into links', component: 'filter_urltolink', version: '2024100700', enabled: true, settings: false, status: 'ok' },
      { name: 'MathJax', component: 'filter_mathjaxloader', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Multimedia plugins', component: 'filter_mediaplugin', version: '2024100700', enabled: true, settings: true, status: 'ok' },
      { name: 'Multi-language content', component: 'filter_multilang', version: '2024100700', enabled: false, settings: false, status: 'ok' },
    ],
  },
];

export default function AdminPluginsPage() {
  const [sections, setSections] = useState(initialSections);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['activities']));

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const togglePlugin = (sectionKey: string, pluginIndex: number) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.key !== sectionKey) return section;
        const plugins = [...section.plugins];
        plugins[pluginIndex] = { ...plugins[pluginIndex], enabled: !plugins[pluginIndex].enabled };
        return { ...section, plugins };
      })
    );
  };

  const totalPlugins = sections.reduce((sum, s) => sum + s.plugins.length, 0);
  const enabledPlugins = sections.reduce((sum, s) => sum + s.plugins.filter((p) => p.enabled).length, 0);
  const disabledPlugins = totalPlugins - enabledPlugins;

  return (
    <>
      <PageHeader
        title="Plugins overview"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Upload size={16} /> Install plugin
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[var(--moodle-primary)]">{totalPlugins}</div>
              <div className="text-xs text-[var(--text-muted)]">Total plugins</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{enabledPlugins}</div>
              <div className="text-xs text-[var(--text-muted)]">Enabled</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-500">{disabledPlugins}</div>
              <div className="text-xs text-[var(--text-muted)]">Disabled</div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-xs">
              <input
                type="text"
                className="form-control text-sm pl-8"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Plugin sections */}
          <div className="space-y-4">
            {sections.map((section) => {
              const filteredPlugins = searchQuery
                ? section.plugins.filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.component.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : section.plugins;

              if (searchQuery && filteredPlugins.length === 0) return null;

              return (
                <div key={section.key} className="border border-[var(--border-color)] rounded-lg">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left bg-[var(--bg-light)] hover:bg-[var(--bg-hover)] transition-colors"
                    onClick={() => toggleSection(section.key)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedSections.has(section.key) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <Puzzle size={16} className="text-[var(--text-muted)]" />
                      <span className="font-semibold text-sm">{section.title}</span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {section.plugins.filter((p) => p.enabled).length}/{section.plugins.length} enabled
                    </span>
                  </button>

                  {expandedSections.has(section.key) && (
                    <div className="border-t border-[var(--border-color)]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                            <th className="py-2 px-3 text-left font-semibold">Plugin name</th>
                            <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Component</th>
                            <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Version</th>
                            <th className="py-2 px-3 text-left font-semibold">Status</th>
                            <th className="py-2 px-3 text-left font-semibold">Enabled</th>
                            <th className="py-2 px-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPlugins.map((plugin, idx) => (
                            <tr key={plugin.component} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                              <td className="py-2 px-3 font-medium">{plugin.name}</td>
                              <td className="py-2 px-3 text-xs text-[var(--text-muted)] font-mono hidden md:table-cell">
                                {plugin.component}
                              </td>
                              <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">
                                {plugin.version}
                              </td>
                              <td className="py-2 px-3">
                                {plugin.status === 'ok' && (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle2 size={12} /> OK
                                  </span>
                                )}
                                {plugin.status === 'update' && (
                                  <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                    <AlertTriangle size={12} /> Update available
                                  </span>
                                )}
                                {plugin.status === 'missing' && (
                                  <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                    <XCircle size={12} /> Missing
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <button
                                  className="flex items-center"
                                  onClick={() => togglePlugin(section.key, idx)}
                                  title={plugin.enabled ? 'Disable plugin' : 'Enable plugin'}
                                >
                                  {plugin.enabled ? (
                                    <ToggleRight size={24} className="text-green-600" />
                                  ) : (
                                    <ToggleLeft size={24} className="text-gray-400" />
                                  )}
                                </button>
                              </td>
                              <td className="py-2 px-3">
                                {plugin.settings && (
                                  <button className="btn-icon" title="Settings">
                                    <Settings size={14} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Additional info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">Installing additional plugins</p>
            <p className="text-xs">
              You can install additional plugins by uploading a ZIP file using the &quot;Install plugin&quot; button above,
              or by placing plugin files directly in the appropriate directory on the server.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
