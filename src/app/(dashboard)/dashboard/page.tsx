'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical, Eye, EyeOff, Plus, ChevronDown, Trash2, X } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import SecondaryNavigation from '@/components/layout/SecondaryNavigation';
import CourseOverview from '@/components/dashboard/CourseOverview';
import RecentlyAccessedCourses from '@/components/dashboard/RecentlyAccessedCourses';
import Timeline from '@/components/dashboard/Timeline';
import CalendarBlock from '@/components/dashboard/CalendarBlock';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import OnlineUsers from '@/components/dashboard/OnlineUsers';
import LatestBadges from '@/components/dashboard/LatestBadges';
import StarredCourses from '@/components/dashboard/StarredCourses';
import LearningPlans from '@/components/dashboard/LearningPlans';
import PrivateFiles from '@/components/dashboard/PrivateFiles';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Comments from '@/components/dashboard/Comments';
import HtmlBlock from '@/components/dashboard/HtmlBlock';
import { useDrawerStore } from '@/store/drawer';

const dashboardTabs = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'mycourses', label: 'My courses', href: '/my/courses' },
];

interface DashboardBlock {
  id: string;
  title: string;
  visible: boolean;
  component: React.ComponentType;
}

// Blocks shown by default on the dashboard
const defaultBlocks: DashboardBlock[] = [
  { id: 'timeline', title: 'Timeline', visible: true, component: Timeline },
  { id: 'recentcourses', title: 'Recently accessed courses', visible: true, component: RecentlyAccessedCourses },
  { id: 'courseoverview', title: 'Course overview', visible: true, component: CourseOverview },
];

// All available blocks that can be added
const allAvailableBlocks: { id: string; title: string; component: React.ComponentType }[] = [
  { id: 'timeline', title: 'Timeline', component: Timeline },
  { id: 'recentcourses', title: 'Recently accessed courses', component: RecentlyAccessedCourses },
  { id: 'courseoverview', title: 'Course overview', component: CourseOverview },
  { id: 'calendar', title: 'Calendar', component: CalendarBlock },
  { id: 'upcomingevents', title: 'Upcoming events', component: UpcomingEvents },
  { id: 'onlineusers', title: 'Online users', component: OnlineUsers },
  { id: 'latestbadges', title: 'Latest badges', component: LatestBadges },
  { id: 'starredcourses', title: 'Starred courses', component: StarredCourses },
  { id: 'learningplans', title: 'Learning plans', component: LearningPlans },
  { id: 'privatefiles', title: 'Private files', component: PrivateFiles },
  { id: 'recentactivity', title: 'Recent activity', component: RecentActivity },
  { id: 'comments', title: 'Comments', component: Comments },
  { id: 'htmlblock', title: 'Text', component: HtmlBlock },
];

