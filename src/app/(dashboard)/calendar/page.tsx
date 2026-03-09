'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  FileText,
  GraduationCap,
  Globe,
  User,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  name: string;
  type: 'site' | 'course' | 'group' | 'user';
  courseName?: string;
  date: string;
  timestart?: string;
  duration?: string;
  description?: string;
}

const eventTypeConfig = {
  site: { label: 'Site', color: 'bg-red-500', icon: <Globe size={12} /> },
  course: { label: 'Course', color: 'bg-[var(--moodle-primary)]', icon: <BookOpen size={12} /> },
  group: { label: 'Group', color: 'bg-amber-500', icon: <GraduationCap size={12} /> },
  user: { label: 'User', color: 'bg-green-500', icon: <User size={12} /> },
};

const demoEvents: CalendarEvent[] = [
  { id: 'e1', name: 'Your First Program due', type: 'course', courseName: 'CS101', date: '2026-03-15', timestart: '23:59', description: 'Assignment submission deadline' },
  { id: 'e2', name: 'Variables Practice Quiz closes', type: 'course', courseName: 'CS101', date: '2026-03-20', timestart: '23:59' },
  { id: 'e3', name: 'Week 2 Assignment due', type: 'course', courseName: 'CS101', date: '2026-03-22', timestart: '23:59' },
  { id: 'e4', name: 'Study group meeting', type: 'group', courseName: 'CS101', date: '2026-03-10', timestart: '15:00', duration: '1 hour' },
  { id: 'e5', name: 'System maintenance', type: 'site', date: '2026-03-12', timestart: '02:00', duration: '2 hours', description: 'Scheduled maintenance window' },
  { id: 'e6', name: 'Office hours', type: 'user', date: '2026-03-11', timestart: '14:00', duration: '1 hour' },
  { id: 'e7', name: 'Data Structures midterm', type: 'course', courseName: 'CS201', date: '2026-03-18', timestart: '09:00', duration: '2 hours' },
  { id: 'e8', name: 'Loops Quiz opens', type: 'course', courseName: 'CS101', date: '2026-03-08', timestart: '00:00' },
];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-03-08');
  const [showFilters, setShowFilters] = useState<Record<string, boolean>>({
    site: true, course: true, group: true, user: true,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date(2026, 2, 1));
    setSelectedDate('2026-03-08');
  };

  const getDateStr = (d: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const getEventsForDate = (dateStr: string) => {
    return demoEvents.filter((e) =>
      e.date === dateStr && showFilters[e.type]
    );
  };

  const selectedEvents = selectedDate
    ? demoEvents.filter((e) => e.date === selectedDate && showFilters[e.type])
    : [];

  // Build calendar grid
  const calendarDays: { day: number; month: 'prev' | 'current' | 'next'; dateStr: string }[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    calendarDays.push({ day: d, month: 'prev', dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, month: 'current', dateStr: getDateStr(d) });
  }

  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month + 2 > 12 ? 1 : month + 2;
    const y = month + 2 > 12 ? year + 1 : year;
    calendarDays.push({ day: d, month: 'next', dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }

  const today = '2026-03-08';

  return (
    <>
      <PageHeader
        title="Calendar"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Calendar' },
        ]}
        actions={
          <button className="btn btn-primary text-sm flex items-center gap-1">
            <Plus size={16} /> New event
          </button>
        }
      />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar grid */}
            <div className="flex-1">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button className="btn btn-secondary p-2" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </button>
                <div className="text-center">
                  <h2 className="text-lg font-bold">
                    {monthNames[month]} {year}
                  </h2>
                  <button className="text-xs text-[var(--text-link)] hover:underline" onClick={goToToday}>
                    Go to today
                  </button>
                </div>
                <button className="btn btn-secondary p-2" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Calendar */}
              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                {/* Day headers */}
                <div className="grid grid-cols-7 bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center py-2 text-xs font-semibold text-[var(--text-muted)]">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((cell, i) => {
                    const events = getEventsForDate(cell.dateStr);
                    const isToday = cell.dateStr === today;
                    const isSelected = cell.dateStr === selectedDate;
                    const isCurrentMonth = cell.month === 'current';

                    return (
                      <button
                        key={i}
                        className={`min-h-[80px] p-1 border-b border-r border-[var(--border-color)] text-left transition-colors ${
                          isSelected ? 'bg-blue-50' :
                          isCurrentMonth ? 'bg-white hover:bg-[var(--bg-hover)]' :
                          'bg-gray-50'
                        }`}
                        onClick={() => setSelectedDate(cell.dateStr)}
                      >
                        <div className={`text-xs font-medium mb-1 ${
                          isToday
                            ? 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--moodle-primary)] text-white'
                            : isCurrentMonth ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                        }`}>
                          {cell.day}
                        </div>
                        <div className="space-y-0.5">
                          {events.slice(0, 2).map((evt) => (
                            <div
                              key={evt.id}
                              className={`text-xs px-1 py-0.5 rounded truncate text-white ${eventTypeConfig[evt.type].color}`}
                            >
                              {evt.name}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-[var(--text-muted)] px-1">
                              +{events.length - 2} more
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72 space-y-4">
              {/* Event type filters */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">Event types</h3>
                </div>
                <div className="p-3 space-y-2">
                  {(Object.keys(eventTypeConfig) as Array<keyof typeof eventTypeConfig>).map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={showFilters[type]}
                        onChange={(e) => setShowFilters((prev) => ({ ...prev, [type]: e.target.checked }))}
                      />
                      <span className={`w-3 h-3 rounded-sm ${eventTypeConfig[type].color}`} />
                      {eventTypeConfig[type].label} events
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected date events */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">
                    {selectedDate
                      ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                          weekday: 'long', day: 'numeric', month: 'long',
                        })
                      : 'Select a date'}
                  </h3>
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                  {selectedEvents.length === 0 ? (
                    <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                      No events for this day
                    </div>
                  ) : (
                    selectedEvents.map((evt) => (
                      <div key={evt.id} className="p-3">
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 w-3 h-3 rounded-sm flex-shrink-0 ${eventTypeConfig[evt.type].color}`} />
                          <div>
                            <div className="text-sm font-medium">{evt.name}</div>
                            {evt.courseName && (
                              <div className="text-xs text-[var(--text-muted)]">{evt.courseName}</div>
                            )}
                            {evt.timestart && (
                              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                                <Clock size={10} />
                                {evt.timestart}
                                {evt.duration && ` (${evt.duration})`}
                              </div>
                            )}
                            {evt.description && (
                              <p className="text-xs text-[var(--text-muted)] mt-1">{evt.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upcoming events */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">Upcoming events</h3>
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                  {demoEvents
                    .filter((e) => e.date >= today && showFilters[e.type])
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .slice(0, 5)
                    .map((evt) => (
                      <div key={evt.id} className="px-3 py-2 hover:bg-[var(--bg-hover)]">
                        <div className="text-xs font-medium">{evt.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {new Date(evt.date + 'T00:00:00').toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short',
                          })}
                          {evt.timestart && `, ${evt.timestart}`}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
