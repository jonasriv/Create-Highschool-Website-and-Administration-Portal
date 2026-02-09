import { create } from "zustand";

type PanelName = "chat" | "notes" | "search";
type LookupMode = "snl" | "web" | "internal";

type LookupEvent = {
  id: string;
  term: string;
  // source?: PanelName | "system"; 
};

type PanelsOpen = Record<PanelName, boolean>;

type ElevActions = {
  togglePanel: (name: PanelName) => void;
  openPanel: (name: PanelName) => void;
  closePanel: (name: PanelName) => void;
  setActivePanel: (name: PanelName) => void;

  triggerLookup: (term: string, mode?: LookupMode) => void;
  clearLookup: () => void;
  toggleNavbar: () => void;
  toggleDark: () => void;
};

type ElevState = {
  panelsOpen: PanelsOpen;
  activePanel: PanelName;
  lookupEvent: LookupEvent | null;
  actions: ElevActions;
  showingNavbar: boolean;
  dark: boolean;
};

export const useElevStore = create<ElevState>()((set) => ({
  panelsOpen: { chat: true, notes: true, search: true },
  activePanel: "chat",
  lookupEvent: null,
  showingNavbar: false,
  dark: false,

  actions: {
    togglePanel: (name) =>
      set((s) => ({
        panelsOpen: { ...s.panelsOpen, [name]: !s.panelsOpen[name] },
      })),

    toggleNavbar: () =>
      set((s) => ({
        showingNavbar: !s.showingNavbar,
      })),      

    toggleDark: () =>
      set((s) => ({
        dark: !s.dark,
      })),           

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

    triggerLookup: (term) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      set((s) => ({
        panelsOpen: { ...s.panelsOpen, search: true },
        activePanel: "search",
        lookupEvent: { id, term },
        // lookupEvent: { id, term, mode, source: s.activePanel }, // hvis du la til source i typen
      }));
    },

    clearLookup: () => set({ lookupEvent: null }),
  },
}));
