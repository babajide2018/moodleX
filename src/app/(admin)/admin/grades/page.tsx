'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Save,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  BarChart3,
  Award,
  Scale,
  LetterText,
} from 'lucide-react';
import { adminTabs } from '@/lib/admin-tabs';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SettingsSection({ title, icon, defaultOpen = false, children }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-left bg-[var(--bg-light)] hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="text-[var(--text-muted)]">{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-[var(--border-color)]">
          {children}
        </div>
      )}
    </div>
  );
}

function SettingField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {help && (
          <span className="text-[var(--text-muted)] cursor-help" title={help}>
            <HelpCircle size={12} />
          </span>
        )}
      </label>
      <div>{children}</div>
    </div>
  );
}

const scales = [
  { id: '1', name: 'Separate and Connected ways of knowing', values: 'Mostly Separate Knowing, Separate and Connected, Mostly Connected Knowing', usedCount: 0 },
  { id: '2', name: 'Default competence scale', values: 'Not yet competent, Competent', usedCount: 3 },
  { id: '3', name: 'Satisfactory/Not satisfactory', values: 'Not satisfactory, Satisfactory', usedCount: 12 },
  { id: '4', name: 'Pass/Fail', values: 'Fail, Pass', usedCount: 8 },
  { id: '5', name: 'Effort scale', values: 'Minimal effort, Some effort, Good effort, Outstanding effort', usedCount: 5 },
  { id: '6', name: 'Participation', values: 'Not participating, Rarely participating, Sometimes participating, Often participating, Always participating', usedCount: 2 },
];

const gradeLetters = [
  { letter: 'A+', lowBound: 97, highBound: 100 },
  { letter: 'A', lowBound: 93, highBound: 96.99 },
  { letter: 'A-', lowBound: 90, highBound: 92.99 },
  { letter: 'B+', lowBound: 87, highBound: 89.99 },
  { letter: 'B', lowBound: 83, highBound: 86.99 },
  { letter: 'B-', lowBound: 80, highBound: 82.99 },
  { letter: 'C+', lowBound: 77, highBound: 79.99 },
  { letter: 'C', lowBound: 73, highBound: 76.99 },
  { letter: 'C-', lowBound: 70, highBound: 72.99 },
  { letter: 'D+', lowBound: 67, highBound: 69.99 },
  { letter: 'D', lowBound: 63, highBound: 66.99 },
  { letter: 'D-', lowBound: 60, highBound: 62.99 },
  { letter: 'F', lowBound: 0, highBound: 59.99 },
];

