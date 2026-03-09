'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { X, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDrawerStore } from '@/store/drawer';
import { useSession } from 'next-auth/react';

export default function RightDrawer() {
  const { rightOpen, setRightOpen } = useDrawerStore();
  const { data: session } = useSession();

  const displayName = session?.user
    ? `${session.user.firstname || session.user.name?.split(' ')[0] || 'User'} ${session.user.lastname || session.user.name?.split(' ').slice(1).join(' ') || ''}`
    : 'Admin User';

  return (
    <aside className={`drawer drawer-right ${rightOpen ? '' : 'closed'}`}>
      <div className="drawer-header">
        <span>Blocks</span>
        <button
          className="drawer-toggler"
          onClick={() => setRightOpen(false)}
          aria-label="Close block drawer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="drawer-content">
        {/* Timeline Block */}
        <div className="block">
          <div className="block-header">
            <span>Timeline</span>
          </div>
          <div className="block-content">
            <div className="text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2 py-2 border-b border-[var(--border-color)]">
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 rounded bg-[var(--moodle-primary)] text-white">
                    Sort by dates
                  </button>
                  <button className="text-xs px-2 py-1 rounded bg-[var(--bg-light)] text-[var(--text-secondary)]">
                    Sort by courses
                  </button>
                </div>
              </div>
              <div className="py-4 text-center">
                <Clock size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
                <p className="text-sm m-0">No upcoming activities due</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Block */}
        <div className="block">
          <div className="block-header">
            <span>Calendar</span>
          </div>
          <div className="block-content">
            <CalendarBlock />
          </div>
        </div>

        {/* Upcoming Events Block */}
        <div className="block">
          <div className="block-header">
            <span>Upcoming events</span>
          </div>
          <div className="block-content">
            <div className="text-sm text-[var(--text-muted)] py-2">
              <p className="m-0">There are no upcoming events</p>
              <Link href="/calendar" className="text-[var(--moodle-primary)] text-sm mt-1 inline-block">
                Go to calendar...
              </Link>
            </div>
          </div>
        </div>

        {/* Online Users Block */}
        <div className="block">
          <div className="block-header">
            <span>Online users</span>
          </div>
          <div className="block-content">
            <div className="text-sm py-2">
              <div className="flex items-center gap-2 py-1">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <span>{displayName}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2 m-0">
                1 online user (last 5 minutes)
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function CalendarBlock() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = useMemo(() => new Date(), []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between py-1 mb-1">
        <button className="btn-icon" onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft size={14} />
        </button>
        <Link href="/calendar" className="font-medium text-sm text-[var(--text-primary)] hover:text-[var(--moodle-primary)]">
          {monthName} {year}
        </Link>
        <button className="btn-icon" onClick={nextMonth} aria-label="Next month">
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0 text-center text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-1 font-medium text-[var(--text-muted)]">
            {day}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`py-1 text-xs rounded hover:bg-[var(--bg-hover)] ${
              day && isToday(day)
                ? 'bg-[var(--moodle-primary)] text-white rounded-full font-bold'
                : ''
            } ${day ? 'cursor-pointer' : 'invisible'}`}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
}
