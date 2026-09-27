import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppMode, SavedItem, ChecklistItem } from '../types';

interface DemoJourneyState {
  active: boolean;
  currentStep: number; // 0–7 (maps to demoScenario stages index)
  completedSteps: number[];
}

interface AppState {
  // ── Mode ───────────────────────────────────────────────────────────────────
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // ── Saved Items ────────────────────────────────────────────────────────────
  savedItems: SavedItem[];
  saveItem: (item: Omit<SavedItem, 'id' | 'savedAt'>) => void;
  removeSavedItem: (id: string) => void;
  isItemSaved: (referenceId: string) => boolean;

  // ── Checklist ──────────────────────────────────────────────────────────────
  checklist: ChecklistItem[];
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'done'>) => void;
  toggleChecklistItem: (id: string) => void;
  removeChecklistItem: (id: string) => void;

  // ── Demo Journey ───────────────────────────────────────────────────────────
  demoJourney: DemoJourneyState;
  startDemoJourney: () => void;
  advanceDemoStep: () => void;
  resetDemoJourney: () => void;

  // ── Assistant Prefill ──────────────────────────────────────────────────────
  assistantPrefill: string | null;
  setAssistantPrefill: (query: string | null) => void;
}

const nanoid = () => Math.random().toString(36).slice(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Mode ─────────────────────────────────────────────────────────────
      mode: 'industry',
      setMode: (mode) => set({ mode }),

      // ── Saved Items ───────────────────────────────────────────────────────
      savedItems: [],
      saveItem: (item) => {
        if (get().isItemSaved(item.referenceId)) return;
        set((s) => ({
          savedItems: [
            ...s.savedItems,
            { ...item, id: nanoid(), savedAt: new Date().toISOString() },
          ],
        }));
      },
      removeSavedItem: (id) =>
        set((s) => ({ savedItems: s.savedItems.filter((i) => i.id !== id) })),
      isItemSaved: (referenceId) =>
        get().savedItems.some((i) => i.referenceId === referenceId),

      // ── Checklist ─────────────────────────────────────────────────────────
      checklist: [],
      addChecklistItem: (item) =>
        set((s) => ({
          checklist: [...s.checklist, { ...item, id: nanoid(), done: false }],
        })),
      toggleChecklistItem: (id) =>
        set((s) => ({
          checklist: s.checklist.map((i) =>
            i.id === id ? { ...i, done: !i.done } : i
          ),
        })),
      removeChecklistItem: (id) =>
        set((s) => ({ checklist: s.checklist.filter((i) => i.id !== id) })),

      // ── Demo Journey ──────────────────────────────────────────────────────
      demoJourney: { active: false, currentStep: 0, completedSteps: [] },
      startDemoJourney: () =>
        set({ demoJourney: { active: true, currentStep: 0, completedSteps: [] } }),
      advanceDemoStep: () =>
        set((s) => {
          const next = s.demoJourney.currentStep + 1;
          return {
            demoJourney: {
              ...s.demoJourney,
              currentStep: next,
              completedSteps: [...s.demoJourney.completedSteps, s.demoJourney.currentStep],
            },
          };
        }),
      resetDemoJourney: () =>
        set({ demoJourney: { active: false, currentStep: 0, completedSteps: [] } }),

      // ── Assistant Prefill ─────────────────────────────────────────────────
      assistantPrefill: null,
      setAssistantPrefill: (query) => set({ assistantPrefill: query }),
    }),
    {
      name: 'bisense-app-state',
      partialize: (s) => ({
        mode: s.mode,
        savedItems: s.savedItems,
        checklist: s.checklist,
      }),
    }
  )
);
