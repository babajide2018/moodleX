'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import {
  Plus,
  GripVertical,
  Trash2,
  Edit3,
  Copy,
  ChevronDown,
  ChevronRight,
  Settings,
  HelpCircle,
  CheckSquare,
  ToggleLeft,
  Type,
  Hash,
  FileText,
  ArrowLeftRight,
  Shuffle,
  ListOrdered,
} from 'lucide-react';

type QuestionType = 'multichoice' | 'truefalse' | 'shortanswer' | 'numerical' | 'essay' | 'matching' | 'description';

interface QuizQuestion {
  id: string;
  type: QuestionType;
  name: string;
  questionText: string;
  defaultMark: number;
  page: number;
}

const questionTypeIcons: Record<QuestionType, React.ReactNode> = {
  multichoice: <CheckSquare size={16} className="text-blue-600" />,
  truefalse: <ToggleLeft size={16} className="text-green-600" />,
  shortanswer: <Type size={16} className="text-purple-600" />,
  numerical: <Hash size={16} className="text-orange-600" />,
  essay: <FileText size={16} className="text-red-600" />,
  matching: <ArrowLeftRight size={16} className="text-teal-600" />,
  description: <ListOrdered size={16} className="text-gray-600" />,
};

const questionTypeLabels: Record<QuestionType, string> = {
  multichoice: 'Multiple choice',
  truefalse: 'True/False',
  shortanswer: 'Short answer',
  numerical: 'Numerical',
  essay: 'Essay',
  matching: 'Matching',
  description: 'Description',
};

const demoQuestions: QuizQuestion[] = [
  { id: 'q1', type: 'multichoice', name: 'Variable declaration', questionText: 'Which of the following correctly declares an integer variable in Python?', defaultMark: 1, page: 1 },
  { id: 'q2', type: 'truefalse', name: 'Data types', questionText: 'In Python, strings are immutable.', defaultMark: 1, page: 1 },
  { id: 'q3', type: 'multichoice', name: 'Variable naming', questionText: 'Which of the following is NOT a valid variable name in Python?', defaultMark: 1, page: 1 },
  { id: 'q4', type: 'shortanswer', name: 'Type function', questionText: 'What built-in function is used to check the data type of a variable in Python?', defaultMark: 1, page: 2 },
  { id: 'q5', type: 'numerical', name: 'Type conversion', questionText: 'What is the result of int(3.7)?', defaultMark: 1, page: 2 },
  { id: 'q6', type: 'multichoice', name: 'String operations', questionText: 'What operator is used for string concatenation in Python?', defaultMark: 1, page: 2 },
  { id: 'q7', type: 'matching', name: 'Match data types', questionText: 'Match each value with its correct data type.', defaultMark: 2, page: 3 },
  { id: 'q8', type: 'essay', name: 'Explain variables', questionText: 'Explain the difference between local and global variables. Give examples.', defaultMark: 5, page: 3 },
];

