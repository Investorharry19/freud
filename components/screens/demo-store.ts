import { useSyncExternalStore } from "react";

export type Practice = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  intention: string;
  style: "Guided" | "Breathing" | "Sleep";
  description: string;
};

export const PRACTICES: Practice[] = [
  {
    id: "breathe-out",
    title: "Breathe Out",
    subtitle: "Grounding Pranayama",
    duration: 10,
    intention: "Stress",
    style: "Breathing",
    description:
      "A gentle paced-breathing practice to help you pause, settle, and return to the present.",
  },
  {
    id: "morning-clarity",
    title: "Morning Clarity",
    subtitle: "A clear start to your day",
    duration: 12,
    intention: "Focus",
    style: "Guided",
    description:
      "A short guided meditation to set an intention and meet the day with a little more space.",
  },
  {
    id: "soft-landing",
    title: "Soft Landing",
    subtitle: "Ease into a restful night",
    duration: 15,
    intention: "Sleep",
    style: "Sleep",
    description:
      "A calming body scan designed to help you release the day and prepare for rest.",
  },
  {
    id: "kindness",
    title: "A Moment of Kindness",
    subtitle: "Compassion for yourself",
    duration: 8,
    intention: "Self-compassion",
    style: "Guided",
    description:
      "Practice offering yourself the patience and warmth you would give to someone you care about.",
  },
];

export type Session = {
  practiceId: string;
  title: string;
  minutes: number;
  completedAt: string;
  reflection?: string;
};

export type MoodEntry = {
  mood: string;
  intensity: number;
  note: string;
  recordedAt: string;
};

type DemoState = {
  sessions: Session[];
  moods: MoodEntry[];
  saved: string[];
  downloaded: string[];
};

let state: DemoState = { sessions: [], moods: [], saved: [], downloaded: [] };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function useDemoState() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state,
  );
}

export const demoActions = {
  completeSession(
    practice: Practice,
    reflection?: string,
    minutes = practice.duration,
  ) {
    state = {
      ...state,
      sessions: [
        {
          practiceId: practice.id,
          title: practice.title,
          minutes,
          completedAt: new Date().toISOString(),
          reflection,
        },
        ...state.sessions,
      ],
    };
    emit();
  },
  addMood(entry: Omit<MoodEntry, "recordedAt">) {
    state = {
      ...state,
      moods: [{ ...entry, recordedAt: new Date().toISOString() }, ...state.moods],
    };
    emit();
  },
  toggleSaved(id: string) {
    state = {
      ...state,
      saved: state.saved.includes(id)
        ? state.saved.filter((savedId) => savedId !== id)
        : [...state.saved, id],
    };
    emit();
  },
  toggleDownloaded(id: string) {
    state = {
      ...state,
      downloaded: state.downloaded.includes(id)
        ? state.downloaded.filter((savedId) => savedId !== id)
        : [...state.downloaded, id],
    };
    emit();
  },
  clear() {
    state = { sessions: [], moods: [], saved: [], downloaded: [] };
    emit();
  },
};

export function getPractice(id: string | undefined) {
  return PRACTICES.find((practice) => practice.id === id) ?? PRACTICES[0];
}
