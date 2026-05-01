import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Persona = "student" | "first-time" | "general";

export type AccessibilityPrefs = {
  largeText: boolean;
  highContrast: boolean;
  voiceOn: boolean;
};

export type Badge = "firstVote" | "quizChampion" | "democracyScholar" | "simulatorPro";

type JourneyStore = {
  persona: Persona | null;
  currentStep: number;
  stepXp: Record<number, number>;
  totalXp: number;
  level: number;
  badges: Badge[];
  completedBonuses: Record<number, boolean>;
  stepData: Record<number, unknown>; // Store interactive state per step (e.g., checklist selections)
  accessibilityPrefs: AccessibilityPrefs;
  locale: string;

  setPersona: (persona: Persona) => void;
  setStep: (step: number) => void;
  addXp: (step: number, amount: number) => void;
  awardBonus: (step: number, amount: number) => void;
  setStepData: (step: number, data: unknown) => void;
  addBadge: (badge: Badge) => void;
  setAccessibilityPref: (key: keyof AccessibilityPrefs, value: boolean) => void;
  setLocale: (locale: string) => void;
  reset: () => void;
};

const XP_PER_LEVEL = 100;

const initialState = {
  persona: null,
  currentStep: 1,
  stepXp: {},
  totalXp: 0,
  level: 1,
  badges: [] as Badge[],
  completedBonuses: {},
  stepData: {},
  accessibilityPrefs: { largeText: false, highContrast: false, voiceOn: false },
  locale: "en",
};

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPersona: (persona) => set({ persona }),

      setStep: (step) => set({ currentStep: step }),

      setStepData: (step, data) =>
        set((state) => ({
          stepData: { ...state.stepData, [step]: data },
        })),

      addXp: (step, amount) =>
        set((state) => {
          const currentStepXp = state.stepXp[step] || 0;
          const updatedStepXp = { ...state.stepXp, [step]: currentStepXp + amount };
          const newTotalXp = Object.values(updatedStepXp).reduce((sum, val) => sum + val, 0);
          const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;

          return {
            stepXp: updatedStepXp,
            totalXp: newTotalXp,
            level: newLevel,
          };
        }),

      awardBonus: (step, amount) => {
        const state = get();
        if (state.completedBonuses[step]) return; // Already awarded

        set((state) => ({
          completedBonuses: { ...state.completedBonuses, [step]: true }
        }));
        state.addXp(step, amount);
      },

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge) ? state.badges : [...state.badges, badge],
        })),

      setAccessibilityPref: (key, value) =>
        set((state) => ({
          accessibilityPrefs: { ...state.accessibilityPrefs, [key]: value },
        })),

      setLocale: (locale) => set({ locale }),

      reset: () => set(initialState),
    }),
    { name: "chunav-mitra-journey-v3" }
  )
);
