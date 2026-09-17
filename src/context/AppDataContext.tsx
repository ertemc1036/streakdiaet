import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadJson, saveJson, clearAll } from '../storage/storage';
import { computeStreak } from '../utils/streak';
import { todayKey } from '../utils/date';
import type { Meal, Settings, WaterEntry, WeightEntry } from '../types';

const DEFAULT_SETTINGS: Settings = {
  waterGoalMl: 2000,
  calorieGoal: 2000,
};

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface AppDataContextValue {
  loading: boolean;
  weights: WeightEntry[];
  water: WaterEntry[];
  meals: Meal[];
  settings: Settings;
  streak: number;
  todayWaterMl: number;
  todayCalories: number;
  todayMeals: Meal[];
  addWeight: (kg: number) => Promise<void>;
  addWater: (ml: number) => Promise<void>;
  addMeal: (meal: Omit<Meal, 'id' | 'date'>) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  removeWater: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [water, setWater] = useState<WaterEntry[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      const [w, wa, m, s] = await Promise.all([
        loadJson<WeightEntry[]>('weights', []),
        loadJson<WaterEntry[]>('water', []),
        loadJson<Meal[]>('meals', []),
        loadJson<Settings>('settings', DEFAULT_SETTINGS),
      ]);
      setWeights(w);
      setWater(wa);
      setMeals(m);
      setSettings(s);
      setLoading(false);
    })();
  }, []);

  const addWeight = useCallback(async (kg: number) => {
    setWeights((prev) => {
      const next = [...prev, { id: makeId(), date: todayKey(), kg }];
      saveJson('weights', next);
      return next;
    });
  }, []);

  const addWater = useCallback(async (ml: number) => {
    setWater((prev) => {
      const next = [...prev, { id: makeId(), date: todayKey(), ml }];
      saveJson('water', next);
      return next;
    });
  }, []);

  const addMeal = useCallback(async (meal: Omit<Meal, 'id' | 'date'>) => {
    setMeals((prev) => {
      const next = [...prev, { ...meal, id: makeId(), date: todayKey() }];
      saveJson('meals', next);
      return next;
    });
  }, []);

  const removeMeal = useCallback(async (id: string) => {
    setMeals((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveJson('meals', next);
      return next;
    });
  }, []);

  const removeWater = useCallback(async (id: string) => {
    setWater((prev) => {
      const next = prev.filter((w) => w.id !== id);
      saveJson('water', next);
      return next;
    });
  }, []);

  const updateSettings = useCallback(async (partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveJson('settings', next);
      return next;
    });
  }, []);

  const resetAllData = useCallback(async () => {
    await clearAll();
    setWeights([]);
    setWater([]);
    setMeals([]);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const streak = useMemo(() => {
    const activeDates = new Set<string>([
      ...weights.map((w) => w.date),
      ...water.map((w) => w.date),
      ...meals.map((m) => m.date),
    ]);
    return computeStreak(activeDates);
  }, [weights, water, meals]);

  const today = todayKey();
  const todayWaterMl = useMemo(
    () => water.filter((w) => w.date === today).reduce((sum, w) => sum + w.ml, 0),
    [water, today]
  );
  const todayMeals = useMemo(() => meals.filter((m) => m.date === today), [meals, today]);
  const todayCalories = useMemo(
    () => todayMeals.reduce((sum, m) => sum + m.calories, 0),
    [todayMeals]
  );

  const value: AppDataContextValue = {
    loading,
    weights,
    water,
    meals,
    settings,
    streak,
    todayWaterMl,
    todayCalories,
    todayMeals,
    addWeight,
    addWater,
    addMeal,
    removeMeal,
    removeWater,
    updateSettings,
    resetAllData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
