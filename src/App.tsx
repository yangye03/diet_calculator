import { useState } from 'react';
import type { TabType, DailyData } from './types/index';
import { RemainingCard } from './components/RemainingCard';
import { IntakeForm } from './components/IntakeForm';
import { IntakeList } from './components/IntakeList';
import { GoalsSettings } from './components/GoalsSettings';
import { History } from './components/History';
import { FoodSelector } from './components/FoodSelector';
import {
  getTodayData,
  getAllData,
  addEntry,
  deleteEntry,
  saveGoals,
  getGoals,
  calculateRemaining,
} from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [todayData, setTodayData] = useState<DailyData>(getTodayData());
  const [allData, setAllData] = useState<DailyData[]>(getAllData());
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const refreshData = () => {
    setTodayData(getTodayData());
    setAllData(getAllData());
  };

  const handleAddEntry = (carbs: number, protein: number, note: string) => {
    addEntry({ carbs, protein, note });
    refreshData();
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    refreshData();
  };

  const handleSaveGoals = (goals: { carbs: number; protein: number }) => {
    saveGoals(goals);
    refreshData();
  };

  const stats = calculateRemaining(todayData.entries, todayData.goals);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-8 mt-2 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">饮食追踪</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">记录每日营养摄入</p>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="切换主题"
            className="mt-1 w-11 h-11 flex items-center justify-center rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 shadow-soft text-gray-700 dark:text-yellow-300 hover:bg-white dark:hover:bg-white/15 transition-all active:scale-95"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.95 2.05a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM5.05 5.464a1 1 0 00-1.414-1.414l-.707.707A1 1 0 104.343 6.17l.707-.707zM3 9a1 1 0 100 2H2a1 1 0 100-2h1zm12.657 6.243a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm-9.9 1.414a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM11 17a1 1 0 11-2 0v-1a1 1 0 112 0v1zm-1-4a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </header>

        {activeTab === 'today' && (
          <div>
            <RemainingCard carbs={stats.carbs} protein={stats.protein} />
            <IntakeForm onSubmit={handleAddEntry} />

            {/* 从食物库添加按钮 */}
            <div className="mb-5">
              <button
                onClick={() => setShowFoodSelector(true)}
                className="w-full py-3.5 bg-white/70 dark:bg-white/10 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 shadow-soft text-primary-600 dark:text-primary-400 font-medium rounded-full hover:bg-white dark:hover:bg-white/15 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                从食物库添加
              </button>
            </div>

            <IntakeList entries={todayData.entries} onDelete={handleDeleteEntry} />
          </div>
        )}

        {activeTab === 'goals' && (
          <GoalsSettings goals={getGoals()} onSave={handleSaveGoals} />
        )}

        {activeTab === 'history' && <History allData={allData} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-black/60 backdrop-blur-xl border-t border-gray-200/70 dark:border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-around">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 text-center font-medium rounded-full transition-all ${
              activeTab === 'today'
                ? 'bg-ultra-500 text-white shadow-soft'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/10'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-3 text-center font-medium rounded-full transition-all mx-2 ${
              activeTab === 'goals'
                ? 'bg-ultra-500 text-white shadow-soft'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/10'
            }`}
          >
            目标
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center font-medium rounded-full transition-all ${
              activeTab === 'history'
                ? 'bg-ultra-500 text-white shadow-soft'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/10'
            }`}
          >
            历史
          </button>
        </div>
      </nav>

      {/* 食物选择器模态框 */}
      {showFoodSelector && (
        <FoodSelector
          onSelect={handleAddEntry}
          onClose={() => setShowFoodSelector(false)}
        />
      )}
    </div>
  );
}

export default App;
