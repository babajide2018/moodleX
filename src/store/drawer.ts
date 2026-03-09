import { create } from 'zustand';

interface DrawerState {
  leftOpen: boolean;
  rightOpen: boolean;
  mobileMenuOpen: boolean;
  editMode: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleMobileMenu: () => void;
  setLeftOpen: (open: boolean) => void;
  setRightOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setEditMode: (on: boolean) => void;
  toggleEditMode: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  leftOpen: true,
  rightOpen: false,
  mobileMenuOpen: false,
  editMode: false,
  toggleLeft: () => set((state) => ({ leftOpen: !state.leftOpen })),
  toggleRight: () => set((state) => ({ rightOpen: !state.rightOpen })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setLeftOpen: (open) => set({ leftOpen: open }),
  setRightOpen: (open) => set({ rightOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setEditMode: (on) => set({ editMode: on }),
  toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
}));
