import React, { useMemo, useState } from 'react';
import { PERFORMANCE_DATA } from '../constants';
import BiasVarianceChart from './BiasVarianceChart';
import { PerformanceDataPoint } from '../types';

interface BiasVarianceTabProps {
  gameStep: number;
  setGameStep: React.Dispatch<React.SetStateAction<number>>;
}

const BiasVarianceTab: React.FC<BiasVarianceTabProps> = ({ gameStep, setGameStep }) => {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({ text: "Select the single most important feature to begin.", type: 'info' });
  const [hoveredFeature, setHoveredFeature] = useState<PerformanceDataPoint | null>(null);

  const correctlySelectedFeatures = useMemo(() => {
    return PERFORMANCE_DATA.slice(0, gameStep);
  }, [gameStep]);
  
  const remainingFeatures = useMemo(() => {
    const selectedNames = new Set(correctlySelectedFeatures.map(f => f.name));
    return PERFORMANCE_DATA.filter(f => !selectedNames.has(f.name));
  }, [correctlySelectedFeatures]);

  const shuffledRemainingFeatures = useMemo(() => {
    // Fisher-Yates shuffle algorithm to randomize the feature order for the game
    const array = [...remainingFeatures];
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }, [remainingFeatures]);

  const currentPerformance = useMemo(() => {
    return gameStep > 0 ? PERFORMANCE_DATA[gameStep - 1] : { rmse: 0, displayName: 'N/A' };
  }, [gameStep]);
  
  const handleFeatureSelect = (selectedFeature: PerformanceDataPoint) => {
    const nextCorrectFeature = PERFORMANCE_DATA[gameStep];
    if (selectedFeature.name === nextCorrectFeature.name) {
      const newStep = gameStep + 1;
      setGameStep(newStep);
      
      if (newStep === PERFORMANCE_DATA.length) {
          setMessage({ text: "Congratulations! You've found all the optimal features! The next tab is now unlocked.", type: 'success' });
      } else {
          setMessage({ text: `Correct! "${selectedFeature.displayName}" was the best feature to add.`, type: 'success' });
      }
    } else {
      setMessage({ text: `Not quite! "${selectedFeature.displayName}" is helpful, but another feature provides a bigger improvement at this stage. Try again!`, type: 'error' });
    }
  };
  
  const handleReset = () => {
      setGameStep(0);
      setMessage({ text: "Game reset. Select the single most important feature to begin.", type: 'info' });
  }

  const getMessageTypeStyles = () => {
      switch (message.type) {
          case 'success': return 'bg-green-100 text-green-800';
          case 'error': return 'bg-red-100 text-red-800';
          default: return 'bg-blue-100 text-blue-800';
      }
  }

  const currentHint = useMemo(() => {
      return gameStep < PERFORMANCE_DATA.length ? PERFORMANCE_DATA[gameStep].hint : "";
  }, [gameStep]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">The Feature Selection Game</h2>
        <p className="text-gray-600">
          Your goal is to build the best possible solar forecasting model by choosing features one by one. At each step, select the feature from the list on the right that you think will most improve the model's accuracy. The chart on the left shows the optimal path—try to match your model's performance (the pink dot) to the blue line by making the right choices!
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Chart and Current Model */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Performance vs. Complexity</h3>
              <BiasVarianceChart data={PERFORMANCE_DATA} selectedFeatureCount={gameStep} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700">Your Current Model</h3>
                <div className="mt-4 flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
                    <div>
                        <div className="font-semibold text-indigo-800">Number of Features</div>
                        <div className="text-3xl font-bold text-indigo-600">{gameStep}</div>
                    </div>
                    <div>
                        <div className="font-semibold text-indigo-800 text-right">Cross-Validation RMSE</div>
                        <div className="text-3xl font-bold text-indigo-600 text-right">{currentPerformance.rmse.toFixed(2)}</div>
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-600">Selected Features (in order of discovery):</h4>
                    {correctlySelectedFeatures.length > 0 ? (
                        <ul className="text-sm text-gray-600 mt-2 space-y-1 overflow-y-auto max-h-40 pr-2">
                            {correctlySelectedFeatures.map((feature, i) => 
                              <li key={feature.name} className="p-1 rounded">
                                <strong>{i+1}.</strong> {feature.displayName}
                              </li>
                            )}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-400 mt-2">No features selected yet.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Feature Selection Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Which Feature is Next?</h3>
                <button 
                    onClick={handleReset}
                    className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Reset
                </button>
             </div>
             
             <div className={`p-4 rounded-md text-sm mb-4 ${getMessageTypeStyles()}`}>
                {message.text}
             </div>

            {gameStep < PERFORMANCE_DATA.length ? (
                <div>
                    <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-700 mb-4 border border-gray-200">
                        <strong className="text-gray-900">Hint:</strong> {currentHint}
                    </div>

                    <div className="mb-4 p-4 min-h-[100px] bg-yellow-50 border border-yellow-200 rounded-lg transition-all duration-300">
                        <h4 className="font-bold text-yellow-800">Educational Tip</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                            {hoveredFeature ? hoveredFeature.tip : "Hover over a feature to learn more about it."}
                        </p>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-800 mb-2">Choose the best feature to add from the list below:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
                      {shuffledRemainingFeatures.map(feature => (
                        <button 
                          key={feature.name}
                          onClick={() => handleFeatureSelect(feature)}
                          onMouseEnter={() => setHoveredFeature(feature)}
                          onMouseLeave={() => setHoveredFeature(null)}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-indigo-100 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <span className="font-semibold text-sm text-gray-700">{feature.displayName}</span>
                        </button>
                      ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 bg-green-50 rounded-lg">
                    <h4 className="text-2xl font-bold text-green-700">Challenge Complete!</h4>
                    <p className="mt-2 text-green-600">You have successfully built the optimal 15-feature model.</p>
                    <p className="mt-4 text-sm text-gray-600">The "Performance Analysis" tab is now unlocked. Click it to see a detailed breakdown!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BiasVarianceTab;