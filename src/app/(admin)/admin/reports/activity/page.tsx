'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { BarChart3, Download } from 'lucide-react';

interface ActivityEntry {
  id: number;
  activityName: string;
  type: string;
  views: number;
  posts: number;
  lastAccess: string;
}

const courseActivities: Record<string, ActivityEntry[]> = {
  'intro-computing': [
    { id: 1, activityName: 'Welcome Forum', type: 'Forum', views: 245, posts: 38, lastAccess: '9 Mar 2026, 14:10' },
    { id: 2, activityName: 'Course Introduction', type: 'Page', views: 312, posts: 0, lastAccess: '9 Mar 2026, 13:55' },
    { id: 3, activityName: 'Week 1: Basics of Programming', type: 'Label', views: 189, posts: 0, lastAccess: '9 Mar 2026, 12:30' },
    { id: 4, activityName: 'Programming Fundamentals Quiz', type: 'Quiz', views: 156, posts: 0, lastAccess: '8 Mar 2026, 16:45' },
    { id: 5, activityName: 'Essay: My First Program', type: 'Assignment', views: 134, posts: 42, lastAccess: '8 Mar 2026, 15:20' },
    { id: 6, activityName: 'Lecture Notes - Variables', type: 'Resource', views: 278, posts: 0, lastAccess: '9 Mar 2026, 11:05' },
    { id: 7, activityName: 'Discussion: Best Practices', type: 'Forum', views: 198, posts: 67, lastAccess: '9 Mar 2026, 14:22' },
    { id: 8, activityName: 'Lab Exercise 1', type: 'Assignment', views: 145, posts: 39, lastAccess: '7 Mar 2026, 17:00' },
    { id: 9, activityName: 'External Resource: Python Docs', type: 'URL', views: 89, posts: 0, lastAccess: '8 Mar 2026, 10:15' },
    { id: 10, activityName: 'Midterm Exam', type: 'Quiz', views: 201, posts: 0, lastAccess: '5 Mar 2026, 14:00' },
  ],
  'advanced-maths': [
    { id: 11, activityName: 'Calculus Forum', type: 'Forum', views: 178, posts: 29, lastAccess: '9 Mar 2026, 13:40' },
    { id: 12, activityName: 'Integration Techniques', type: 'Page', views: 256, posts: 0, lastAccess: '9 Mar 2026, 12:15' },
    { id: 13, activityName: 'Problem Set 1', type: 'Assignment', views: 198, posts: 45, lastAccess: '8 Mar 2026, 16:30' },
    { id: 14, activityName: 'Maths Quiz 3', type: 'Quiz', views: 167, posts: 0, lastAccess: '9 Mar 2026, 14:22' },
    { id: 15, activityName: 'Video: Differential Equations', type: 'Resource', views: 210, posts: 0, lastAccess: '7 Mar 2026, 11:50' },
  ],
  'english-lit': [
    { id: 16, activityName: 'Book Club Forum', type: 'Forum', views: 312, posts: 85, lastAccess: '9 Mar 2026, 14:05' },
    { id: 17, activityName: 'Reading List', type: 'Page', views: 287, posts: 0, lastAccess: '9 Mar 2026, 10:30' },
    { id: 18, activityName: 'Essay: Shakespeare Analysis', type: 'Assignment', views: 156, posts: 32, lastAccess: '8 Mar 2026, 15:45' },
    { id: 19, activityName: 'Poetry Quiz', type: 'Quiz', views: 134, posts: 0, lastAccess: '6 Mar 2026, 14:20' },
    { id: 20, activityName: 'Lecture Notes Week 4', type: 'Resource', views: 245, posts: 0, lastAccess: '9 Mar 2026, 13:30' },
  ],
};

const courseNames: Record<string, string> = {
  'intro-computing': 'Introduction to Computing',
  'advanced-maths': 'Advanced Mathematics',
  'english-lit': 'English Literature',
};

export default function ActivityReportPage() {
  const [selectedCourse, setSelectedCourse] = useState('intro-computing');

  const activities = courseActivities[selectedCourse] || [];
  const totalViews = activities.reduce((sum, a) => sum + a.views, 0);
  const totalPosts = activities.reduce((sum, a) => sum + a.posts, 0);

  return (
    <>
      <PageHeader
        title="Activity report"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Reports', href: '/admin/reports' },
          { label: 'Activity report' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Course selector */}
          <div
            className="border border-[var(--border-color)] rounded-lg p-4 mb-4"
            style={{ backgroundColor: 'var(--bg-light)' }}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={16} className="text-[var(--text-muted)]" />
              <label className="text-sm font-semibold">Select course:</label>
              <select
                className="form-control text-sm w-auto"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {Object.entries(courseNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
              <button className="btn btn-primary text-sm">Show report</button>
              <button className="btn text-sm flex items-center gap-1 ml-auto">
                <Download size={14} /> Download
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{activities.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Activities</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[var(--text-link)]">{totalViews.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">Total views</div>
            </div>
            <div className="border border-[var(--border-color)] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">{totalPosts.toLocaleString()}</div>
              <div className="text-xs text-[var(--text-muted)]">Total posts</div>
            </div>
          </div>

          {/* Activity table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Activity name</th>
                  <th className="py-2 px-3 text-left font-semibold">Type</th>
                  <th className="py-2 px-3 text-right font-semibold">Views</th>
                  <th className="py-2 px-3 text-right font-semibold">Posts</th>
                  <th className="py-2 px-3 text-left font-semibold">Last access</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
                  >
                    <td className="py-2 px-3">
                      <span className="text-[var(--text-link)] cursor-pointer hover:underline">
                        {activity.activityName}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {activity.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">{activity.views.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">{activity.posts > 0 ? activity.posts.toLocaleString() : '-'}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)]">{activity.lastAccess}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-[var(--bg-light)] border-t-2 border-[var(--border-color)] font-semibold">
                  <td className="py-2 px-3" colSpan={2}>Total</td>
                  <td className="py-2 px-3 text-right">{totalViews.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">{totalPosts.toLocaleString()}</td>
                  <td className="py-2 px-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
