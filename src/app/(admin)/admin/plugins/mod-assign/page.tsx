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

export default function ModAssignSettingsPage() {
  return (
    <>
      <PageHeader
        title="Assignment settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Activity modules', href: '/admin/plugins/activities' },
          { label: 'Assignment settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="Submission settings">
              <SettingField label="Default submission plugins" help="Choose default submission plugins for new assignments">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    Online text
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    File submissions
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    Submission comments
                  </label>
                </div>
              </SettingField>
              <SettingField label="Max submission size" help="Maximum file size for submissions">
                <select className="form-control text-sm" defaultValue="5242880">
                  <option value="1048576">1 MB</option>
                  <option value="2097152">2 MB</option>
                  <option value="5242880">5 MB</option>
                  <option value="10485760">10 MB</option>
                  <option value="20971520">20 MB</option>
                  <option value="52428800">50 MB</option>
                </select>
              </SettingField>
              <SettingField label="Maximum number of uploaded files" help="Maximum number of files each student can upload">
                <select className="form-control text-sm" defaultValue="20">
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </SettingField>
              <SettingField label="Default word limit" help="Default word limit for online text submissions">
                <input type="number" className="form-control text-sm" defaultValue="" placeholder="No limit" />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Feedback settings">
              <SettingField label="Default feedback plugins" help="Choose default feedback plugins for new assignments">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    Feedback comments
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    Annotate PDF
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
                    Offline grading worksheet
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
                    Feedback files
                  </label>
                </div>
              </SettingField>
              <SettingField label="Feedback inline" help="If enabled, submission text will be copied into the feedback comment field during grading">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Submission defaults">
              <SettingField label="Require students to accept submission statement" help="Require that students accept the submission statement for all submissions">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Attempts reopened" help="Determines how student submission attempts are reopened">
                <select className="form-control text-sm" defaultValue="none">
                  <option value="none">Never</option>
                  <option value="manual">Manually</option>
                  <option value="untilpass">Automatically until pass</option>
                </select>
              </SettingField>
              <SettingField label="Maximum attempts" help="Maximum number of submission attempts a student can make">
                <select className="form-control text-sm" defaultValue="-1">
                  <option value="-1">Unlimited</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Cut-off date and late submissions">
              <SettingField label="Enable cut-off date" help="If enabled, assignments will not accept submissions after the cut-off date without an extension">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Late submissions grace period" help="Default grace period before the cut-off date">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="0" />
                  <select className="form-control text-sm w-auto">
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days" selected>days</option>
                    <option value="weeks">weeks</option>
                  </select>
                </div>
              </SettingField>
              <SettingField label="Send notifications to graders" help="Notify graders when students submit work">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Send late submission notifications" help="Notify graders when students submit work after the due date">
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
