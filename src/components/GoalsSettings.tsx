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
    <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl rounded-3xl shadow-soft ring-1 ring-black/5 dark:ring-white/10 p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">每日目标设置</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            碳水化合物目标
          </label>
          <div className="flex items-center">
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="1"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="flex-1 px-4 py-3 text-2xl font-semibold bg-gray-100/80 dark:bg-white/10 dark:text-white border border-transparent rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-white/15 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition"
            />
            <span className="ml-3 text-xl font-medium text-gray-600 dark:text-gray-400">g</span>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            蛋白质目标
          </label>
          <div className="flex items-center">
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="flex-1 px-4 py-3 text-2xl font-semibold bg-gray-100/80 dark:bg-white/10 dark:text-white border border-transparent rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-white/15 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition"
            />
            <span className="ml-3 text-xl font-medium text-gray-600 dark:text-gray-400">g</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 rounded-full font-semibold text-lg transition-all active:scale-[0.99] ${
            isValid
              ? 'bg-primary-500 text-white shadow-soft hover:bg-primary-600 active:bg-primary-700'
              : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          保存目标
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50/70 dark:bg-primary-500/10 rounded-2xl ring-1 ring-blue-100 dark:ring-primary-400/20">
        <p className="text-sm text-blue-800 dark:text-primary-200">
          <span className="font-medium">提示：</span>
          修改目标后，今日的剩余量会根据新目标重新计算。建议根据你的健身目标和体重设定合理的摄入量。
        </p>
      </div>
    </div>
  );
}
