export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 15,
  medium: 25,
  hard: 40,
};

export const COMPLETION_BONUS = 25;

export type StepConfig = {
  id: number;
  emoji: string;
  maxPossibleXp: number;
};

export const STEPS_CONFIG: StepConfig[] = [
  { id: 1, emoji: "🏛️", maxPossibleXp: 80 },
  { id: 2, emoji: "🗳️", maxPossibleXp: 90 },
  { id: 3, emoji: "📋", maxPossibleXp: 105 },
  { id: 4, emoji: "📅", maxPossibleXp: 155 },
  { id: 5, emoji: "📝", maxPossibleXp: 90 },
  { id: 6, emoji: "📣", maxPossibleXp: 105 },
  { id: 7, emoji: "✍️", maxPossibleXp: 155 },
  { id: 8, emoji: "🔢", maxPossibleXp: 115 },
  { id: 9, emoji: "🏅", maxPossibleXp: 155 },
];

export const TOTAL_MAX_XP = STEPS_CONFIG.reduce((sum, st) => sum + st.maxPossibleXp, 0);
