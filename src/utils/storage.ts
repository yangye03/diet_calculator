import { DailyData, DailyGoals, IntakeEntry } from '../types';
import { getTodayString } from './dateUtils';

const STORAGE_KEY = 'diet_tracker_data';
const GOALS_KEY = 'diet_tracker_goals';

const DEFAULT_GOALS: DailyGoals = {
  carbs: 300,
  protein: 150,
};

export function getGoals(): DailyGoals {
  const stored = localStorage.getItem(GOALS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_GOALS;
    }
  }
  return DEFAULT_GOALS;
}

export function saveGoals(goals: DailyGoals): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function getTodayData(): DailyData {
  const today = getTodayString();
  const allData = getAllData();

  const existingData = allData.find(d => d.date === today);
  if (existingData) {
    return existingData;
  }

  return {
    date: today,
    goals: getGoals(),
    entries: [],
  };
}

export function getAllData(): DailyData[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveTodayData(data: DailyData): void {
  const allData = getAllData();
  const index = allData.findIndex(d => d.date === data.date);

  if (index >= 0) {
    allData[index] = data;
  } else {
    allData.push(data);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

export function addEntry(entry: Omit<IntakeEntry, 'id' | 'timestamp'>): IntakeEntry {
  const newEntry: IntakeEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  const todayData = getTodayData();
  todayData.entries.push(newEntry);
  saveTodayData(todayData);

  return newEntry;
}

export function deleteEntry(id: string): void {
  const todayData = getTodayData();
  todayData.entries = todayData.entries.filter(e => e.id !== id);
  saveTodayData(todayData);
}

export function calculateRemaining(entries: IntakeEntry[], goals: DailyGoals) {
  const consumed = entries.reduce(
    (acc, entry) => ({
      carbs: acc.carbs + entry.carbs,
      protein: acc.protein + entry.protein,
    }),
    { carbs: 0, protein: 0 }
  );

  return {
    carbs: {
      consumed: consumed.carbs,
      remaining: goals.carbs - consumed.carbs,
      total: goals.carbs,
      percentage: (consumed.carbs / goals.carbs) * 100,
    },
    protein: {
      consumed: consumed.protein,
      remaining: goals.protein - consumed.protein,
      total: goals.protein,
      percentage: (consumed.protein / goals.protein) * 100,
    },
  };
}
