import { useState } from 'react';
import { TabType, DailyData } from './types';
import { RemainingCard } from './components/RemainingCard';
import { IntakeForm } from './components/IntakeForm';
import { IntakeList } from './components/IntakeList';
import { GoalsSettings } from './components/GoalsSettings';
import { History } from './components/History';
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">饮食追踪</h1>
          <p className="text-gray-600 mt-1">记录每日营养摄入</p>
        </header>

        {activeTab === 'today' && (
          <div>
            <RemainingCard carbs={stats.carbs} protein={stats.protein} />
            <IntakeForm onSubmit={handleAddEntry} />
            <IntakeList entries={todayData.entries} onDelete={handleDeleteEntry} />
          </div>
        )}

        {activeTab === 'goals' && (
          <GoalsSettings goals={getGoals()} onSave={handleSaveGoals} />
        )}

        {activeTab === 'history' && <History allData={allData} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-around">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 text-center font-medium rounded-lg transition-colors ${
              activeTab === 'today'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-3 text-center font-medium rounded-lg transition-colors mx-2 ${
              activeTab === 'goals'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            目标
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center font-medium rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            历史
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
