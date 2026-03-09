'use client';

import { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

type TimelineView = 'dates' | 'courses';
type TimelineFilter = 'all' | 'overdue' | 'next7days' | 'next30days' | 'next3months' | 'next6months';

const filterLabels: Record<TimelineFilter, string> = {
  all: 'All',
  overdue: 'Overdue',
  next7days: 'Next 7 days',
  next30days: 'Next 30 days',
  next3months: 'Next 3 months',
  next6months: 'Next 6 months',
};

export default function Timeline() {
  const [view, setView] = useState<TimelineView>('dates');
  const [filter, setFilter] = useState<TimelineFilter>('next7days');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h5 className="text-base font-semibold m-0">Timeline</h5>

        <div className="flex items-center gap-2">
          {/* Sort by dates / courses toggle */}
          <div className="flex border border-[var(--border-color)] rounded overflow-hidden">
            <button
              className={`px-3 py-1 text-xs ${
                view === 'dates'
                  ? 'bg-[var(--moodle-primary)] text-white'
                  : 'bg-white text-[var(--text-secondary)]'
              }`}
              onClick={() => setView('dates')}
            >
              Sort by dates
            </button>
            <button
              className={`px-3 py-1 text-xs border-l border-[var(--border-color)] ${
                view === 'courses'
                  ? 'bg-[var(--moodle-primary)] text-white'
                  : 'bg-white text-[var(--text-secondary)]'
              }`}
              onClick={() => setView('courses')}
            >
              Sort by courses
            </button>
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              className="btn btn-outline-secondary text-xs flex items-center gap-1"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              {filterLabels[filter]}
              <ChevronDown size={12} />
            </button>
            {showFilterDropdown && (
              <div className="dropdown-menu mt-1" style={{ display: 'block', minWidth: '160px' }}>
                {Object.entries(filterLabels).map(([key, label]) => (
                  <button
                    key={key}
                    className="dropdown-item text-sm"
                    onClick={() => {
                      setFilter(key as TimelineFilter);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border border-[var(--border-color)] rounded p-6 text-center">
        <Clock size={40} className="mx-auto mb-3 text-[var(--text-muted)]" />
        <p className="text-sm text-[var(--text-muted)] m-0">
          No upcoming activities due
        </p>
      </div>
    </div>
  );
}
