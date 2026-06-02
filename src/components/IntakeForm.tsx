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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">记录摄入</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            碳水化合物 (g) <span className="text-gray-400 text-xs">可选</span>
          </label>
          <input
            ref={carbsInputRef}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            placeholder="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            蛋白质 (g) <span className="text-gray-400 text-xs">可选</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            placeholder="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            备注 (可选)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
            placeholder="午餐、晚餐..."
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
            isValid
              ? 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          记录
        </button>
      </form>
    </div>
  );
}