export default function DashboardPage() {
  const { editMode } = useDrawerStore();
  const [blocks, setBlocks] = useState<DashboardBlock[]>(defaultBlocks);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const addBlockRef = useRef<HTMLDivElement>(null);

  // Close add block dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addBlockRef.current && !addBlockRef.current.contains(event.target as Node)) {
        setShowAddBlock(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleBlockVisibility = useCallback((blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, visible: !b.visible } : b))
    );
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }, []);

  const addBlock = useCallback((blockDef: { id: string; title: string; component: React.ComponentType }) => {
    setBlocks((prev) => [...prev, { ...blockDef, visible: true }]);
    setShowAddBlock(false);
  }, []);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      moveBlock(dragIndex, index);
      setDragIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // Blocks not yet added to the dashboard
  const addableBlocks = allAvailableBlocks.filter(
    (ab) => !blocks.some((b) => b.id === ab.id)
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: 'Dashboard' }]}
        actions={
          editMode ? (
            <button
              className="btn btn-outline-secondary text-sm"
              onClick={() => setShowAddBlock(!showAddBlock)}
            >
              Customise this page
            </button>
          ) : undefined
        }
      />

      <SecondaryNavigation tabs={dashboardTabs} />

      <div id="page-content" className="p-4">
        <div id="region-main">
          {editMode && (
            <div className="mb-4 flex items-center justify-between gap-3 p-3 bg-[var(--bg-light)] border border-[var(--border-color)] rounded-lg">
              <p className="text-sm text-[var(--text-secondary)] m-0">
                Drag blocks to reorder. Use the eye icon to show or hide blocks.
              </p>
              <div className="relative" ref={addBlockRef}>
                <button
                  className="btn btn-outline-secondary text-sm flex items-center gap-1"
                  onClick={() => setShowAddBlock(!showAddBlock)}
                >
                  <Plus size={14} />
                  Add a block
                  <ChevronDown size={12} />
                </button>
                {showAddBlock && (
                  <div
                    className="absolute right-0 mt-1 w-64 bg-white border border-[var(--border-color)] rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 bg-[var(--bg-light)] border-b border-[var(--border-color)] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-secondary)]">Add a block</span>
                      <button
                        className="p-0.5 hover:bg-[var(--bg-hover)] rounded border-none bg-transparent cursor-pointer"
                        onClick={() => setShowAddBlock(false)}
                      >
                        <X size={14} className="text-[var(--text-muted)]" />
                      </button>
                    </div>
                    {addableBlocks.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto">
                        {addableBlocks.map((block) => (
                          <button
                            key={block.id}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-light)] border-none bg-transparent cursor-pointer text-[var(--text-primary)] border-b border-[var(--border-color)] last:border-b-0"
                            onClick={() => addBlock(block)}
                          >
                            {block.title}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-3 text-xs text-[var(--text-muted)] text-center">
                        All available blocks are already added
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {blocks.map((block, index) => {
            if (!block.visible && !editMode) return null;

            const BlockComponent = block.component;

            return (
              <div
                key={block.id}
                draggable={editMode}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`${!block.visible ? 'opacity-50' : ''} ${
                  dragIndex === index ? 'opacity-60 scale-[1.02]' : ''
                } transition-all`}
              >
                {editMode ? (
                  <div className="border-2 border-dashed border-[var(--moodle-primary)] rounded-lg mb-3 overflow-hidden bg-white shadow-sm">
                    {/* Block edit header - always visible in edit mode */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#e7f1fa] border-b border-[var(--moodle-primary)]/30">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-[var(--moodle-primary)]/10 cursor-grab active:cursor-grabbing rounded border-none bg-transparent"
                          title="Drag to reorder"
                        >
                          <GripVertical size={16} className="text-[var(--moodle-primary)]" />
                        </button>
                        <span className="text-sm font-semibold text-[var(--moodle-primary)]">
                          {block.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <button
                            className="p-1.5 hover:bg-[var(--moodle-primary)]/10 rounded border-none bg-transparent cursor-pointer"
                            onClick={() => moveBlock(index, index - 1)}
                            title="Move up"
                          >
                            <ChevronDown size={16} className="text-[var(--text-secondary)] rotate-180" />
                          </button>
                        )}
                        {index < blocks.length - 1 && (
                          <button
                            className="p-1.5 hover:bg-[var(--moodle-primary)]/10 rounded border-none bg-transparent cursor-pointer"
                            onClick={() => moveBlock(index, index + 1)}
                            title="Move down"
                          >
                            <ChevronDown size={16} className="text-[var(--text-secondary)]" />
                          </button>
                        )}
                        <button
                          className="p-1.5 hover:bg-[var(--moodle-primary)]/10 rounded border-none bg-transparent cursor-pointer"
                          onClick={() => toggleBlockVisibility(block.id)}
                          title={block.visible ? 'Hide block' : 'Show block'}
                        >
                          {block.visible ? (
                            <Eye size={16} className="text-[var(--text-secondary)]" />
                          ) : (
                            <EyeOff size={16} className="text-[var(--text-secondary)]" />
                          )}
                        </button>
                        <button
                          className="p-1.5 hover:bg-red-50 rounded border-none bg-transparent cursor-pointer"
                          onClick={() => removeBlock(block.id)}
                          title="Delete block"
                        >
                          <Trash2 size={16} className="text-[var(--moodle-danger)]" />
                        </button>
                      </div>
                    </div>
                    <div className={!block.visible ? 'pointer-events-none' : ''}>
                      <BlockComponent />
                    </div>
                  </div>
                ) : (
                  <BlockComponent />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
