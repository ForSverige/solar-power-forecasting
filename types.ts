export interface PerformanceDataPoint {
  features: number;
  name: string;
  displayName:string;
  mse: number;
  rmse: number;
  hint: string;
  tip: string;
}

export interface ScatterDataPoint {
  actual: number;
  predicted: number;
}

export interface IncrementalMetric {
  features: number;
  featureName: string;
  rmse: number;
  mae: number;
  r2: number;
  improvement: string;
}
