'use client';

import { useState } from 'react';
import { Award, ChevronDown } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  courseName: string;
  dateEarned: string;
  color: string;
}

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Course Completion',
    courseName: 'Introduction to Psychology',
    dateEarned: '5 March 2026',
    color: '#e8a54b',
  },
  {
    id: '2',
    name: 'Perfect Score',
    courseName: 'Data Structures & Algorithms',
    dateEarned: '28 February 2026',
    color: '#0f6cbf',
  },
  {
    id: '3',
    name: 'Active Participant',
    courseName: 'Artificial Intelligence',
    dateEarned: '20 February 2026',
    color: '#57a89a',
  },
];

export default function LatestBadges() {
  const [showEmpty, setShowEmpty] = useState(false);

  const badges = showEmpty ? [] : mockBadges;

  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)] flex items-center justify-between">
        <h6 className="text-sm font-semibold m-0">Latest badges</h6>
        <button
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--moodle-primary)]"
          onClick={() => setShowEmpty(!showEmpty)}
          title="Toggle empty state"
        >
          <ChevronDown size={12} />
        </button>
      </div>
      <div className="p-3">
        {badges.length === 0 ? (
          <div className="text-center py-4">
            <Award size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)] m-0">
              You have no badges to display
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3">
                {/* Badge icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: badge.color }}
                >
                  <Award size={20} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-secondary)] m-0 truncate">
                    {badge.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] m-0 truncate">
                    {badge.courseName}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] m-0">
                    Earned: {badge.dateEarned}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
