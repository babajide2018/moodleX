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

export default function ModWorkshopSettingsPage() {
  return (
    <>
      <PageHeader
        title="Workshop settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Activity modules', href: '/admin/plugins/activities' },
          { label: 'Workshop settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Grading strategy" help="Default grading strategy for new workshops">
                <select className="form-control text-sm" defaultValue="accumulative">
                  <option value="accumulative">Accumulative grading</option>
                  <option value="comments">Comments</option>
                  <option value="numerrors">Number of errors</option>
                  <option value="rubric">Rubric</option>
                </select>
              </SettingField>
              <SettingField label="Grade for submission" help="Maximum grade that can be obtained for a submission">
                <select className="form-control text-sm" defaultValue="80">
                  <option value="0">0</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="60">60</option>
                  <option value="80">80</option>
                  <option value="100">100</option>
                </select>
              </SettingField>
              <SettingField label="Grade for assessment" help="Maximum grade for assessment of others' work">
                <select className="form-control text-sm" defaultValue="20">
                  <option value="0">0</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="60">60</option>
                  <option value="100">100</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Submission settings">
              <SettingField label="Submission types" help="Types of submissions accepted">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    Text submission
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    File attachment
                  </label>
                </div>
              </SettingField>
              <SettingField label="Maximum number of submission attachments" help="Maximum number of files that can be attached to a submission">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="7">7</option>
                </select>
              </SettingField>
              <SettingField label="Maximum submission attachment size" help="Maximum size of each submission attachment">
                <select className="form-control text-sm" defaultValue="10485760">
                  <option value="1048576">1 MB</option>
                  <option value="2097152">2 MB</option>
                  <option value="5242880">5 MB</option>
                  <option value="10485760">10 MB</option>
                  <option value="20971520">20 MB</option>
                  <option value="52428800">50 MB</option>
                </select>
              </SettingField>
              <SettingField label="Late submissions" help="Whether to allow submissions after the deadline">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Assessment settings" defaultOpen={false}>
              <SettingField label="Instructions for assessment" help="Default instructions for peer assessment">
                <textarea className="form-control text-sm" rows={3} defaultValue="" placeholder="Provide default assessment instructions here..." />
              </SettingField>
              <SettingField label="Self-assessment" help="Whether authors can assess their own submissions">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Number of required assessments" help="Minimum number of peer assessments each student must provide">
                <select className="form-control text-sm" defaultValue="3">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Grading evaluation" defaultOpen={false}>
              <SettingField label="Comparison of assessments" help="How strictly the student's grades must agree with the teacher grades">
                <select className="form-control text-sm" defaultValue="5">
                  <option value="1">Very lax</option>
                  <option value="3">Lax</option>
                  <option value="5">Fair</option>
                  <option value="7">Strict</option>
                  <option value="9">Very strict</option>
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
