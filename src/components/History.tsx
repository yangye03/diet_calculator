import type { DailyData } from '../types/index';
import { formatDate } from '../utils/dateUtils';
import { calculateRemaining } from '../utils/storage';

interface HistoryProps {
  allData: DailyData[];
}

export function History({ allData }: HistoryProps) {
  const sortedData = [...allData].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">历史</h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-1">查看每日碳水和蛋白质摄入总结</p>
      </div>

      {allData.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 px-6 py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">还没有历史记录</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">开始记录后，每日总结会显示在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedData.map((day) => {
            const stats = calculateRemaining(day.entries, day.goals);
            const carbsComplete = stats.carbs.consumed >= stats.carbs.total * 0.9;
            const proteinComplete = stats.protein.consumed >= stats.protein.total * 0.9;
            const isComplete = carbsComplete && proteinComplete;
            const isOver = stats.carbs.consumed > stats.carbs.total || stats.protein.consumed > stats.protein.total;

            return (
              <div
                key={day.date}
                className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {formatDate(day.date)}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    isOver
                      ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-300'
                      : isComplete
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                      : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                  }`}>
                    {isOver ? '超标' : isComplete ? '已完成' : '未完成'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">碳水</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                      {Math.round(stats.carbs.consumed)} / {stats.carbs.total}g
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">蛋白质</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                      {Math.round(stats.protein.consumed)} / {stats.protein.total}g
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                  {day.entries.length} 条记录
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
