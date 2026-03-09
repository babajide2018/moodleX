'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  Flag,
} from 'lucide-react';

interface ReviewQuestion {
  id: string;
  number: number;
  type: string;
  questionText: string;
  marks: number;
  marksObtained: number;
  status: 'correct' | 'incorrect' | 'partiallycorrect' | 'needsgrading';
  studentAnswer: string;
  correctAnswer: string;
  feedback?: string;
  specificFeedback?: string;
}

const demoAttempt = {
  id: 'a2',
  attemptNumber: 2,
  state: 'finished',
  startedOn: '2026-03-09T14:00:00',
  completedOn: '2026-03-09T14:22:00',
  timeTaken: '22 mins 14 secs',
  grade: 87,
  maxGrade: 100,
  marksObtained: 11.5,
  totalMarks: 13,
};

const demoReviewQuestions: ReviewQuestion[] = [
  {
    id: 'q1', number: 1, type: 'Multiple choice', marks: 1, marksObtained: 1,
    questionText: 'Which of the following correctly declares an integer variable in Python?',
    status: 'correct',
    studentAnswer: 'x = 5',
    correctAnswer: 'x = 5',
    feedback: 'Your answer is correct.',
    specificFeedback: 'In Python, you simply assign a value to a variable name. No type declaration is needed.',
  },
  {
    id: 'q2', number: 2, type: 'True/False', marks: 1, marksObtained: 1,
    questionText: 'In Python, strings are immutable, meaning once created, their content cannot be changed.',
    status: 'correct',
    studentAnswer: 'True',
    correctAnswer: 'True',
    feedback: 'Your answer is correct.',
  },
  {
    id: 'q3', number: 3, type: 'Multiple choice', marks: 1, marksObtained: 1,
    questionText: 'Which of the following is NOT a valid variable name in Python?',
    status: 'correct',
    studentAnswer: '2ndVariable',
    correctAnswer: '2ndVariable',
    feedback: 'Your answer is correct.',
    specificFeedback: 'Variable names in Python cannot start with a digit.',
  },
  {
    id: 'q4', number: 4, type: 'Short answer', marks: 1, marksObtained: 1,
    questionText: 'What built-in function is used to check the data type of a variable in Python?',
    status: 'correct',
    studentAnswer: 'type',
    correctAnswer: 'type',
    feedback: 'Your answer is correct.',
  },
  {
    id: 'q5', number: 5, type: 'Numerical', marks: 1, marksObtained: 1,
    questionText: 'What is the result of int(3.7) in Python?',
    status: 'correct',
    studentAnswer: '3',
    correctAnswer: '3',
    feedback: 'Your answer is correct.',
  },
  {
    id: 'q6', number: 6, type: 'Multiple choice', marks: 1, marksObtained: 0,
    questionText: 'What operator is used for string concatenation in Python?',
    status: 'incorrect',
    studentAnswer: '&',
    correctAnswer: '+',
    feedback: 'Your answer is incorrect.',
    specificFeedback: 'The + operator is used for concatenation in Python. The & operator is used in some other languages.',
  },
  {
    id: 'q7', number: 7, type: 'Matching', marks: 2, marksObtained: 1.5,
    questionText: 'Match each value with its correct data type in Python.',
    status: 'partiallycorrect',
    studentAnswer: '42→int, 3.14→float, "hello"→str, True→int',
    correctAnswer: '42→int, 3.14→float, "hello"→str, True→bool',
    feedback: 'Your answer is partially correct.',
    specificFeedback: 'True is of type bool, not int. While bool is a subclass of int, the type() function returns bool.',
  },
  {
    id: 'q8', number: 8, type: 'Essay', marks: 5, marksObtained: 5,
    questionText: 'Explain the difference between local and global variables in Python.',
    status: 'needsgrading',
    studentAnswer: 'Local variables are defined inside a function and only accessible within that function. Global variables are defined outside all functions and can be accessed anywhere in the program...',
    correctAnswer: '',
    feedback: 'This question will be graded manually by your teacher.',
  },
];

