// Chart data utilities for generating extraction rate time series data

export interface ExtractionDataPoint {
  time: string;
  hour: number;
  mercurium: number;
  solarPlatinum: number;
  thermalCrystals: number;
  total: number;
}

/**
 * Generates 24-hour extraction rate data with realistic variations
 * Simulates day/night production cycles and random fluctuations
 */
export function generateExtractionData(): ExtractionDataPoint[] {
  const data: ExtractionDataPoint[] = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const hour = (now.getHours() - i + 24) % 24;
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

    // Simulate production variations based on "time of day" on Mercury
    // Mercury's day cycle affects production (simplified simulation)
    const dayFactor = 0.7 + 0.3 * Math.sin((hour / 24) * Math.PI * 2);

    // Base extraction rates with some randomness
    const mercurium = Math.round((80 + Math.random() * 40) * dayFactor);
    const solarPlatinum = Math.round((45 + Math.random() * 25) * dayFactor);
    const thermalCrystals = Math.round((30 + Math.random() * 20) * dayFactor);

    data.push({
      time: timeLabel,
      hour,
      mercurium,
      solarPlatinum,
      thermalCrystals,
      total: mercurium + solarPlatinum + thermalCrystals,
    });
  }

  return data;
}

/**
 * Generates a single new data point for real-time updates
 */
export function generateNewDataPoint(previousData: ExtractionDataPoint[]): ExtractionDataPoint {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  // Get the last data point for continuity
  const lastPoint = previousData[previousData.length - 1];

  // Small variations from last point for smooth transitions
  const variation = () => (Math.random() - 0.5) * 10;

  const mercurium = Math.max(40, Math.min(140, lastPoint.mercurium + variation()));
  const solarPlatinum = Math.max(25, Math.min(80, lastPoint.solarPlatinum + variation()));
  const thermalCrystals = Math.max(15, Math.min(60, lastPoint.thermalCrystals + variation()));

  return {
    time: timeLabel,
    hour,
    mercurium: Math.round(mercurium),
    solarPlatinum: Math.round(solarPlatinum),
    thermalCrystals: Math.round(thermalCrystals),
    total: Math.round(mercurium + solarPlatinum + thermalCrystals),
  };
}

/**
 * Site historical data point for the detail modal
 */
export interface SiteHistoricalDataPoint {
  day: string;
  extraction: number;
  target: number;
}

/**
 * Generates 7-day historical extraction data for a specific site
 * Uses the site's current extraction rate as a baseline
 */
export function generateSiteHistoricalData(
  baseRate: number,
  dailyTarget: number
): SiteHistoricalDataPoint[] {
  const data: SiteHistoricalDataPoint[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    // Calculate daily extraction with realistic variation (±20%)
    const variation = 0.8 + Math.random() * 0.4;
    // Assume 24 hours of operation at the extraction rate
    const dailyExtraction = Math.round(baseRate * 24 * variation);

    data.push({
      day: dayLabel,
      extraction: dailyExtraction,
      target: dailyTarget,
    });
  }

  return data;
}

/**
 * Calculates summary statistics from extraction data
 */
export function calculateExtractionStats(data: ExtractionDataPoint[]) {
  const totals = data.reduce(
    (acc, point) => ({
      mercurium: acc.mercurium + point.mercurium,
      solarPlatinum: acc.solarPlatinum + point.solarPlatinum,
      thermalCrystals: acc.thermalCrystals + point.thermalCrystals,
      total: acc.total + point.total,
    }),
    { mercurium: 0, solarPlatinum: 0, thermalCrystals: 0, total: 0 }
  );

  const peakHour = data.reduce((max, point) =>
    point.total > max.total ? point : max
  , data[0]);

  const lowHour = data.reduce((min, point) =>
    point.total < min.total ? point : min
  , data[0]);

  return {
    totals,
    averages: {
      mercurium: Math.round(totals.mercurium / data.length),
      solarPlatinum: Math.round(totals.solarPlatinum / data.length),
      thermalCrystals: Math.round(totals.thermalCrystals / data.length),
      total: Math.round(totals.total / data.length),
    },
    peakHour,
    lowHour,
  };
}
