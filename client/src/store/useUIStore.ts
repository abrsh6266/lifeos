import { create } from "zustand";

interface UIState {
  selectedDate: string;
  sidebarOpen: boolean;
  setSelectedDate: (date: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const todayStr = () => new Date().toISOString().split("T")[0];

export const useUIStore = create<UIState>((set) => ({
  selectedDate: todayStr(),
  sidebarOpen: true,
  setSelectedDate: (date) => set({ selectedDate: date }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
