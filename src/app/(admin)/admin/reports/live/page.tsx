'use client';

import { useState, useEffect, useRef } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { Play, Pause, RefreshCw, Circle } from 'lucide-react';

interface LiveLogEntry {
  id: number;
  username: string;
  time: string;
  action: string;
  ipAddress: string;
  isNew?: boolean;
}

const initialLogs: LiveLogEntry[] = [
  { id: 1, username: 'admin', time: '14:23:45', action: 'User logged in', ipAddress: '192.168.1.10' },
  { id: 2, username: 'jdoe', time: '14:23:30', action: 'Course viewed: Introduction to Computing', ipAddress: '10.0.0.45' },
  { id: 3, username: 'jsmith', time: '14:23:12', action: 'Assignment submitted: Essay 1', ipAddress: '172.16.0.22' },
  { id: 4, username: 'ebrown', time: '14:22:55', action: 'Quiz attempt started: Maths Quiz 3', ipAddress: '10.0.0.91' },
  { id: 5, username: 'mjohnson', time: '14:22:40', action: 'Forum post created: Help with Q5', ipAddress: '172.16.0.55' },
  { id: 6, username: 'swilson', time: '14:22:18', action: 'Resource viewed: Lecture Notes Week 4', ipAddress: '10.0.0.33' },
  { id: 7, username: 'admin', time: '14:21:50', action: 'User profile updated: Sarah Wilson', ipAddress: '192.168.1.10' },
  { id: 8, username: 'jdoe', time: '14:21:30', action: 'Discussion created: Project ideas', ipAddress: '10.0.0.45' },
  { id: 9, username: 'tlee', time: '14:21:05', action: 'Course enrolled: Advanced Mathematics', ipAddress: '172.16.0.80' },
  { id: 10, username: 'kpatel', time: '14:20:42', action: 'Quiz attempt submitted: Science Quiz 2', ipAddress: '10.0.0.67' },
];

const incomingActions = [
  { username: 'admin', action: 'Settings page viewed', ipAddress: '192.168.1.10' },
  { username: 'jdoe', action: 'File uploaded: report.pdf', ipAddress: '10.0.0.45' },
  { username: 'ebrown', action: 'Grade viewed: Maths Quiz 3', ipAddress: '10.0.0.91' },
  { username: 'newuser1', action: 'User logged in', ipAddress: '172.16.0.101' },
  { username: 'mjohnson', action: 'Message sent to jsmith', ipAddress: '172.16.0.55' },
  { username: 'swilson', action: 'Assignment viewed: Lab Report 2', ipAddress: '10.0.0.33' },
  { username: 'tlee', action: 'Forum post created: Need study group', ipAddress: '172.16.0.80' },
  { username: 'kpatel', action: 'Course viewed: Biology 101', ipAddress: '10.0.0.67' },
];

function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LiveLogsPage() {
  const [logs, setLogs] = useState<LiveLogEntry[]>(initialLogs);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(getCurrentTime());
  const nextIdRef = useRef(11);
  const actionIndexRef = useRef(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const action = incomingActions[actionIndexRef.current % incomingActions.length];
      actionIndexRef.current++;

      const newEntry: LiveLogEntry = {
        id: nextIdRef.current++,
        username: action.username,
        time: getCurrentTime(),
        action: action.action,
        ipAddress: action.ipAddress,
        isNew: true,
      };

      setLogs((prev) => {
        const updated = prev.map((l) => ({ ...l, isNew: false }));
        return [newEntry, ...updated].slice(0, 50);
      });
      setLastUpdated(getCurrentTime());
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleRefresh = () => {
    setLastUpdated(getCurrentTime());
  };

  return (
    <>
      <PageHeader
        title="Live logs"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Live logs' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="btn btn-primary text-sm flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <Play size={14} /> Resume
                  </>
                ) : (
                  <>
                    <Pause size={14} /> Pause
                  </>
                )}
              </button>
              <button
                onClick={handleRefresh}
                className="btn text-sm flex items-center gap-2"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Circle
                size={8}
                className={isPaused ? 'fill-amber-500 text-amber-500' : 'fill-green-500 text-green-500'}
              />
              {isPaused ? 'Paused' : 'Live'} &middot; Last updated: {lastUpdated}
            </div>
          </div>

          {/* Info box */}
          <div
            className="border border-[var(--border-color)] rounded-lg p-3 mb-4 text-sm"
            style={{ backgroundColor: 'var(--bg-light)' }}
          >
            Live logs update automatically every 3 seconds. Click <strong>Pause</strong> to freeze the display.
          </div>

          {/* Live log entries */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold w-24">Time</th>
                  <th className="py-2 px-3 text-left font-semibold w-32">User</th>
                  <th className="py-2 px-3 text-left font-semibold">Action</th>
                  <th className="py-2 px-3 text-left font-semibold w-36">IP address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className={`border-b border-[var(--border-color)] transition-colors duration-500 ${
                      log.isNew ? 'bg-blue-50' : 'hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <td className="py-2 px-3 text-[var(--text-muted)] font-mono text-xs">{log.time}</td>
                    <td className="py-2 px-3">
                      <span className="text-[var(--text-link)] cursor-pointer hover:underline">{log.username}</span>
                    </td>
                    <td className="py-2 px-3">{log.action}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)] font-mono text-xs">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-[var(--text-muted)] mt-2">
            Showing {logs.length} entries (maximum 50)
          </div>
        </div>
      </div>
    </>
  );
}
