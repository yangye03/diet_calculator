import React from 'react';
import { IntakeEntry } from '../types';
import { formatTime } from '../utils/dateUtils';

interface IntakeListProps {
  entries: IntakeEntry[];
  onDelete: (id: string) => void;
}

export function IntakeList({ entries, onDelete }: IntakeListProps) {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">今日已摄入</h2>
        <div className="text-center py-8 text-gray-400">
          还没有记录，开始记录今天的饮食吧！
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">今日已摄入</h2>
      <div className="space-y-3">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">
                {formatTime(entry.timestamp)}
              </div>
              <div className="text-base font-medium text-gray-900">
                碳水 {entry.carbs}g · 蛋白质 {entry.protein}g
              </div>
              {entry.note && (
                <div className="text-sm text-gray-600 mt-1">{entry.note}</div>
              )}
            </div>
            <button
              onClick={() => {
                if (confirm('确定删除这条记录吗？')) {
                  onDelete(entry.id);
                }
              }}
              className="ml-4 text-danger-500 hover:text-danger-600 font-medium"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
