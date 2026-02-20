import { create } from "zustand";

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
};

export const useTeacherStore = create<TeacherState>()((set) => ({
  panelsOpen: { chat: true, notes: true },
  activePanel: "chat",
  lookupEvent: null,
  showingNavbar: false,
  dark: true,
  showingFeedback: false,
  mobilePanel: "chat",
  showingAdminFeedback: false,
  windowOpen: "tools",
  showingMenu: true,
  showingTests: true,

  actions: {
    togglePanel: (name) =>
      set((s) => ({
        panelsOpen: { ...s.panelsOpen, [name]: !s.panelsOpen[name] },
      })),

    setMobilePanel: (name) =>
      set(() => ({
        mobilePanel: name,
      })),      

    toggleNavbar: () =>
      set((s) => ({
        showingNavbar: !s.showingNavbar,
      })),      

    toggleMenu: () =>
      set((s) => ({
        showingMenu: !s.showingMenu,
      })),   

    toggleTests: () =>
      set((s) => ({
        showingTests: !s.showingTests,
      })),         

    toggleAdminFeedback: () =>
      set((s) => ({
        showingAdminFeedback: !s.showingAdminFeedback,
      })),      

    hideNavbar: () =>
      set(() => ({
        showingNavbar: false,
      })),         

    hideFeedback: () =>
      set(() => ({
        showingFeedback: false,
      })),         

    hideAdminFeedback: () =>
      set(() => ({
        showingAdminFeedback: false,
      })),   

    toggleDark: () =>
      set((s) => ({
        dark: !s.dark,
      })),         
      
    toggleFeedback: () =>
      set((s) => ({
        showingFeedback: !s.showingFeedback,
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

    setWindowOpen: (name) => set({ windowOpen: name }),

},
}));
