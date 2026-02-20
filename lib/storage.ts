import type { QuranProgress, Language } from '@/types';

// City Selection Storage
export interface CitySelection {
  province: string;
  city: string;
}

const CITY_SELECTION_KEY = 'imsakiyah-city';

// Quran Progress Storage
const QURAN_PROGRESS_KEY = 'quran-progress';
const LANGUAGE_KEY = 'app-language';

export const saveProgress = (surah: number, ayah: number, surahName: string): void => {
  if (typeof window === 'undefined') return;

  const progress: QuranProgress = {
    surah,
    ayah,
    surahName,
    timestamp: Date.now(),
  };

  localStorage.setItem(QURAN_PROGRESS_KEY, JSON.stringify(progress));
};

export const getProgress = (): QuranProgress | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(QURAN_PROGRESS_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearProgress = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(QURAN_PROGRESS_KEY);
};

// Language Storage
export const saveLanguage = (language: Language): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(LANGUAGE_KEY, language);
};

export const getLanguage = (): Language => {
  if (typeof window === 'undefined') return 'id';

  const stored = localStorage.getItem(LANGUAGE_KEY);
  return stored === 'en' ? 'en' : 'id';
};

// City Selection Storage
export const saveCitySelection = (province: string, city: string): void => {
  if (typeof window === 'undefined') return;

  const selection: CitySelection = { province, city };
  localStorage.setItem(CITY_SELECTION_KEY, JSON.stringify(selection));
};

export const getCitySelection = (): CitySelection | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(CITY_SELECTION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
