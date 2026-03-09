'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Search, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';

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
      <button
        className="w-full flex items-center gap-2 p-4 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setOpen(!open)}
      >
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

const blockedIPs = [
  { ip: '192.168.1.100', reason: 'Brute force attempt', blockedAt: '2026-02-15 10:23:00', expires: 'Never' },
  { ip: '10.0.0.55', reason: 'Spam registration', blockedAt: '2026-03-01 08:45:12', expires: '2026-04-01 08:45:12' },
  { ip: '172.16.0.0/16', reason: 'Suspicious activity', blockedAt: '2026-03-05 14:12:33', expires: 'Never' },
];

export default function IPBlockerPage() {
  const [testIP, setTestIP] = useState('');
  const [testResult, setTestResult] = useState<null | { allowed: boolean; message: string }>(null);

  const handleTestIP = () => {
    if (!testIP.trim()) return;
    const isBlocked = blockedIPs.some((b) => b.ip === testIP.trim());
    setTestResult({
      allowed: !isBlocked,
      message: isBlocked
        ? `IP address ${testIP} is currently blocked.`
        : `IP address ${testIP} is allowed.`,
    });
  };

  return (
    <>
      <PageHeader
        title="IP blocker"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Security', href: '/admin/security' },
          { label: 'IP blocker' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Allowed IP list">
              <SettingField label="Allowed IPs" help="Enter one IP address or CIDR range per line. If set, only these IPs will be allowed access. Leave empty to allow all.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={6}
                  placeholder={"192.168.1.0/24\n10.0.0.1\n172.16.0.0/16"}
                />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Blocked IP list">
              <SettingField label="Blocked IPs" help="Enter one IP address or CIDR range per line. These IPs will be denied access to the site.">
                <textarea
                  className="form-control text-sm font-mono"
                  rows={6}
                  defaultValue={"192.168.1.100\n10.0.0.55\n172.16.0.0/16"}
                />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Test IP address">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">IP address to test</label>
                  <input
                    type="text"
                    className="form-control text-sm"
                    placeholder="e.g. 192.168.1.50"
                    value={testIP}
                    onChange={(e) => { setTestIP(e.target.value); setTestResult(null); }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary text-sm flex items-center gap-1"
                  onClick={handleTestIP}
                >
                  <Search size={14} /> Test
                </button>
              </div>
              {testResult && (
                <div className={`flex items-center gap-2 p-3 rounded-md text-sm mt-2 ${testResult.allowed ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {testResult.allowed ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                  {testResult.message}
                </div>
              )}
            </SettingsSection>

            <SettingsSection title="Currently blocked IPs" defaultOpen={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-[var(--border-color)]">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="text-left p-3 font-medium">IP Address</th>
                      <th className="text-left p-3 font-medium">Reason</th>
                      <th className="text-left p-3 font-medium">Blocked at</th>
                      <th className="text-left p-3 font-medium">Expires</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedIPs.map((entry, i) => (
                      <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="p-3 font-mono">{entry.ip}</td>
                        <td className="p-3">{entry.reason}</td>
                        <td className="p-3 text-[var(--text-muted)]">{entry.blockedAt}</td>
                        <td className="p-3 text-[var(--text-muted)]">{entry.expires}</td>
                        <td className="p-3">
                          <button type="button" className="btn-icon text-red-600 hover:text-red-800" title="Remove block">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
