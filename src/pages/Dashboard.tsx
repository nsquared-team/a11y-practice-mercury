import { Activity, Pickaxe, Users, AlertTriangle, RefreshCw } from 'lucide-react'
import ExtractionChart from '../components/dashboard/ExtractionChart'
import { useSimulation, useSimulationMetrics } from '../hooks/useSimulation'
import { getSeverityColor, formatAlertTime } from '../data/alerts'

function Dashboard() {
  const simulation = useSimulation()
  const metrics = useSimulationMetrics(simulation)

  const metricCards = [
    {
      label: 'Total Extraction Today',
      value: metrics.totalExtractionToday.toLocaleString(),
      unit: 'kg',
      icon: Pickaxe,
      trend: `+${((metrics.totalExtractionToday / 25000) * 100).toFixed(1)}%`,
      trendUp: true,
    },
    {
      label: 'Active Equipment',
      value: metrics.activeEquipmentCount.toString(),
      unit: 'units',
      icon: Activity,
      trend: `${metrics.equipmentStatusCounts.maintenance} in maintenance`,
      trendUp: metrics.equipmentStatusCounts.offline === 0,
    },
    {
      label: 'Personnel On Shift',
      value: metrics.personnelOnShift.toString(),
      unit: 'workers',
      icon: Users,
      trend: 'Alpha Shift',
      trendUp: true,
    },
    {
      label: 'Active Alerts',
      value: metrics.unreadAlertCount.toString(),
      unit: 'unread',
      icon: AlertTriangle,
      trend: metrics.unreadAlertCount === 0 ? 'All clear' : 'Attention needed',
      trendUp: metrics.unreadAlertCount === 0,
    },
  ]

  // Get recent alerts (top 5)
  const recentAlerts = simulation.alerts.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Operations Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Real-time overview of Mercury mining operations
            {simulation.isRunning && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-mercury-amber">
                <span className="w-2 h-2 bg-mercury-amber rounded-full animate-pulse"></span>
                Live
              </span>
            )}
          </p>
        </div>
        <button
          onClick={simulation.refreshData}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg hover:border-mercury-amber/50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Key Metrics Cards */}
      {/* A11Y ISSUE: Metric icons convey meaning but have no accessible text alternative */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => (
          <div key={metric.label} className="card-hover">
            <div className="flex items-start justify-between">
              <div>
                {/* A11Y ISSUE: Low contrast - gray-600 on dark background fails WCAG 1.4.3 */}
                <p className="text-sm text-gray-600">{metric.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold data-display">{metric.value}</span>
                  <span className="text-sm text-gray-600">{metric.unit}</span>
                </div>
                {/* A11Y ISSUE: Color-only indicator - trend direction conveyed only by color */}
                <p
                  className={`text-xs mt-2 ${
                    metric.trendUp ? 'text-status-active' : 'text-status-warning'
                  }`}
                >
                  {metric.trend}
                </p>
              </div>
              <div className="p-2 bg-mercury-dark rounded-lg">
                {/* A11Y ISSUE: Icon has no accessible name */}
                <metric.icon className="w-5 h-5 text-mercury-amber" aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Extraction Chart - Takes 2 columns */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Extraction Rate (24h)</h2>
          <ExtractionChart data={simulation.extractionData} />
        </div>

        {/* Alert Feed - Takes 1 column */}
        {/* A11Y ISSUE: Missing aria-live region for dynamic content */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-100">Recent Alerts</h2>
            {metrics.unreadAlertCount > 0 && (
              <span className="text-xs px-2 py-1 bg-status-warning/20 text-status-warning rounded">
                {metrics.unreadAlertCount} unread
              </span>
            )}
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              // A11Y ISSUE: Non-keyboard accessible - div with onClick but no keyboard support
              // A11Y ISSUE: Missing focus indicator - no visible focus state
              // A11Y ISSUE: Color-only - unread indicator is just a colored dot
              <div
                key={alert.id}
                onClick={() => simulation.markAlertRead(alert.id)}
                className={`p-3 rounded-lg border-l-4 cursor-pointer transition-opacity ${
                  getSeverityColor(alert.severity)
                } ${alert.isRead ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-200 font-medium">{alert.title}</p>
                  {!alert.isRead && (
                    // A11Y ISSUE: Color-only indicator with no text alternative
                    <span className="w-2 h-2 bg-mercury-amber rounded-full flex-shrink-0 mt-1" aria-hidden="true"></span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                {/* A11Y ISSUE: Low contrast timestamp text */}
                <p className="text-xs text-gray-600 mt-2">{formatAlertTime(alert.timestamp)}</p>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Status Grid */}
      {/* A11Y ISSUE: Color-only status - equipment status conveyed entirely through color */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Equipment Status Overview</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {simulation.equipment.slice(0, 35).map((equip) => (
            // A11Y ISSUE: Not keyboard accessible - status info only in title attribute
            // A11Y ISSUE: Color-only status indication
            <div
              key={equip.id}
              title={`${equip.name} - ${equip.status}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-mono cursor-default ${
                equip.status === 'operational'
                  ? 'bg-status-active/20 text-status-active border border-status-active/30'
                  : equip.status === 'idle'
                    ? 'bg-status-idle/20 text-status-idle border border-status-idle/30'
                    : equip.status === 'maintenance'
                      ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                      : 'bg-status-error/20 text-status-error border border-status-error/30'
              }`}
            >
              {equip.id.split('-')[1]}
            </div>
          ))}
        </div>
        {/* A11Y ISSUE: Legend uses color-only indicators without text patterns */}
        {/* A11Y ISSUE: Low contrast text in legend - gray-600 */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-active/20 border border-status-active/30"></span>
            Operational ({metrics.equipmentStatusCounts.operational})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-idle/20 border border-status-idle/30"></span>
            Idle ({metrics.equipmentStatusCounts.idle})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-warning/20 border border-status-warning/30"></span>
            Maintenance ({metrics.equipmentStatusCounts.maintenance})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-error/20 border border-status-error/30"></span>
            Offline ({metrics.equipmentStatusCounts.offline})
          </span>
        </div>
      </div>

      {/* Commodity Prices */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Commodity Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {simulation.commodities.map((commodity) => (
            <div key={commodity.symbol} className="p-4 bg-mercury-dark rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  {/* A11Y ISSUE: Low contrast text */}
                  <p className="text-sm text-gray-600">{commodity.name}</p>
                  <p className="text-xs text-gray-700 font-mono">{commodity.symbol}</p>
                </div>
                {/* A11Y ISSUE: Color-only indicator - price change shown only in color (green/red) */}
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    commodity.change24h >= 0
                      ? 'bg-status-active/20 text-status-active'
                      : 'bg-status-error/20 text-status-error'
                  }`}
                >
                  {commodity.change24h >= 0 ? '+' : ''}
                  {commodity.change24h.toFixed(1)}%
                </span>
              </div>
              <p className="text-2xl font-bold data-display mt-2">
                {commodity.price.toLocaleString()}
                <span className="text-sm text-gray-600 font-normal ml-1">cr/kg</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Last Update Timestamp */}
      <div className="text-center text-xs text-gray-600">
        Last updated: {simulation.lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  )
}

export default Dashboard