const statusConfig = {
  correct: { icon: <CheckCircle2 size={16} />, color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'Correct' },
  incorrect: { icon: <XCircle size={16} />, color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'Incorrect' },
  partiallycorrect: { icon: <MinusCircle size={16} />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', label: 'Partially correct' },
  needsgrading: { icon: <Clock size={16} />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', label: 'Requires grading' },
};

export default function QuizReviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const attempt = demoAttempt;
  const questions = demoReviewQuestions;

  return (
    <>
      <PageHeader
        title="Review attempt"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Variables Practice Quiz', href: `/course/${courseId}/mod/quiz/${quizId}` },
          { label: `Review attempt ${attempt.attemptNumber}` },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Attempt summary */}
          <div className="border border-[var(--border-color)] rounded-lg mb-6">
            <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-sm font-semibold m-0">Attempt summary</h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-[var(--border-color)]">
                  <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)] w-40">Started on</td>
                  <td className="py-2 px-4">
                    {new Date(attempt.startedOn).toLocaleDateString('en-GB', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
                <tr className="border-b border-[var(--border-color)]">
                  <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">Completed</td>
                  <td className="py-2 px-4">
                    {new Date(attempt.completedOn).toLocaleDateString('en-GB', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
                <tr className="border-b border-[var(--border-color)]">
                  <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">Time taken</td>
                  <td className="py-2 px-4">{attempt.timeTaken}</td>
                </tr>
                <tr className="border-b border-[var(--border-color)]">
                  <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">Marks</td>
                  <td className="py-2 px-4">{attempt.marksObtained} / {attempt.totalMarks}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">Grade</td>
                  <td className="py-2 px-4">
                    <span className="text-lg font-bold text-[var(--moodle-primary)]">
                      {attempt.grade.toFixed(2)}
                    </span>
                    <span className="text-[var(--text-muted)]"> out of {attempt.maxGrade.toFixed(2)}</span>
                    <span className="text-sm text-[var(--text-muted)] ml-2">
                      ({((attempt.grade / attempt.maxGrade) * 100).toFixed(0)}%)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Overall grade bar */}
          <div className="mb-6 p-4 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your score</span>
              <span className="text-sm font-bold text-[var(--moodle-primary)]">
                {attempt.grade}%
              </span>
            </div>
            <div className="progress-moodle h-3">
              <div
                className="progress-bar-moodle"
                style={{ width: `${attempt.grade}%` }}
              />
            </div>
          </div>

          {/* Questions review */}
          <div className="space-y-4">
            {questions.map((question) => {
              const config = statusConfig[question.status];
              return (
                <div key={question.id} className={`border rounded-lg ${config.bg}`}>
                  {/* Question header */}
                  <div className="flex items-start justify-between px-4 py-3 border-b border-inherit">
                    <div>
                      <span className="text-sm font-semibold">Question {question.number}</span>
                      <span className="text-xs text-[var(--text-muted)] ml-2">{question.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        Mark {question.marksObtained.toFixed(2)} out of {question.marks.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Question body */}
                  <div className="px-4 py-3">
                    <p className="text-sm mb-3 whitespace-pre-line">{question.questionText}</p>

                    {/* Answer comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="p-3 bg-white rounded border border-inherit">
                        <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">Your answer</div>
                        <div className="text-sm">{question.studentAnswer}</div>
                      </div>
                      {question.correctAnswer && (
                        <div className="p-3 bg-white rounded border border-inherit">
                          <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">Correct answer</div>
                          <div className="text-sm">{question.correctAnswer}</div>
                        </div>
                      )}
                    </div>

                    {/* Feedback */}
                    {question.feedback && (
                      <div className="text-sm text-[var(--text-secondary)] p-2 bg-white rounded border border-inherit">
                        <strong>Feedback:</strong> {question.feedback}
                        {question.specificFeedback && (
                          <span className="block mt-1 text-[var(--text-muted)]">{question.specificFeedback}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Link
              href={`/course/${courseId}/mod/quiz/${quizId}`}
              className="btn btn-secondary"
            >
              Back to quiz
            </Link>
            <Link
              href={`/course/${courseId}`}
              className="btn btn-secondary"
            >
              Back to course
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
