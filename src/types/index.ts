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
  date: string;
  goals: DailyGoals;
  entries: IntakeEntry[];
}

export type TabType = 'today' | 'goals' | 'history';

export interface Food {
  id: string;
  name: string;
  carbs: number;      // 每100g碳水化合物（克）
  protein: number;    // 每100g蛋白质（克）
  fat: number;        // 每100g脂肪（克）
  category: string;   // 分类：肉类、主食、蔬菜等
  commonServing?: number;  // 常见份量（克）
}
