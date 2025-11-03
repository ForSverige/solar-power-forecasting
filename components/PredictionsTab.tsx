import React, { useMemo, useRef, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import { INCREMENTAL_METRICS, generateScatterData, featureDetails } from '../constants';
// FIX: Use standard ES module import for d3 to ensure compatibility.
import * as d3 from 'd3';
import { IncrementalMetric } from '../types';

// Chart components defined within the file to keep changes minimal
const PerformanceLineChart = ({ 
    data, 
    yKey, 
    yDomain, 
    color 
}: { 
    data: IncrementalMetric[], 
    yKey: keyof IncrementalMetric, 
    yDomain: [number, number],
    color: string
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.parentElement?.clientWidth || 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    
    svg.attr('width', width).attr('height', height);

    const x = d3.scaleLinear()
      .domain([1, data.length])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain(yDomain)
      .range([height - margin.bottom, margin.top]).nice();

    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(data.length));
    
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5)
      .attr("d", d3.line<IncrementalMetric>()
        .x(d => x(d.features))
        .y(d => y(d[yKey] as number))
      );
      
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
        .attr("cx", d => x(d.features))
        .attr("cy", d => y(d[yKey] as number))
        .attr("r", 4)
        .attr("fill", color);

  }, [data, yKey, yDomain, color]);

  return <svg ref={svgRef}></svg>;
};


const PredictionsTab: React.FC = () => {
  const keyFeatureCounts = [1, 3, 5, 7];

  const keyModelsData = useMemo(() => {
    return keyFeatureCounts.map(num => {
      const metrics = INCREMENTAL_METRICS.find(m => m.features === num);
      if (!metrics) return null;
      return {
        ...metrics,
        scatterData: generateScatterData(metrics.rmse)
      };
    }).filter(Boolean);
  }, [keyFeatureCounts]);
  
  const getFeatureCategory = (index: number) => {
    const i = index + 1;
    if (i <= 3) return { label: 'Critical', color: 'text-red-600' };
    if (i <= 7) return { label: 'Recommended', color: 'text-green-600' };
    if (i <= 10) return { label: 'Optional', color: 'text-blue-600' };
    return { label: 'Marginal', color: 'text-gray-500' };
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Incremental Feature Selection Analysis</h2>
        <p className="text-lg text-gray-600">Finding the Optimal Number of Features</p>
      </div>

      {/* --- Scatter Plots --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Actual vs. Predicted Power for Key Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {keyModelsData.map(model => (
            <div key={model!.features} className="border rounded-lg p-2">
              <h4 className="text-center font-bold text-gray-700">{model!.features} Feature{model!.features > 1 ? 's' : ''}</h4>
              <p className="text-center text-xs text-gray-500 mb-1">RMSE: {model!.rmse.toFixed(2)} | R²: {model!.r2.toFixed(4)}</p>
              <ScatterPlot data={model!.scatterData} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Performance Line Charts --- */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Model Error vs. Number of Features</h3>
            <PerformanceLineChart 
                data={INCREMENTAL_METRICS} 
                yKey="rmse" 
                yDomain={[0, 12]} 
                color="crimson" 
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Model Fit vs. Number of Features</h3>
            <PerformanceLineChart 
                data={INCREMENTAL_METRICS} 
                yKey="r2" 
                yDomain={[0.99, 1.0]}
                color="steelblue"
             />
          </div>
       </div>

      {/* --- Analysis and Recommendation --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Selected Features in Order</h3>
            <div className="space-y-2 font-mono text-sm max-h-96 overflow-y-auto pr-2">
                {INCREMENTAL_METRICS.map((metric, index) => {
                    const category = getFeatureCategory(index);
                    const displayName = featureDetails[metric.featureName]?.displayName || metric.featureName;
                    return (
                        <div key={metric.features} className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                            <div>
                                <span className={`${category.color} font-bold`}>{String(metric.features).padStart(2, ' ')}.</span>
                                <span className="ml-2 text-gray-800">{displayName}</span>
                            </div>
                            <span className="text-gray-600">RMSE: {metric.rmse.toFixed(2)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Analysis Summary</h3>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-r-lg">
                <h4 className="font-bold">Optimal Number of Features: 14</h4>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    <li>With 14 features, the model achieves a low RMSE of {INCREMENTAL_METRICS[13].rmse.toFixed(2)}W.</li>
                    <li>Adding the 15th feature provides a negative improvement, suggesting it adds more noise than signal (overfitting).</li>
                    <li>The 14-feature model provides the best balance between high performance and model simplicity.</li>
                </ul>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800">Top 3 Most Important Features:</h4>
                <ol className="list-decimal list-inside mt-2 text-sm text-gray-700 space-y-1">
                    <li>{featureDetails[INCREMENTAL_METRICS[0].featureName]?.displayName}</li>
                    <li>{featureDetails[INCREMENTAL_METRICS[1].featureName]?.displayName}</li>
                    <li>{featureDetails[INCREMENTAL_METRICS[2].featureName]?.displayName}</li>
                </ol>
            </div>
            <div className="text-sm text-gray-600">
                <p>This analysis shows a classic machine learning pattern: adding features initially yields large performance gains, but these gains diminish over time. After a certain point, adding more features can even hurt performance, a phenomenon known as the bias-variance tradeoff.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsTab;
