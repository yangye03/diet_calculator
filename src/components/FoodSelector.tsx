import { useState, useMemo } from 'react';
import type { Food } from '../types';
import { FOOD_DATABASE, FOOD_CATEGORIES } from '../data/foods';

interface FoodSelectorProps {
  onSelect: (carbs: number, protein: number, note: string) => void;
  onClose: () => void;
}

export function FoodSelector({ onSelect, onClose }: FoodSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [serving, setServing] = useState('100');

  // 过滤食物列表
  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '全部' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // 选择食物
  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    setServing(food.commonServing?.toString() || '100');
  };

  // 计算营养素
  const calculateNutrients = () => {
    if (!selectedFood) return { carbs: 0, protein: 0 };
    const servingNum = parseFloat(serving) || 0;
    return {
      carbs: Math.round((selectedFood.carbs * servingNum) / 100),
      protein: Math.round((selectedFood.protein * servingNum) / 100),
    };
  };

  // 确认添加
  const handleConfirm = () => {
    if (!selectedFood) return;
    const { carbs, protein } = calculateNutrients();
    const note = `${selectedFood.name} ${serving}g`;
    onSelect(carbs, protein, note);
    onClose();
  };

  const nutrients = calculateNutrients();

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-soft-lg ring-1 ring-black/10 dark:ring-white/10">
        {/* 头部 */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200/70 dark:border-white/10">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">选择食物</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {selectedFood ? (
          // 份量输入界面
          <div className="flex-1 flex flex-col p-6">
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2 text-center">
                {selectedFood.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                每100g: 碳水 {selectedFood.carbs}g | 蛋白质 {selectedFood.protein}g | 脂肪{' '}
                {selectedFood.fat}g
              </p>

              {/* 份量输入 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  输入份量（克）
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={serving}
                  onChange={(e) => setServing(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-gray-100/80 dark:bg-white/10 dark:text-white border border-transparent rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-white/15 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition"
                  placeholder="100"
                  autoFocus
                />
              </div>

              {/* 营养素预览 */}
              <div className="bg-gray-50/80 dark:bg-white/[0.04] rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">将添加：</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-white/10 rounded-2xl p-3 text-center shadow-soft">
                    <div className="text-2xl font-bold text-primary-500 dark:text-primary-400">{nutrients.carbs}g</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">碳水化合物</div>
                  </div>
                  <div className="bg-white dark:bg-white/10 rounded-2xl p-3 text-center shadow-soft">
                    <div className="text-2xl font-bold text-primary-500 dark:text-primary-400">{nutrients.protein}g</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">蛋白质</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFood(null)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-white/15 transition-all active:scale-[0.99] font-medium"
              >
                返回
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-full shadow-soft hover:bg-primary-600 active:bg-primary-700 transition-all active:scale-[0.99] font-semibold"
              >
                确认添加
              </button>
            </div>
          </div>
        ) : (
          // 食物列表界面
          <>
            {/* 搜索和分类 */}
            <div className="p-4 border-b border-gray-200/70 dark:border-white/10 space-y-3">
              {/* 搜索框 */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索食物..."
                className="w-full px-4 py-2.5 bg-gray-100/80 dark:bg-white/10 dark:text-white border border-transparent rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/15 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 transition"
              />

              {/* 分类选择 */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {FOOD_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white shadow-soft'
                        : 'bg-gray-100/80 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 食物列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  没有找到匹配的食物
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleFoodClick(food)}
                      className="text-left p-4 bg-white/60 dark:bg-white/[0.04] ring-1 ring-black/5 dark:ring-white/10 rounded-2xl hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all active:scale-[0.99]"
                    >
                      <div className="font-medium text-gray-800 dark:text-white mb-1">{food.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        每100g: 碳水 {food.carbs}g | 蛋白质 {food.protein}g | 脂肪 {food.fat}g
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
