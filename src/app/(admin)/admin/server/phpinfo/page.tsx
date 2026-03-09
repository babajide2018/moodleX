'use client';

import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Server, Cpu, HardDrive, Clock, Globe, Code } from 'lucide-react';

interface InfoSection {
  title: string;
  icon: React.ReactNode;
  items: { key: string; value: string }[];
}

const infoSections: InfoSection[] = [
  {
    title: 'Runtime Information',
    icon: <Server size={16} />,
    items: [
      { key: 'Node.js Version', value: 'v20.11.0' },
      { key: 'V8 Engine', value: '11.3.244.8' },
      { key: 'Next.js Version', value: '16.0.0' },
      { key: 'React Version', value: '19.0.0' },
      { key: 'TypeScript Version', value: '5.7.3' },
      { key: 'Prisma Version', value: '6.3.0' },
      { key: 'npm Version', value: '10.2.4' },
    ],
  },
  {
    title: 'Operating System',
    icon: <Cpu size={16} />,
    items: [
      { key: 'OS Type', value: 'Darwin' },
      { key: 'Platform', value: 'darwin' },
      { key: 'Architecture', value: 'arm64' },
      { key: 'OS Release', value: '25.2.0' },
      { key: 'Hostname', value: 'moodle-server-01' },
      { key: 'CPU Model', value: 'Apple M2 Pro' },
      { key: 'CPU Cores', value: '12' },
    ],
  },
  {
    title: 'Memory Usage',
    icon: <HardDrive size={16} />,
    items: [
      { key: 'Total Memory', value: '32.00 GB' },
      { key: 'Free Memory', value: '18.45 GB' },
      { key: 'Heap Total', value: '256.00 MB' },
      { key: 'Heap Used', value: '128.34 MB' },
      { key: 'External', value: '12.56 MB' },
      { key: 'Array Buffers', value: '4.23 MB' },
      { key: 'RSS', value: '312.45 MB' },
    ],
  },
  {
    title: 'Process Information',
    icon: <Clock size={16} />,
    items: [
      { key: 'Process ID (PID)', value: '12345' },
      { key: 'Uptime', value: '14 days, 6 hours, 23 minutes' },
      { key: 'Working Directory', value: '/var/www/moodle-lms' },
      { key: 'User', value: 'www-data' },
      { key: 'Group', value: 'www-data' },
      { key: 'Executable Path', value: '/usr/local/bin/node' },
    ],
  },
  {
    title: 'Network',
    icon: <Globe size={16} />,
    items: [
      { key: 'Server Port', value: '3000' },
      { key: 'Protocol', value: 'HTTP/1.1' },
      { key: 'IPv4 Address', value: '192.168.1.100' },
      { key: 'IPv6 Address', value: '::1' },
      { key: 'DNS Servers', value: '8.8.8.8, 8.8.4.4' },
    ],
  },
  {
    title: 'Environment Variables',
    icon: <Code size={16} />,
    items: [
      { key: 'NODE_ENV', value: 'production' },
      { key: 'NEXTAUTH_URL', value: 'http://localhost:3000' },
      { key: 'DATABASE_URL', value: 'postgresql://****:****@localhost:5432/moodle' },
      { key: 'NEXTAUTH_SECRET', value: '********' },
      { key: 'NEXT_TELEMETRY_DISABLED', value: '1' },
      { key: 'TZ', value: 'UTC' },
      { key: 'LANG', value: 'en_US.UTF-8' },
    ],
  },
];

export default function RuntimeInfoPage() {
  return (
    <>
      <PageHeader
        title="Runtime info"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Server', href: '/admin/server' },
          { label: 'Environment' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            This page displays runtime information about the server environment. This is the Next.js equivalent of PHP&apos;s phpinfo() page.
          </p>

          <div className="space-y-4">
            {infoSections.map((section, idx) => (
              <div key={idx} className="border border-[var(--border-color)] rounded-lg bg-white overflow-hidden">
                <div className="flex items-center gap-2 p-3 bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <span className="text-[var(--moodle-primary)]">{section.icon}</span>
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {section.items.map((item, i) => (
                      <tr key={i} className={`${i < section.items.length - 1 ? 'border-b border-[var(--border-color)]' : ''} hover:bg-[var(--bg-hover)]`}>
                        <td className="py-2 px-3 font-medium w-1/3 bg-[var(--bg-light)]">{item.key}</td>
                        <td className="py-2 px-3 font-mono text-xs">
                          {item.value.includes('****') || item.value.includes('********') ? (
                            <span className="text-[var(--text-muted)]">{item.value}</span>
                          ) : (
                            item.value
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50 text-xs text-blue-800">
            Note: Sensitive values such as database credentials and secrets are masked for security. Environment variable values shown are representative for this demo.
          </div>
        </div>
      </div>
    </>
  );
}
