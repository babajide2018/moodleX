'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import {
  Save,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Palette,
  Image,
  Code2,
  Navigation,
  LayoutDashboard,
  CheckCircle2,
  Upload,
  Monitor,
} from 'lucide-react';
import { adminTabs } from '@/lib/admin-tabs';

interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function SettingsSection({ title, icon, defaultOpen = false, children }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border-color)] rounded-lg">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-left bg-[var(--bg-light)] hover:bg-[var(--bg-hover)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="text-[var(--text-muted)]">{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-[var(--border-color)]">
          {children}
        </div>
      )}
    </div>
  );
}

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

const themes = [
  {
    id: 'boost',
    name: 'Boost',
    description: 'A modern, clean theme designed with usability and accessibility in mind. This is the default Moodle theme.',
    version: '4.5',
    author: 'Moodle HQ',
    primary: '#0f6cbf',
    secondary: '#ced4da',
    accent: '#f0ad4e',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'The Classic theme brings back the traditional Moodle look with a three-column layout and familiar navigation.',
    version: '4.5',
    author: 'Moodle HQ',
    primary: '#0f6cbf',
    secondary: '#e0e0e0',
    accent: '#5bc0de',
  },
];

const dashboardBlocks = [
  { id: 'timeline', name: 'Timeline', enabled: true, region: 'right' },
  { id: 'calendar', name: 'Calendar', enabled: true, region: 'right' },
  { id: 'private_files', name: 'Private files', enabled: false, region: 'right' },
  { id: 'online_users', name: 'Online users', enabled: true, region: 'right' },
  { id: 'recent_courses', name: 'Recently accessed courses', enabled: true, region: 'content' },
  { id: 'starred_courses', name: 'Starred courses', enabled: true, region: 'content' },
  { id: 'badges', name: 'Latest badges', enabled: false, region: 'right' },
  { id: 'comments', name: 'Comments', enabled: false, region: 'right' },
];

