'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  Bell,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  ServerCog,
} from 'lucide-react';

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  dismissed: boolean;
}

const severityStyles: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: <Info size={16} className="text-blue-500" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: <AlertTriangle size={16} className="text-amber-500" />,
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: <ShieldAlert size={16} className="text-red-500" />,
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: <CheckCircle2 size={16} className="text-green-500" />,
  },
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    icon: <RefreshCw size={20} className="text-[var(--moodle-primary)]" />,
    title: 'Update available: Moodle 4.4.1',
    description:
      'A new version of Moodle is available. It is recommended that you update your site to the latest version to benefit from bug fixes and security patches.',
    severity: 'warning',
    timestamp: '2 hours ago',
    dismissed: false,
  },
  {
    id: '2',
    icon: <ShieldAlert size={20} className="text-red-500" />,
    title: 'Security alert: Critical vulnerability patched',
    description:
      'A critical security vulnerability (CVE-2024-XXXX) has been patched in the latest release. Please update immediately to protect your site and user data.',
    severity: 'danger',
    timestamp: '1 day ago',
    dismissed: false,
  },
  {
    id: '3',
    icon: <Bell size={20} className="text-amber-500" />,
    title: 'Site not registered',
    description:
      'Your Moodle site is not registered with Moodle.net. Registering allows you to receive important security notifications and contributes to usage statistics.',
    severity: 'info',
    timestamp: '3 days ago',
    dismissed: false,
  },
  {
    id: '4',
    icon: <ServerCog size={20} className="text-green-600" />,
    title: 'Cron is running properly',
    description:
      'The scheduled task system (cron) is running on schedule. Last run: 5 minutes ago. All scheduled tasks are operating normally.',
    severity: 'success',
    timestamp: '5 minutes ago',
    dismissed: false,
  },
  {
    id: '5',
    icon: <AlertTriangle size={20} className="text-amber-500" />,
    title: 'PHP version notice',
    description:
      'Your server is running Node.js v20. Ensure you keep your server software up to date for the best performance and security.',
    severity: 'info',
    timestamp: '1 week ago',
    dismissed: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n)));
  };

  const dismissAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, dismissed: true })));
  };

  const restoreAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, dismissed: false })));
  };

  const active = notifications.filter((n) => !n.dismissed);
  const dismissed = notifications.filter((n) => n.dismissed);

  return (
    <>
      <PageHeader
        title="Notifications"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'General', href: '/admin' },
          { label: 'Site administration' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Version info card */}
          <div className="border border-[var(--border-color)] rounded-lg p-4 mb-6 bg-[var(--bg-light)]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center flex-shrink-0">
                <ServerCog size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1">Moodle LMS (Next.js)</h3>
                <p className="text-xs text-[var(--text-muted)] mb-2">
                  Version 4.4.0 (Build: 20240401) | Next.js Runtime
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 size={12} /> Up to date
                  </span>
                  <a
                    href="#"
                    className="text-[var(--text-link)] hover:underline flex items-center gap-1"
                  >
                    Check for updates <ExternalLink size={10} />
                  </a>
                  <a
                    href="#"
                    className="text-[var(--text-link)] hover:underline flex items-center gap-1"
                  >
                    Release notes <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">
              Admin notifications ({active.length})
            </h2>
            <div className="flex items-center gap-2">
              {active.length > 0 && (
                <button
                  className="btn btn-secondary text-sm flex items-center gap-1"
                  onClick={dismissAll}
                >
                  <X size={14} /> Dismiss all
                </button>
              )}
              {dismissed.length > 0 && (
                <button
                  className="btn btn-secondary text-sm"
                  onClick={restoreAll}
                >
                  Restore dismissed
                </button>
              )}
            </div>
          </div>

          {/* Active notifications */}
          {active.length === 0 ? (
            <div className="border border-[var(--border-color)] rounded-lg p-8 text-center bg-white mb-6">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
              <p className="text-sm text-[var(--text-muted)]">
                No active notifications. Your site is running smoothly.
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {active.map((notification) => {
                const style = severityStyles[notification.severity];
                return (
                  <div
                    key={notification.id}
                    className={`border ${style.border} ${style.bg} rounded-lg p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                              {notification.title}
                              <span
                                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}
                              >
                                {style.icon}
                                {notification.severity.charAt(0).toUpperCase() + notification.severity.slice(1)}
                              </span>
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              {notification.timestamp}
                            </p>
                          </div>
                          <button
                            className="btn-icon flex-shrink-0"
                            onClick={() => dismiss(notification.id)}
                            title="Dismiss notification"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-sm mt-2 text-gray-700">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Dismissed notifications */}
          {dismissed.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
                Dismissed ({dismissed.length})
              </h3>
              <div className="space-y-2">
                {dismissed.map((notification) => (
                  <div
                    key={notification.id}
                    className="border border-[var(--border-color)] rounded-lg p-3 bg-white opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{notification.timestamp}</p>
                      </div>
                      <button
                        className="text-xs text-[var(--text-link)] hover:underline"
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((n) => (n.id === notification.id ? { ...n, dismissed: false } : n))
                          )
                        }
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
