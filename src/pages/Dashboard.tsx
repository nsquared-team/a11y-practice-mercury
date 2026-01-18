import { Activity, Pickaxe, Users, AlertTriangle } from 'lucide-react'

function Dashboard() {
  // Placeholder data - will be replaced with real data fixtures
  const metrics = [
    {
      label: 'Total Extraction Today',
      value: '2,847',
      unit: 'kg',
      icon: Pickaxe,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      label: 'Active Equipment',
      value: '24',
      unit: 'units',
      icon: Activity,
      trend: '-2',
      trendUp: false,
    },
    {
      label: 'Personnel On Shift',
      value: '47',
      unit: 'workers',
      icon: Users,
      trend: 'Alpha Shift',
      trendUp: true,
    },
    {
      label: 'Safety Incidents',
      value: '0',
      unit: 'today',
      icon: AlertTriangle,
      trend: '14 days clear',
      trendUp: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Operations Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time overview of Mercury mining operations</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold data-display">{metric.value}</span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                <p
                  className={`text-xs mt-2 ${
                    metric.trendUp ? 'text-status-active' : 'text-status-warning'
                  }`}
                >
                  {metric.trend}
                </p>
              </div>
              <div className="p-2 bg-mercury-dark rounded-lg">
                <metric.icon className="w-5 h-5 text-mercury-amber" />
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
          <div className="h-64 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
            <p className="text-gray-500">Chart component will be implemented in Phase 2</p>
          </div>
        </div>

        {/* Alert Feed - Takes 1 column */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {[
              { severity: 'warning', message: 'Thermal Drill Unit 7 requires maintenance', time: '15m ago' },
              { severity: 'info', message: 'Shift change: Alpha to Beta in 2 hours', time: '1h ago' },
              { severity: 'success', message: 'Site CB-Alpha reached daily target', time: '2h ago' },
            ].map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'warning'
                    ? 'bg-status-warning/10 border-status-warning'
                    : alert.severity === 'success'
                      ? 'bg-status-active/10 border-status-active'
                      : 'bg-mercury-dark-tertiary border-mercury-gray'
                }`}
              >
                <p className="text-sm text-gray-200">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Status Grid */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Equipment Status Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {Array.from({ length: 24 }, (_, i) => {
            const statuses = ['operational', 'operational', 'operational', 'idle', 'maintenance', 'offline']
            const status = statuses[Math.floor(Math.random() * statuses.length)]
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-mono ${
                  status === 'operational'
                    ? 'bg-status-active/20 text-status-active border border-status-active/30'
                    : status === 'idle'
                      ? 'bg-status-idle/20 text-status-idle border border-status-idle/30'
                      : status === 'maintenance'
                        ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                        : 'bg-status-error/20 text-status-error border border-status-error/30'
                }`}
              >
                {(i + 1).toString().padStart(2, '0')}
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-active/20 border border-status-active/30"></span>
            Operational
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-idle/20 border border-status-idle/30"></span>
            Idle
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-warning/20 border border-status-warning/30"></span>
            Maintenance
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-status-error/20 border border-status-error/30"></span>
            Offline
          </span>
        </div>
      </div>

      {/* Commodity Prices */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Commodity Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Mercurium', symbol: 'MRC', price: 12450, change: 2.3 },
            { name: 'Solar Platinum', symbol: 'SPT', price: 8720, change: -1.2 },
            { name: 'Thermal Crystals', symbol: 'THC', price: 3280, change: 5.7 },
          ].map((commodity) => (
            <div key={commodity.symbol} className="p-4 bg-mercury-dark rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{commodity.name}</p>
                  <p className="text-xs text-mercury-gray font-mono">{commodity.symbol}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    commodity.change >= 0
                      ? 'bg-status-active/20 text-status-active'
                      : 'bg-status-error/20 text-status-error'
                  }`}
                >
                  {commodity.change >= 0 ? '+' : ''}
                  {commodity.change}%
                </span>
              </div>
              <p className="text-2xl font-bold data-display mt-2">
                {commodity.price.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal ml-1">cr/kg</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
