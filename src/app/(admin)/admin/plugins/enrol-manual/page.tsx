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

export default function EnrolManualSettingsPage() {
  return (
    <>
      <PageHeader
        title="Manual enrolments"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Enrolments', href: '/admin/plugins/enrol' },
          { label: 'Manual enrolments' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="Default enrolment settings">
              <SettingField label="Add instance to new courses" help="Add a manual enrolment instance to all new courses automatically">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
              <SettingField label="Default role assignment" help="Default role assigned when manually enrolling users">
                <select className="form-control text-sm" defaultValue="student">
                  <option value="student">Student</option>
                  <option value="teacher">Non-editing teacher</option>
                  <option value="editingteacher">Teacher</option>
                  <option value="manager">Manager</option>
                </select>
              </SettingField>
              <SettingField label="Default enrolment duration" help="Default length of time that enrolment is valid. 0 means unlimited.">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="0" />
                  <select className="form-control text-sm w-auto">
                    <option value="days" selected>days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </select>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Set to 0 for unlimited enrolment duration.</p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Notification settings">
              <SettingField label="Notify before enrolment expires" help="Should users be notified before their enrolment expires?">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">Enroled user only</option>
                  <option value="2">Enroler and enroled user</option>
                </select>
              </SettingField>
              <SettingField label="Notification threshold" help="How many days before expiry should users be notified">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="1" />
                  <span className="text-sm text-[var(--text-muted)]">days</span>
                </div>
              </SettingField>
              <SettingField label="Send course welcome message" help="Send a welcome message to users when they are manually enrolled">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">No</option>
                  <option value="1">From the course contact</option>
                  <option value="2">From the key holder</option>
                  <option value="3">From no-reply address</option>
                </select>
              </SettingField>
              <SettingField label="Custom welcome message" help="Custom welcome message text. Leave blank for default.">
                <textarea
                  className="form-control text-sm"
                  rows={4}
                  placeholder="Leave blank for the default welcome message"
                  defaultValue=""
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  You can use placeholders: {'{$coursename}'}, {'{$fullname}'}, {'{$profileurl}'}
                </p>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Expiration handling" defaultOpen={false}>
              <SettingField label="Expire action" help="What happens when an enrolment expires">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">Unenrol user from course</option>
                  <option value="1">Suspend course enrolment</option>
                </select>
              </SettingField>
              <SettingField label="Unenrolment grace period" help="How long after expiry before the user is fully unenrolled">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="0" />
                  <select className="form-control text-sm w-auto">
                    <option value="hours">hours</option>
                    <option value="days" selected>days</option>
                    <option value="weeks">weeks</option>
                  </select>
                </div>
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
