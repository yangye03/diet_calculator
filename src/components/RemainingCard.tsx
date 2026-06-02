
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

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-lg font-medium text-gray-700">{label}</span>
        <span className="text-3xl font-bold text-gray-900">
          {Math.max(0, Math.round(info.remaining))}g
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        已摄入 {Math.round(info.consumed)}g / 目标 {info.total}g
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">今日剩余</h2>
      <NutrientRow label="碳水化合物" info={carbs} />
      <NutrientRow label="蛋白质" info={protein} />
    </div>
  );
}
