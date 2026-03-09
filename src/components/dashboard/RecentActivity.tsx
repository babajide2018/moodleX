'use client';

import { Activity, MessageSquare, FileCheck, BookOpen, Users } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'forum' | 'assignment' | 'course' | 'enrolment';
  description: string;
  timestamp: string;
}

const typeIcons: Record<string, typeof Activity> = {
  forum: MessageSquare,
  assignment: FileCheck,
  course: BookOpen,
  enrolment: Users,
};

const typeColors: Record<string, string> = {
  forum: '#57a89a',
  assignment: '#ce5f5f',
  course: '#0f6cbf',
  enrolment: '#7b62a8',
};

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'forum',
    description: 'New forum post in "Introduction to Psychology"',
    timestamp: '10 minutes ago',
  },
  {
    id: '2',
    type: 'assignment',
    description: 'Assignment graded in "Data Structures & Algorithms"',
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    type: 'course',
    description: 'New resource added to "Artificial Intelligence"',
    timestamp: '3 hours ago',
  },
  {
    id: '4',
    type: 'enrolment',
    description: '5 new students enrolled in "Computer Networks"',
    timestamp: 'Yesterday',
  },
];

export default function RecentActivity() {
  return (
    <div className="border border-[var(--border-color)] rounded mb-4">
      <div className="px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-light)]">
        <h6 className="text-sm font-semibold m-0">Recent activity</h6>
      </div>
      <div className="p-3">
        <div className="space-y-3">
          {mockActivities.map((item) => {
            const Icon = typeIcons[item.type] || Activity;
            return (
              <div key={item.id} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: typeColors[item.type] + '1a' }}
                >
                  <Icon size={14} style={{ color: typeColors[item.type] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-secondary)] m-0 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] m-0 mt-0.5">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
