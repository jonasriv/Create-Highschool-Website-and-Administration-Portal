/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { TestDto } from "./tests/dtoTypes";

type WindowName = "tools" | "tests" | "other";
type PanelName = "chat" | "notes";
type PanelsOpen = Record<PanelName, boolean>;
type MobilePanelName = "chat" | "notes";


type TeacherActions = {
  togglePanel: (name: PanelName) => void;
  openPanel: (name: PanelName) => void;
  closePanel: (name: PanelName) => void;
  setActivePanel: (name: PanelName) => void;
  toggleFeedback: () => void;
  toggleNavbar: () => void;
  hideNavbar: () => void;
  hideFeedback: () => void;
  hideAdminFeedback: () => void;
  toggleDark: () => void;
  toggleAdminFeedback: () => void;
  setMobilePanel: (name: MobilePanelName) => void;
  setWindowOpen: (name: WindowName) => void;
  toggleMenu: () => void;
  toggleTests: () => void;
  setTests: (tests: TestDto[]) => void;
  fetchTests: () => Promise<void>;
  upsertTest: (test: TestDto) => void;
  expandTest: (testId: string) => void;
  shrinkTest: (testId: string) => void;
  setEditingTest: (testId: string) => void;
  setMonitoringTest: (testId: string) => void;
};

type TeacherState = {
  panelsOpen: PanelsOpen;
  windowOpen: WindowName;
  activePanel: PanelName;
  actions: TeacherActions;
  showingNavbar: boolean;
  dark: boolean;
  mobilePanel: MobilePanelName;
  showingFeedback: boolean;
  showingAdminFeedback: boolean;
  showingMenu: boolean;
  showingTests: boolean;
  expandedTests: string[];
  tests: TestDto[];
  testsLoading: boolean;
  testsError: string | null;
  editingTest:  string | undefined;
  monitoringTest:  string | undefined;
  editingOrMonitoring: "monitoring" | "editing" | null;
};

export const useTeacherStore = create<TeacherState>()((set) => ({
  panelsOpen: { chat: true, notes: true },
  activePanel: "chat",
  showingNavbar: false,
  dark: true,
  showingFeedback: false,
  mobilePanel: "chat",
  showingAdminFeedback: false,
  windowOpen: "tools",
  showingMenu: true,
  showingTests: true,
  expandedTests: [],
  tests: [],
  testsLoading: false,
  testsError: null,
  editingTest: undefined,
  monitoringTest: undefined,
  editingOrMonitoring: null,

  actions: {
    togglePanel: (name) =>
      set((s) => ({
        panelsOpen: { ...s.panelsOpen, [name]: !s.panelsOpen[name] },
      })),

    setMobilePanel: (name) => set({ mobilePanel: name }),

    toggleNavbar: () => set((s) => ({ showingNavbar: !s.showingNavbar })),

    toggleMenu: () => set((s) => ({ showingMenu: !s.showingMenu })),

    toggleTests: () => set((s) => ({ showingTests: !s.showingTests })),

    toggleAdminFeedback: () =>
      set((s) => ({ showingAdminFeedback: !s.showingAdminFeedback })),

    hideNavbar: () => set({ showingNavbar: false }),

    hideFeedback: () => set({ showingFeedback: false }),

    hideAdminFeedback: () => set({ showingAdminFeedback: false }),

    toggleDark: () => set((s) => ({ dark: !s.dark })),

    toggleFeedback: () => set((s) => ({ showingFeedback: !s.showingFeedback })),

    openPanel: (name) =>
      set((s) => ({
        panelsOpen: { ...s.panelsOpen, [name]: true },
        activePanel: name,
      })),

    closePanel: (name) =>
      set((s) => ({
        panelsOpen: { ...s.panelsOpen, [name]: false },
        activePanel: s.activePanel === name ? "chat" : s.activePanel,
      })),

    setActivePanel: (name) => set({ activePanel: name }),

    setWindowOpen: (name) => set({ windowOpen: name }),

    // -------- NEW: tests --------
    setTests: (tests) => set({ tests }),

    fetchTests: async () => {
      set({ testsLoading: true, testsError: null });
      try {
        const res = await fetch("/api/tests");
        if (!res.ok) {
          throw new Error(`Kunne ikke hente prøver (${res.status})`);
        }
        const data = (await res.json()) as TestDto[];
        set({ tests: data, testsLoading: false });
      } catch (err: any) {
        set({
          testsLoading: false,
          testsError: err?.message ?? "Kunne ikke hente prøver",
        });
      }
    },

    expandTest: (testId) => set((s) => ({ expandedTests: [...s.expandedTests, testId] })),

    shrinkTest: (testId) => set((s) => ({ expandedTests: [...s.expandedTests.filter((test) => test !== testId)] })),

    setEditingTest: (testId) => 
      set((state) => {
        if (state.editingTest === undefined) {
          return { editingTest: testId, editingOrMonitoring: "editing" };
        } else if (state.editingTest === testId) {
          return {};
        } else {
          if (confirm("Er du sikker på at du vil forlate denne prøven (har du lagret?)")) {
            return { editingTest: testId, editingOrMonitoring: "editing" };
          }
          return {};
        }
      }),

    setMonitoringTest: (testId) => 
      set((state) => {
        if (state.editingTest !== undefined) {
          if (!confirm("Er du sikker på at du vil forlate redigeringsmodus (har du lagret?)")) {
            return {};
          } else {
            return { monitoringTest: testId, editingOrMonitoring: "monitoring"}
          }
        } else {
          return { monitoringTest: testId, editingOrMonitoring: "monitoring"}
        }
      }),      

    upsertTest: (test) => {
      set((s) => {
        const id = test?._id;
        if (!id) {
          // fallback: legg først hvis ingen _id (f.eks. optimistisk)
          return { tests: [test, ...s.tests] };
        }

        const idx = s.tests.findIndex((t) => t?._id === id);
        if (idx === -1) {
          return { tests: [test, ...s.tests] };
        }

        const next = [...s.tests];
        next[idx] = test;
        return { tests: next };
      });
    },
  },

  fetchTestById: async (id: string) => {
    try {
      const res = await fetch(`/api/tests/${id}`);
      if (!res.ok) throw new Error("Kunne ikke hente prøve");
      const dto = await res.json();
      set((s) => {
        const idx = s.tests.findIndex((t) => t._id === dto._id);
        if (idx === -1) return { tests: [dto, ...s.tests] };
        const next = [...s.tests];
        next[idx] = dto;
        return { tests: next };
      });
    } catch (e) {
    //  ...
    }
  },  

  startNewTest: () =>
    set((state) => {
      if (state.editingTest && !confirm("Er du sikker på at du vil forlate denne prøven (har du lagret?)")) {
        return {};
      }
      return { editingTest: undefined, monitoringTest: undefined, editingOrMonitoring: "editing" };
    }),  
}));
