'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle } from 'lucide-react';

interface GradeLetter {
  letter: string;
  lowerboundary: number;
}

const defaultLetters: GradeLetter[] = [
  { letter: 'A+', lowerboundary: 97 },
  { letter: 'A', lowerboundary: 93 },
  { letter: 'A-', lowerboundary: 90 },
  { letter: 'B+', lowerboundary: 87 },
  { letter: 'B', lowerboundary: 83 },
  { letter: 'B-', lowerboundary: 80 },
  { letter: 'C+', lowerboundary: 77 },
  { letter: 'C', lowerboundary: 73 },
  { letter: 'C-', lowerboundary: 70 },
  { letter: 'D+', lowerboundary: 67 },
  { letter: 'D', lowerboundary: 63 },
  { letter: 'D-', lowerboundary: 60 },
  { letter: 'F', lowerboundary: 0 },
];

export default function GradeLettersPage() {
  const [letters, setLetters] = useState<GradeLetter[]>(defaultLetters);
  const [editing, setEditing] = useState(false);

  const handleLetterChange = (index: number, field: keyof GradeLetter, value: string | number) => {
    setLetters((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  return (
    <>
      <PageHeader
        title="Grade letters"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades', href: '/admin/grades' },
          { label: 'Scales' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-[var(--text-muted)]">
                  Grade letters are used to represent ranges of grades.
                </p>
                <span className="text-[var(--text-muted)] cursor-help" title="Define the letter grades and percentage boundaries used when letter grades are displayed.">
                  <HelpCircle size={14} />
                </span>
              </div>
              <button
                className="btn btn-primary text-sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel editing' : 'Edit grade letters'}
              </button>
            </div>

            <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                    <th className="text-left p-3 font-semibold w-16">#</th>
                    <th className="text-left p-3 font-semibold">Grade letter</th>
                    <th className="text-left p-3 font-semibold">Lower boundary (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {letters.map((letter, index) => (
                    <tr key={index} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="p-3 text-[var(--text-muted)]">{index + 1}</td>
                      <td className="p-3">
                        {editing ? (
                          <input
                            type="text"
                            className="form-control text-sm w-24"
                            value={letter.letter}
                            onChange={(e) => handleLetterChange(index, 'letter', e.target.value)}
                          />
                        ) : (
                          <span className="font-medium">{letter.letter}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {editing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              className="form-control text-sm w-24"
                              value={letter.lowerboundary}
                              min={0}
                              max={100}
                              step={0.01}
                              onChange={(e) => handleLetterChange(index, 'lowerboundary', parseFloat(e.target.value))}
                            />
                            <span className="text-[var(--text-muted)]">%</span>
                          </div>
                        ) : (
                          <span>{letter.lowerboundary.toFixed(2)} %</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editing && (
              <div className="mt-4 flex items-center gap-3">
                <button type="button" className="btn btn-primary text-sm">Save changes</button>
                <button type="button" className="btn text-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            )}

            <p className="mt-3 text-xs text-[var(--text-muted)]">
              These are the site default grade letters. Individual courses can override these values.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
