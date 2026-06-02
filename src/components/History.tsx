import React from 'react';
import { DailyData } from '../types';
import { formatDate } from '../utils/dateUtils';
import { calculateRemaining } from '../utils/storage';

interface HistoryProps {
  allData: DailyData[];
}

export function History({ allData }: HistoryProps) {
  const sortedData = [...allData].sort((a, b) => b.date.localeCompare(a.date));

  if (allData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">历史记录</h2>
        <div className="text-center py-8 text-gray-400">
          还没有历史记录
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">历史记录</h2>
      <div className="space-y-4">
        {sortedData.map((day) => {
          const stats = calculateRemaining(day.entries, day.goals);
          const carbsComplete = stats.carbs.consumed >= stats.carbs.total * 0.9;
          const proteinComplete = stats.protein.consumed >= stats.protein.total * 0.9;
          const isComplete = carbsComplete && proteinComplete;
          const isOver = stats.carbs.consumed > stats.carbs.total || stats.protein.consumed > stats.protein.total;

          return (
            <div
              key={day.date}
              className="p-4 border-2 border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-bold text-gray-900">
                  {formatDate(day.date)}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOver
                    ? 'bg-accent-100 text-accent-700'
                    : isComplete
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {isOver ? '⚠ 超标' : isComplete ? '✓ 完成' : '未完成'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">碳水</div>
                  <div className="font-medium text-gray-900">
                    {Math.round(stats.carbs.consumed)} / {stats.carbs.total}g
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">蛋白质</div>
                  <div className="font-medium text-gray-900">
                    {Math.round(stats.protein.consumed)} / {stats.protein.total}g
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {day.entries.length} 条记录
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
