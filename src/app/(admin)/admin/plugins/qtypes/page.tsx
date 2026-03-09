'use client';

import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionType {
  id: string;
  name: string;
  description: string;
  questions: number;
  version: string;
  status: 'enabled' | 'disabled';
}

const questionTypes: QuestionType[] = [
  { id: 'calculated', name: 'Calculated', description: 'Like numerical questions with random values from a dataset', questions: 12, version: '2024100700', status: 'enabled' },
  { id: 'calculatedmulti', name: 'Calculated multichoice', description: 'Calculated questions with multiple choice answers', questions: 3, version: '2024100700', status: 'enabled' },
  { id: 'calculatedsimple', name: 'Simple calculated', description: 'Simpler version of calculated questions', questions: 5, version: '2024100700', status: 'enabled' },
  { id: 'ddimageortext', name: 'Drag and drop onto image', description: 'Drag and drop markers or text onto a background image', questions: 8, version: '2024100700', status: 'enabled' },
  { id: 'ddmarker', name: 'Drag and drop markers', description: 'Drag and drop markers onto a background image', questions: 4, version: '2024100700', status: 'enabled' },
  { id: 'ddwtos', name: 'Drag and drop into text', description: 'Fill in blanks in a passage by dragging words', questions: 15, version: '2024100700', status: 'enabled' },
  { id: 'description', name: 'Description', description: 'Not actually a question - displays text with no input', questions: 34, version: '2024100700', status: 'enabled' },
  { id: 'essay', name: 'Essay', description: 'Open-ended question requiring manual grading', questions: 67, version: '2024100700', status: 'enabled' },
  { id: 'gapselect', name: 'Select missing words', description: 'Fill in blanks using dropdown menus', questions: 11, version: '2024100700', status: 'enabled' },
  { id: 'match', name: 'Matching', description: 'Match sub-questions to correct answers', questions: 23, version: '2024100700', status: 'enabled' },
  { id: 'missingtype', name: 'Missing type', description: 'Placeholder for missing question type plugins', questions: 0, version: '2024100700', status: 'enabled' },
  { id: 'multianswer', name: 'Embedded answers (Cloze)', description: 'Questions with embedded answer fields in the text', questions: 19, version: '2024100700', status: 'enabled' },
  { id: 'multichoice', name: 'Multiple choice', description: 'Single or multiple answer multiple choice questions', questions: 245, version: '2024100700', status: 'enabled' },
  { id: 'numerical', name: 'Numerical', description: 'Allow a numerical response, possibly with units', questions: 34, version: '2024100700', status: 'enabled' },
  { id: 'random', name: 'Random question', description: 'Randomly selects a question from a category', questions: 0, version: '2024100700', status: 'enabled' },
  { id: 'randomsamatch', name: 'Random short-answer matching', description: 'Like matching but sub-questions drawn randomly from short answer questions', questions: 2, version: '2024100700', status: 'disabled' },
  { id: 'shortanswer', name: 'Short answer', description: 'Allow a short typed text response', questions: 89, version: '2024100700', status: 'enabled' },
  { id: 'truefalse', name: 'True/False', description: 'Simple true or false question', questions: 56, version: '2024100700', status: 'enabled' },
];

export default function ManageQTypesPage() {
  return (
    <>
      <PageHeader
        title="Manage question types"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Question types' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            This table lists all installed question types with the number of questions of each type in the question bank.
          </p>

          <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                  <th className="py-2 px-3 text-left font-semibold">Question type</th>
                  <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Description</th>
                  <th className="py-2 px-3 text-center font-semibold">Questions</th>
                  <th className="py-2 px-3 text-left font-semibold hidden lg:table-cell">Version</th>
                  <th className="py-2 px-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {questionTypes.map((qt) => (
                  <tr
                    key={qt.id}
                    className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] ${
                      qt.status === 'disabled' ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-medium">{qt.name}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)] text-xs hidden md:table-cell">
                      {qt.description}
                    </td>
                    <td className="py-2 px-3 text-center text-[var(--text-muted)]">{qt.questions}</td>
                    <td className="py-2 px-3 text-xs font-mono text-[var(--text-muted)] hidden lg:table-cell">
                      {qt.version}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {qt.status === 'enabled' ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                          <CheckCircle2 size={10} /> Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-red-50 text-red-700">
                          <XCircle size={10} /> Disabled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-[var(--text-muted)]">
            Total questions in question bank: {questionTypes.reduce((sum, qt) => sum + qt.questions, 0)}
          </div>
        </div>
      </div>
    </>
  );
}
