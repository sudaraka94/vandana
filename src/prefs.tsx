import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ThemeMode } from "./theme/theme";

export type LineSpacing = "compact" | "normal" | "relaxed";

export interface LastRead {
  id: string;
  progress: number; // 0..1
}

export interface Prefs {
  themeMode: ThemeMode;
  fontSize: number; // px, verse text
  lineSpacing: LineSpacing;
  keepAwake: boolean;
  favourites: string[];
  lastRead?: LastRead;
}

export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 40;
export const DEFAULT_FONT_SIZE = 19;

export const LINE_HEIGHTS: Record<LineSpacing, number> = {
  compact: 1.6,
  normal: 1.85,
  relaxed: 2.15,
};

const STORAGE_KEY = "vandanaPrefs";
const OLD_FONT_SIZE_KEY = "articleFontSize";

const DEFAULTS: Prefs = {
  themeMode: "paper",
  fontSize: DEFAULT_FONT_SIZE,
  lineSpacing: "normal",
  keepAwake: true,
  favourites: [],
};

export const clampFontSize = (size: number) =>
  Math.round(Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size)));

const load = (): Prefs => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && typeof saved === "object") {
      return { ...DEFAULTS, ...saved, fontSize: clampFontSize(saved.fontSize ?? DEFAULT_FONT_SIZE) };
    }
    // Carry over the size chosen in the old zoom bar (stored as an em factor of 16px).
    const oldFactor = parseFloat(localStorage.getItem(OLD_FONT_SIZE_KEY) ?? "");
    if (Number.isFinite(oldFactor)) {
      return { ...DEFAULTS, fontSize: clampFontSize(oldFactor * 16) };
    }
  } catch {
    // Storage can be unavailable (private mode); fall back to defaults.
  }
  return DEFAULTS;
};

interface PrefsContextValue extends Prefs {
  update: (changes: Partial<Prefs>) => void;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export const PrefsProvider = ({ children }: { children: React.ReactNode }) => {
  const [prefs, setPrefs] = useState<Prefs>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Not remembered this time; the app still works.
    }
  }, [prefs]);

  const update = useCallback((changes: Partial<Prefs>) => {
    setPrefs((current) => ({ ...current, ...changes }));
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setPrefs((current) => ({
      ...current,
      favourites: current.favourites.includes(id)
        ? current.favourites.filter((f) => f !== id)
        : [...current.favourites, id],
    }));
  }, []);

  const value = useMemo<PrefsContextValue>(
    () => ({
      ...prefs,
      update,
      toggleFavourite,
      isFavourite: (id: string) => prefs.favourites.includes(id),
    }),
    [prefs, update, toggleFavourite]
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
};

export const usePrefs = () => {
  const value = useContext(PrefsContext);
  if (!value) throw new Error("usePrefs must be used inside PrefsProvider");
  return value;
};
