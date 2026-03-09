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

export default function EnrolSelfSettingsPage() {
  return (
    <>
      <PageHeader
        title="Self enrolment"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Enrolments', href: '/admin/plugins/enrol' },
          { label: 'Self enrolment' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Add instance to new courses" help="Add a self enrolment instance to all new courses by default">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Allow self enrolments" help="Allow users to self-enrol into courses by default">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Default role assignment" help="Default role assigned when self-enrolling">
                <select className="form-control text-sm" defaultValue="student">
                  <option value="student">Student</option>
                  <option value="teacher">Non-editing teacher</option>
                  <option value="editingteacher">Teacher</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Enrolment key">
              <SettingField label="Require enrolment key" help="Require an enrolment key for self-enrolment by default">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Use group enrolment keys" help="Allow group enrolment keys in addition to the course enrolment key">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Duration and limits">
              <SettingField label="Default enrolment duration" help="Default length of enrolment. 0 means unlimited.">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="0" />
                  <select className="form-control text-sm w-auto">
                    <option value="days" selected>days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </select>
                </div>
              </SettingField>
              <SettingField label="Maximum enrolled users" help="Maximum number of users that can self-enrol. 0 means unlimited.">
                <input type="number" className="form-control text-sm w-32" defaultValue="0" min="0" />
                <p className="text-xs text-[var(--text-muted)] mt-1">0 means no limit on the number of enrolments.</p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Notifications">
              <SettingField label="Send course welcome message" help="Send a welcome message when users self-enrol">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">From the course contact</option>
                  <option value="2">From the key holder</option>
                  <option value="3">From no-reply address</option>
                </select>
              </SettingField>
              <SettingField label="Custom welcome message" help="Custom welcome message. Leave blank for default.">
                <textarea
                  className="form-control text-sm"
                  rows={4}
                  placeholder="Leave blank for the default welcome message"
                  defaultValue=""
                />
              </SettingField>
              <SettingField label="Notify before enrolment expires" help="Should users be notified before their enrolment expires?">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Enroled user only</option>
                  <option value="2">Enroler and enroled user</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Unenrolment" defaultOpen={false}>
              <SettingField label="Allow user unenrolment" help="Allow users to unenrol themselves from courses">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Expire action" help="What happens when a self-enrolment expires">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">Unenrol user from course</option>
                  <option value="1">Suspend course enrolment</option>
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
