'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  courseName: string;
  date: string;
  time: string;
  type: 'assignment' | 'quiz' | 'forum' | 'event';
}

const typeColors: Record<string, string> = {
  assignment: '#ce5f5f',
  quiz: '#0f6cbf',
  forum: '#57a89a',
  event: '#e8a54b',
};

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Essay Submission',
    courseName: 'Introduction to Psychology',
    date: 'Wednesday, 12 March',
    time: '23:59',
    type: 'assignment',
  },
  {
    id: '2',
    title: 'Module 5 Quiz',
    courseName: 'Data Structures & Algorithms',
    date: 'Friday, 14 March',
    time: '14:00',
    type: 'quiz',
  },
  {
    id: '3',
    title: 'Discussion: Ethics in AI',
    courseName: 'Artificial Intelligence',
    date: 'Monday, 17 March',
    time: '09:00',
    type: 'forum',
  },
  {
    id: '4',
    title: 'Guest Lecture: Cloud Computing',
    courseName: 'Computer Networks',
    date: 'Tuesday, 18 March',
    time: '10:30',
    type: 'event',
  },
];

export default function UpcomingEvents() {
  const [showEmpty, setShowEmpty] = useState(false);

  const events = showEmpty ? [] : mockEvents;

  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)] flex items-center justify-between">
        <h6 className="text-sm font-semibold m-0">Upcoming events</h6>
        <button
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--moodle-primary)]"
          onClick={() => setShowEmpty(!showEmpty)}
          title="Toggle empty state"
        >
          <ChevronDown size={12} />
        </button>
      </div>
      <div className="p-3">
        {events.length === 0 ? (
          <div className="text-center py-4">
            <Calendar size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)] m-0">No upcoming events</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex gap-3">
                <div
                  className="w-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: typeColors[event.type] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-secondary)] m-0 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] m-0 truncate">
                    {event.courseName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={10} className="text-[var(--text-muted)]" />
                    <span className="text-[11px] text-[var(--text-muted)]">{event.date}</span>
                    <Clock size={10} className="text-[var(--text-muted)]" />
                    <span className="text-[11px] text-[var(--text-muted)]">{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-[var(--border-color)] text-center">
          <Link
            href="/calendar"
            className="text-xs text-[var(--moodle-primary)] hover:underline no-underline"
          >
            Go to calendar...
          </Link>
        </div>
      </div>
    </div>
  );
}