export default function AdminGradesPage() {
  const [gradeDisplayType, setGradeDisplayType] = useState('real');
  const [decimalPoints, setDecimalPoints] = useState('2');
  const [aggregation, setAggregation] = useState('mean');
  const [defaultWeight, setDefaultWeight] = useState('1');
  const [showScaleValues, setShowScaleValues] = useState(true);
  const [overallDecimalPoints, setOverallDecimalPoints] = useState('2');
  const [gradeExportDecimal, setGradeExportDecimal] = useState('2');
  const [enableOutcomes, setEnableOutcomes] = useState(false);
  const [myGradesEnabled, setMyGradesEnabled] = useState(true);

  return (
    <>
      <PageHeader
        title="Grade settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Grades' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          <div className="space-y-4">
            {/* Grade display settings */}
            <SettingsSection title="Grade display settings" icon={<BarChart3 size={16} />} defaultOpen={true}>
              <SettingField label="Grade display type" help="How grades are displayed to students and teachers">
                <select
                  className="form-control w-48"
                  value={gradeDisplayType}
                  onChange={(e) => setGradeDisplayType(e.target.value)}
                >
                  <option value="real">Real</option>
                  <option value="percentage">Percentage</option>
                  <option value="letter">Letter</option>
                  <option value="real_percentage">Real (percentage)</option>
                  <option value="real_letter">Real (letter)</option>
                  <option value="letter_real">Letter (real)</option>
                  <option value="letter_percentage">Letter (percentage)</option>
                  <option value="percentage_letter">Percentage (letter)</option>
                  <option value="percentage_real">Percentage (real)</option>
                </select>
              </SettingField>
              <SettingField label="Overall decimal points" help="Number of decimal places to display for overall grade">
                <select
                  className="form-control w-24"
                  value={overallDecimalPoints}
                  onChange={(e) => setOverallDecimalPoints(e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </SettingField>
              <SettingField label="Grade item decimal points" help="Number of decimal places to display for each grade item">
                <select
                  className="form-control w-24"
                  value={decimalPoints}
                  onChange={(e) => setDecimalPoints(e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </SettingField>
              <SettingField label="Export decimal points">
                <select
                  className="form-control w-24"
                  value={gradeExportDecimal}
                  onChange={(e) => setGradeExportDecimal(e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </SettingField>
              <SettingField label="Show scale values" help="Display the underlying numeric values of scales">
                <select
                  className="form-control w-32"
                  value={showScaleValues ? 'yes' : 'no'}
                  onChange={(e) => setShowScaleValues(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              <SettingField label="My grades enabled" help="Allow students to view their own grades page">
                <select
                  className="form-control w-32"
                  value={myGradesEnabled ? 'yes' : 'no'}
                  onChange={(e) => setMyGradesEnabled(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* Grade item settings */}
            <SettingsSection title="Grade item settings" icon={<Award size={16} />}>
              <SettingField label="Default aggregation" help="Default method for calculating category grades">
                <select
                  className="form-control w-64"
                  value={aggregation}
                  onChange={(e) => setAggregation(e.target.value)}
                >
                  <option value="mean">Mean of grades</option>
                  <option value="weighted_mean">Weighted mean of grades</option>
                  <option value="simple_weighted_mean">Simple weighted mean of grades</option>
                  <option value="mean_all">Mean of grades (with extra credits)</option>
                  <option value="median">Median of grades</option>
                  <option value="lowest">Lowest grade</option>
                  <option value="highest">Highest grade</option>
                  <option value="mode">Mode of grades</option>
                  <option value="natural">Natural</option>
                </select>
              </SettingField>
              <SettingField label="Default weight" help="Default weight applied to grade items">
                <input
                  type="number"
                  className="form-control w-24"
                  value={defaultWeight}
                  onChange={(e) => setDefaultWeight(e.target.value)}
                  min={0}
                  step={0.1}
                />
              </SettingField>
              <SettingField label="Enable outcomes" help="Enable the use of outcomes (competencies) for grading">
                <select
                  className="form-control w-32"
                  value={enableOutcomes ? 'yes' : 'no'}
                  onChange={(e) => setEnableOutcomes(e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            {/* Grade category settings */}
            <SettingsSection title="Grade category settings" icon={<BarChart3 size={16} />}>
              <SettingField label="Available aggregation types" help="Select which aggregation types are available to teachers">
                <div className="space-y-2">
                  {[
                    { value: 'mean', label: 'Mean of grades' },
                    { value: 'weighted_mean', label: 'Weighted mean of grades' },
                    { value: 'simple_weighted_mean', label: 'Simple weighted mean of grades' },
                    { value: 'median', label: 'Median of grades' },
                    { value: 'lowest', label: 'Lowest grade' },
                    { value: 'highest', label: 'Highest grade' },
                    { value: 'mode', label: 'Mode of grades' },
                    { value: 'natural', label: 'Natural' },
                  ].map((type) => (
                    <label key={type.value} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      {type.label}
                    </label>
                  ))}
                </div>
              </SettingField>
              <SettingField label="Keep highest" help="Number of highest grades to keep (0 to disable)">
                <input type="number" className="form-control w-24" defaultValue="0" min={0} />
              </SettingField>
              <SettingField label="Drop lowest" help="Number of lowest grades to drop (0 to disable)">
                <input type="number" className="form-control w-24" defaultValue="0" min={0} />
              </SettingField>
            </SettingsSection>

            {/* Scales */}
            <SettingsSection title="Scales" icon={<Scale size={16} />}>
              <div className="flex justify-end mb-2">
                <button className="btn btn-primary text-xs flex items-center gap-1">
                  <Plus size={12} /> Add a new scale
                </button>
              </div>
              <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold">Scale name</th>
                      <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">Scale values</th>
                      <th className="py-2 px-3 text-left font-semibold">Used</th>
                      <th className="py-2 px-3 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {scales.map((scale) => (
                      <tr key={scale.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-medium text-[var(--text-link)]">{scale.name}</td>
                        <td className="py-2 px-3 text-xs text-[var(--text-muted)] hidden md:table-cell max-w-xs truncate">
                          {scale.values}
                        </td>
                        <td className="py-2 px-3 text-[var(--text-muted)]">{scale.usedCount}</td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1">
                            <button className="btn-icon" title="Edit"><Edit3 size={12} /></button>
                            <button className="btn-icon" title="Delete"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            {/* Grade letters */}
            <SettingsSection title="Grade letters" icon={<LetterText size={16} />}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Grade letters are used to represent ranges of grades. You can customise the boundaries for each letter.
              </p>
              <div className="border border-[var(--border-color)] rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold">Grade letter</th>
                      <th className="py-2 px-3 text-left font-semibold">Lower boundary (%)</th>
                      <th className="py-2 px-3 text-left font-semibold">Upper boundary (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeLetters.map((gl) => (
                      <tr key={gl.letter} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-semibold">{gl.letter}</td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            className="form-control w-24 text-sm"
                            defaultValue={gl.lowBound}
                            step={0.01}
                            min={0}
                            max={100}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            className="form-control w-24 text-sm"
                            defaultValue={gl.highBound}
                            step={0.01}
                            min={0}
                            max={100}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            {/* Save */}
            <div className="flex items-center gap-3 py-4 border-t border-[var(--border-color)]">
              <button className="btn btn-primary flex items-center gap-2">
                <Save size={16} /> Save changes
              </button>
              <Link href="/admin" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
