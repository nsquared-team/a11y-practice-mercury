import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { generateExtractionData, ExtractionDataPoint } from '../../utils/chartData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg p-3 shadow-lg">
        <p className="text-gray-400 text-xs mb-2 font-mono">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">{entry.name}</span>
            </span>
            <span className="font-mono text-gray-100">{entry.value} kg/h</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-mercury-dark-tertiary flex items-center justify-between">
          <span className="text-gray-400 text-xs">Total</span>
          <span className="font-mono text-mercury-amber font-semibold">
            {payload.reduce((sum, entry) => sum + entry.value, 0)} kg/h
          </span>
        </div>
      </div>
    );
  }
  return null;
}

function ExtractionChart() {
  const [data, setData] = useState<ExtractionDataPoint[]>([]);

  useEffect(() => {
    // Generate initial data
    setData(generateExtractionData());

    // Optional: Update data periodically for "real-time" feel
    const interval = setInterval(() => {
      setData(generateExtractionData());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="mercuriumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="solarPlatinumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="thermalCrystalsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#78716c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#78716c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#262626"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={{ stroke: '#6b7280' }}
            axisLine={{ stroke: '#262626' }}
            interval="preserveStartEnd"
            tickMargin={8}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={{ stroke: '#6b7280' }}
            axisLine={{ stroke: '#262626' }}
            tickFormatter={(value) => `${value}`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => (
              <span className="text-gray-400 text-xs">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="mercurium"
            name="Mercurium"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#mercuriumGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b', stroke: '#0d0d0d', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="solarPlatinum"
            name="Solar Platinum"
            stroke="#ea580c"
            strokeWidth={2}
            fill="url(#solarPlatinumGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#ea580c', stroke: '#0d0d0d', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="thermalCrystals"
            name="Thermal Crystals"
            stroke="#78716c"
            strokeWidth={2}
            fill="url(#thermalCrystalsGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#78716c', stroke: '#0d0d0d', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExtractionChart;
