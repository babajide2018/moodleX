'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

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
      <button className="w-full flex items-center gap-2 p-4 text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors" onClick={() => setOpen(!open)}>
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

export default function ModQuizSettingsPage() {
  return (
    <>
      <PageHeader
        title="Quiz settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Activity modules', href: '/admin/plugins/activities' },
          { label: 'Quiz settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="Timing">
              <SettingField label="Default time limit" help="Default time limit for quizzes. 0 means no time limit.">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="0" />
                  <select className="form-control text-sm w-auto">
                    <option value="seconds">seconds</option>
                    <option value="minutes" selected>minutes</option>
                    <option value="hours">hours</option>
                  </select>
                </div>
              </SettingField>
              <SettingField label="When time expires" help="What should happen when the time limit expires">
                <select className="form-control text-sm" defaultValue="autosubmit">
                  <option value="autosubmit">Open attempts are submitted automatically</option>
                  <option value="graceperiod">There is a grace period for submission</option>
                  <option value="autoabandon">Attempts must be submitted before time expires</option>
                </select>
              </SettingField>
              <SettingField label="Submission grace period" help="Extra time allowed for submission after time expires">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="0" />
                  <select className="form-control text-sm w-auto">
                    <option value="seconds">seconds</option>
                    <option value="minutes" selected>minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Grade">
              <SettingField label="Grading method" help="When multiple attempts are allowed, determines how the final grade is calculated">
                <select className="form-control text-sm" defaultValue="highest">
                  <option value="highest">Highest grade</option>
                  <option value="average">Average grade</option>
                  <option value="first">First attempt</option>
                  <option value="last">Last attempt</option>
                </select>
              </SettingField>
              <SettingField label="Grade to pass" help="Default grade required to pass (percentage)">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="0" min="0" max="100" />
                  <span className="text-sm text-[var(--text-muted)]">%</span>
                </div>
              </SettingField>
              <SettingField label="Maximum grade" help="Default maximum grade for new quizzes">
                <input type="number" className="form-control text-sm w-24" defaultValue="10" />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Attempts">
              <SettingField label="Attempts allowed" help="Default number of attempts allowed">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">Unlimited</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </SettingField>
              <SettingField label="Each attempt builds on the last" help="If enabled, each new attempt contains the results of the previous attempt">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Question behaviour">
              <SettingField label="How questions behave" help="Default question behaviour for quizzes">
                <select className="form-control text-sm" defaultValue="deferredfeedback">
                  <option value="deferredfeedback">Deferred feedback</option>
                  <option value="adaptive">Adaptive mode</option>
                  <option value="adaptivenopenalty">Adaptive mode (no penalties)</option>
                  <option value="interactive">Interactive with multiple tries</option>
                  <option value="immediatefeedback">Immediate feedback</option>
                  <option value="immediatecbm">Immediate feedback with CBM</option>
                  <option value="deferredcbm">Deferred feedback with CBM</option>
                </select>
              </SettingField>
              <SettingField label="Shuffle within questions" help="Shuffle answer options within each question">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Review options" defaultOpen={false}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                These options control what information students can see when they review a quiz attempt.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-[var(--border-color)] rounded">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold">Setting</th>
                      <th className="py-2 px-3 text-center font-semibold">During attempt</th>
                      <th className="py-2 px-3 text-center font-semibold">Immediately after</th>
                      <th className="py-2 px-3 text-center font-semibold">Later, while open</th>
                      <th className="py-2 px-3 text-center font-semibold">After quiz is closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['The attempt', 'Whether correct', 'Marks', 'Specific feedback', 'General feedback', 'Right answer', 'Overall feedback'].map((setting) => (
                      <tr key={setting} className="border-b border-[var(--border-color)]">
                        <td className="py-2 px-3">{setting}</td>
                        <td className="py-2 px-3 text-center"><input type="checkbox" className="w-4 h-4" defaultChecked={setting === 'The attempt'} /></td>
                        <td className="py-2 px-3 text-center"><input type="checkbox" className="w-4 h-4" defaultChecked /></td>
                        <td className="py-2 px-3 text-center"><input type="checkbox" className="w-4 h-4" defaultChecked /></td>
                        <td className="py-2 px-3 text-center"><input type="checkbox" className="w-4 h-4" defaultChecked /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            <SettingsSection title="Appearance" defaultOpen={false}>
              <SettingField label="Show the user&apos;s picture" help="Show the user picture during quiz attempts">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No image</option>
                  <option value="1">Small image</option>
                  <option value="2">Large image</option>
                </select>
              </SettingField>
              <SettingField label="Decimal places in grades" help="Number of decimal places to display in grades">
                <select className="form-control text-sm" defaultValue="2">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </SettingField>
              <SettingField label="Decimal places in question grades" help="Number of decimal places for question grades">
                <select className="form-control text-sm" defaultValue="7">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="7">7</option>
                </select>
              </SettingField>
              <SettingField label="Show blocks during quiz attempts" help="Show blocks during quiz attempts">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <div className="flex items-center gap-3 pt-2">
              <button type="button" className="btn btn-primary text-sm">Save changes</button>
              <button type="button" className="btn text-sm border border-[var(--border-color)]">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
