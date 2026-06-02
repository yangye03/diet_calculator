export interface DailyGoals {
  carbs: number;
  protein: number;
}

export interface IntakeEntry {
  id: string;
  timestamp: number;
  carbs: number;
  protein: number;
  note?: string;
}

export interface DailyData {
  date: string; // YYYY-MM-DD
  goals: DailyGoals;
  entries: IntakeEntry[];
}

export type TabType = 'today' | 'goals' | 'history';
