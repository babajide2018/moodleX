'use client';

import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { CheckCircle2, AlertTriangle, XCircle, Shield, RefreshCw } from 'lucide-react';

type CheckStatus = 'ok' | 'warning' | 'critical';

interface SecurityCheck {
  id: number;
  name: string;
  description: string;
  status: CheckStatus;
  detail: string;
}

const securityChecks: SecurityCheck[] = [
  {
    id: 1,
    name: 'Admin has strong password',
    description: 'The site administrator account should have a strong password that meets the password policy.',
    status: 'ok',
    detail: 'The admin account password meets all complexity requirements.',
  },
  {
    id: 2,
    name: 'Default user role',
    description: 'The default role for all registered users should have minimal permissions.',
    status: 'ok',
    detail: 'Default role is set to "Authenticated user" with appropriate minimal permissions.',
  },
  {
    id: 3,
    name: 'Guest role permissions',
    description: 'Guest users should not be able to post content or access sensitive areas.',
    status: 'ok',
    detail: 'Guest role has read-only access. No write permissions are assigned.',
  },
  {
    id: 4,
    name: 'Backup configuration',
    description: 'Automated backups should be enabled and configured to run regularly.',
    status: 'warning',
    detail: 'Automated backups are enabled but have not run successfully in the last 7 days. Last successful backup: 2 Mar 2026.',
  },
  {
    id: 5,
    name: 'Error display',
    description: 'PHP/application errors should not be displayed to users in production.',
    status: 'ok',
    detail: 'Debug messages are set to "NONE" for production. Errors are logged to file only.',
  },
  {
    id: 6,
    name: 'Cron security',
    description: 'The cron script should only be executable from the command line or with a secure token.',
    status: 'critical',
    detail: 'Cron is accessible via web without a password. Set "cronclionly" to true or configure a cron password.',
  },
  {
    id: 7,
    name: 'XSS trusted users',
    description: 'Only trusted administrators should have the ability to use unfiltered HTML.',
    status: 'warning',
    detail: '3 users have the "unfiltered HTML" capability. Review these users: Admin User, Teacher1, CourseCreator1.',
  },
  {
    id: 8,
    name: 'Password policy',
    description: 'A strong password policy should be enforced for all users.',
    status: 'ok',
    detail: 'Password policy is enabled: minimum 8 characters, requires uppercase, lowercase, digits, and special characters.',
  },
  {
    id: 9,
    name: 'HTTPS configuration',
    description: 'The site should be served over HTTPS to encrypt all traffic.',
    status: 'ok',
    detail: 'Site URL uses HTTPS. HTTP to HTTPS redirect is configured.',
  },
  {
    id: 10,
    name: 'Open user profiles',
    description: 'User profiles should require login to view to protect privacy.',
    status: 'ok',
    detail: 'Force login for profiles is enabled. Anonymous users cannot view profiles.',
  },
  {
    id: 11,
    name: 'Session handling',
    description: 'Session timeout and security settings should be properly configured.',
    status: 'ok',
    detail: 'Session timeout set to 7200 seconds (2 hours). Cookie secure flag is enabled.',
  },
  {
    id: 12,
    name: 'Email change confirmation',
    description: 'Users should be required to confirm email address changes.',
    status: 'warning',
    detail: 'Email change confirmation is disabled. Users can change their email without verification.',
  },
  {
    id: 13,
    name: 'Public registration',
    description: 'Self-registration should be disabled or use email confirmation.',
    status: 'ok',
    detail: 'Self-registration uses email-based confirmation. CAPTCHA is enabled.',
  },
  {
    id: 14,
    name: 'Data directory access',
    description: 'The data directory should not be accessible via the web.',
    status: 'ok',
    detail: 'Data directory is outside the web root and not directly accessible.',
  },
  {
    id: 15,
    name: 'Vendor directory',
    description: 'The vendor/node_modules directory should not be accessible via the web.',
    status: 'ok',
    detail: 'Vendor directories are not publicly accessible.',
  },
];

const statusIcons: Record<CheckStatus, React.ReactNode> = {
  ok: <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />,
  warning: <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />,
  critical: <XCircle size={20} className="text-red-600 flex-shrink-0" />,
};

const statusLabels: Record<CheckStatus, string> = {
  ok: 'OK',
  warning: 'Warning',
  critical: 'Critical',
};

const statusColors: Record<CheckStatus, string> = {
  ok: 'bg-green-50 border-green-200',
  warning: 'bg-amber-50 border-amber-200',
  critical: 'bg-red-50 border-red-200',
};

export default function SecurityOverviewPage() {
  const okCount = securityChecks.filter((c) => c.status === 'ok').length;
  const warningCount = securityChecks.filter((c) => c.status === 'warning').length;
  const criticalCount = securityChecks.filter((c) => c.status === 'critical').length;

  return (
    <>
      <PageHeader
        title="Security overview"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Security' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Shield size={24} className="text-[var(--text-muted)]" />
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <strong>{okCount}</strong> OK
                </span>
                <span className="flex items-center gap-1">
                  <AlertTriangle size={16} className="text-amber-500" />
                  <strong>{warningCount}</strong> Warning{warningCount !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <XCircle size={16} className="text-red-600" />
                  <strong>{criticalCount}</strong> Critical
                </span>
              </div>
            </div>
            <button className="btn text-sm flex items-center gap-2">
              <RefreshCw size={14} /> Re-check
            </button>
          </div>

          {/* Security checks list */}
          <div className="space-y-3">
            {securityChecks.map((check) => (
              <div
                key={check.id}
                className={`border rounded-lg p-4 ${statusColors[check.status]}`}
              >
                <div className="flex items-start gap-3">
                  {statusIcons[check.status]}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{check.name}</span>
                      <span
                        className={`inline-flex items-center text-xs px-2 py-0.5 rounded ${
                          check.status === 'ok'
                            ? 'bg-green-100 text-green-700'
                            : check.status === 'warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {statusLabels[check.status]}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">{check.description}</p>
                    <p className="text-sm">{check.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
