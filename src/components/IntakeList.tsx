import type { IntakeEntry } from '../types/index';
import { formatTime } from '../utils/dateUtils';

interface IntakeListProps {
  entries: IntakeEntry[];
  onDelete: (id: string) => void;
}

export function IntakeList({ entries, onDelete }: IntakeListProps) {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  if (entries.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl rounded-3xl shadow-soft ring-1 ring-black/5 dark:ring-white/10 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">今日已摄入</h2>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          还没有记录，开始记录今天的饮食吧！
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl rounded-3xl shadow-soft ring-1 ring-black/5 dark:ring-white/10 p-6">
      <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">今日已摄入</h2>
      <div className="space-y-2.5">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-white/[0.04] rounded-2xl hover:bg-gray-100/80 dark:hover:bg-white/[0.08] transition-colors"
          >
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {formatTime(entry.timestamp)}
              </div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                碳水 {entry.carbs}g · 蛋白质 {entry.protein}g
              </div>
              {entry.note && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.note}</div>
              )}
            </div>
            <button
              onClick={() => {
                if (confirm('确定删除这条记录吗？')) {
                  onDelete(entry.id);
                }
              }}
              className="ml-4 text-danger-500 hover:text-danger-600 dark:text-danger-400 font-medium"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
