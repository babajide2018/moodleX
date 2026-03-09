'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Plus, Trash2, RefreshCw, Database, HardDrive, Cpu, Settings } from 'lucide-react';

interface CacheStore {
  id: number;
  name: string;
  plugin: string;
  type: 'application' | 'session' | 'request';
  ready: boolean;
  mappings: number;
}

interface CacheDefinition {
  area: string;
  component: string;
  store: string;
  mode: string;
  hits: number;
  misses: number;
}

const demoStores: CacheStore[] = [
  { id: 1, name: 'Default application cache', plugin: 'File cache', type: 'application', ready: true, mappings: 12 },
  { id: 2, name: 'Default session cache', plugin: 'Session cache', type: 'session', ready: true, mappings: 5 },
  { id: 3, name: 'Default request cache', plugin: 'Static request cache', type: 'request', ready: true, mappings: 8 },
  { id: 4, name: 'Redis cache store', plugin: 'Redis', type: 'application', ready: false, mappings: 0 },
  { id: 5, name: 'Memcached store', plugin: 'Memcached', type: 'application', ready: false, mappings: 0 },
];

const demoDefinitions: CacheDefinition[] = [
  { area: 'String cache', component: 'core', store: 'Default application cache', mode: 'Application', hits: 15234, misses: 456 },
  { area: 'Language strings', component: 'core', store: 'Default application cache', mode: 'Application', hits: 89012, misses: 123 },
  { area: 'Theme cache', component: 'core', store: 'Default application cache', mode: 'Application', hits: 4567, misses: 89 },
  { area: 'Configuration', component: 'core', store: 'Default application cache', mode: 'Application', hits: 23456, misses: 12 },
  { area: 'Course modules', component: 'core', store: 'Default request cache', mode: 'Request', hits: 7890, misses: 234 },
  { area: 'User sessions', component: 'core', store: 'Default session cache', mode: 'Session', hits: 56789, misses: 567 },
  { area: 'Calendar events', component: 'core_calendar', store: 'Default application cache', mode: 'Application', hits: 3456, misses: 78 },
  { area: 'Gradebook cache', component: 'core_grades', store: 'Default application cache', mode: 'Application', hits: 12345, misses: 345 },
];

const typeColors: Record<string, string> = {
  application: 'bg-blue-50 text-blue-700',
  session: 'bg-purple-50 text-purple-700',
  request: 'bg-amber-50 text-amber-700',
};

const typeIcons: Record<string, React.ReactNode> = {
  application: <Database size={14} />,
  session: <HardDrive size={14} />,
  request: <Cpu size={14} />,
};

export default function CachingConfigPage() {
  const [purging, setPurging] = useState(false);

  const handlePurge = () => {
    setPurging(true);
    setTimeout(() => setPurging(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Caching configuration"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Performance' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button className="btn btn-primary text-sm flex items-center gap-1">
              <Plus size={16} /> Add cache store
            </button>
            <button
              className="btn btn-secondary text-sm flex items-center gap-1"
              onClick={handlePurge}
              disabled={purging}
            >
              <RefreshCw size={16} className={purging ? 'animate-spin' : ''} />
              {purging ? 'Purging...' : 'Purge all caches'}
            </button>
          </div>
        }
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{demoStores.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Cache stores</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{demoStores.filter(s => s.ready).length}</div>
              <div className="text-xs text-[var(--text-muted)]">Ready</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{demoDefinitions.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Cache definitions</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[var(--moodle-primary)]">
                {demoDefinitions.reduce((sum, d) => sum + d.hits, 0).toLocaleString()}
              </div>
              <div className="text-xs text-[var(--text-muted)]">Total hits</div>
            </div>
          </div>

          {/* Cache stores */}
          <h3 className="text-sm font-semibold mb-2">Cache stores</h3>
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Store name</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Plugin</th>
                  <th className="py-2 px-3 text-center font-semibold">Type</th>
                  <th className="py-2 px-3 text-center font-semibold">Ready</th>
                  <th className="py-2 px-3 text-center font-semibold hidden md:table-cell">Mappings</th>
                  <th className="py-2 px-3 text-center font-semibold w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoStores.map(store => (
                  <tr key={store.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3 font-medium">{store.name}</td>
                    <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{store.plugin}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${typeColors[store.type]}`}>
                        {typeIcons[store.type]} {store.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {store.ready ? (
                        <span className="text-xs text-green-600 font-medium">Ready</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Not ready</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center text-xs hidden md:table-cell">{store.mappings}</td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="btn-icon" title="Edit"><Settings size={14} /></button>
                        {store.id > 3 && <button className="btn-icon text-red-500" title="Delete"><Trash2 size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cache definitions */}
          <h3 className="text-sm font-semibold mb-2">Cache definitions summary</h3>
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Area</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Component</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Store</th>
                  <th className="py-2 px-3 text-center font-semibold">Mode</th>
                  <th className="py-2 px-3 text-right font-semibold">Hits</th>
                  <th className="py-2 px-3 text-right font-semibold">Misses</th>
                  <th className="py-2 px-3 text-right font-semibold hidden md:table-cell">Hit ratio</th>
                </tr>
              </thead>
              <tbody>
                {demoDefinitions.map((def, i) => {
                  const ratio = def.hits + def.misses > 0 ? ((def.hits / (def.hits + def.misses)) * 100).toFixed(1) : '0';
                  return (
                    <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                      <td className="py-2 px-3 font-medium">{def.area}</td>
                      <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">{def.component}</td>
                      <td className="py-2 px-3 text-xs hidden lg:table-cell">{def.store}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded ${typeColors[def.mode.toLowerCase()] || 'bg-gray-50 text-gray-600'}`}>
                          {def.mode}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-xs font-mono">{def.hits.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-xs font-mono">{def.misses.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-xs font-mono hidden md:table-cell">
                        <span className={Number(ratio) > 90 ? 'text-green-600' : Number(ratio) > 70 ? 'text-amber-600' : 'text-red-600'}>
                          {ratio}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
