import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  ReportConfig,
  reportMetrics,
  generateReportData,
  getDaysFromPreset,
  generateExtractionReportFromSites,
  generateEquipmentReportFromData,
  generatePersonnelReportFromData,
} from '../../data/reports'
import { Download, Table, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ReportPreviewProps {
  config: ReportConfig
  onExport: () => void
}

// Chart colors for multiple metrics
const CHART_COLORS = [
  '#f59e0b', // amber
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ef4444', // red
]

export default function ReportPreview({ config, onExport }: ReportPreviewProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')

  // Generate report data based on config
  const data = useMemo(() => {
    const days = getDaysFromPreset(config.dateRange)

    // Use real data sources based on report type
    switch (config.type) {
      case 'extraction':
        return generateExtractionReportFromSites(days)
      case 'equipment':
        return generateEquipmentReportFromData(days)
      case 'personnel':
        return generatePersonnelReportFromData(days)
      case 'commodity':
      default:
        return generateReportData(config, days)
    }
  }, [config])

  // Get metric info for display
  const metricsInfo = useMemo(() => {
    const typeMetrics = reportMetrics[config.type] || []
    return config.metrics.map(metricId => {
      const info = typeMetrics.find(m => m.id === metricId)
      return info || { id: metricId, name: metricId, unit: '' }
    })
  }, [config.type, config.metrics])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return metricsInfo.map((metric, index) => {
      const values = data.map(d => (typeof d[metric.id] === 'number' ? d[metric.id] : 0) as number)
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)
      const current = values[values.length - 1]
      const previous = values[values.length - 2] || current
      const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0

      return {
        ...metric,
        avg: Math.round(avg * 10) / 10,
        min: Math.round(min * 10) / 10,
        max: Math.round(max * 10) / 10,
        current: Math.round(current * 10) / 10,
        change: Math.round(change * 10) / 10,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }
    })
  }, [data, metricsInfo])

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Render chart based on visualization type
  const renderChart = () => {
    if (config.visualization === 'table') {
      return renderTable()
    }

    const ChartComponent =
      config.visualization === 'bar'
        ? BarChart
        : config.visualization === 'area'
          ? AreaChart
          : LineChart

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#f59e0b' }}
            itemStyle={{ color: '#d1d5db' }}
            labelFormatter={formatDate}
          />
          <Legend />
          {metricsInfo.map((metric, index) => {
            const color = CHART_COLORS[index % CHART_COLORS.length]
            const commonProps = {
              key: metric.id,
              dataKey: metric.id,
              name: metric.name,
              stroke: color,
              fill: color,
            }

            if (config.visualization === 'area') {
              return (
                <Area
                  {...commonProps}
                  type="monotone"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              )
            } else if (config.visualization === 'bar') {
              return <Bar {...commonProps} fillOpacity={0.8} />
            } else {
              return (
                <Line
                  {...commonProps}
                  type="monotone"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )
            }
          })}
        </ChartComponent>
      </ResponsiveContainer>
    )
  }

  // Render data table
  const renderTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mercury-dark-tertiary">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
              {metricsInfo.map(metric => (
                <th key={metric.id} className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                  {metric.name}
                  {metric.unit && <span className="text-gray-500 ml-1">({metric.unit})</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.date}
                className={`border-b border-mercury-dark-tertiary/50 ${
                  index % 2 === 0 ? 'bg-mercury-dark/30' : ''
                }`}
              >
                <td className="py-2 px-4 text-sm text-gray-300">{formatDate(row.date as string)}</td>
                {metricsInfo.map(metric => (
                  <td key={metric.id} className="text-right py-2 px-4 text-sm text-gray-200 font-mono">
                    {typeof row[metric.id] === 'number'
                      ? (row[metric.id] as number).toLocaleString()
                      : row[metric.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Get trend icon
  const getTrendIcon = (change: number) => {
    if (change > 2) return <TrendingUp className="w-4 h-4 text-status-active" />
    if (change < -2) return <TrendingDown className="w-4 h-4 text-status-error" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  if (config.metrics.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
        <p className="text-gray-500">Select at least one metric to preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with view toggle and export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'chart'
                ? 'bg-mercury-amber/10 text-mercury-amber'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Chart
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'table'
                ? 'bg-mercury-amber/10 text-mercury-amber'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Table className="w-4 h-4" />
            Table
          </button>
        </div>
        <button onClick={onExport} className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryStats.map(stat => (
          <div
            key={stat.id}
            className="p-3 rounded-lg border border-mercury-dark-tertiary bg-mercury-dark"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{stat.name}</span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: stat.color }}
              />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-lg font-semibold text-gray-200">
                {stat.current.toLocaleString()}
              </span>
              <div className="flex items-center gap-1">
                {getTrendIcon(stat.change)}
                <span
                  className={`text-xs ${
                    stat.change > 0
                      ? 'text-status-active'
                      : stat.change < 0
                        ? 'text-status-error'
                        : 'text-gray-500'
                  }`}
                >
                  {stat.change > 0 ? '+' : ''}
                  {stat.change}%
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              Range: {stat.min.toLocaleString()} - {stat.max.toLocaleString()} {stat.unit}
            </p>
          </div>
        ))}
      </div>

      {/* Chart or Table View */}
      <div className="p-4 rounded-lg border border-mercury-dark-tertiary bg-mercury-dark">
        {viewMode === 'chart' && config.visualization !== 'table' ? renderChart() : renderTable()}
      </div>
    </div>
  )
}
