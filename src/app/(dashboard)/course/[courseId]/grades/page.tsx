'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';

interface GradeRow {
  id: string;
  itemName: string;
  itemType: string;
  weight?: number;
  grade?: number;
  range: string;
  percentage?: number;
  feedback?: string;
  contributionToCourse?: number;
}

const demoGrades: GradeRow[] = [
  {
    id: 'g0',
    itemName: 'Introduction to Computer Science',
    itemType: 'course',
    range: '0–100',
    grade: 72.5,
    percentage: 72.5,
  },
  {
    id: 'g1',
    itemName: 'Your First Program',
    itemType: 'assign',
    weight: 20,
    grade: 85,
    range: '0–100',
    percentage: 85,
    feedback: 'Good work!',
    contributionToCourse: 17,
  },
  {
    id: 'g2',
    itemName: 'Variables Practice Quiz',
    itemType: 'quiz',
    weight: 15,
    grade: 87,
    range: '0–100',
    percentage: 87,
    contributionToCourse: 13.05,
  },
  {
    id: 'g3',
    itemName: 'Week 2 Assignment',
    itemType: 'assign',
    weight: 20,
    grade: undefined,
    range: '0–100',
    percentage: undefined,
    contributionToCourse: undefined,
  },
  {
    id: 'g4',
    itemName: 'Loops Quiz',
    itemType: 'quiz',
    weight: 15,
    grade: undefined,
    range: '0–100',
    percentage: undefined,
    contributionToCourse: undefined,
  },
  {
    id: 'g5',
    itemName: 'If Statements Exercise',
    itemType: 'assign',
    weight: 15,
    grade: undefined,
    range: '0–100',
    percentage: undefined,
    contributionToCourse: undefined,
  },
  {
    id: 'g6',
    itemName: 'Functions Assignment',
    itemType: 'assign',
    weight: 15,
    grade: undefined,
    range: '0–100',
    percentage: undefined,
    contributionToCourse: undefined,
  },
];

export default function CourseGradesPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
  ];

  const gradeTabs = [
    { key: 'user', label: 'User report', href: `/course/${courseId}/grades` },
    { key: 'overview', label: 'Overview report', href: `/course/${courseId}/grades?tab=overview` },
  ];

  const courseTotal = demoGrades.find((g) => g.itemType === 'course');
  const gradeItems = demoGrades.filter((g) => g.itemType !== 'course');

  return (
    <>
      <PageHeader
        title="User report"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Grades' },
        ]}
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* User info row */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center font-medium">
              AU
            </div>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-[var(--text-muted)]">admin@example.com</div>
            </div>
          </div>

          {/* Grade report tabs */}
          <div className="mb-4">
            <div className="flex gap-0 border-b border-[var(--border-color)]">
              {gradeTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 text-sm border-b-2 ${
                    tab.key === 'user'
                      ? 'border-[var(--moodle-primary)] text-[var(--moodle-primary)] font-medium'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grades table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b-2 border-[var(--border-color)]">
                  <th className="py-2 px-4 text-left font-semibold">Grade item</th>
                  <th className="py-2 px-4 text-center font-semibold w-20">Weight</th>
                  <th className="py-2 px-4 text-center font-semibold w-24">Grade</th>
                  <th className="py-2 px-4 text-center font-semibold w-20">Range</th>
                  <th className="py-2 px-4 text-center font-semibold w-24">Percentage</th>
                  <th className="py-2 px-4 text-left font-semibold hidden lg:table-cell">Feedback</th>
                  <th className="py-2 px-4 text-center font-semibold w-28 hidden md:table-cell">Contribution to course total</th>
                </tr>
              </thead>
              <tbody>
                {/* Course total row (highlighted) */}
                {courseTotal && (
                  <tr className="bg-blue-50 border-b border-[var(--border-color)] font-medium">
                    <td className="py-2 px-4">
                      <span className="font-semibold">{courseTotal.itemName}</span>
                    </td>
                    <td className="py-2 px-4 text-center">-</td>
                    <td className="py-2 px-4 text-center">
                      {courseTotal.grade !== undefined ? (
                        <span className="text-[var(--moodle-primary)] font-bold">
                          {courseTotal.grade.toFixed(2)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-2 px-4 text-center">{courseTotal.range}</td>
                    <td className="py-2 px-4 text-center">
                      {courseTotal.percentage !== undefined ? `${courseTotal.percentage.toFixed(2)} %` : '-'}
                    </td>
                    <td className="py-2 px-4 hidden lg:table-cell">-</td>
                    <td className="py-2 px-4 text-center hidden md:table-cell">-</td>
                  </tr>
                )}

                {/* Individual grade items */}
                {gradeItems.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                            item.itemType === 'assign' ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                        />
                        <span>{item.itemName}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center text-[var(--text-muted)]">
                      {item.weight !== undefined ? `${item.weight.toFixed(2)} %` : '-'}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {item.grade !== undefined ? (
                        <span className="font-medium">{item.grade.toFixed(2)}</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center text-[var(--text-muted)]">
                      {item.range}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {item.percentage !== undefined ? (
                        <span>{item.percentage.toFixed(2)} %</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-xs text-[var(--text-muted)] hidden lg:table-cell">
                      {item.feedback || '-'}
                    </td>
                    <td className="py-2 px-4 text-center hidden md:table-cell">
                      {item.contributionToCourse !== undefined ? (
                        <span>{item.contributionToCourse.toFixed(2)} %</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grade overview bar */}
          <div className="mt-4 p-4 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall course grade</span>
              <span className="text-sm font-bold text-[var(--moodle-primary)]">
                {courseTotal?.grade !== undefined ? `${courseTotal.grade.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <div className="progress-moodle h-3">
              <div
                className="progress-bar-moodle"
                style={{ width: `${courseTotal?.percentage || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>2 of {gradeItems.length} graded</span>
              <span>{gradeItems.filter((g) => g.grade === undefined).length} pending</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
