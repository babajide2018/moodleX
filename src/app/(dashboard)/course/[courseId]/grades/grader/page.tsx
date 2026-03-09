'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Download,
  Upload,
  Settings,
  ChevronDown,
  Search,
  Edit3,
  Save,
} from 'lucide-react';

interface GradeCell {
  grade?: number;
  maxGrade: number;
  itemId: string;
}

interface StudentRow {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  grades: GradeCell[];
  courseTotal?: number;
}

const gradeItems = [
  { id: 'gi1', name: 'Your First Program', type: 'assign', maxGrade: 100, weight: 20 },
  { id: 'gi2', name: 'Variables Practice Quiz', type: 'quiz', maxGrade: 100, weight: 15 },
  { id: 'gi3', name: 'Week 2 Assignment', type: 'assign', maxGrade: 100, weight: 20 },
  { id: 'gi4', name: 'Loops Quiz', type: 'quiz', maxGrade: 100, weight: 15 },
  { id: 'gi5', name: 'If Statements Exercise', type: 'assign', maxGrade: 100, weight: 15 },
  { id: 'gi6', name: 'Functions Assignment', type: 'assign', maxGrade: 100, weight: 15 },
];

const demoStudents: StudentRow[] = [
  { id: '3', firstname: 'James', lastname: 'Williams', email: 'james.w@example.com', grades: [
    { grade: 85, maxGrade: 100, itemId: 'gi1' },
    { grade: 87, maxGrade: 100, itemId: 'gi2' },
    { grade: undefined, maxGrade: 100, itemId: 'gi3' },
    { grade: undefined, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: 72.5 },
  { id: '4', firstname: 'Emily', lastname: 'Brown', email: 'emily.b@example.com', grades: [
    { grade: 92, maxGrade: 100, itemId: 'gi1' },
    { grade: 95, maxGrade: 100, itemId: 'gi2' },
    { grade: 88, maxGrade: 100, itemId: 'gi3' },
    { grade: undefined, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: 85.3 },
  { id: '5', firstname: 'Michael', lastname: 'Davis', email: 'michael.d@example.com', grades: [
    { grade: 78, maxGrade: 100, itemId: 'gi1' },
    { grade: 65, maxGrade: 100, itemId: 'gi2' },
    { grade: undefined, maxGrade: 100, itemId: 'gi3' },
    { grade: undefined, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: 60.1 },
  { id: '6', firstname: 'Jessica', lastname: 'Wilson', email: 'jessica.w@example.com', grades: [
    { grade: 70, maxGrade: 100, itemId: 'gi1' },
    { grade: 82, maxGrade: 100, itemId: 'gi2' },
    { grade: 75, maxGrade: 100, itemId: 'gi3' },
    { grade: 91, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: 73.8 },
  { id: '7', firstname: 'David', lastname: 'Taylor', email: 'david.t@example.com', grades: [
    { grade: 55, maxGrade: 100, itemId: 'gi1' },
    { grade: 60, maxGrade: 100, itemId: 'gi2' },
    { grade: undefined, maxGrade: 100, itemId: 'gi3' },
    { grade: undefined, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: 48.5 },
  { id: '8', firstname: 'Ashley', lastname: 'Anderson', email: 'ashley.a@example.com', grades: [
    { grade: undefined, maxGrade: 100, itemId: 'gi1' },
    { grade: undefined, maxGrade: 100, itemId: 'gi2' },
    { grade: undefined, maxGrade: 100, itemId: 'gi3' },
    { grade: undefined, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: undefined },
  { id: '9', firstname: 'Robert', lastname: 'Thomas', email: 'robert.t@example.com', grades: [
    { grade: 88, maxGrade: 100, itemId: 'gi1' },
    { grade: 76, maxGrade: 100, itemId: 'gi2' },
    { grade: 82, maxGrade: 100, itemId: 'gi3' },
    { grade: undefined, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: 70.2 },
  { id: '10', firstname: 'Jennifer', lastname: 'Martinez', email: 'jennifer.m@example.com', grades: [
    { grade: 95, maxGrade: 100, itemId: 'gi1' },
    { grade: 90, maxGrade: 100, itemId: 'gi2' },
    { grade: 92, maxGrade: 100, itemId: 'gi3' },
    { grade: 88, maxGrade: 100, itemId: 'gi4' },
    { grade: undefined, maxGrade: 100, itemId: 'gi5' },
    { grade: undefined, maxGrade: 100, itemId: 'gi6' },
  ], courseTotal: 88.7 },
];

export default function GraderReportPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [editMode, setEditMode] = useState(false);
  const [editedGrades, setEditedGrades] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
  ];

  const gradeTabs = [
    { key: 'grader', label: 'Grader report', href: `/course/${courseId}/grades/grader` },
    { key: 'user', label: 'User report', href: `/course/${courseId}/grades` },
  ];

  const filtered = demoStudents.filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return `${s.firstname} ${s.lastname}`.toLowerCase().includes(q) ||
             s.email.toLowerCase().includes(q);
    }
    return true;
  });

  const getGradeColor = (grade: number | undefined, max: number) => {
    if (grade === undefined) return '';
    const pct = (grade / max) * 100;
    if (pct >= 80) return 'text-green-700 bg-green-50';
    if (pct >= 60) return 'text-amber-700 bg-amber-50';
    if (pct >= 40) return 'text-orange-700 bg-orange-50';
    return 'text-red-700 bg-red-50';
  };

  const handleGradeEdit = (studentId: string, itemId: string, value: string) => {
    setEditedGrades((prev) => ({ ...prev, [`${studentId}-${itemId}`]: value }));
  };

  return (
    <>
      <PageHeader
        title="Grader report"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Grades' },
        ]}
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Grade report tabs */}
          <div className="mb-4">
            <div className="flex gap-0 border-b border-[var(--border-color)]">
              {gradeTabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`px-4 py-2 text-sm border-b-2 ${
                    tab.key === 'grader'
                      ? 'border-[var(--moodle-primary)] text-[var(--moodle-primary)] font-medium'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  className="form-control text-sm pl-8 w-56"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
              <button
                className={`btn text-sm flex items-center gap-1 ${editMode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setEditMode(!editMode)}
              >
                <Edit3 size={14} />
                {editMode ? 'Editing on' : 'Turn editing on'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/course/${courseId}/grades/export`}
                className="btn btn-secondary text-sm flex items-center gap-1"
              >
                <Download size={14} /> Export
              </Link>
              <button className="btn btn-secondary text-sm flex items-center gap-1">
                <Settings size={14} /> Setup
              </button>
            </div>
          </div>

          {/* Grader table */}
          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b-2 border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold sticky left-0 bg-[var(--bg-light)] z-10 min-w-[180px]">
                    Student
                  </th>
                  {gradeItems.map((item) => (
                    <th key={item.id} className="py-2 px-2 text-center font-semibold min-w-[100px]">
                      <div className="text-xs leading-tight">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          item.type === 'assign' ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        {item.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] font-normal">
                        /{item.maxGrade}
                      </div>
                    </th>
                  ))}
                  <th className="py-2 px-3 text-center font-semibold min-w-[100px] bg-blue-50">
                    Course total
                    <div className="text-xs text-[var(--text-muted)] font-normal">/100</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                    <td className="py-2 px-3 sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs flex-shrink-0">
                          {student.firstname[0]}{student.lastname[0]}
                        </div>
                        <Link
                          href={`/user/${student.id}`}
                          className="text-[var(--text-link)] hover:underline text-xs font-medium"
                        >
                          {student.firstname} {student.lastname}
                        </Link>
                      </div>
                    </td>
                    {student.grades.map((cell) => (
                      <td key={cell.itemId} className="py-1 px-2 text-center">
                        {editMode && cell.grade === undefined ? (
                          <input
                            type="number"
                            className="form-control w-16 text-center text-xs py-0.5 mx-auto"
                            min={0}
                            max={cell.maxGrade}
                            placeholder="-"
                            value={editedGrades[`${student.id}-${cell.itemId}`] || ''}
                            onChange={(e) => handleGradeEdit(student.id, cell.itemId, e.target.value)}
                          />
                        ) : (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            cell.grade !== undefined ? getGradeColor(cell.grade, cell.maxGrade) : 'text-[var(--text-muted)]'
                          }`}>
                            {cell.grade !== undefined ? cell.grade.toFixed(1) : '-'}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="py-2 px-3 text-center bg-blue-50/50">
                      <span className={`font-bold text-sm ${
                        student.courseTotal !== undefined
                          ? getGradeColor(student.courseTotal, 100)
                          : 'text-[var(--text-muted)]'
                      } inline-block px-2 py-0.5 rounded`}>
                        {student.courseTotal !== undefined ? student.courseTotal.toFixed(1) : '-'}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Average row */}
                <tr className="bg-[var(--bg-light)] border-t-2 border-[var(--border-color)] font-medium">
                  <td className="py-2 px-3 sticky left-0 bg-[var(--bg-light)] z-10 text-sm">
                    Overall average
                  </td>
                  {gradeItems.map((item) => {
                    const grades = demoStudents
                      .map((s) => s.grades.find((g) => g.itemId === item.id)?.grade)
                      .filter((g): g is number => g !== undefined);
                    const avg = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : undefined;
                    return (
                      <td key={item.id} className="py-2 px-2 text-center text-xs">
                        {avg !== undefined ? avg.toFixed(1) : '-'}
                      </td>
                    );
                  })}
                  <td className="py-2 px-3 text-center bg-blue-50/50 text-sm">
                    {(() => {
                      const totals = demoStudents
                        .map((s) => s.courseTotal)
                        .filter((t): t is number => t !== undefined);
                      return totals.length > 0
                        ? (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1)
                        : '-';
                    })()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Save edited grades */}
          {editMode && Object.keys(editedGrades).length > 0 && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-sm text-amber-800">You have unsaved grade changes.</span>
              <button className="btn btn-primary text-sm flex items-center gap-1 ml-auto">
                <Save size={14} /> Save changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
