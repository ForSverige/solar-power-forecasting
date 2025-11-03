import React, { useEffect, useRef } from 'react';
// FIX: Use standard ES module import for d3 to ensure compatibility.
import * as d3 from 'd3';
import { PerformanceDataPoint } from '../types';

interface BiasVarianceChartProps {
  data: PerformanceDataPoint[];
  selectedFeatureCount: number;
}

const BiasVarianceChart: React.FC<BiasVarianceChartProps> = ({ data, selectedFeatureCount }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = svgRef.current.parentElement?.clientWidth || 600;
    const height = 350;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleLinear()
      .domain([1, data.length])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.rmse) as number])
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g: any) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(data.length));

    const yAxis = (g: any) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.append("g").call(xAxis)
      .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 5)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Number of Features");

    svg.append("g").call(yAxis)
       .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Cross-Validation Error (RMSE)");

    const line = d3.line<PerformanceDataPoint>()
      .x(d => x(d.features))
      .y(d => y(d.rmse))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.features))
      .attr("cy", d => y(d.rmse))
      .attr("r", 5)
      .attr("fill", d => d.features === selectedFeatureCount ? "#db2777" : "#4f46e5");

    const selectedPoint = data[selectedFeatureCount - 1];
    if (selectedPoint) {
      svg.append("circle")
        .attr("cx", x(selectedPoint.features))
        .attr("cy", y(selectedPoint.rmse))
        .attr("r", 8)
        .attr("fill", "#db2777")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);
    }
  }, [data, selectedFeatureCount]);

  return <svg ref={svgRef}></svg>;
};

export default BiasVarianceChart;
