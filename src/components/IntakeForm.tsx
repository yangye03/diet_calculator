import { useState, useRef } from 'react';
import type { FormEvent } from 'react';

interface IntakeFormProps {
  onSubmit: (carbs: number, protein: number, note: string) => void;
}

export function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [note, setNote] = useState('');
  const carbsInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const carbsNum = carbs === '' ? 0 : parseFloat(carbs);
    const proteinNum = protein === '' ? 0 : parseFloat(protein);

    // 至少需要填写一个
    if ((isNaN(carbsNum) && isNaN(proteinNum)) || (carbsNum === 0 && proteinNum === 0)) {
      alert('请至少输入碳水或蛋白质其中一项');
      return;
    }

    if (carbsNum < 0 || proteinNum < 0) {
      alert('数值不能为负数');
      return;
    }

    onSubmit(carbsNum, proteinNum, note);

    setCarbs('');
    setProtein('');
    setNote('');
    carbsInputRef.current?.focus();
  };

  // 至少填写一个且非负数即可
  const hasCarbs = carbs !== '' && parseFloat(carbs) >= 0;
  const hasProtein = protein !== '' && parseFloat(protein) >= 0;
  const isValid = hasCarbs || hasProtein;

  return (
    <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl rounded-3xl shadow-soft ring-1 ring-black/5 dark:ring-white/10 p-6 mb-5">
      <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">记录摄入</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            碳水化合物 (g) <span className="text-gray-400 dark:text-gray-500 text-xs">可选</span>
          </label>
          <input
            ref={carbsInputRef}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="w-full px-4 py-3 text-lg bg-gray-100/80 dark:bg-white/10 dark:text-white border border-transparent rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/15 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition"
            placeholder="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            蛋白质 (g) <span className="text-gray-400 dark:text-gray-500 text-xs">可选</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="w-full px-4 py-3 text-lg bg-gray-100/80 dark:bg-white/10 dark:text-white border border-transparent rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/15 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition"
            placeholder="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            备注 (可选)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100/80 dark:bg-white/10 dark:text-white border border-transparent rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/15 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition"
            placeholder="午餐、晚餐..."
          />
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
          记录
        </button>
      </form>
    </div>
  );
}
