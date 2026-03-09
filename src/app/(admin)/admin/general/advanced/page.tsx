'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Save,
  RotateCcw,
} from 'lucide-react';

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

interface FeatureToggle {
  key: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

const features: { section: string; items: FeatureToggle[] }[] = [
  {
    section: 'Achievements & competencies',
    items: [
      {
        key: 'badges',
        label: 'Enable badges',
        description:
          'Badges allow you to recognize student achievements. Students can display badges on their profile and share them externally via Mozilla Open Badges backpack.',
        defaultValue: true,
      },
      {
        key: 'competencies',
        label: 'Enable competencies',
        description:
          'Competency frameworks allow you to define learning outcomes and track student progress against them across courses and activities.',
        defaultValue: true,
      },
    ],
  },
  {
    section: 'Analytics & tracking',
    items: [
      {
        key: 'analytics',
        label: 'Enable analytics',
        description:
          'Analytics uses machine learning models to predict students at risk of not completing a course, enabling early intervention by teachers.',
        defaultValue: true,
      },
      {
        key: 'statistics',
        label: 'Enable statistics',
        description:
          'Enable processing of site-wide statistics. These provide information about user activity, logins, and course participation over time.',
        defaultValue: false,
      },
      {
        key: 'completion',
        label: 'Enable completion tracking',
        description:
          'Activity completion allows teachers to set completion conditions for activities and resources, and students to track their own progress.',
        defaultValue: true,
      },
      {
        key: 'conditional',
        label: 'Enable conditional access',
        description:
          'Restrict access to activities and resources based on conditions such as date, grade, activity completion, or user profile fields.',
        defaultValue: true,
      },
    ],
  },
  {
    section: 'Social & communication',
    items: [
      {
        key: 'comments',
        label: 'Enable comments',
        description:
          'Allow users to add comments to glossary entries, database entries, blog posts, and other content across the site.',
        defaultValue: true,
      },
      {
        key: 'tags',
        label: 'Enable tags',
        description:
          'Tags allow users to categorize and label content such as courses, blog posts, and user interests to improve discoverability.',
        defaultValue: true,
      },
      {
        key: 'notes',
        label: 'Enable notes',
        description:
          'Notes allow teachers to attach personal, course, or site-level notes about students, visible to other teachers or only to themselves.',
        defaultValue: true,
      },
      {
        key: 'blogs',
        label: 'Enable blogs',
        description:
          'Allow users to maintain personal blogs. Blog entries can be associated with courses and shared with specific groups or the entire site.',
        defaultValue: true,
      },
      {
        key: 'messaging',
        label: 'Enable messaging',
        description:
          'Allow users to send private messages to each other. Messages can include text and links, with notification preferences configurable per user.',
        defaultValue: true,
      },
    ],
  },
  {
    section: 'Content & integration',
    items: [
      {
        key: 'rss',
        label: 'Enable RSS feeds',
        description:
          'Allow RSS feed generation for forums, glossaries, databases, and other activities. Users can subscribe to feeds in their preferred reader.',
        defaultValue: false,
      },
      {
        key: 'plagiarism',
        label: 'Enable plagiarism plugins',
        description:
          'Allow integration with plagiarism detection services such as Turnitin or Urkund. Requires a compatible plagiarism plugin to be installed.',
        defaultValue: false,
      },
      {
        key: 'webservices',
        label: 'Enable web services',
        description:
          'Web services allow external systems to interact with Moodle via REST, SOAP, or XML-RPC protocols. Required for the mobile app and LTI integrations.',
        defaultValue: true,
      },
    ],
  },
];

export default function AdvancedFeaturesPage() {
  const [featureState, setFeatureState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    features.forEach((section) => {
      section.items.forEach((item) => {
        initial[item.key] = item.defaultValue;
      });
    });
    return initial;
  });

  const toggleFeature = (key: string) => {
    setFeatureState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Advanced features settings saved successfully.');
  };

  const handleReset = () => {
    const defaults: Record<string, boolean> = {};
    features.forEach((section) => {
      section.items.forEach((item) => {
        defaults[item.key] = item.defaultValue;
      });
    });
    setFeatureState(defaults);
  };

  const enabledCount = Object.values(featureState).filter(Boolean).length;
  const totalCount = Object.keys(featureState).length;

  return (
    <>
      <PageHeader
        title="Advanced features"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'General', href: '/admin' },
          { label: 'Advanced features' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {/* Summary */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">
              {enabledCount} of {totalCount} features enabled
            </span>
            <div className="flex-1 max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--moodle-primary)] rounded-full transition-all"
                style={{ width: `${(enabledCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="space-y-4">
              {features.map((section) => (
                <SettingsSection key={section.section} title={section.section}>
                  {section.items.map((item) => (
                    <SettingField key={item.key} label={item.label} help={item.description}>
                      <div className="flex flex-col gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={featureState[item.key]}
                            onChange={() => toggleFeature(item.key)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--moodle-primary)]" />
                          <span className="ml-3 text-sm">
                            {featureState[item.key] ? (
                              <span className="text-green-600 font-medium">Enabled</span>
                            ) : (
                              <span className="text-[var(--text-muted)]">Disabled</span>
                            )}
                          </span>
                        </label>
                        <p className="text-xs text-[var(--text-muted)] max-w-xl">
                          {item.description}
                        </p>
                      </div>
                    </SettingField>
                  ))}
                </SettingsSection>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button type="submit" className="btn btn-primary text-sm flex items-center gap-2">
                <Save size={16} /> Save changes
              </button>
              <button
                type="button"
                className="btn btn-secondary text-sm flex items-center gap-2"
                onClick={handleReset}
              >
                <RotateCcw size={14} /> Reset to defaults
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
