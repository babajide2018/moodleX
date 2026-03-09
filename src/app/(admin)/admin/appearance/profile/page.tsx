'use client';

import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import { adminTabs } from '@/lib/admin-tabs';
import { GripVertical, Plus, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface Block {
  id: string;
  name: string;
  region: 'content' | 'side-pre';
  visible: boolean;
}

const defaultBlocks: Block[] = [
  { id: '1', name: 'Course overview', region: 'content', visible: true },
  { id: '2', name: 'Login activity', region: 'content', visible: true },
  { id: '3', name: 'Online users', region: 'side-pre', visible: true },
  { id: '4', name: 'Latest badges', region: 'side-pre', visible: true },
  { id: '5', name: 'Calendar', region: 'side-pre', visible: true },
  { id: '6', name: 'Blog entries', region: 'content', visible: false },
];

const availableBlocks = [
  'Activity results',
  'Blog menu',
  'Blog tags',
  'Comments',
  'Course completion status',
  'Flickr',
  'Global search',
  'HTML',
  'Latest announcements',
  'Logged in user',
  'Mentees',
  'Navigation',
  'Private files',
  'RSS feeds',
  'Recent activity',
  'Remote RSS feeds',
  'Search forums',
  'Section links',
  'Self completion',
  'Tags',
  'Timeline',
  'Upcoming events',
];

function BlockItem({
  block,
  onToggleVisibility,
  onRemove,
}: {
  block: Block;
  onToggleVisibility: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-lg bg-white group ${
        !block.visible ? 'opacity-50' : ''
      }`}
    >
      <GripVertical size={16} className="text-[var(--text-muted)] cursor-grab flex-shrink-0" />
      <span className="text-sm flex-1">{block.name}</span>
      <span className="text-xs text-[var(--text-muted)] px-2 py-0.5 bg-[var(--bg-light)] rounded">
        {block.region === 'content' ? 'Main' : 'Side'}
      </span>
      <button
        type="button"
        className="btn btn-icon p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onToggleVisibility}
        title={block.visible ? 'Hide block' : 'Show block'}
      >
        {block.visible ? <Eye size={14} /> : <EyeOff size={14} />}
      </button>
      <button
        type="button"
        className="btn btn-icon p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
        title="Remove block"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function ProfileSettingsPage() {
  const [blocks, setBlocks] = useState<Block[]>(defaultBlocks);
  const [showAddBlock, setShowAddBlock] = useState(false);

  const toggleVisibility = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const addBlock = (name: string) => {
    setBlocks((prev) => [
      ...prev,
      { id: Date.now().toString(), name, region: 'side-pre', visible: true },
    ]);
    setShowAddBlock(false);
  };

  const resetToDefaults = () => {
    setBlocks(defaultBlocks);
  };

  const contentBlocks = blocks.filter((b) => b.region === 'content');
  const sideBlocks = blocks.filter((b) => b.region === 'side-pre');

  return (
    <>
      <PageHeader
        title="Default profile page"
        breadcrumbs={[
          { label: 'Site administration', href: '/admin' },
          { label: 'Appearance', href: '/admin/appearance' },
          { label: 'Default profile page' },
        ]}
      />

      <SecondaryNavigation tabs={adminTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Configure the default blocks and layout for user profile pages. This layout defines which blocks are shown on all user profile pages. Users with the appropriate permission may customise their own profile page.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              className="btn btn-primary text-sm flex items-center gap-1"
              onClick={() => setShowAddBlock(true)}
            >
              <Plus size={14} /> Add a block
            </button>
            <button
              type="button"
              className="btn btn-icon text-sm flex items-center gap-1"
              onClick={resetToDefaults}
            >
              <RotateCcw size={14} /> Reset profile page for all users
            </button>
          </div>

          {showAddBlock && (
            <div className="mb-6 p-4 border border-[var(--border-color)] rounded-lg bg-white max-w-md">
              <h3 className="text-sm font-semibold mb-3">Add a block</h3>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {availableBlocks.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="w-full text-left text-sm px-3 py-2 rounded hover:bg-[var(--bg-hover)] text-[var(--text-link)] transition-colors"
                    onClick={() => addBlock(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="mt-3 text-sm text-[var(--text-muted)] hover:underline"
                onClick={() => setShowAddBlock(false)}
              >
                Cancel
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Main content area */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wide">
                Main content area
              </h3>
              <div className="space-y-2">
                {contentBlocks.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] italic p-4 border border-dashed border-[var(--border-color)] rounded-lg text-center">
                    No blocks in the main content area
                  </p>
                ) : (
                  contentBlocks.map((block) => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      onToggleVisibility={() => toggleVisibility(block.id)}
                      onRemove={() => removeBlock(block.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Side blocks */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wide">
                Side blocks
              </h3>
              <div className="space-y-2">
                {sideBlocks.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] italic p-4 border border-dashed border-[var(--border-color)] rounded-lg text-center">
                    No side blocks
                  </p>
                ) : (
                  sideBlocks.map((block) => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      onToggleVisibility={() => toggleVisibility(block.id)}
                      onRemove={() => removeBlock(block.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button type="button" className="btn btn-primary text-sm">Save changes</button>
          </div>
        </div>
      </div>
    </>
  );
}
