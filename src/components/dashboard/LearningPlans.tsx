'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';

interface LearningPlan {
  id: string;
  name: string;
  status: 'active' | 'complete' | 'draft';
  progress: number;
  dueDate: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: '#0f6cbf' },
  complete: { label: 'Complete', color: '#57a89a' },
  draft: { label: 'Draft', color: '#e8a54b' },
};

const mockPlans: LearningPlan[] = [
  {
    id: '1',
    name: 'Web Development Fundamentals',
    status: 'active',
    progress: 65,
    dueDate: '30 June 2026',
  },
  {
    id: '2',
    name: 'Data Science Pathway',
    status: 'active',
    progress: 30,
    dueDate: '15 September 2026',
  },
];

export default function LearningPlans() {
  const [showEmpty, setShowEmpty] = useState(false);

  const plans = showEmpty ? [] : mockPlans;

  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)] flex items-center justify-between">
        <h6 className="text-sm font-semibold m-0">Learning plans</h6>
        <button
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--moodle-primary)]"
          onClick={() => setShowEmpty(!showEmpty)}
          title="Toggle empty state"
        >
          <ChevronDown size={12} />
        </button>
      </div>
      <div className="p-3">
        {plans.length === 0 ? (
          <div className="text-center py-4">
            <BookOpen size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)] m-0">
              No active learning plans
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const statusInfo = statusLabels[plan.status];
              return (
                <div key={plan.id} className="p-2 rounded border border-[var(--border-color)]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[var(--text-secondary)] m-0 truncate">
                      {plan.name}
                    </p>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                      style={{
                        backgroundColor: statusInfo.color + '1a',
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-2 m-0">
                    Due: {plan.dueDate}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${plan.progress}%`,
                          backgroundColor: statusInfo.color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] flex-shrink-0">
                      {plan.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
