'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface CalendarEvent {
  day: number;
  title: string;
  color: string;
}

const mockEvents: CalendarEvent[] = [
  { day: 12, title: 'Assignment due', color: '#ce5f5f' },
  { day: 18, title: 'Quiz opens', color: '#0f6cbf' },
  { day: 24, title: 'Forum deadline', color: '#57a89a' },
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarBlock() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const eventDays = new Map<number, CalendarEvent>();
  if (isCurrentMonth) {
    mockEvents.forEach((e) => eventDays.set(e.day, e));
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
        <h6 className="text-sm font-semibold m-0">Calendar</h6>
      </div>
      <div className="p-3">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            className="p-1 rounded hover:bg-[var(--bg-light)] text-[var(--text-secondary)]"
            onClick={prevMonth}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {MONTHS[month]} {year}
          </span>
          <button
            className="p-1 rounded hover:bg-[var(--bg-light)] text-[var(--text-secondary)]"
            onClick={nextMonth}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-[var(--text-muted)] py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-0">
          {cells.map((day, i) => {
            const isToday = isCurrentMonth && day === today.getDate();
            const event = day ? eventDays.get(day) : undefined;
            return (
              <div
                key={i}
                className={`text-center py-1 text-xs relative cursor-default ${
                  isToday
                    ? 'bg-[var(--moodle-primary)] text-white rounded-full font-bold'
                    : day
                    ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-light)] rounded'
                    : ''
                }`}
                title={event ? event.title : undefined}
              >
                {day || ''}
                {event && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Events list */}
        {isCurrentMonth && mockEvents.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Events this month</p>
            {mockEvents.map((event, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  {event.day} {MONTHS[month].slice(0, 3)} - {event.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
