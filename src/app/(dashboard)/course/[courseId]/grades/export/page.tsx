'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Download,
  FileSpreadsheet,
  FileText,
  File,
  CheckSquare,
} from 'lucide-react';

const gradeItems = [
  { id: 'gi1', name: 'Your First Program', type: 'assign', checked: true },
  { id: 'gi2', name: 'Variables Practice Quiz', type: 'quiz', checked: true },
  { id: 'gi3', name: 'Week 2 Assignment', type: 'assign', checked: true },
  { id: 'gi4', name: 'Loops Quiz', type: 'quiz', checked: true },
  { id: 'gi5', name: 'If Statements Exercise', type: 'assign', checked: true },
  { id: 'gi6', name: 'Functions Assignment', type: 'assign', checked: true },
  { id: 'total', name: 'Course total', type: 'course', checked: true },
];

export default function GradeExportPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedItems, setSelectedItems] = useState(
    new Set(gradeItems.map((i) => i.id))
  );
  const [includePercentage, setIncludePercentage] = useState(true);
  const [includeFeedback, setIncludeFeedback] = useState(false);
  const [includeLetterGrade, setIncludeLetterGrade] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState('2');
  const [separator, setSeparator] = useState('comma');

  const courseTabs = [
    { key: 'course', label: 'Course', href: `/course/${courseId}` },
    { key: 'participants', label: 'Participants', href: `/course/${courseId}/participants` },
    { key: 'grades', label: 'Grades', href: `/course/${courseId}/grades` },
  ];

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedItems.size === gradeItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(gradeItems.map((i) => i.id)));
    }
  };

  const formatIcons: Record<string, React.ReactNode> = {
    csv: <FileText size={20} className="text-green-600" />,
    excel: <FileSpreadsheet size={20} className="text-green-700" />,
    ods: <File size={20} className="text-blue-600" />,
    txt: <FileText size={20} className="text-gray-600" />,
  };

  return (
    <>
      <PageHeader
        title="Grade export"
        breadcrumbs={[
          { label: 'My courses', href: '/my/courses' },
          { label: 'CS101', href: `/course/${courseId}` },
          { label: 'Grades', href: `/course/${courseId}/grades/grader` },
          { label: 'Export' },
        ]}
      />

      <SecondaryNavigation tabs={courseTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-3xl">
          {/* Export format selection */}
          <div className="border border-[var(--border-color)] rounded-lg mb-6">
            <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-sm font-semibold m-0">Export format</h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'csv', label: 'CSV file', desc: 'Comma-separated values' },
                { key: 'excel', label: 'Excel spreadsheet', desc: '.xlsx format' },
                { key: 'ods', label: 'OpenDocument', desc: '.ods format' },
                { key: 'txt', label: 'Plain text', desc: 'Tab-separated' },
              ].map((fmt) => (
                <button
                  key={fmt.key}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    exportFormat === fmt.key
                      ? 'border-[var(--moodle-primary)] bg-blue-50'
                      : 'border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                  onClick={() => setExportFormat(fmt.key)}
                >
                  <div className="flex justify-center mb-2">{formatIcons[fmt.key]}</div>
                  <div className="text-sm font-medium">{fmt.label}</div>
                  <div className="text-xs text-[var(--text-muted)]">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Grade items to include */}
          <div className="border border-[var(--border-color)] rounded-lg mb-6">
            <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
              <h3 className="text-sm font-semibold m-0">Grade items to include</h3>
              <button className="text-xs text-[var(--text-link)] hover:underline" onClick={toggleAll}>
                {selectedItems.size === gradeItems.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="p-4 space-y-2">
              {gradeItems.map((item) => (
                <label key={item.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    item.type === 'assign' ? 'bg-green-500' :
                    item.type === 'quiz' ? 'bg-orange-500' :
                    'bg-[var(--moodle-primary)]'
                  }`} />
                  <span className={item.type === 'course' ? 'font-semibold' : ''}>
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Export options */}
          <div className="border border-[var(--border-color)] rounded-lg mb-6">
            <div className="bg-[var(--bg-light)] px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-sm font-semibold m-0">Export options</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 items-start">
                <span className="text-sm font-medium pt-1">Include</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={includePercentage}
                      onChange={(e) => setIncludePercentage(e.target.checked)}
                    />
                    Percentage for each grade
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={includeFeedback}
                      onChange={(e) => setIncludeFeedback(e.target.checked)}
                    />
                    Feedback for each grade
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={includeLetterGrade}
                      onChange={(e) => setIncludeLetterGrade(e.target.checked)}
                    />
                    Letter grades
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 items-center">
                <span className="text-sm font-medium">Decimal places</span>
                <select
                  className="form-control w-20"
                  value={decimalPlaces}
                  onChange={(e) => setDecimalPlaces(e.target.value)}
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {exportFormat === 'csv' && (
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 items-center">
                  <span className="text-sm font-medium">Separator</span>
                  <select
                    className="form-control w-40"
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                  >
                    <option value="comma">Comma (,)</option>
                    <option value="semicolon">Semicolon (;)</option>
                    <option value="tab">Tab</option>
                    <option value="colon">Colon (:)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Export button */}
          <div className="flex items-center gap-3">
            <button className="btn btn-primary flex items-center gap-2">
              <Download size={16} />
              Download
            </button>
            <Link
              href={`/course/${courseId}/grades/grader`}
              className="btn btn-secondary"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
