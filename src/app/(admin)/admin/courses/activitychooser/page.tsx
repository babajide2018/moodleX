'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { HelpCircle, ChevronDown, ChevronRight, Star, GripVertical } from 'lucide-react';

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

interface Activity {
  name: string;
  type: 'activity' | 'resource';
  recommended: boolean;
}

const defaultActivities: Activity[] = [
  { name: 'Assignment', type: 'activity', recommended: true },
  { name: 'Chat', type: 'activity', recommended: false },
  { name: 'Choice', type: 'activity', recommended: false },
  { name: 'Database', type: 'activity', recommended: false },
  { name: 'External tool', type: 'activity', recommended: false },
  { name: 'Feedback', type: 'activity', recommended: false },
  { name: 'Forum', type: 'activity', recommended: true },
  { name: 'Glossary', type: 'activity', recommended: false },
  { name: 'H5P', type: 'activity', recommended: false },
  { name: 'Lesson', type: 'activity', recommended: false },
  { name: 'Quiz', type: 'activity', recommended: true },
  { name: 'SCORM package', type: 'activity', recommended: false },
  { name: 'Survey', type: 'activity', recommended: false },
  { name: 'Wiki', type: 'activity', recommended: false },
  { name: 'Workshop', type: 'activity', recommended: false },
  { name: 'Book', type: 'resource', recommended: false },
  { name: 'File', type: 'resource', recommended: true },
  { name: 'Folder', type: 'resource', recommended: false },
  { name: 'IMS content package', type: 'resource', recommended: false },
  { name: 'Label', type: 'resource', recommended: false },
  { name: 'Page', type: 'resource', recommended: true },
  { name: 'URL', type: 'resource', recommended: true },
];

export default function ActivityChooserPage() {
  const [activities, setActivities] = useState(defaultActivities);

  const toggleRecommended = (index: number) => {
    setActivities((prev) =>
      prev.map((a, i) => (i === index ? { ...a, recommended: !a.recommended } : a))
    );
  };

  const recommendedCount = activities.filter((a) => a.recommended).length;

  return (
    <>
      <PageHeader
        title="Activity chooser"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Courses', href: '/admin/courses' },
          { label: 'Activity chooser' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <form className="max-w-3xl space-y-4">
            <SettingsSection title="Activity chooser settings">
              <SettingField label="Tabs to display" help="Select which tabs are visible in the activity chooser. The activity chooser appears when teachers add activities or resources to a course.">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> All
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Activities
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Resources
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Recommended
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4" /> Starred
                  </label>
                </div>
              </SettingField>
            </SettingsSection>

            <SettingsSection title={`Recommended activities (${recommendedCount})`}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Recommended activities and resources appear first in the activity chooser. Click the star icon to toggle the recommended status.
              </p>

              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold w-8"></th>
                      <th className="py-2 px-3 text-left font-semibold">Activity / Resource</th>
                      <th className="py-2 px-3 text-left font-semibold">Type</th>
                      <th className="py-2 px-3 text-center font-semibold">Recommended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity, index) => (
                      <tr key={activity.name} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3">
                          <GripVertical size={14} className="text-[var(--text-muted)] cursor-move" />
                        </td>
                        <td className="py-2 px-3 font-medium">{activity.name}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded ${
                            activity.type === 'activity'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {activity.type === 'activity' ? 'Activity' : 'Resource'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleRecommended(index)}
                            className="inline-flex items-center justify-center"
                            title={activity.recommended ? 'Remove from recommended' : 'Add to recommended'}
                          >
                            <Star
                              size={18}
                              className={activity.recommended ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-muted)]'}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
