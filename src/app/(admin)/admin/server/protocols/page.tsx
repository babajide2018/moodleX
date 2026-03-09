'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Save, ExternalLink } from 'lucide-react';

function SettingField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {help && <span className="text-[var(--text-muted)] cursor-help" title={help}><HelpCircle size={12} /></span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

function SettingsSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-white">
      <button className="w-full flex items-center gap-2 p-4 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-color)] pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface Protocol {
  name: string;
  key: string;
  enabled: boolean;
  activeUsers: number;
  description: string;
  docUrl: string;
}

export default function ManageProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([
    { name: 'REST', key: 'rest', enabled: true, activeUsers: 248, description: 'REST (Representational State Transfer) protocol. Most commonly used protocol for web service integrations.', docUrl: '#' },
    { name: 'SOAP', key: 'soap', enabled: false, activeUsers: 0, description: 'SOAP (Simple Object Access Protocol). Uses XML-based messaging and WSDL for service description.', docUrl: '#' },
    { name: 'XML-RPC', key: 'xmlrpc', enabled: false, activeUsers: 0, description: 'XML-RPC protocol. A simple remote procedure call protocol using XML over HTTP.', docUrl: '#' },
  ]);

  const toggleProtocol = (key: string) => {
    setProtocols(prev => prev.map(p => p.key === key ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <>
      <PageHeader
        title="Manage protocols"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Web services' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Enable the web service protocols that you want to make available. At least one protocol must be enabled for web services to function.
            </p>

            {/* Protocols table */}
            <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                    <th className="py-2 px-3 text-left font-semibold">Protocol</th>
                    <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Description</th>
                    <th className="py-2 px-3 text-center font-semibold">Enabled</th>
                    <th className="py-2 px-3 text-center font-semibold">Active users</th>
                    <th className="py-2 px-3 text-center font-semibold">Documentation</th>
                  </tr>
                </thead>
                <tbody>
                  {protocols.map(protocol => (
                    <tr key={protocol.key} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                      <td className="py-3 px-3">
                        <span className="font-semibold">{protocol.name}</span>
                      </td>
                      <td className="py-3 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
                        {protocol.description}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={protocol.enabled}
                            onChange={() => toggleProtocol(protocol.key)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-sm font-medium ${protocol.activeUsers > 0 ? 'text-[var(--moodle-primary)]' : 'text-[var(--text-muted)]'}`}>
                          {protocol.activeUsers}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button className="btn-icon text-[var(--text-link)]" title="View documentation">
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SettingsSection title="Web service settings">
              <SettingField label="Web services documentation" help="Enable auto-generated API documentation for each protocol.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-sm">Enable web services documentation</span>
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Users with the appropriate capability will see a link to auto-generated API documentation.
                </p>
              </SettingField>
            </SettingsSection>

            <div className="flex justify-end">
              <button className="btn btn-primary text-sm flex items-center gap-2">
                <Save size={16} />
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
