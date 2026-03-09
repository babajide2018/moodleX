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

export default function ModForumSettingsPage() {
  return (
    <>
      <PageHeader
        title="Forum settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Plugins', href: '/admin/plugins' },
          { label: 'Activity modules', href: '/admin/plugins/activities' },
          { label: 'Forum settings' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="space-y-4">
            <SettingsSection title="General settings">
              <SettingField label="Display mode" help="The default display mode for discussions">
                <select className="form-control text-sm" defaultValue="3">
                  <option value="1">Display replies flat, with oldest first</option>
                  <option value="2">Display replies flat, with newest first</option>
                  <option value="3">Display replies in threaded form</option>
                  <option value="4">Display replies in nested form</option>
                </select>
              </SettingField>
              <SettingField label="Subscription mode" help="Default subscription mode for new forums">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">Optional subscription</option>
                  <option value="1">Forced subscription</option>
                  <option value="2">Auto subscription</option>
                  <option value="3">Subscription disabled</option>
                </select>
              </SettingField>
              <SettingField label="Tracking read" help="Enable read tracking for forums">
                <select className="form-control text-sm" defaultValue="1">
                  <option value="0">Off</option>
                  <option value="1">Optional</option>
                </select>
              </SettingField>
              <SettingField label="Posts per page" help="Number of discussions per page">
                <input type="number" className="form-control text-sm" defaultValue="10" />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Attachments and word count">
              <SettingField label="Maximum attachment size" help="Maximum file size for forum attachments">
                <select className="form-control text-sm" defaultValue="512000">
                  <option value="0">Upload not allowed</option>
                  <option value="512000">500 KB</option>
                  <option value="1048576">1 MB</option>
                  <option value="2097152">2 MB</option>
                  <option value="5242880">5 MB</option>
                  <option value="10485760">10 MB</option>
                  <option value="20971520">20 MB</option>
                </select>
              </SettingField>
              <SettingField label="Maximum number of attachments" help="Maximum number of attachments per post">
                <select className="form-control text-sm" defaultValue="9">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="9">9</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </SettingField>
              <SettingField label="Display word count" help="Display the word count of each post">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="RSS">
              <SettingField label="Enable RSS feeds" help="Allows forums to generate RSS feeds of discussions and posts">
                <select className="form-control text-sm" defaultValue="0">
                  <option value="0">Disabled</option>
                  <option value="1">Enabled</option>
                </select>
              </SettingField>
              <SettingField label="Number of RSS recent articles" help="Number of articles to include in the RSS feed">
                <select className="form-control text-sm" defaultValue="5">
                  <option value="0">None</option>
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Post settings" defaultOpen={false}>
              <SettingField label="Allow editing of posts" help="Time period in which posts may be edited after posting">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="30" />
                  <span className="text-sm text-[var(--text-muted)]">minutes</span>
                </div>
              </SettingField>
              <SettingField label="Forum post threshold for blocking" help="Maximum number of posts within the given time period before blocking">
                <input type="number" className="form-control text-sm" defaultValue="0" />
                <p className="text-xs text-[var(--text-muted)] mt-1">Set to 0 to disable blocking</p>
              </SettingField>
              <SettingField label="Time period for blocking" help="Students cannot post more than the threshold number in this time period">
                <div className="flex items-center gap-2">
                  <input type="number" className="form-control text-sm w-24" defaultValue="24" />
                  <span className="text-sm text-[var(--text-muted)]">hours</span>
                </div>
              </SettingField>
              <SettingField label="Forum post threshold for warning" help="Number of posts before the student is warned">
                <input type="number" className="form-control text-sm" defaultValue="0" />
                <p className="text-xs text-[var(--text-muted)] mt-1">Set to 0 to disable warning</p>
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
