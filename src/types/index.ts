export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  kg: number;
}

export interface WaterEntry {
  id: string;
  date: string; // YYYY-MM-DD
  ml: number;
}

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photoUri?: string;
  source: 'manual' | 'ai';
}

export interface Settings {
  waterGoalMl: number;
  calorieGoal: number;
}

export interface MealAnalysis {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
