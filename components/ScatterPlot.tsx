import React, { useEffect, useRef } from 'react';
// FIX: Use standard ES module import for d3 to ensure compatibility.
import * as d3 from 'd3';
import { ScatterDataPoint } from '../types';

interface ScatterPlotProps {
  data: ScatterDataPoint[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const parentElement = svgRef.current.parentElement;
    if (!parentElement) return;

    const width = parentElement.clientWidth > 0 ? parentElement.clientWidth : 250;
    const height = width; // Maintain a square aspect ratio
    const margin = { top: 10, right: 10, bottom: 35, left: 45 };

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const maxVal = d3.max(data, d => Math.max(d.actual, d.predicted)) as number;
    const domainMax = Math.ceil((maxVal || 250) / 50) * 50;

    const x = d3.scaleLinear()
      .domain([0, domainMax]).nice()
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, domainMax]).nice()
      .range([height - margin.bottom, margin.top]);

    // X-axis
    const xAxisGroup = svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 50).tickSizeOuter(0));
    
    xAxisGroup.selectAll("text").style("font-size", "8px");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text("Actual (W)");
    
    // Y-axis
    const yAxisGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(height / 50).tickSizeOuter(0));
    
    yAxisGroup.selectAll("text").style("font-size", "8px");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", -(height / 2))
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text("Predicted (W)");

    // Perfect prediction line
    svg.append("line")
      .attr("x1", x(0))
      .attr("y1", y(0))
      .attr("x2", x(domainMax))
      .attr("y2", y(domainMax))
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    
    // Data points
    svg.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
        .attr("cx", d => x(d.actual))
        .attr("cy", d => y(d.predicted))
        .attr("r", 2.5)
        .attr("fill", "rgb(79 70 229 / 0.6)");

  }, [data]);

  return <svg ref={svgRef} className="w-full h-auto aspect-square"></svg>;
};

export default ScatterPlot;
