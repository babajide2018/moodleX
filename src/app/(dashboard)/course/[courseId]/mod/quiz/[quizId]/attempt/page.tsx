'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  number: number;
  type: 'multichoice' | 'truefalse' | 'shortanswer' | 'numerical' | 'essay' | 'matching';
  questionText: string;
  marks: number;
  options?: { id: string; text: string }[];
  matchItems?: { id: string; question: string; answers: string[] }[];
}

const demoQuestions: QuizQuestion[] = [
  {
    id: 'q1', number: 1, type: 'multichoice', marks: 1,
    questionText: 'Which of the following correctly declares an integer variable in Python?',
    options: [
      { id: 'a', text: 'int x = 5' },
      { id: 'b', text: 'x = 5' },
      { id: 'c', text: 'var x: int = 5' },
      { id: 'd', text: 'integer x = 5' },
    ],
  },
  {
    id: 'q2', number: 2, type: 'truefalse', marks: 1,
    questionText: 'In Python, strings are immutable, meaning once created, their content cannot be changed.',
    options: [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ],
  },
  {
    id: 'q3', number: 3, type: 'multichoice', marks: 1,
    questionText: 'Which of the following is NOT a valid variable name in Python?',
    options: [
      { id: 'a', text: '_myVar' },
      { id: 'b', text: 'my_var' },
      { id: 'c', text: '2ndVariable' },
      { id: 'd', text: 'myVar2' },
    ],
  },
  {
    id: 'q4', number: 4, type: 'shortanswer', marks: 1,
    questionText: 'What built-in function is used to check the data type of a variable in Python? (Enter the function name only, without parentheses)',
  },
  {
    id: 'q5', number: 5, type: 'numerical', marks: 1,
    questionText: 'What is the result of int(3.7) in Python? Enter a number.',
  },
  {
    id: 'q6', number: 6, type: 'multichoice', marks: 1,
    questionText: 'What operator is used for string concatenation in Python?',
    options: [
      { id: 'a', text: '&' },
      { id: 'b', text: '+' },
      { id: 'c', text: '.' },
      { id: 'd', text: ',' },
    ],
  },
  {
    id: 'q7', number: 7, type: 'matching', marks: 2,
    questionText: 'Match each value with its correct data type in Python.',
    matchItems: [
      { id: 'm1', question: '42', answers: ['int', 'float', 'str', 'bool'] },
      { id: 'm2', question: '3.14', answers: ['int', 'float', 'str', 'bool'] },
      { id: 'm3', question: '"hello"', answers: ['int', 'float', 'str', 'bool'] },
      { id: 'm4', question: 'True', answers: ['int', 'float', 'str', 'bool'] },
    ],
  },
  {
    id: 'q8', number: 8, type: 'essay', marks: 5,
    questionText: 'Explain the difference between local and global variables in Python. Provide examples of each and explain when you would use one over the other.',
  },
];

