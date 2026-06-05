import { useState, useMemo, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);

  // 进入动画
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
    if (!selectedFood) return { carbs: 0, protein: 0, fat: 0 };
    const servingNum = parseFloat(serving) || 0;
    return {
      carbs: Math.round((selectedFood.carbs * servingNum) / 100),
      protein: Math.round((selectedFood.protein * servingNum) / 100),
      fat: Math.round((selectedFood.fat * servingNum) / 100),
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
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-black/60 transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md bg-[#f2f2f7]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-t-3xl shadow-soft-lg ring-1 ring-black/10 dark:ring-white/10 max-h-[85vh] flex flex-col transform transition-transform duration-300 ease-out ${
          mounted ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 拖动手柄 */}
        <div className="shrink-0 flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-1.5 rounded-full bg-gray-300 dark:bg-white/20" />
        </div>

        {/* 头部 */}
        <div className="shrink-0 flex items-start justify-between px-5 pt-1 pb-3">
          {selectedFood ? (
            <button
              onClick={() => setSelectedFood(null)}
              className="flex items-center gap-1 text-primary-500 dark:text-primary-400 font-medium -ml-1 active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              返回
            </button>
          ) : (
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">食物库</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">搜索食物并按克数计算营养</p>
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="关闭"
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-gray-200/70 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-300/70 dark:hover:bg-white/15 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {selectedFood ? (
          // 份量输入界面
          <>
            <div className="flex-1 overflow-y-auto px-5 pb-2">
              {/* 选中食物卡片 */}
              <div className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 p-5 text-center mb-4">
                <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {selectedFood.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                  每100g · 碳水 {selectedFood.carbs}g / 蛋白质 {selectedFood.protein}g / 脂肪 {selectedFood.fat}g
                </p>
              </div>

              {/* 份量输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
                  份量（克）
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={serving}
                  onChange={(e) => setServing(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-white dark:bg-white/10 dark:text-white ring-1 ring-black/5 dark:ring-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
                  placeholder="100"
                  autoFocus
                />
              </div>

              {/* 营养素预览 */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 p-3 text-center">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">{nutrients.carbs}g</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">碳水</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 p-3 text-center">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">{nutrients.protein}g</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">蛋白质</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 p-3 text-center">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">{nutrients.fat}g</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">脂肪</div>
                </div>
              </div>
            </div>

            {/* 添加按钮 */}
            <div className="shrink-0 px-5 pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-primary-500 text-white rounded-full font-semibold text-lg shadow-soft hover:bg-primary-600 active:bg-primary-700 active:scale-[0.99] transition-all"
              >
                添加到今日
              </button>
            </div>
          </>
        ) : (
          // 食物列表界面
          <>
            {/* 搜索和分类 */}
            <div className="shrink-0 px-5 pb-3 space-y-3">
              {/* 搜索框 */}
              <div className="relative">
                <svg
                  className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索食物..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-200/70 dark:bg-white/10 dark:text-white rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition"
                />
              </div>

              {/* 分类选择 */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {FOOD_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors active:scale-95 ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200/70 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-300/70 dark:hover:bg-white/15'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 食物列表 */}
            <div className="flex-1 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                  没有找到匹配的食物
                </div>
              ) : (
                <div className="rounded-2xl bg-white dark:bg-white/[0.06] ring-1 ring-black/5 dark:ring-white/10 overflow-hidden divide-y divide-black/5 dark:divide-white/10">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleFoodClick(food)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.04] active:bg-black/[0.04] dark:active:bg-white/[0.08] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">{food.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{food.category}</div>
                      </div>
                      <div className="shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                        {food.protein}P / {food.carbs}C / {food.fat}F
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
