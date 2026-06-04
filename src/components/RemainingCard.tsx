
interface NutrientInfo {
  consumed: number;
  remaining: number;
  total: number;
  percentage: number;
}

interface RemainingCardProps {
  carbs: NutrientInfo;
  protein: NutrientInfo;
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-danger-500';
  if (percentage >= 80) return 'bg-accent-500';
  return 'bg-primary-500';
}

function NutrientRow({ label, info }: { label: string; info: NutrientInfo }) {
  const progressColor = getProgressColor(info.percentage);
  const progressWidth = Math.min(info.percentage, 100);
  const overAmount = Math.round(-info.remaining);
  const isOver = overAmount > 0;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-lg font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className="flex items-baseline gap-2">
          {isOver && (
            <span className="text-sm font-medium text-danger-500 dark:text-danger-400">
              已超出 {overAmount}g
            </span>
          )}
          <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {Math.max(0, Math.round(info.remaining))}g
          </span>
        </span>
      </div>
      <div className="text-sm text-gray-400 dark:text-gray-500 mb-2.5">
        已摄入 {Math.round(info.consumed)}g / 目标 {info.total}g
      </div>
      <div className="w-full bg-gray-200/70 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300 rounded-full`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
}

export function RemainingCard({ carbs, protein }: RemainingCardProps) {
  return (
    <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl rounded-3xl shadow-soft ring-1 ring-black/5 dark:ring-white/10 p-6 mb-5">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">今日剩余</h2>
      <NutrientRow label="碳水化合物" info={carbs} />
      <NutrientRow label="蛋白质" info={protein} />
    </div>
  );
}
