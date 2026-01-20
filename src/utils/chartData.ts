// Chart data utilities for generating extraction rate time series data

export interface ExtractionDataPoint {
  time: string;
  hour: number;
  mercurium: number;
  solarPlatinum: number;
  thermalCrystals: number;
  total: number;
}

export interface DailyExtractionDataPoint {
  date: string;
  day: string;
  mercurium: number;
  solarPlatinum: number;
  thermalCrystals: number;
  total: number;
}

export interface CommodityPricePoint {
  date: string;
  price: number;
}

export interface HistoricalData {
  extraction: DailyExtractionDataPoint[];
  commodityPrices: {
    mercurium: CommodityPricePoint[];
    solarPlatinum: CommodityPricePoint[];
    thermalCrystals: CommodityPricePoint[];
  };
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

/**
 * Generates 30 days of historical extraction data
 * Includes realistic variations, weekly patterns, and trend simulation
 */
export function generate30DayHistoricalData(): DailyExtractionDataPoint[] {
  const data: DailyExtractionDataPoint[] = [];
  const now = new Date();

  // Base daily extraction rates (kg per day)
  const baseMercurium = 2400;
  const baseSolarPlatinum = 1600;
  const baseThermalCrystals = 1200;

  // Slight upward trend over 30 days (2% improvement)
  const trendFactor = 0.02 / 30;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dateStr = date.toISOString().split('T')[0];
    const dayLabel = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    // Day of week affects production (weekends slightly lower)
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.85 : 1.0;

    // Random daily variation (±15%)
    const dailyVariation = () => 0.85 + Math.random() * 0.30;

    // Trend improvement over time
    const dayTrend = 1 + trendFactor * (30 - i);

    const mercurium = Math.round(
      baseMercurium * weekendFactor * dailyVariation() * dayTrend
    );
    const solarPlatinum = Math.round(
      baseSolarPlatinum * weekendFactor * dailyVariation() * dayTrend
    );
    const thermalCrystals = Math.round(
      baseThermalCrystals * weekendFactor * dailyVariation() * dayTrend
    );

    data.push({
      date: dateStr,
      day: dayLabel,
      mercurium,
      solarPlatinum,
      thermalCrystals,
      total: mercurium + solarPlatinum + thermalCrystals,
    });
  }

  return data;
}

/**
 * Generates 30 days of commodity price history
 * Simulates realistic market fluctuations with trends
 */
export function generate30DayCommodityPrices(): HistoricalData['commodityPrices'] {
  const now = new Date();

  // Starting prices (30 days ago)
  let mercuriumPrice = 11500;
  let solarPlatinumPrice = 9100;
  let thermalCrystalsPrice = 2900;

  const mercuriumHistory: CommodityPricePoint[] = [];
  const solarPlatinumHistory: CommodityPricePoint[] = [];
  const thermalCrystalsHistory: CommodityPricePoint[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Daily price changes (random walk with slight trends)
    // Mercurium: slight upward trend
    mercuriumPrice = Math.round(
      mercuriumPrice * (1 + (Math.random() - 0.45) * 0.03)
    );
    // Solar Platinum: slight downward trend
    solarPlatinumPrice = Math.round(
      solarPlatinumPrice * (1 + (Math.random() - 0.55) * 0.025)
    );
    // Thermal Crystals: volatile with upward trend
    thermalCrystalsPrice = Math.round(
      thermalCrystalsPrice * (1 + (Math.random() - 0.4) * 0.04)
    );

    mercuriumHistory.push({ date: dateStr, price: mercuriumPrice });
    solarPlatinumHistory.push({ date: dateStr, price: solarPlatinumPrice });
    thermalCrystalsHistory.push({ date: dateStr, price: thermalCrystalsPrice });
  }

  return {
    mercurium: mercuriumHistory,
    solarPlatinum: solarPlatinumHistory,
    thermalCrystals: thermalCrystalsHistory,
  };
}

/**
 * Generates complete 30-day historical data package
 */
export function generateHistoricalData(): HistoricalData {
  return {
    extraction: generate30DayHistoricalData(),
    commodityPrices: generate30DayCommodityPrices(),
  };
}

/**
 * Calculates period-over-period comparison
 */
export function calculatePeriodComparison(data: DailyExtractionDataPoint[]) {
  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);

  const sumFirst = firstHalf.reduce((sum, d) => sum + d.total, 0);
  const sumSecond = secondHalf.reduce((sum, d) => sum + d.total, 0);

  const avgFirst = sumFirst / firstHalf.length;
  const avgSecond = sumSecond / secondHalf.length;

  const percentChange = ((avgSecond - avgFirst) / avgFirst) * 100;

  return {
    firstPeriodTotal: sumFirst,
    secondPeriodTotal: sumSecond,
    firstPeriodAverage: Math.round(avgFirst),
    secondPeriodAverage: Math.round(avgSecond),
    percentChange: Math.round(percentChange * 10) / 10,
    trend: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable',
  };
}

/**
 * Site-specific 30-day historical data
 */
export interface SiteMonthlyDataPoint {
  date: string;
  extraction: number;
  target: number;
  efficiency: number;
}

export function generateSiteMonthlyData(
  baseRate: number,
  dailyTarget: number
): SiteMonthlyDataPoint[] {
  const data: SiteMonthlyDataPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Random daily variation (±25%)
    const variation = 0.75 + Math.random() * 0.5;
    const dailyExtraction = Math.round(baseRate * 24 * variation);
    const efficiency = Math.round((dailyExtraction / dailyTarget) * 100);

    data.push({
      date: dateStr,
      extraction: dailyExtraction,
      target: dailyTarget,
      efficiency: Math.min(efficiency, 150), // Cap at 150% for display
    });
  }

  return data;
}