export default function AdminAppearancePage() {
  const [selectedTheme, setSelectedTheme] = useState('boost');
  const [customCSS, setCustomCSS] = useState('');
  const [defaultHomePage, setDefaultHomePage] = useState('dashboard');
  const [navShowFullName, setNavShowFullName] = useState(true);
  const [navShowCourseCategories, setNavShowCourseCategories] = useState(true);
  const [navCourseLimit, setNavCourseLimit] = useState('10');
  const [colorPrimary, setColorPrimary] = useState('#0f6cbf');
  const [colorSuccess, setColorSuccess] = useState('#357a32');
  const [colorInfo, setColorInfo] = useState('#008196');
  const [colorWarning, setColorWarning] = useState('#f0ad4e');
  const [colorDanger, setColorDanger] = useState('#ca3120');
  const [blocks, setBlocks] = useState(dashboardBlocks);

  const toggleBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  return (
    <>
      <PageHeader
        title="Appearance settings"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main" className="max-w-4xl">
          <div className="space-y-4">
            {/* Theme selector */}
            <SettingsSection title="Theme selector" icon={<Palette size={16} />} defaultOpen={true}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Choose the theme for your Moodle site. The theme controls the overall look and feel.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`text-left border-2 rounded-lg overflow-hidden transition-colors ${
                      selectedTheme === theme.id
                        ? 'border-[var(--moodle-primary)] ring-2 ring-[var(--moodle-primary)]/20'
                        : 'border-[var(--border-color)] hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    {/* Theme preview */}
                    <div className="h-32 relative" style={{ backgroundColor: theme.primary }}>
                      <div className="absolute inset-x-0 top-0 h-8 flex items-center px-3 gap-2" style={{ backgroundColor: theme.primary }}>
                        <div className="w-3 h-3 bg-white/40 rounded" />
                        <div className="w-16 h-2 bg-white/30 rounded" />
                        <div className="flex-1" />
                        <div className="w-6 h-6 bg-white/20 rounded-full" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-[88px] bg-white flex">
                        <div className="w-16 bg-gray-100 border-r border-gray-200" />
                        <div className="flex-1 p-2">
                          <div className="w-full h-3 bg-gray-200 rounded mb-1.5" />
                          <div className="w-3/4 h-3 bg-gray-100 rounded mb-1.5" />
                          <div className="w-1/2 h-3 bg-gray-100 rounded" />
                        </div>
                        <div className="w-14 bg-gray-50 border-l border-gray-200" />
                      </div>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 size={20} className="text-white drop-shadow" />
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{theme.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">v{theme.version}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{theme.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </SettingsSection>

            {/* Logo */}
            <SettingsSection title="Logo and images" icon={<Image size={16} />}>
              <SettingField label="Logo" help="The logo is displayed in the header. Recommended size: 200x50px">
                <div className="flex items-center gap-3">
                  <div className="w-48 h-12 border-2 border-dashed border-[var(--border-color)] rounded flex items-center justify-center text-[var(--text-muted)]">
                    <Upload size={16} className="mr-2" /> Upload logo
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">PNG, JPG, SVG (max 2MB)</span>
                </div>
              </SettingField>
              <SettingField label="Compact logo" help="Small logo used in the navigation bar. Recommended: 50x50px">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 border-2 border-dashed border-[var(--border-color)] rounded flex items-center justify-center text-[var(--text-muted)]">
                    <Upload size={14} />
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">Square image (max 1MB)</span>
                </div>
              </SettingField>
              <SettingField label="Favicon" help="The favicon appears in browser tabs. Must be an .ico or .png file">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-dashed border-[var(--border-color)] rounded flex items-center justify-center text-[var(--text-muted)]">
                    <Upload size={12} />
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">ICO or PNG, 16x16 or 32x32</span>
                </div>
              </SettingField>
              <SettingField label="Login page background" help="Background image for the login page">
                <div className="flex items-center gap-3">
                  <div className="w-48 h-20 border-2 border-dashed border-[var(--border-color)] rounded flex items-center justify-center text-[var(--text-muted)]">
                    <Upload size={16} className="mr-2" /> Upload image
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">Recommended: 1920x1080px</span>
                </div>
              </SettingField>
            </SettingsSection>

            {/* Color scheme */}
            <SettingsSection title="Colour scheme" icon={<Palette size={16} />}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Customise the colour scheme used by the current theme.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Brand colour (Primary)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer"
                      value={colorPrimary}
                      onChange={(e) => setColorPrimary(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control w-28 text-sm font-mono"
                      value={colorPrimary}
                      onChange={(e) => setColorPrimary(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Success colour</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer"
                      value={colorSuccess}
                      onChange={(e) => setColorSuccess(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control w-28 text-sm font-mono"
                      value={colorSuccess}
                      onChange={(e) => setColorSuccess(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Info colour</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer"
                      value={colorInfo}
                      onChange={(e) => setColorInfo(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control w-28 text-sm font-mono"
                      value={colorInfo}
                      onChange={(e) => setColorInfo(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Warning colour</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer"
                      value={colorWarning}
                      onChange={(e) => setColorWarning(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control w-28 text-sm font-mono"
                      value={colorWarning}
                      onChange={(e) => setColorWarning(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Danger colour</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer"
                      value={colorDanger}
                      onChange={(e) => setColorDanger(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control w-28 text-sm font-mono"
                      value={colorDanger}
                      onChange={(e) => setColorDanger(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Custom CSS */}
            <SettingsSection title="Custom CSS" icon={<Code2 size={16} />}>
              <p className="text-sm text-[var(--text-muted)] mb-2">
                Add custom CSS rules that will be applied across the entire site. Use with caution.
              </p>
              <textarea
                className="form-control font-mono text-xs min-h-[200px]"
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder={`/* Custom CSS */\n\n/* Example: Change the navbar background */\n/* .navbar { background-color: #1a1a2e; } */`}
                spellCheck={false}
              />
            </SettingsSection>

            {/* Navigation settings */}
            <SettingsSection title="Navigation settings" icon={<Navigation size={16} />}>
              <SettingField label="Default home page" help="The page shown when users click the home link">
                <select
                  className="form-control w-48"
                  value={defaultHomePage}
                  onChange={(e) => setDefaultHomePage(e.target.value)}
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="home">Site home</option>
                  <option value="mycourses">My courses</option>
                </select>
              </SettingField>
              <SettingField label="Show full user name" help="Display the user full name in the navigation bar">
                <select
                  className="form-control w-32"
                  value={navShowFullName ? 'yes' : 'no'}
                  onChange={(e) => setNavShowFullName(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              <SettingField label="Show course categories" help="Show category names in the navigation">
                <select
                  className="form-control w-32"
                  value={navShowCourseCategories ? 'yes' : 'no'}
                  onChange={(e) => setNavShowCourseCategories(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </SettingField>
              <SettingField label="Course limit" help="Maximum number of courses to show in the navigation drawer">
                <input
                  type="number"
                  className="form-control w-24"
                  value={navCourseLimit}
                  onChange={(e) => setNavCourseLimit(e.target.value)}
                  min={1}
                  max={50}
                />
              </SettingField>
            </SettingsSection>

            {/* Dashboard default blocks */}
            <SettingsSection title="Default Dashboard blocks" icon={<LayoutDashboard size={16} />}>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Configure which blocks appear by default on users&apos; Dashboard pages.
              </p>
              <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                      <th className="py-2 px-3 text-left font-semibold">Block</th>
                      <th className="py-2 px-3 text-left font-semibold">Region</th>
                      <th className="py-2 px-3 text-left font-semibold">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocks.map((block) => (
                      <tr key={block.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)]">
                        <td className="py-2 px-3 font-medium">{block.name}</td>
                        <td className="py-2 px-3">
                          <span className="text-xs capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {block.region}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={block.enabled}
                            onChange={() => toggleBlock(block.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SettingsSection>

            {/* Save */}
            <div className="flex items-center gap-3 py-4 border-t border-[var(--border-color)]">
              <button className="btn btn-primary flex items-center gap-2">
                <Save size={16} /> Save changes
              </button>
              <Link href="/admin" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