export default function EditQuizQuestionsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const [questions, setQuestions] = useState(demoQuestions);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);

  const totalMarks = questions.reduce((sum, q) => sum + q.defaultMark, 0);
  const maxGrade = 100;
  const pages = [...new Set(questions.map((q) => q.page))].sort();

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (q: QuizQuestion) => {
    const newQ: QuizQuestion = {
      ...q,
      id: `q-${Date.now()}`,
      name: `${q.name} (copy)`,
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const updateMark = (id: string, mark: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, defaultMark: mark } : q))
    );
  };

  return (
    <>
      <PageHeader
        title="Editing quiz: Variables Practice Quiz"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Variables Practice Quiz', href: `/course/${courseId}/mod/quiz/${quizId}` },
          { label: 'Edit quiz' },
        ]}
        actions={
          <Link
            href={`/course/${courseId}/mod/quiz/${quizId}`}
            className="btn btn-secondary text-sm"
          >
            Done editing
          </Link>
        }
      />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          {/* Quiz summary bar */}
          <div className="flex items-center justify-between p-3 mb-4 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <span>
                <strong>{questions.length}</strong> questions
              </span>
              <span>
                Total of marks: <strong>{totalMarks.toFixed(2)}</strong>
              </span>
              <span>
                Maximum grade: <strong>{maxGrade.toFixed(2)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <Shuffle size={14} className="text-[var(--text-muted)]" />
                <span>Shuffle</span>
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                />
              </label>
              <button className="btn btn-secondary text-sm">Repaginate</button>
            </div>
          </div>

          {/* Questions by page */}
          {pages.map((page) => {
            const pageQuestions = questions.filter((q) => q.page === page);
            return (
              <div key={page} className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-[var(--text-muted)]">Page {page}</h3>
                  <div className="flex-1 h-px bg-[var(--border-color)]" />
                </div>

                <div className="space-y-2">
                  {pageQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-center gap-2 border border-[var(--border-color)] rounded-lg bg-white hover:shadow-sm transition-shadow"
                    >
                      {/* Drag handle */}
                      <div className="px-2 py-3 cursor-grab text-[var(--text-muted)]">
                        <GripVertical size={16} />
                      </div>

                      {/* Question type icon */}
                      <div className="flex-shrink-0" title={questionTypeLabels[question.type]}>
                        {questionTypeIcons[question.type]}
                      </div>

                      {/* Question info */}
                      <div className="flex-1 py-2 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-muted)]">
                            Q{questions.indexOf(question) + 1}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {question.name}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                          {question.questionText}
                        </p>
                      </div>

                      {/* Mark input */}
                      <div className="flex items-center gap-1 px-2">
                        <input
                          type="number"
                          className="form-control w-16 text-center text-sm py-0.5"
                          value={question.defaultMark}
                          onChange={(e) => updateMark(question.id, Number(e.target.value))}
                          min={0}
                          step={0.5}
                        />
                        <span className="text-xs text-[var(--text-muted)]">marks</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 px-2">
                        <button className="btn-icon" title="Edit question">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn-icon" title="Duplicate" onClick={() => duplicateQuestion(question)}>
                          <Copy size={14} />
                        </button>
                        <button
                          className="btn-icon text-[var(--moodle-danger)]"
                          title="Remove from quiz"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add after page */}
                <div className="mt-2 flex justify-center">
                  <div className="h-px flex-1 bg-[var(--border-color)] self-center" />
                  <span className="text-xs text-[var(--text-muted)] px-2">Page break</span>
                  <div className="h-px flex-1 bg-[var(--border-color)] self-center" />
                </div>
              </div>
            );
          })}

          {/* Add question controls */}
          <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <button
                  className="btn btn-primary text-sm flex items-center gap-1"
                  onClick={() => setShowAddMenu(!showAddMenu)}
                >
                  <Plus size={16} /> Add
                  <ChevronDown size={14} />
                </button>

                {showAddMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[var(--border-color)] rounded-lg shadow-lg z-10 w-64">
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase">
                        Add a question
                      </div>
                      {(Object.keys(questionTypeLabels) as QuestionType[]).map((type) => (
                        <button
                          key={type}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2"
                          onClick={() => setShowAddMenu(false)}
                        >
                          {questionTypeIcons[type]}
                          {questionTypeLabels[type]}
                        </button>
                      ))}
                      <div className="border-t border-[var(--border-color)] my-1" />
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2"
                        onClick={() => setShowAddMenu(false)}
                      >
                        <Plus size={16} className="text-[var(--text-muted)]" />
                        From question bank
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] flex items-center gap-2"
                        onClick={() => setShowAddMenu(false)}
                      >
                        <Shuffle size={16} className="text-[var(--text-muted)]" />
                        A random question
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-secondary text-sm">
                Add a page break
              </button>
            </div>
          </div>

          {/* Maximum grade */}
          <div className="mt-6 flex items-center gap-3 p-4 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg">
            <span className="text-sm font-medium">Maximum grade:</span>
            <input
              type="number"
              className="form-control w-24 text-center"
              value={maxGrade}
              min={0}
              readOnly
            />
            <button className="btn btn-secondary text-sm">Save</button>
            <span className="text-xs text-[var(--text-muted)] ml-2">
              Total of marks: {totalMarks.toFixed(2)} &mdash;
              {totalMarks !== maxGrade && (
                <span className="text-amber-600 ml-1">
                  Questions will be rescaled to {maxGrade.toFixed(2)}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
