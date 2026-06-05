import { useState } from 'react';
import type { FormEvent } from 'react';
import type { DailyGoals } from '../types/index';

interface GoalsSettingsProps {
  goals: DailyGoals;
  onSave: (goals: DailyGoals) => void;
}

export function GoalsSettings({ goals, onSave }: GoalsSettingsProps) {
  const [carbs, setCarbs] = useState(goals.carbs.toString());
  const [protein, setProtein] = useState(goals.protein.toString());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const carbsNum = parseFloat(carbs);
    const proteinNum = parseFloat(protein);

    if (isNaN(carbsNum) || isNaN(proteinNum) || carbsNum <= 0 || proteinNum <= 0) {
      alert('请输入有效的正数');
      return;
    }

    onSave({ carbs: carbsNum, protein: proteinNum });
    alert('目标已保存！');
  };

  const isValid = carbs !== '' && protein !== '' && parseFloat(carbs) > 0 && parseFloat(protein) > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">目标</h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-1">设置每日碳水和蛋白质的摄入目标</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 分组表单卡片 */}
        <div className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10 mb-3">
          {/* 碳水 */}
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <label className="text-base font-medium text-gray-900 dark:text-white">碳水化合物</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-28 px-3 py-2 text-right text-lg font-semibold bg-gray-100 dark:bg-white/10 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition"
              />
              <span className="text-sm text-gray-400 dark:text-gray-500 w-3">g</span>
            </div>
          </div>

          {/* 蛋白质 */}
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <label className="text-base font-medium text-gray-900 dark:text-white">蛋白质</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-28 px-3 py-2 text-right text-lg font-semibold bg-gray-100 dark:bg-white/10 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition"
              />
              <span className="text-sm text-gray-400 dark:text-gray-500 w-3">g</span>
            </div>
          </div>
        </div>

        {/* 说明 */}
        <p className="px-1 mb-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          修改目标后，今日剩余量会根据新的目标重新计算。
        </p>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-3.5 rounded-full font-semibold text-lg transition-all active:scale-[0.99] ${
            isValid
              ? 'bg-primary-500 text-white shadow-soft hover:bg-primary-600 active:bg-primary-700'
              : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          保存目标
        </button>
      </form>
    </div>
  );
}
