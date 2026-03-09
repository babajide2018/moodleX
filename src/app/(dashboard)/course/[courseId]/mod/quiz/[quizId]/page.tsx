'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Clock,
  Calendar,
  HelpCircle,
  BarChart3,
  Play,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

const demoQuiz = {
  id: 'm9',
  name: 'Variables Practice Quiz',
  description: 'Test your understanding of variables and data types. This quiz covers variable declaration, initialization, data types, and type conversion.',
  timeopen: '2026-03-01T00:00:00',
  timeclose: '2026-03-20T23:59:00',
  timelimit: 1800, // 30 minutes
  attempts: 3,
  grademethod: 'highest' as const,
  maxGrade: 100,
  questionsCount: 15,
  shuffleQuestions: true,
  navmethod: 'free',
};

const demoAttempts = [
  {
    id: 'a1',
    attempt: 1,
    state: 'finished',
    sumgrades: 73,
    timestart: '2026-03-08T10:15:00',
    timefinish: '2026-03-08T10:38:00',
  },
  {
    id: 'a2',
    attempt: 2,
    state: 'finished',
    sumgrades: 87,
    timestart: '2026-03-09T14:00:00',
    timefinish: '2026-03-09T14:22:00',
  },
];

export default function QuizPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const quiz = demoQuiz;
  const attempts = demoAttempts;

  const attemptsRemaining = quiz.attempts === 0 ? 'Unlimited' : String(quiz.attempts - attempts.length);
  const bestGrade = attempts.length > 0 ? Math.max(...attempts.map((a) => a.sumgrades)) : null;
  const canAttempt = quiz.attempts === 0 || attempts.length < quiz.attempts;

  return (
    <>
      <PageHeader
        title={quiz.name}
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: quiz.name },
        ]}
        actions={
          <Link
            href={`/course/${courseId}/mod/quiz/${params.quizId}/edit`}
            className="btn btn-secondary text-sm"
          >
            Edit quiz
          </Link>
        }
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Quiz intro */}
          <div className="border border-[var(--border-color)] rounded-lg mb-6">
            <div className="p-4">
              <p className="text-sm text-[var(--text-primary)] whitespace-pre-line">
                {quiz.description}
              </p>
            </div>

            {/* Quiz info table */}
            <div className="border-t border-[var(--border-color)]">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] w-48 bg-[var(--bg-light)]">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} /> Open date
                      </span>
                    </td>
                    <td className="py-2 px-4">{formatDate(quiz.timeopen)}</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} /> Close date
                      </span>
                    </td>
                    <td className="py-2 px-4">{formatDate(quiz.timeclose)}</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      <span className="flex items-center gap-2">
                        <Clock size={14} /> Time limit
                      </span>
                    </td>
                    <td className="py-2 px-4">{formatDuration(quiz.timelimit)}</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      <span className="flex items-center gap-2">
                        <HelpCircle size={14} /> Questions
                      </span>
                    </td>
                    <td className="py-2 px-4">{quiz.questionsCount}</td>
                  </tr>
                  <tr className="border-b border-[var(--border-color)]">
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      <span className="flex items-center gap-2">
                        <BarChart3 size={14} /> Grading method
                      </span>
                    </td>
                    <td className="py-2 px-4 capitalize">{quiz.grademethod} grade</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium text-[var(--text-muted)] bg-[var(--bg-light)]">
                      Attempts allowed
                    </td>
                    <td className="py-2 px-4">{quiz.attempts === 0 ? 'Unlimited' : quiz.attempts}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Previous attempts */}
          {attempts.length > 0 && (
            <div className="border border-[var(--border-color)] rounded-lg mb-6">
              <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold m-0">Summary of your previous attempts</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-light)]">
                    <th className="py-2 px-4 text-left font-semibold">Attempt</th>
                    <th className="py-2 px-4 text-left font-semibold">State</th>
                    <th className="py-2 px-4 text-left font-semibold">Grade / {quiz.maxGrade}</th>
                    <th className="py-2 px-4 text-left font-semibold">Started on</th>
                    <th className="py-2 px-4 text-left font-semibold">Completed</th>
                    <th className="py-2 px-4 text-left font-semibold">Time taken</th>
                    <th className="py-2 px-4 text-left font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => {
                    const duration = new Date(attempt.timefinish).getTime() - new Date(attempt.timestart).getTime();
                    const isBest = attempt.sumgrades === bestGrade;
                    return (
                      <tr key={attempt.id} className="border-b border-[var(--border-color)]">
                        <td className="py-2 px-4">{attempt.attempt}</td>
                        <td className="py-2 px-4">
                          <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                            <CheckCircle2 size={12} /> Finished
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`font-medium ${isBest ? 'text-[var(--moodle-primary)]' : ''}`}>
                            {attempt.sumgrades.toFixed(2)}
                          </span>
                          {isBest && (
                            <span className="text-xs text-[var(--moodle-primary)] ml-1">(highest)</span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-[var(--text-muted)]">{formatDateShort(attempt.timestart)}</td>
                        <td className="py-2 px-4 text-[var(--text-muted)]">{formatDateShort(attempt.timefinish)}</td>
                        <td className="py-2 px-4 text-[var(--text-muted)]">{formatDuration(duration / 1000)}</td>
                        <td className="py-2 px-4">
                          <Link
                            href={`/course/${courseId}/mod/quiz/${params.quizId}/review/${attempt.id}`}
                            className="btn-link text-xs flex items-center gap-1"
                          >
                            Review <ChevronRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Highest grade */}
              {bestGrade !== null && (
                <div className="px-4 py-2 bg-[var(--bg-light)] border-t border-[var(--border-color)] text-sm">
                  <strong>Highest grade:</strong>{' '}
                  <span className="text-[var(--moodle-primary)] font-medium">
                    {bestGrade.toFixed(2)} / {quiz.maxGrade.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Attempt button or info */}
          <div className="flex items-center gap-3">
            {canAttempt ? (
              <>
                <Link
                  href={`/course/${courseId}/mod/quiz/${params.quizId}/attempt`}
                  className="btn btn-primary py-2 px-6 flex items-center gap-2"
                >
                  <Play size={16} />
                  {attempts.length === 0 ? 'Attempt quiz now' : 'Re-attempt quiz'}
                </Link>
                {quiz.attempts > 0 && (
                  <span className="text-sm text-[var(--text-muted)]">
                    You have {attemptsRemaining} attempt(s) remaining.
                  </span>
                )}
              </>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 flex items-center gap-2">
                <AlertTriangle size={16} />
                No more attempts allowed. You have reached the maximum of {quiz.attempts} attempts.
              </div>
            )}
          </div>

          {/* Time limit warning */}
          {quiz.timelimit > 0 && canAttempt && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 flex items-start gap-2">
              <Clock size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                This quiz has a time limit of <strong>{formatDuration(quiz.timelimit)}</strong>.
                When you start an attempt, the timer will begin counting down and cannot be paused.
                You must submit before the time expires.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h} hour${h > 1 ? 's' : ''} ${rm} min${rm > 1 ? 's' : ''}`;
  }
  return `${m} min${m > 1 ? 's' : ''}${s > 0 ? ` ${s} secs` : ''}`;
}
