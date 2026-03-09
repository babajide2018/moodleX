'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

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

const weekDays = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

export default function CalendarSettingsPage() {
  const [weekendDays, setWeekendDays] = useState([0, 6]);

  const toggleWeekend = (day: number) => {
    setWeekendDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <>
      <PageHeader
        title="Calendar"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Calendar' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="General calendar settings">
              <SettingField label="Calendar type" help="Choose the default calendar type for the site. This can be overridden at the course or user level.">
                <select className="form-control text-sm">
                  <option value="gregorian">Gregorian</option>
                  <option value="islamic">Islamic (Hijri)</option>
                  <option value="persian">Persian (Jalali)</option>
                  <option value="coptic">Coptic</option>
                  <option value="ethiopian">Ethiopian</option>
                </select>
              </SettingField>

              <SettingField label="Start of week" help="Which day should be shown as the first day of the week in the calendar.">
                <select className="form-control text-sm">
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="6">Saturday</option>
                </select>
              </SettingField>

              <SettingField label="Weekend days" help="Select which days are considered weekend days. Weekend days are displayed in a different colour in the calendar.">
                <div className="space-y-2">
                  {weekDays.map((day) => (
                    <label key={day.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={weekendDays.includes(day.value)}
                        onChange={() => toggleWeekend(day.value)}
                      />
                      {day.label}
                    </label>
                  ))}
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Display settings" defaultOpen={false}>
              <SettingField label="Time display format" help="Choose between 12-hour and 24-hour time display in the calendar.">
                <select className="form-control text-sm">
                  <option value="0">12-hour (AM/PM)</option>
                  <option value="1">24-hour</option>
                </select>
              </SettingField>

              <SettingField label="Upcoming events look-ahead" help="Number of days in advance to look for upcoming events.">
                <input type="number" className="form-control text-sm w-24" defaultValue={21} min={1} max={365} />
                <p className="text-xs text-[var(--text-muted)] mt-1">days</p>
              </SettingField>

              <SettingField label="Maximum upcoming events" help="Maximum number of upcoming events to display in the upcoming events block.">
                <input type="number" className="form-control text-sm w-24" defaultValue={10} min={1} max={50} />
              </SettingField>
            </SettingsSection>

            <SettingsSection title="Export settings" defaultOpen={false}>
              <SettingField label="Enable calendar export" help="Allow users to export their calendar to external applications.">
                <select className="form-control text-sm">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </SettingField>

              <SettingField label="Days to look ahead" help="Default number of days in the future to include in the calendar export.">
                <input type="number" className="form-control text-sm w-24" defaultValue={365} min={1} max={3650} />
                <p className="text-xs text-[var(--text-muted)] mt-1">days</p>
              </SettingField>

              <SettingField label="Days to look back" help="Default number of days in the past to include in the calendar export.">
                <input type="number" className="form-control text-sm w-24" defaultValue={5} min={0} max={365} />
                <p className="text-xs text-[var(--text-muted)] mt-1">days</p>
              </SettingField>

              <SettingField label="Calendar export salt" help="A random text string used to enhance security of authentication tokens for calendar export. Changing this will invalidate all existing tokens.">
                <input type="text" className="form-control text-sm font-mono" defaultValue="auto-generated-salt" />
              </SettingField>
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
