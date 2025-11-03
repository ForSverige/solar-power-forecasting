import React, { useState } from 'react';
import BiasVarianceTab from './components/BiasVarianceTab';
import PredictionsTab from './components/PredictionsTab';
import { PERFORMANCE_DATA } from './constants';

type Tab = 'bias-variance' | 'predictions';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('bias-variance');
  const [gameStep, setGameStep] = useState(0);
  const totalFeatures = PERFORMANCE_DATA.length;
  const isGameComplete = gameStep >= totalFeatures;


  const TabButton = ({ tab, label, disabled = false }: { tab: Tab, label: string, disabled?: boolean }) => (
    <button
      onClick={() => !disabled && setActiveTab(tab)}
      disabled={disabled}
      title={disabled ? "Complete the Feature Selection Game to unlock this tab." : ""}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        activeTab === tab
          ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
          : disabled 
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Solar Power Forecasting</h1>
          <p className="mt-1 text-md text-gray-600">An interactive guide to machine learning concepts.</p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white border-b border-gray-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <TabButton tab="bias-variance" label="1. The Bias-Variance Tradeoff" />
            <TabButton tab="predictions" label="2. Performance Analysis" disabled={!isGameComplete} />
          </nav>
        </div>

        <div className="mt-4">
          {activeTab === 'bias-variance' && (
            <BiasVarianceTab
              gameStep={gameStep}
              setGameStep={setGameStep}
            />
          )}
          {activeTab === 'predictions' && isGameComplete && <PredictionsTab />}
        </div>
      </main>

      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Built for educational purposes.</p>
      </footer>
    </div>
  );
};

export default App;