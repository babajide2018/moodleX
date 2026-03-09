'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Settings, ArrowUp, ArrowDown, Eye, EyeOff, Users } from 'lucide-react';

interface AuthMethod {
  id: string;
  name: string;
  enabled: boolean;
  users: number;
  settingsHref: string;
  canDisable: boolean;
}

const initialMethods: AuthMethod[] = [
  { id: 'manual', name: 'Manual accounts', enabled: true, users: 45, settingsHref: '/admin/plugins/auth-manual', canDisable: false },
  { id: 'nologin', name: 'No login', enabled: true, users: 3, settingsHref: '#', canDisable: true },
  { id: 'email', name: 'Email-based self-registration', enabled: true, users: 128, settingsHref: '/admin/plugins/auth-email', canDisable: true },
  { id: 'db', name: 'External database', enabled: false, users: 0, settingsHref: '#', canDisable: true },
  { id: 'ldap', name: 'LDAP server', enabled: false, users: 0, settingsHref: '#', canDisable: true },
  { id: 'cas', name: 'CAS server (SSO)', enabled: false, users: 0, settingsHref: '#', canDisable: true },
  { id: 'mnet', name: 'MNet authentication', enabled: false, users: 0, settingsHref: '#', canDisable: true },
  { id: 'oauth2', name: 'OAuth 2', enabled: false, users: 0, settingsHref: '#', canDisable: true },
  { id: 'shibboleth', name: 'Shibboleth', enabled: false, users: 0, settingsHref: '#', canDisable: true },
  { id: 'lti', name: 'LTI', enabled: true, users: 12, settingsHref: '#', canDisable: true },
  { id: 'webservice', name: 'Web services authentication', enabled: true, users: 2, settingsHref: '#', canDisable: true },
];

export default function ManageAuthPage() {
  const [methods, setMethods] = useState(initialMethods);

  const toggleEnabled = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setMethods((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === methods.length - 1) return;
    setMethods((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Manage authentication"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Authentication' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Manage authentication plugins. The order determines priority when multiple methods are enabled. Manual accounts cannot be disabled.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Authentication method</th>
                  <th className="py-2 px-3 text-center font-semibold">Users</th>
                  <th className="py-2 px-3 text-center font-semibold">Enable</th>
                  <th className="py-2 px-3 text-center font-semibold">Order</th>
                  <th className="py-2 px-3 text-center font-semibold">Settings</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method, index) => (
                  <tr
                    key={method.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      !method.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">{method.name}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Users size={12} /> {method.users}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => toggleEnabled(method.id)}
                        className="btn-icon"
                        title={method.enabled ? 'Disable' : 'Enable'}
                        disabled={!method.canDisable}
                      >
                        {method.enabled ? (
                          <Eye size={16} className={!method.canDisable ? 'text-gray-400' : 'text-green-600'} />
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
                          disabled={index === methods.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} className={index === methods.length - 1 ? 'text-gray-300' : ''} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Link href={method.settingsHref} className="btn-icon" title="Settings">
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
