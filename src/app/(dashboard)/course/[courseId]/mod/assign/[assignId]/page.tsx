'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Users,
  Download,
} from 'lucide-react';

// Demo assignment data
const demoAssignment = {
  id: 'm5',
  name: 'Your First Program',
  description:
    'Write a simple program that prints "Hello, World!" to the console. Then extend it to ask the user for their name and print a personalized greeting.\n\nRequirements:\n- Use proper variable naming conventions\n- Include comments explaining your code\n- Handle edge cases (empty name input)',
  duedate: '2026-03-15T23:59:00',
  cutoffdate: '2026-03-18T23:59:00',
  allowsubmissionsfrom: '2026-03-01T00:00:00',
  maxGrade: 100,
  gradingType: 'point',
  submissionTypes: ['onlinetext', 'file'],
  maxFileSubmissions: 3,
  maxFileSize: '5MB',
  attemptsAllowed: 'Unlimited',
  teamSubmission: false,
};

const demoSubmission = {
  status: 'submitted' as const,
  submittedAt: '2026-03-10T14:30:00',
  grade: 85,
  feedback: 'Good work! Your code is clean and well-commented. Consider adding input validation for the name field.',
  gradedAt: '2026-03-11T09:15:00',
  gradedBy: 'Sarah Johnson',
  attemptnumber: 1,
};

type ViewMode = 'student' | 'grading';

export default function AssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const [submissionText, setSubmissionText] = useState('');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const assignment = demoAssignment;
  const submission = demoSubmission;

  const isOverdue = new Date(assignment.duedate) < new Date();
  const timeRemaining = getTimeRemaining(assignment.duedate);

  const isTeacher = true; // In real app, check user role

  return (
    <>
      <PageHeader
        title={assignment.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: assignment.name },
        ]}
        actions={
          isTeacher ? (
            <Link
              href={`/course/${courseId}/mod/assign/${params.assignId}/grading`}
              className="btn btn-primary text-sm flex items-center gap-1"
            >
              <Users size={16} /> View all submissions
            </Link>
          ) : undefined
        }
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Assignment details card */}
          <div className="border border-[var(--border-color)] rounded-lg mb-6">
            {/* Description */}
            <div className="p-4 border-b border-[var(--border-color)]">
              <div className="prose prose-sm max-w-none text-sm text-[var(--text-primary)] whitespace-pre-line">
                {assignment.description}
              </div>
            </div>

            {/* Key dates & info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-color)]">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Opened:</span>
                  <span>{formatDate(assignment.allowsubmissionsfrom)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className={`flex-shrink-0 ${isOverdue ? 'text-[var(--moodle-danger)]' : 'text-[var(--text-muted)]'}`} />
                  <span className="text-[var(--text-muted)]">Due:</span>
                  <span className={isOverdue ? 'text-[var(--moodle-danger)] font-medium' : ''}>
                    {formatDate(assignment.duedate)}
                  </span>
                </div>
                {assignment.cutoffdate && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-[var(--text-muted)]">Cut-off:</span>
                    <span>{formatDate(assignment.cutoffdate)}</span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Submission types:</span>
                  <span>Online text, File submissions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Upload size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">Max files:</span>
                  <span>{assignment.maxFileSubmissions} ({assignment.maxFileSize} each)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--text-muted)] ml-5">Grade:</span>
                  <span>{assignment.maxGrade} points</span>
                </div>
              </div>
            </div>

            {/* Time remaining banner */}
            {!isOverdue && (
              <div className="px-4 py-2 bg-[var(--bg-light)] border-t border-[var(--border-color)] text-sm flex items-center gap-2">
                <Clock size={14} className="text-[var(--moodle-info)]" />
                <span className="text-[var(--moodle-info)]">
                  Time remaining: {timeRemaining}
                </span>
              </div>
            )}
          </div>

          {/* Submission status */}
          <div className="border border-[var(--border-color)] rounded-lg mb-6">
            <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-sm font-semibold m-0">Submission status</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] w-48 bg-[var(--bg-light)]">
                      Submission status
                    </td>
                    <td className="py-2 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${
                        submission.status === 'submitted'
                          ? 'bg-green-50 text-green-700'
                          : submission.status === 'draft'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {submission.status === 'submitted' && <CheckCircle2 size={12} />}
                        Submitted for grading
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      Grading status
                    </td>
                    <td className="py-2 px-4">
                      {submission.grade !== undefined ? (
                        <span className="text-green-700 font-medium">Graded</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">Not graded</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      Due date
                    </td>
                    <td className="py-2 px-4">{formatDate(assignment.duedate)}</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      Time remaining
                    </td>
                    <td className="py-2 px-4">
                      {isOverdue ? (
                        <span className="text-[var(--moodle-danger)]">Assignment was submitted on time</span>
                      ) : (
                        timeRemaining
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      Last modified
                    </td>
                    <td className="py-2 px-4">{formatDate(submission.submittedAt)}</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      Attempt number
                    </td>
                    <td className="py-2 px-4">{submission.attemptnumber} ({assignment.attemptsAllowed} allowed)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Grade & Feedback (if graded) */}
          {submission.grade !== undefined && (
            <div className="border border-[var(--border-color)] rounded-lg mb-6">
              <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold m-0">Feedback</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] w-48 bg-[var(--bg-light)]">
                        Grade
                      </td>
                      <td className="py-2 px-4">
                        <span className="text-lg font-bold text-[var(--moodle-primary)]">
                          {submission.grade}
                        </span>
                        <span className="text-[var(--text-muted)]"> / {assignment.maxGrade}</span>
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                        Graded on
                      </td>
                      <td className="py-2 px-4">{formatDate(submission.gradedAt!)}</td>
                    </tr>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                        Graded by
                      </td>
                      <td className="py-2 px-4">{submission.gradedBy}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)] align-top">
                        Feedback comments
                      </td>
                      <td className="py-2 px-4 whitespace-pre-line">{submission.feedback}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add/edit submission button */}
          <div className="flex gap-3">
            <Link
              href={`/course/${courseId}/mod/assign/${params.assignId}/submit`}
              className="btn btn-primary"
            >
              {submission.status === 'submitted' ? 'Edit submission' : 'Add submission'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTimeRemaining(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();

  if (diff <= 0) return 'Overdue';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hours`;
}
