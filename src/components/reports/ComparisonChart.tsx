import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { miningSites } from '../../data/sites'
import { TrendingUp, TrendingDown, Minus, BarChart3, LineChartIcon, RefreshCw } from 'lucide-react'

type ComparisonMode = 'sites' | 'periods'
type ChartType = 'line' | 'bar'

interface SiteComparisonData {
  date: string
  [siteId: string]: string | number
}

interface PeriodComparisonData {
  label: string
  current: number
  previous: number
  change: number
}

const SITE_COLORS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
]

export default function ComparisonChart() {
  const [mode, setMode] = useState<ComparisonMode>('sites')
  const [chartType, setChartType] = useState<ChartType>('line')
  const [selectedSites, setSelectedSites] = useState<string[]>(['CB-001', 'RC-002', 'RT-003'])
  const [metric, setMetric] = useState<'extractionRate' | 'dailyProgress'>('extractionRate')

  // Generate site comparison data
  const siteComparisonData = useMemo(() => {
    const data: SiteComparisonData[] = []
    const days = 7

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      const point: SiteComparisonData = { date: dateStr }

      selectedSites.forEach(siteId => {
        const site = miningSites.find(s => s.id === siteId)
        if (site) {
          const baseValue = metric === 'extractionRate' ? site.extractionRate : site.dailyProgress
          // Add some variation for historical data
          const variance = baseValue * 0.15
          point[siteId] = Math.round((baseValue + (Math.random() - 0.5) * variance * 2) * 10) / 10
        }
      })

      data.push(point)
    }

    return data
  }, [selectedSites, metric])

  // Generate period comparison data
  const periodComparisonData = useMemo((): PeriodComparisonData[] => {
    const activeSites = miningSites.filter(s => s.status === 'active')

    return [
      {
        label: 'Total Output',
        current: activeSites.reduce((sum, s) => sum + s.dailyProgress, 0),
        previous: activeSites.reduce((sum, s) => sum + s.dailyProgress * 0.92, 0),
        change: 8.7,
      },
      {
        label: 'Avg Rate',
        current: activeSites.reduce((sum, s) => sum + s.extractionRate, 0) / activeSites.length,
        previous: activeSites.reduce((sum, s) => sum + s.extractionRate * 0.95, 0) / activeSites.length,
        change: 5.2,
      },
      {
        label: 'Active Sites',
        current: activeSites.length,
        previous: activeSites.length - 1,
        change: ((activeSites.length / (activeSites.length - 1)) - 1) * 100,
      },
      {
        label: 'Efficiency',
        current: 87.5,
        previous: 84.2,
        change: 3.9,
      },
    ]
  }, [])

  const toggleSite = (siteId: string) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId)
      }
      if (prev.length < 6) {
        return [...prev, siteId]
      }
      return prev
    })
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-status-success" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-status-error" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const formatValue = (value: number, label: string) => {
    if (label === 'Total Output') return `${(value / 1000).toFixed(1)}k kg`
    if (label === 'Avg Rate') return `${value.toFixed(1)} kg/hr`
    if (label === 'Active Sites') return value.toString()
    if (label === 'Efficiency') return `${value.toFixed(1)}%`
    return value.toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-mercury-dark-tertiary p-1">
          <button
            onClick={() => setMode('sites')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'sites'
                ? 'bg-mercury-amber text-mercury-dark'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Site Comparison
          </button>
          <button
            onClick={() => setMode('periods')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'periods'
                ? 'bg-mercury-amber text-mercury-dark'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Period Analysis
          </button>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'line'
                ? 'bg-mercury-amber/20 text-mercury-amber'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Line Chart"
          >
            <LineChartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-lg transition-colors ${
              chartType === 'bar'
                ? 'bg-mercury-amber/20 text-mercury-amber'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Selector (for site comparison) */}
        {mode === 'sites' && (
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as typeof metric)}
            className="bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
          >
            <option value="extractionRate">Extraction Rate (kg/hr)</option>
            <option value="dailyProgress">Daily Progress (kg)</option>
          </select>
        )}

        {/* Refresh Button */}
        <button className="btn-secondary flex items-center gap-2 ml-auto">
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Site Selection (for site comparison mode) */}
      {mode === 'sites' && (
        <div className="card">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Select Sites to Compare (max 6)</h3>
          <div className="flex flex-wrap gap-2">
            {miningSites.filter(s => s.status === 'active').map((site) => (
              <button
                key={site.id}
                onClick={() => toggleSite(site.id)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  selectedSites.includes(site.id)
                    ? 'bg-mercury-amber/20 text-mercury-amber border border-mercury-amber'
                    : 'bg-mercury-dark-tertiary text-gray-400 border border-transparent hover:text-gray-200'
                }`}
              >
                {selectedSites.includes(site.id) && (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: SITE_COLORS[selectedSites.indexOf(site.id) % SITE_COLORS.length] }}
                  />
                )}
                {site.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chart Area */}
      <div className="card">
        {mode === 'sites' ? (
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4">
              {metric === 'extractionRate' ? 'Extraction Rate Comparison' : 'Daily Progress Comparison'}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={siteComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    {selectedSites.map((siteId, index) => {
                      const site = miningSites.find(s => s.id === siteId)
                      return (
                        <Line
                          key={siteId}
                          type="monotone"
                          dataKey={siteId}
                          name={site?.name || siteId}
                          stroke={SITE_COLORS[index % SITE_COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      )
                    })}
                  </LineChart>
                ) : (
                  <BarChart data={siteComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Legend />
                    {selectedSites.map((siteId, index) => {
                      const site = miningSites.find(s => s.id === siteId)
                      return (
                        <Bar
                          key={siteId}
                          dataKey={siteId}
                          name={site?.name || siteId}
                          fill={SITE_COLORS[index % SITE_COLORS.length]}
                        />
                      )
                    })}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-4">
              Current vs Previous Period
            </h3>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {periodComparisonData.map((item) => (
                <div key={item.label} className="bg-mercury-dark-tertiary rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="text-xl font-semibold text-gray-100">
                    {formatValue(item.current, item.label)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(item.change)}
                    <span className={`text-sm ${
                      item.change > 0 ? 'text-status-success' : item.change < 0 ? 'text-status-error' : 'text-gray-400'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Period Comparison Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={periodComparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis type="category" dataKey="label" stroke="#9ca3af" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#f3f4f6' }}
                    formatter={(value) => [
                      typeof value === 'number' ? value.toLocaleString() : String(value),
                      ''
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="previous" name="Previous Period" fill="#6b7280" />
                  <Bar dataKey="current" name="Current Period" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {mode === 'sites' && selectedSites.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Highest Rate</p>
            <p className="text-lg font-semibold text-gray-100 mt-1">
              {(() => {
                const maxSite = selectedSites
                  .map(id => miningSites.find(s => s.id === id))
                  .filter(Boolean)
                  .reduce((max, site) =>
                    site!.extractionRate > (max?.extractionRate || 0) ? site! : max,
                    miningSites.find(s => s.id === selectedSites[0])
                  )
                return maxSite?.name || '-'
              })()}
            </p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Combined Output</p>
            <p className="text-lg font-semibold text-mercury-amber mt-1">
              {selectedSites
                .map(id => miningSites.find(s => s.id === id))
                .filter(Boolean)
                .reduce((sum, site) => sum + site!.dailyProgress, 0)
                .toLocaleString()} kg
            </p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Efficiency</p>
            <p className="text-lg font-semibold text-gray-100 mt-1">
              {(selectedSites
                .map(id => miningSites.find(s => s.id === id))
                .filter(Boolean)
                .reduce((sum, site) => sum + (site!.dailyProgress / site!.dailyTarget) * 100, 0) / selectedSites.length
              ).toFixed(1)}%
            </p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Sites Compared</p>
            <p className="text-lg font-semibold text-gray-100 mt-1">{selectedSites.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
