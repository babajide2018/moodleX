'use client';

import { PanelLeft, PanelRight } from 'lucide-react';
import { useDrawerStore } from '@/store/drawer';

export default function DrawerToggles() {
  const { leftOpen, rightOpen, toggleLeft, toggleRight } = useDrawerStore();

  return (
    <div className="flex items-center justify-between px-3 pt-2">
      <button
        className={`flex items-center justify-center w-8 h-8 rounded transition-colors border-none cursor-pointer ${
          leftOpen
            ? 'bg-[var(--moodle-primary-light)] text-[var(--moodle-primary)]'
            : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
        }`}
        onClick={toggleLeft}
        aria-label={leftOpen ? 'Close course index' : 'Open course index'}
        title={leftOpen ? 'Close course index' : 'Open course index'}
      >
        <PanelLeft size={18} />
      </button>

      <button
        className={`flex items-center justify-center w-8 h-8 rounded transition-colors border-none cursor-pointer ${
          rightOpen
            ? 'bg-[var(--moodle-primary-light)] text-[var(--moodle-primary)]'
            : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
        }`}
        onClick={toggleRight}
        aria-label={rightOpen ? 'Close block drawer' : 'Open block drawer'}
        title={rightOpen ? 'Close block drawer' : 'Open block drawer'}
      >
        <PanelRight size={18} />
      </button>
    </div>
  );
}
