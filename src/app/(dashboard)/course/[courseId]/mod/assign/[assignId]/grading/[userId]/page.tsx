'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  File,
  Download,
  AlertTriangle,
  MessageSquare,
  Save,
  RotateCcw,
  Lock,
  Unlock,
} from 'lucide-react';

const demoAssignment = {
  id: 'm5',
  name: 'Your First Program',
  maxGrade: 100,
  duedate: '2026-03-15T23:59:00',
  rubricEnabled: false,
};

const demoStudent = {
  id: '3',
  firstname: 'James',
  lastname: 'Williams',
  email: 'james.w@example.com',
};

const demoSubmission = {
  status: 'submitted' as const,
  submittedAt: '2026-03-10T14:30:00',
  isLate: false,
  attemptnumber: 1,
  onlineText: `<p>Here is my "Hello World" program:</p>
<pre>
# My First Program
# Author: James Williams

def main():
    print("Hello, World!")

    # Ask user for their name
    name = input("What is your name? ")

    # Handle empty input
    if name.strip() == "":
        print("Hello, stranger!")
    else:
        print(f"Hello, {name}! Nice to meet you.")

if __name__ == "__main__":
    main()
</pre>
<p>I used Python for this assignment. The program first prints "Hello, World!" and then asks the user for their name. If the user enters an empty string, it prints a default greeting.</p>`,
  files: [
    { id: 'f1', name: 'hello_world.py', size: 428, type: 'text/x-python' },
  ],
  previousGrade: undefined as number | undefined,
  previousFeedback: undefined as string | undefined,
};

// Navigation context
const allStudents = [
  { id: '3', name: 'James Williams' },
  { id: '4', name: 'Emily Brown' },
  { id: '5', name: 'Michael Davis' },
  { id: '6', name: 'Jessica Wilson' },
];

