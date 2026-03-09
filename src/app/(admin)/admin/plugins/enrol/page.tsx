'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Settings, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

interface EnrolPlugin {
  id: string;
  name: string;
  enabled: boolean;
  instances: number;
  settingsHref: string;
  canDisable: boolean;
}

const initialPlugins: EnrolPlugin[] = [
  { id: 'manual', name: 'Manual enrolments', enabled: true, instances: 156, settingsHref: '/admin/plugins/enrol-manual', canDisable: false },
  { id: 'self', name: 'Self enrolment', enabled: true, instances: 89, settingsHref: '/admin/plugins/enrol-self', canDisable: true },
  { id: 'guest', name: 'Guest access', enabled: true, instances: 45, settingsHref: '/admin/plugins/enrol-guest', canDisable: true },
  { id: 'cohort', name: 'Cohort sync', enabled: true, instances: 23, settingsHref: '/admin/plugins/enrol-cohort', canDisable: true },
  { id: 'meta', name: 'Course meta link', enabled: true, instances: 12, settingsHref: '#', canDisable: true },
  { id: 'category', name: 'Category enrolments', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
  { id: 'database', name: 'External database', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
  { id: 'flatfile', name: 'Flat file (CSV)', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
  { id: 'imsenterprise', name: 'IMS Enterprise file', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
  { id: 'ldap', name: 'LDAP enrolments', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
  { id: 'lti', name: 'Publish as LTI tool', enabled: true, instances: 5, settingsHref: '#', canDisable: true },
  { id: 'mnet', name: 'MNet remote enrolments', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
  { id: 'paypal', name: 'PayPal', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
  { id: 'fee', name: 'Enrolment on payment', enabled: false, instances: 0, settingsHref: '#', canDisable: true },
];

export default function ManageEnrolPage() {
  const [plugins, setPlugins] = useState(initialPlugins);

  const toggleEnabled = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPlugins((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === plugins.length - 1) return;
    setPlugins((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Manage enrolment plugins"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Enrolments' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Manage enrolment plugins and their order. The order determines the default display in course enrolment options. Manual enrolments cannot be disabled.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Enrolment method</th>
                  <th className="py-2 px-3 text-center font-semibold">Instances</th>
                  <th className="py-2 px-3 text-center font-semibold">Enable</th>
                  <th className="py-2 px-3 text-center font-semibold">Order</th>
                  <th className="py-2 px-3 text-center font-semibold">Settings</th>
                </tr>
              </thead>
              <tbody>
                {plugins.map((plugin, index) => (
                  <tr
                    key={plugin.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      !plugin.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">{plugin.name}</td>
                    <td className="py-2 px-3 text-center text-[var(--text-muted)]">{plugin.instances}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleEnabled(plugin.id)}
                        className="btn-icon"
                        title={plugin.enabled ? 'Disable' : 'Enable'}
                        disabled={!plugin.canDisable}
                      >
                        {plugin.enabled ? (
                          <Eye size={16} className={!plugin.canDisable ? 'text-gray-400' : 'text-green-600'} />
                        ) : (
                          <EyeOff size={16} className="text-red-500" />
                        )}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveUp(index)}
                          className="btn-icon"
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp size={14} className={index === 0 ? 'text-gray-300' : ''} />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          className="btn-icon"
                          disabled={index === plugins.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} className={index === plugins.length - 1 ? 'text-gray-300' : ''} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Link href={plugin.settingsHref} className="btn-icon" title="Settings">
                        <Settings size={14} className="text-[var(--text-muted)]" />
                      </Link>
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
