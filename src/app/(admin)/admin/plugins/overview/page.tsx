'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';

interface PluginInfo {
  name: string;
  component: string;
  version: string;
  release: string;
  status: 'enabled' | 'disabled' | 'missing';
  availability: 'standard' | 'additional' | 'missing';
  type: string;
  hasUpdate: boolean;
}

const demoPlugins: PluginInfo[] = [
  { name: 'Assignment', component: 'mod_assign', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Forum', component: 'mod_forum', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Quiz', component: 'mod_quiz', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Workshop', component: 'mod_workshop', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Chat', component: 'mod_chat', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Choice', component: 'mod_choice', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Database', component: 'mod_data', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Feedback', component: 'mod_feedback', version: '2024100700', release: '4.5', status: 'disabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Glossary', component: 'mod_glossary', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Lesson', component: 'mod_lesson', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'SCORM package', component: 'mod_scorm', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Wiki', component: 'mod_wiki', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Activity module', hasUpdate: false },
  { name: 'Online text', component: 'assignsubmission_onlinetext', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Assignment submission', hasUpdate: false },
  { name: 'File submissions', component: 'assignsubmission_file', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Assignment submission', hasUpdate: false },
  { name: 'Submission comments', component: 'assignsubmission_comments', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Assignment submission', hasUpdate: false },
  { name: 'Annotate PDF', component: 'assignfeedback_editpdf', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Assignment feedback', hasUpdate: false },
  { name: 'Feedback comments', component: 'assignfeedback_comments', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Assignment feedback', hasUpdate: false },
  { name: 'Offline grading worksheet', component: 'assignfeedback_offline', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Assignment feedback', hasUpdate: false },
  { name: 'Manual enrolments', component: 'enrol_manual', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Enrolment', hasUpdate: false },
  { name: 'Self enrolment', component: 'enrol_self', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Enrolment', hasUpdate: false },
  { name: 'Guest access', component: 'enrol_guest', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Enrolment', hasUpdate: false },
  { name: 'Cohort sync', component: 'enrol_cohort', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Enrolment', hasUpdate: false },
  { name: 'Email-based self-registration', component: 'auth_email', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Authentication', hasUpdate: false },
  { name: 'Manual accounts', component: 'auth_manual', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Authentication', hasUpdate: false },
  { name: 'No login', component: 'auth_nologin', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Authentication', hasUpdate: false },
  { name: 'Atto HTML editor', component: 'editor_atto', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Text editor', hasUpdate: false },
  { name: 'TinyMCE editor', component: 'editor_tiny', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Text editor', hasUpdate: true },
  { name: 'Plain text area', component: 'editor_textarea', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Text editor', hasUpdate: false },
  { name: 'Topics format', component: 'format_topics', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Course format', hasUpdate: false },
  { name: 'Weekly format', component: 'format_weeks', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Course format', hasUpdate: false },
  { name: 'Social format', component: 'format_social', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Course format', hasUpdate: false },
  { name: 'Single activity format', component: 'format_singleactivity', version: '2024100700', release: '4.5', status: 'enabled', availability: 'standard', type: 'Course format', hasUpdate: false },
];

export default function PluginsOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [checking, setChecking] = useState(false);

  const types = Array.from(new Set(demoPlugins.map((p) => p.type))).sort();

  const filtered = demoPlugins.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.component.toLowerCase().includes(q)) return false;
    }
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const handleCheckUpdates = () => {
    setChecking(true);
    setTimeout(() => setChecking(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Plugins overview"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Plugins overview' },
        ]}
        actions={
          <button
            className="btn btn-primary text-sm flex items-center gap-1"
            onClick={handleCheckUpdates}
            disabled={checking}
          >
            <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking...' : 'Check for available updates'}
          </button>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{demoPlugins.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Total plugins</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">
                {demoPlugins.filter((p) => p.status === 'enabled').length}
              </div>
              <div className="text-xs text-[var(--text-muted)]">Enabled</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-red-600">
                {demoPlugins.filter((p) => p.status === 'disabled').length}
              </div>
              <div className="text-xs text-[var(--text-muted)]">Disabled</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-amber-600">
                {demoPlugins.filter((p) => p.hasUpdate).length}
              </div>
              <div className="text-xs text-[var(--text-muted)]">Updates available</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <input
                type="text"
                className="form-control text-sm"
                style={{ paddingLeft: '2rem' }}
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-[var(--text-muted)]" />
              <select
                className="form-control text-sm py-1"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                className="form-control text-sm py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <span className="text-sm text-[var(--text-muted)]">{filtered.length} plugins</span>
          </div>

          {/* Table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Plugin name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Component</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Type</th>
                  <th className="py-2 px-3 text-left font-semibold">Version</th>
                  <th className="py-2 px-3 text-left font-semibold">Release</th>
                  <th className="py-2 px-3 text-left font-semibold">Status</th>
                  <th className="py-2 px-3 text-left font-semibold">Availability</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((plugin) => (
                  <tr key={plugin.component} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3 font-medium">
                      <div className="flex items-center gap-2">
                        {plugin.name}
                        {plugin.hasUpdate && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                            <AlertTriangle size={10} /> Update
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs font-mono hidden md:table-cell">
                      {plugin.component}
                    </td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs hidden lg:table-cell">
                      {plugin.type}
                    </td>
                    <td className="py-2 px-3 text-xs font-mono">{plugin.version}</td>
                    <td className="py-2 px-3 text-xs">{plugin.release}</td>
                    <td className="py-2 px-3">
                      {plugin.status === 'enabled' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                          <CheckCircle2 size={10} /> Enabled
                        </span>
                      ) : plugin.status === 'disabled' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">
                          <XCircle size={10} /> Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-50 text-gray-600">
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        plugin.availability === 'standard'
                          ? 'bg-blue-50 text-blue-700'
                          : plugin.availability === 'additional'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}>
                        {plugin.availability.charAt(0).toUpperCase() + plugin.availability.slice(1)}
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
