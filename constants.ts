import { PerformanceDataPoint, ScatterDataPoint, IncrementalMetric } from './types';

export const featureDetails: { [key: string]: { displayName: string; hint: string; tip: string; } } = {
    'irradiance': {
        displayName: 'Solar Irradiance (Sunlight Strength)',
        hint: 'What is the most direct and powerful driver of solar power generation?',
        tip: 'Solar irradiance measures the sun\'s power hitting the panels. It\'s the most fundamental predictor for solar energy output.'
    },
    'power_rolling_std_6': {
        displayName: 'Recent Power Fluctuation (6-hr)',
        hint: 'After raw sunlight, what factor tells us if the power output has been stable or fluctuating?',
        tip: 'This "rolling standard deviation" measures consistency. High fluctuation can indicate intermittent clouds, a key challenge in forecasting.'
    },
    'hour_cos': {
        displayName: 'Time of Day (Cyclical)',
        hint: 'Power generation follows a clear daily pattern. How can we mathematically represent this cycle to the model?',
        tip: 'Using a cosine transformation on the hour helps the model understand the 24-hour cycle of the sun rising and setting.'
    },
    'power_rolling_mean_3': {
        displayName: 'Average Power (3-hr)',
        hint: 'Knowing the immediate past can predict the near future. Which feature captures the very recent trend in power output?',
        tip: 'A "rolling mean" shows the recent performance trend. This helps the model correct its short-term forecasts.'
    },
    'dhi': {
        displayName: 'Diffuse Horizontal Irradiance',
        hint: 'Besides direct sunlight, what other type of solar radiation contributes to power generation, especially on cloudy days?',
        tip: 'DHI is the sunlight that\'s been scattered by the atmosphere. It\'s a crucial secondary measure of solar energy.'
    },
    'power_lag_3': {
        displayName: 'Power Output 3 Hours Ago',
        hint: 'Sometimes, conditions persist. What was the power output a few hours ago?',
        tip: 'A "lag feature" provides a snapshot of a specific point in the recent past, helping the model identify longer-term weather patterns.'
    },
    'is_weekend': {
        displayName: 'Is it a Weekend?',
        hint: 'Energy consumption patterns often differ on certain days of the week. Which feature captures this social pattern?',
        tip: 'Local grid demand can subtly influence power systems. Differentiating between weekdays and weekends can capture these patterns.'
    },
    'power_lag_1': {
        displayName: 'Power Output 1 Hour Ago',
        hint: 'The most recent data point is often the most predictive. What was the power output exactly one hour ago?',
        tip: 'This is another lag feature, but with a shorter time horizon. It is extremely useful for very short-term (next hour) predictions.'
    },
    'day_cos': {
        displayName: 'Time of Year (Cyclical)',
        hint: 'Just like the day has a cycle, so does the year. How can we represent the seasonal change in sun angle and day length?',
        tip: 'Similar to the daily cycle, a cosine transformation on the day of the year informs the model about seasonal patterns.'
    },
    'power_rolling_mean_24': {
        displayName: 'Average Power (24-hr)',
        hint: 'To understand the daily baseline, it helps to look at the average performance over what time period?',
        tip: 'Looking at the full 24-hour average helps the model establish a daily baseline, ignoring short-term fluctuations.'
    },
    'wind_speed': {
        displayName: 'Wind Speed',
        hint: 'What weather condition can cool down solar panels, potentially improving their efficiency?',
        tip: 'Solar panel efficiency is affected by temperature. Higher wind speeds can have a cooling effect, which this feature helps capture.'
    },
    'power_lag_2': {
        displayName: 'Power Output 2 Hours Ago',
        hint: 'Let\'s add another reference point between the 1-hour and 3-hour lags.',
        tip: 'This feature provides an intermediate historical data point, giving the model more context about developing trends.'
    },
    'power_rolling_std_3': {
        displayName: 'Recent Power Fluctuation (3-hr)',
        hint: 'We have a 6-hour measure of fluctuation. What if we need to know about more immediate, short-term changes?',
        tip: 'Measuring fluctuation over a shorter, 3-hour window helps the model react more quickly to rapidly changing cloud cover.'
    },
    'power_rolling_mean_6': {
        displayName: 'Average Power (6-hr)',
        hint: 'We have 3-hour and 24-hour averages. What feature provides a good middle-ground, morning or afternoon, trend?',
        tip: 'This feature captures the trend over a medium time frame, useful for understanding conditions over half a day.'
    },
    'month': {
        displayName: 'Month of the Year',
        hint: 'While the "Time of Year" feature is smooth, sometimes abrupt monthly changes matter. Which feature captures this directly?',
        tip: 'While the cyclical "day_cos" feature is better for seasonal trends, the specific month can capture non-cyclical effects or anomalies.'
    }
};

// This data comes from the incremental feature selection process (page 26 of PDF)
// It is used for the "Feature Selection Game" on the first tab.
const rawPerformanceData = [
  { features: 1,  name: 'irradiance',              mse: 194.022613 },
  { features: 2,  name: 'power_rolling_std_6',     mse: 73.787899 },
  { features: 3,  name: 'hour_cos',                mse: 19.675892 },
  { features: 4,  name: 'power_rolling_mean_3',    mse: 16.297301 },
  { features: 5,  name: 'dhi',                     mse: 12.259382 },
  { features: 6,  name: 'power_lag_3',             mse: 11.453465 },
  { features: 7,  name: 'is_weekend',              mse: 11.072475 },
  { features: 8,  name: 'power_lag_1',             mse: 11.206930 },
  { features: 9,  name: 'day_cos',                 mse: 11.365273 },
  { features: 10, name: 'power_rolling_mean_24',   mse: 10.789118 },
  { features: 11, name: 'wind_speed',              mse: 10.649279 },
  { features: 12, name: 'power_lag_2',             mse: 10.141312 },
  { features: 13, name: 'power_rolling_std_3',     mse: 10.220916 },
  { features: 14, name: 'power_rolling_mean_6',    mse: 10.253110 },
  { features: 15, name: 'month',                   mse: 9.947706 }
];