export default function GradeStudentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const assignId = params.assignId as string;
  const userId = params.userId as string;

  const [grade, setGrade] = useState(demoSubmission.previousGrade?.toString() || '');
  const [feedback, setFeedback] = useState(demoSubmission.previousFeedback || '');
  const [feedbackFiles, setFeedbackFiles] = useState<string[]>([]);
  const [notifyStudent, setNotifyStudent] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const student = demoStudent;
  const submission = demoSubmission;
  const assignment = demoAssignment;

  const currentIndex = allStudents.findIndex((s) => s.id === userId);
  const prevStudent = currentIndex > 0 ? allStudents[currentIndex - 1] : null;
  const nextStudent = currentIndex < allStudents.length - 1 ? allStudents[currentIndex + 1] : null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const handleSaveAndNext = () => {
    handleSave();
    if (nextStudent) {
      setTimeout(() => {
        router.push(`/course/${courseId}/mod/assign/${assignId}/grading/${nextStudent.id}`);
      }, 600);
    }
  };

  const handleRevert = () => {
    // Revert submission to draft
  };

  return (
    <>
      <PageHeader
        title={`Grade: ${student.firstname} ${student.lastname}`}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: assignment.name, href: `/course/${courseId}/mod/assign/${assignId}` },
          { label: 'Grading', href: `/course/${courseId}/mod/assign/${assignId}/grading` },
          { label: `${student.firstname} ${student.lastname}` },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-5xl">
          {/* Student navigation bar */}
          <div className="flex items-center justify-between mb-4 p-3 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg">
            <button
              className="btn btn-secondary text-sm flex items-center gap-1"
              disabled={!prevStudent}
              onClick={() => prevStudent && router.push(`/course/${courseId}/mod/assign/${assignId}/grading/${prevStudent.id}`)}
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--moodle-primary)] text-white flex items-center justify-center text-xs font-medium">
                {student.firstname[0]}{student.lastname[0]}
              </div>
              <div>
                <div className="text-sm font-medium">{student.firstname} {student.lastname}</div>
                <div className="text-xs text-[var(--text-muted)]">{student.email}</div>
              </div>
              <span className="text-xs text-[var(--text-muted)] ml-2">
                {currentIndex + 1} of {allStudents.length}
              </span>
            </div>

            <button
              className="btn btn-secondary text-sm flex items-center gap-1"
              disabled={!nextStudent}
              onClick={() => nextStudent && router.push(`/course/${courseId}/mod/assign/${assignId}/grading/${nextStudent.id}`)}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Saved indicator */}
          {saved && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <CheckCircle2 size={16} />
              Grade and feedback saved successfully.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Submission content */}
            <div className="space-y-4">
              {/* Submission status */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">Submission status</h3>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)] w-36">Status</td>
                      <td className="py-2 px-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                          <CheckCircle2 size={10} /> Submitted for grading
                        </span>
                        {submission.isLate && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded">Late</span>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">Submitted</td>
                      <td className="py-2 px-4 text-xs">
                        {new Date(submission.submittedAt).toLocaleDateString('en-GB', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">Attempt</td>
                      <td className="py-2 px-4">{submission.attemptnumber}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Online text submission */}
              {submission.onlineText && (
                <div className="border border-[var(--border-color)] rounded-lg">
                  <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                    <h3 className="text-sm font-semibold m-0">Online text</h3>
                  </div>
                  <div
                    className="p-4 text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: submission.onlineText }}
                  />
                </div>
              )}

              {/* File submissions */}
              {submission.files.length > 0 && (
                <div className="border border-[var(--border-color)] rounded-lg">
                  <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                    <h3 className="text-sm font-semibold m-0">File submissions</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {submission.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-2 border border-[var(--border-color)] rounded bg-[var(--bg-light)]"
                      >
                        <File size={16} className="text-[var(--text-muted)]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            {file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`}
                          </div>
                        </div>
                        <button className="btn-icon" title="Download">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Grading panel */}
            <div className="space-y-4">
              {/* Grade input */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">Grade</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-[var(--text-muted)] w-24">
                      Grade out of {assignment.maxGrade}
                    </label>
                    <input
                      type="number"
                      className="form-control w-24 text-center text-lg font-bold"
                      min={0}
                      max={assignment.maxGrade}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="-"
                    />
                    <span className="text-sm text-[var(--text-muted)]">/ {assignment.maxGrade}</span>
                  </div>

                  {/* Grade visual bar */}
                  {grade && (
                    <div>
                      <div className="progress-moodle h-2 mb-1">
                        <div
                          className="progress-bar-moodle"
                          style={{ width: `${Math.min(Number(grade), assignment.maxGrade) / assignment.maxGrade * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-[var(--text-muted)] text-right">
                        {((Number(grade) / assignment.maxGrade) * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0 flex items-center gap-2">
                    <MessageSquare size={14} />
                    Feedback comments
                  </h3>
                </div>
                <div className="p-0">
                  <textarea
                    className="w-full p-4 text-sm min-h-[150px] resize-y border-0 outline-none"
                    placeholder="Enter feedback for the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-light)] text-xs text-[var(--text-muted)]">
                    Word count: {feedback.trim() ? feedback.trim().split(/\s+/).length : 0}
                  </div>
                </div>
              </div>

              {/* Feedback files */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">Feedback files</h3>
                </div>
                <div className="p-4">
                  <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center">
                    <FileText size={24} className="mx-auto mb-2 text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">
                      Drag feedback files here or click to browse
                    </p>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="border border-[var(--border-color)] rounded-lg">
                <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                  <h3 className="text-sm font-semibold m-0">Grading options</h3>
                </div>
                <div className="p-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={notifyStudent}
                      onChange={(e) => setNotifyStudent(e.target.checked)}
                    />
                    Notify student
                  </label>

                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                    <button
                      className="btn btn-secondary text-sm flex items-center gap-1"
                      onClick={handleRevert}
                      title="Revert the submission to draft status"
                    >
                      <RotateCcw size={14} />
                      Revert to draft
                    </button>
                    <button
                      className="btn btn-secondary text-sm flex items-center gap-1"
                      title="Prevent further changes to the submission"
                    >
                      <Lock size={14} />
                      Lock submission
                    </button>
                  </div>
                </div>
              </div>

              {/* Save buttons */}
              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  className="btn btn-secondary w-full flex items-center justify-center gap-2"
                  onClick={handleSaveAndNext}
                  disabled={isSaving || !nextStudent}
                >
                  Save and show next
                  <ChevronRight size={14} />
                </button>
                <Link
                  href={`/course/${courseId}/mod/assign/${assignId}/grading`}
                  className="btn btn-secondary w-full text-center"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
