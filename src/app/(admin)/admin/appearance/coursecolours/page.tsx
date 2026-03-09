'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';

function SettingField({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
      <label className="text-sm font-medium pt-2 flex items-center gap-1">
        {label}
        {help && <span className="text-[var(--text-muted)] cursor-help" title={help}><HelpCircle size={12} /></span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

function SettingsSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-white">
      <button
        className="w-full flex items-center gap-2 p-4 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-color)] pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

const defaultColours = [
  '#613d7c',
  '#5f4b8b',
  '#0f6cbf',
  '#0b8793',
  '#1a8b43',
  '#7a9a01',
  '#e89b00',
  '#d4502a',
  '#c5344c',
  '#8e4585',
];

function ColourSwatch({ index, colour, onChange }: { index: number; colour: string; onChange: (val: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-lg bg-white">
      <span className="text-sm text-[var(--text-muted)] w-6 text-center font-medium">{index + 1}</span>
      <input
        type="color"
        value={colour}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded cursor-pointer border border-[var(--border-color)] flex-shrink-0"
      />
      <input
        type="text"
        value={colour}
        onChange={(e) => onChange(e.target.value)}
        className="form-control text-sm font-mono w-28"
      />
      <div
        className="flex-1 h-10 rounded"
        style={{ backgroundColor: colour }}
      />
    </div>
  );
}

export default function CourseColoursPage() {
  const [colours, setColours] = useState(defaultColours);

  const updateColour = (index: number, value: string) => {
    setColours((prev) => prev.map((c, i) => (i === index ? value : c)));
  };

  const resetColours = () => {
    setColours(defaultColours);
  };

  return (
    <>
      <PageHeader
        title="Course colours"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Course colours' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Course colour palette">
              <SettingField label="Colour palette" help="These colours are used as placeholder backgrounds for course images when no course image has been uploaded. Colours are assigned based on the course ID.">
                <div className="space-y-2">
                  {colours.map((colour, index) => (
                    <ColourSwatch
                      key={index}
                      index={index}
                      colour={colour}
                      onChange={(val) => updateColour(index, val)}
                    />
                  ))}
                </div>
              </SettingField>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  className="btn btn-icon text-sm flex items-center gap-1"
                  onClick={resetColours}
                >
                  <RotateCcw size={14} /> Reset to defaults
                </button>
              </div>
            </SettingsSection>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