export const PERFORMANCE_DATA: PerformanceDataPoint[] = rawPerformanceData.map(d => ({
  ...d,
  displayName: featureDetails[d.name].displayName,
  hint: featureDetails[d.name].hint,
  tip: featureDetails[d.name].tip,
  rmse: Math.sqrt(d.mse)
}));

// This data comes from the final performance evaluation on the test set (page 36 of PDF)
// It is used for the "Performance Analysis" tab.
export const INCREMENTAL_METRICS: IncrementalMetric[] = [
    { features: 1,  featureName: 'irradiance',            rmse: 11.5761, mae: 3.7257, r2: 0.9903, improvement: '' },
    { features: 2,  featureName: 'power_rolling_std_6',   rmse: 7.2000,  mae: 1.5918, r2: 0.9963, improvement: '+37.80%' },
    { features: 3,  featureName: 'hour_cos',              rmse: 3.2532,  mae: 0.8523, r2: 0.9992, improvement: '+54.82%' },
    { features: 4,  featureName: 'power_rolling_mean_3',  rmse: 2.4708,  mae: 0.6836, r2: 0.9996, improvement: '+24.05%' },
    { features: 5,  featureName: 'dhi',                   rmse: 2.2875,  mae: 0.6553, r2: 0.9996, improvement: '+7.42%' },
    { features: 6,  featureName: 'power_lag_3',           rmse: 2.4752,  mae: 0.6969, r2: 0.9996, improvement: '-8.21%' },
    { features: 7,  featureName: 'is_weekend',            rmse: 2.4453,  mae: 0.6869, r2: 0.9996, improvement: '+1.21%' },
    { features: 8,  featureName: 'power_lag_1',           rmse: 2.3689,  mae: 0.6821, r2: 0.9996, improvement: '+3.12%' },
    { features: 9,  featureName: 'day_cos',               rmse: 2.2308,  mae: 0.6405, r2: 0.9996, improvement: '+5.83%' },
    { features: 10, featureName: 'power_rolling_mean_24', rmse: 2.1246,  mae: 0.6288, r2: 0.9997, improvement: '+4.76%' },
    { features: 11, featureName: 'wind_speed',            rmse: 2.2308,  mae: 0.6544, r2: 0.9996, improvement: '-5.00%' },
    { features: 12, featureName: 'power_lag_2',           rmse: 2.2412,  mae: 0.6654, r2: 0.9996, improvement: '-0.47%' },
    { features: 13, featureName: 'power_rolling_std_3',   rmse: 2.1895,  mae: 0.6592, r2: 0.9997, improvement: '+2.31%' },
    { features: 14, featureName: 'power_rolling_mean_6',  rmse: 2.1243,  mae: 0.6256, r2: 0.9997, improvement: '+2.98%' },
    { features: 15, featureName: 'month',                 rmse: 2.2420,  mae: 0.6673, r2: 0.9996, improvement: '-5.54%' },
];


export const generateScatterData = (rmse: number): ScatterDataPoint[] => {
    const data: ScatterDataPoint[] = [];
    const numPoints = 200;
    const maxPower = 250;

    for (let i = 0; i < numPoints; i++) {
        let actual;
        // Generate more points near zero to simulate nighttime
        if (Math.random() < 0.4) {
             actual = Math.random() * 10;
        } else {
             actual = Math.random() * maxPower;
        }

        // Generate noise from a normal-like distribution (Box-Muller transform)
        const u1 = Math.random();
        const u2 = Math.random();
        const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        const noise = rmse * randStdNormal;

        let predicted = actual + noise;
        predicted = Math.max(0, predicted); // Power can't be negative
        predicted = Math.min(predicted, maxPower + 30); // Cap predictions
        
        data.push({ actual, predicted });
    }
    return data;
};

export const calculateMetrics = (data: ScatterDataPoint[]) => {
    if (data.length === 0) {
        return { mae: 0, rSquared: 0 };
    }

    const meanActual = data.reduce((sum, d) => sum + d.actual, 0) / data.length;
    
    let sumOfSquaresTotal = 0;
    let sumOfSquaresResidual = 0;
    let sumOfAbsoluteErrors = 0;
    
    data.forEach(d => {
        const residual = d.actual - d.predicted;
        sumOfSquaresTotal += Math.pow(d.actual - meanActual, 2);
        sumOfSquaresResidual += Math.pow(residual, 2);
        sumOfAbsoluteErrors += Math.abs(residual);
    });

    const mae = sumOfAbsoluteErrors / data.length;
    // Handle case where total sum of squares is zero to avoid division by zero
    const rSquared = sumOfSquaresTotal === 0 ? 1 : 1 - (sumOfSquaresResidual / sumOfSquaresTotal);

    return { mae, rSquared: Math.max(0, rSquared) }; // R-squared shouldn't be negative for display
};