export default function QuizAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<string, Record<string, string>>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const questionsPerPage = 1;
  const totalPages = Math.ceil(demoQuestions.length / questionsPerPage);
  const currentQuestions = demoQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-submit
          router.push(`/course/${courseId}/mod/quiz/${quizId}/review/demo`);
          return 0;
        }
        if (prev === 300 && !showTimeWarning) {
          setShowTimeWarning(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [courseId, quizId, router, showTimeWarning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFlag = (id: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const setMatchAnswer = (questionId: string, itemId: string, value: string) => {
    setMatchAnswers((prev) => ({
      ...prev,
      [questionId]: { ...(prev[questionId] || {}), [itemId]: value },
    }));
  };

  const isAnswered = (q: QuizQuestion) => {
    if (q.type === 'matching') {
      const ma = matchAnswers[q.id];
      return ma && q.matchItems && Object.keys(ma).length === q.matchItems.length;
    }
    return !!answers[q.id];
  };

  const handleFinish = () => {
    router.push(`/course/${courseId}/mod/quiz/${quizId}/review/demo`);
  };

  const timeIsLow = timeLeft < 300;

  return (
    <>
      <PageHeader
        title="Variables Practice Quiz"
        breadcrumbs={[
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Variables Practice Quiz', href: `/course/${courseId}/mod/quiz/${quizId}` },
          { label: 'Attempt' },
        ]}
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-5xl">
          {/* Time warning */}
          {showTimeWarning && timeLeft > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2">
              <AlertTriangle size={16} />
              <span><strong>Warning:</strong> Less than 5 minutes remaining!</span>
              <button
                className="ml-auto text-xs underline"
                onClick={() => setShowTimeWarning(false)}
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex gap-6">
            {/* Main question area */}
            <div className="flex-1 min-w-0">
              {currentQuestions.map((question) => (
                <div key={question.id} className="border border-[var(--border-color)] rounded-lg mb-4">
                  {/* Question header */}
                  <div className="flex items-start justify-between px-4 py-3 bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                    <div>
                      <span className="text-sm font-semibold">Question {question.number}</span>
                      <span className="text-xs text-[var(--text-muted)] ml-2">
                        {isAnswered(question) ? 'Answered' : 'Not yet answered'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-muted)]">
                        Marked out of {question.marks.toFixed(2)}
                      </span>
                      <button
                        className={`p-1 rounded ${flagged.has(question.id) ? 'text-red-500' : 'text-[var(--text-muted)]'}`}
                        onClick={() => toggleFlag(question.id)}
                        title={flagged.has(question.id) ? 'Remove flag' : 'Flag this question'}
                      >
                        <Flag size={14} fill={flagged.has(question.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Question body */}
                  <div className="p-4">
                    <div className="text-sm mb-4 whitespace-pre-line">{question.questionText}</div>

                    {/* Multiple choice */}
                    {(question.type === 'multichoice' || question.type === 'truefalse') && question.options && (
                      <div className="space-y-2">
                        {question.options.map((opt) => (
                          <label
                            key={opt.id}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              answers[question.id] === opt.id
                                ? 'border-[var(--moodle-primary)] bg-blue-50'
                                : 'border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${question.id}`}
                              value={opt.id}
                              checked={answers[question.id] === opt.id}
                              onChange={() => setAnswer(question.id, opt.id)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{opt.text}</span>
                          </label>
                        ))}
                        <button
                          className="text-xs text-[var(--text-muted)] hover:underline mt-1"
                          onClick={() => setAnswer(question.id, '')}
                        >
                          Clear my choice
                        </button>
                      </div>
                    )}

                    {/* Short answer */}
                    {question.type === 'shortanswer' && (
                      <input
                        type="text"
                        className="form-control max-w-md"
                        placeholder="Type your answer..."
                        value={answers[question.id] || ''}
                        onChange={(e) => setAnswer(question.id, e.target.value)}
                      />
                    )}

                    {/* Numerical */}
                    {question.type === 'numerical' && (
                      <input
                        type="number"
                        className="form-control w-32"
                        placeholder="0"
                        value={answers[question.id] || ''}
                        onChange={(e) => setAnswer(question.id, e.target.value)}
                      />
                    )}

                    {/* Essay */}
                    {question.type === 'essay' && (
                      <div>
                        <textarea
                          className="form-control min-h-[200px]"
                          placeholder="Write your answer here..."
                          value={answers[question.id] || ''}
                          onChange={(e) => setAnswer(question.id, e.target.value)}
                        />
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          Word count: {(answers[question.id] || '').trim() ? (answers[question.id] || '').trim().split(/\s+/).length : 0}
                        </div>
                      </div>
                    )}

                    {/* Matching */}
                    {question.type === 'matching' && question.matchItems && (
                      <div className="space-y-2">
                        {question.matchItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-24 text-right">{item.question}</span>
                            <select
                              className="form-control w-40"
                              value={matchAnswers[question.id]?.[item.id] || ''}
                              onChange={(e) => setMatchAnswer(question.id, item.id, e.target.value)}
                            >
                              <option value="">Choose...</option>
                              {item.answers.map((a) => (
                                <option key={a} value={a}>{a}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  className="btn btn-secondary flex items-center gap-1"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft size={16} /> Previous page
                </button>

                {currentPage < totalPages - 1 ? (
                  <button
                    className="btn btn-primary flex items-center gap-1"
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next page <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowFinishConfirm(true)}
                  >
                    Finish attempt...
                  </button>
                )}
              </div>
            </div>

            {/* Quiz navigation sidebar */}
            <div className="w-56 flex-shrink-0 hidden lg:block">
              <div className="sticky top-16 space-y-4">
                {/* Timer */}
                <div className={`border rounded-lg p-3 text-center ${
                  timeIsLow ? 'border-red-300 bg-red-50' : 'border-[var(--border-color)]'
                }`}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock size={14} className={timeIsLow ? 'text-red-600' : 'text-[var(--text-muted)]'} />
                    <span className="text-xs text-[var(--text-muted)]">Time left</span>
                  </div>
                  <div className={`text-xl font-mono font-bold ${timeIsLow ? 'text-red-600' : 'text-[var(--text-primary)]'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Question navigation */}
                <div className="border border-[var(--border-color)] rounded-lg">
                  <div className="bg-[var(--bg-light)] px-3 py-2 border-b border-[var(--border-color)]">
                    <span className="text-xs font-semibold">Quiz navigation</span>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-5 gap-1.5">
                      {demoQuestions.map((q) => (
                        <button
                          key={q.id}
                          className={`w-8 h-8 rounded text-xs font-medium border transition-colors ${
                            currentPage === Math.floor((q.number - 1) / questionsPerPage)
                              ? 'border-[var(--moodle-primary)] bg-blue-100 text-[var(--moodle-primary)]'
                              : isAnswered(q)
                              ? 'border-gray-300 bg-gray-100 text-gray-700'
                              : 'border-[var(--border-color)] bg-white text-[var(--text-muted)]'
                          } ${flagged.has(q.id) ? 'ring-2 ring-red-300' : ''}`}
                          onClick={() => setCurrentPage(Math.floor((q.number - 1) / questionsPerPage))}
                          title={`Question ${q.number}${flagged.has(q.id) ? ' (flagged)' : ''}`}
                        >
                          {q.number}
                        </button>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-gray-300 bg-gray-100" />
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-[var(--border-color)] bg-white" />
                        <span>Not yet answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-[var(--border-color)] ring-2 ring-red-300" />
                        <span>Flagged</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finish button */}
                <button
                  className="btn btn-primary w-full text-sm"
                  onClick={() => setShowFinishConfirm(true)}
                >
                  Finish attempt...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finish confirmation modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[1060] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[var(--border-color)] shadow-xl max-w-lg w-full">
            <div className="px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-base">Summary of attempt</h3>
            </div>
            <div className="p-4">
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="py-1 px-2 text-left text-xs font-semibold">Question</th>
                    <th className="py-1 px-2 text-left text-xs font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demoQuestions.map((q) => (
                    <tr key={q.id} className="border-b border-[var(--border-color)]">
                      <td className="py-1 px-2 text-sm">{q.number}</td>
                      <td className="py-1 px-2 text-xs">
                        {isAnswered(q) ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Answered
                          </span>
                        ) : (
                          <span className="text-[var(--text-muted)]">Not yet answered</span>
                        )}
                        {flagged.has(q.id) && (
                          <span className="ml-2 text-red-500">
                            <Flag size={10} className="inline" /> Flagged
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-sm text-[var(--text-secondary)]">
                Once you submit, you will not be able to change your answers for this attempt.
              </p>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-light)]">
              <button
                className="btn btn-secondary"
                onClick={() => setShowFinishConfirm(false)}
              >
                Return to attempt
              </button>
              <button className="btn btn-primary" onClick={handleFinish}>
                Submit all and finish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
