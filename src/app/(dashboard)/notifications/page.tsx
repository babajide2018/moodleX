'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  FileText,
  MessageSquare,
  GraduationCap,
  Calendar,
  Users,
  Award,
  AlertCircle,
} from 'lucide-react';

interface Notification {
  id: string;
  component: string;
  eventType: string;
  icon: React.ReactNode;
  subject: string;
  fullMessage: string;
  contextUrl?: string;
  isRead: boolean;
  createdAt: string;
}

const demoNotifications: Notification[] = [
  {
    id: 'n1', component: 'mod_assign', eventType: 'graded',
    icon: <FileText size={16} className="text-green-600" />,
    subject: 'Your First Program has been graded',
    fullMessage: 'Your submission for "Your First Program" in CS101 has been graded. You received 85/100.',
    contextUrl: '/course/1/mod/assign/m5',
    isRead: false, createdAt: '2026-03-08T15:30:00',
  },
  {
    id: 'n2', component: 'mod_forum', eventType: 'post',
    icon: <MessageSquare size={16} className="text-blue-600" />,
    subject: 'New reply in "Struggling with Hello World"',
    fullMessage: 'Sarah Johnson replied to your discussion post in Week 1 Discussion forum.',
    contextUrl: '/course/1/mod/forum/m6/discuss/d2',
    isRead: false, createdAt: '2026-03-08T14:00:00',
  },
  {
    id: 'n3', component: 'mod_quiz', eventType: 'attempt',
    icon: <GraduationCap size={16} className="text-purple-600" />,
    subject: 'Quiz attempt submitted',
    fullMessage: 'Your attempt on "Variables Practice Quiz" has been submitted. Grade: 87/100.',
    contextUrl: '/course/1/mod/quiz/m9',
    isRead: false, createdAt: '2026-03-08T10:38:00',
  },
  {
    id: 'n4', component: 'core', eventType: 'reminder',
    icon: <Calendar size={16} className="text-orange-500" />,
    subject: 'Assignment due soon: Week 2 Assignment',
    fullMessage: 'The assignment "Week 2 Assignment" in CS101 is due on 15 March 2026. You have not yet submitted.',
    contextUrl: '/course/1/mod/assign/m5',
    isRead: true, createdAt: '2026-03-07T09:00:00',
  },
  {
    id: 'n5', component: 'enrol', eventType: 'enrolled',
    icon: <Users size={16} className="text-teal-600" />,
    subject: 'Course enrolment: Data Structures',
    fullMessage: 'You have been enrolled in "Data Structures and Algorithms" (CS201) as a Student.',
    contextUrl: '/course/2',
    isRead: true, createdAt: '2026-03-06T11:00:00',
  },
  {
    id: 'n6', component: 'badges', eventType: 'awarded',
    icon: <Award size={16} className="text-amber-500" />,
    subject: 'New badge awarded: Active Participant',
    fullMessage: 'Congratulations! You have been awarded the "Active Participant" badge.',
    isRead: true, createdAt: '2026-03-05T16:00:00',
  },
  {
    id: 'n7', component: 'core', eventType: 'system',
    icon: <AlertCircle size={16} className="text-red-500" />,
    subject: 'Scheduled maintenance',
    fullMessage: 'The system will be undergoing scheduled maintenance on March 10, 2026 from 02:00 to 04:00 UTC.',
    isRead: true, createdAt: '2026-03-04T08:00:00',
  },
  {
    id: 'n8', component: 'mod_forum', eventType: 'subscription',
    icon: <MessageSquare size={16} className="text-blue-600" />,
    subject: 'New post in subscribed forum',
    fullMessage: 'Michael Davis posted "What IDE/editor is everyone using?" in Week 1 Discussion.',
    contextUrl: '/course/1/mod/forum/m6/discuss/d3',
    isRead: true, createdAt: '2026-03-03T10:00:00',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((n) => n.id)));
    }
  };

  const markAsRead = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
    );
    setSelectedIds(new Set());
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotifications = (ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelectedIds(new Set());
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Notifications' },
        ]}
        actions={
          <Link href="/notifications/preferences" className="btn btn-secondary text-sm flex items-center gap-1">
            <Settings size={14} /> Preferences
          </Link>
        }
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-3xl">
          {/* Filter bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1.5 text-sm rounded ${
                  filter === 'all'
                    ? 'bg-[var(--moodle-primary)] text-white'
                    : 'bg-[var(--bg-light)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                }`}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </button>
              <button
                className={`px-3 py-1.5 text-sm rounded ${
                  filter === 'unread'
                    ? 'bg-[var(--moodle-primary)] text-white'
                    : 'bg-[var(--bg-light)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                }`}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <button
              className="btn btn-secondary text-sm flex items-center gap-1"
              onClick={markAllAsRead}
            >
              <CheckCheck size={14} /> Mark all as read
            </button>
          </div>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 mb-3 p-2 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg">
              <span className="text-sm text-[var(--text-muted)]">
                {selectedIds.size} selected
              </span>
              <button
                className="btn btn-secondary text-xs flex items-center gap-1"
                onClick={() => markAsRead(Array.from(selectedIds))}
              >
                <Check size={12} /> Mark as read
              </button>
              <button
                className="btn btn-secondary text-xs flex items-center gap-1 text-[var(--moodle-danger)]"
                onClick={() => deleteNotifications(Array.from(selectedIds))}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}

          {/* Notification list */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            {/* Select all header */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-light)] border-b border-[var(--border-color)]">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectedIds.size === filtered.length && filtered.length > 0}
                onChange={toggleSelectAll}
              />
              <span className="text-xs text-[var(--text-muted)]">
                {filtered.length} notifications
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                <BellOff size={32} className="mx-auto mb-2 opacity-50" />
                <p>{filter === 'unread' ? 'No unread notifications' : 'No notifications'}</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {filtered.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-hover)] ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1"
                      checked={selectedIds.has(notification.id)}
                      onChange={() => toggleSelect(notification.id)}
                    />

                    {/* Unread indicator */}
                    <div className="mt-1.5 flex-shrink-0">
                      {!notification.isRead ? (
                        <div className="w-2 h-2 rounded-full bg-[var(--moodle-primary)]" />
                      ) : (
                        <div className="w-2 h-2" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {notification.contextUrl ? (
                        <Link
                          href={notification.contextUrl}
                          className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--text-link)] hover:underline block"
                          onClick={() => markAsRead([notification.id])}
                        >
                          {notification.subject}
                        </Link>
                      ) : (
                        <div className="text-sm font-medium">{notification.subject}</div>
                      )}
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                        {notification.fullMessage}
                      </p>
                      <span className="text-xs text-[var(--text-muted)] mt-1 block">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          className="btn-icon"
                          title="Mark as read"
                          onClick={() => markAsRead([notification.id])}
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
