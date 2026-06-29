import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface Settings {
  profile: {
    name: string;
    university: string;
    semester: string;
  };
  study: {
    dailyHours: number;
    subjects: string;
    examDates: string;
  };
  quiz: {
    difficulty: "easy" | "medium" | "hard";
    numQuestions: number;
  };
  notes: {
    defaultStyle: "bullet-points" | "paragraph" | "detailed";
  };
  language: "english" | "roman-urdu" | "urdu";
  fontSize: "small" | "medium" | "large";
}

const STORAGE_KEY = "nyra_settings";

const defaultSettings: Settings = {
  profile: { name: "", university: "", semester: "" },
  study: { dailyHours: 3, subjects: "", examDates: "" },
  quiz: { difficulty: "medium", numQuestions: 5 },
  notes: { defaultStyle: "bullet-points" },
  language: "english",
  fontSize: "medium",
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
