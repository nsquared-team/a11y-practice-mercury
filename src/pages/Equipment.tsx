import { useState } from 'react'
import { Search, Plus, Wrench, Activity, AlertCircle } from 'lucide-react'

function Equipment() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'inventory' | 'maintenance' | 'diagnostics'>('inventory')

  // Placeholder data
  const equipment = [
    { id: 'TDU-007', name: 'Thermal Drill Unit 7', type: 'Thermal Drill Unit', status: 'operational', utilization: 87, site: 'Caloris Basin Alpha' },
    { id: 'TDU-012', name: 'Thermal Drill Unit 12', type: 'Thermal Drill Unit', status: 'maintenance', utilization: 0, site: 'Caloris Basin Beta' },
    { id: 'CH-003', name: 'Conveyor Hauler 3', type: 'Conveyor Hauler', status: 'operational', utilization: 92, site: 'Rachmaninoff Crater Deep' },
    { id: 'PM-001', name: 'Processing Module 1', type: 'Processing Module', status: 'operational', utilization: 78, site: 'Raditladi Thermal Zone' },
    { id: 'ES-005', name: 'Environmental Shield 5', type: 'Environmental Shield', status: 'idle', utilization: 0, site: 'Polar Shadow Mine' },
    { id: 'SA-002', name: 'Sensor Array 2', type: 'Sensor Array', status: 'operational', utilization: 100, site: 'Caloris Basin Alpha' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-status-active border-status-active/30 bg-status-active/10'
      case 'idle':
        return 'text-status-idle border-status-idle/30 bg-status-idle/10'
      case 'maintenance':
        return 'text-status-warning border-status-warning/30 bg-status-warning/10'
      case 'offline':
        return 'text-status-error border-status-error/30 bg-status-error/10'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Equipment Monitoring</h1>
          <p className="text-gray-500 mt-1">Track equipment status and maintenance schedules</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Request Maintenance
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-mercury-dark-tertiary">
        {[
          { id: 'inventory', label: 'Inventory', icon: Wrench },
          { id: 'maintenance', label: 'Maintenance Schedule', icon: AlertCircle },
          { id: 'diagnostics', label: 'Diagnostics', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-mercury-amber'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-mercury-amber"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
            />
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <div key={item.id} className="card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-mercury-amber text-sm">{item.id}</p>
                    <h3 className="font-medium text-gray-100 mt-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                {/* Utilization Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Utilization</span>
                    <span className="text-gray-400">{item.utilization}%</span>
                  </div>
                  <div className="h-2 bg-mercury-dark rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.utilization > 80
                          ? 'bg-status-active'
                          : item.utilization > 50
                            ? 'bg-status-warning'
                            : item.utilization > 0
                              ? 'bg-status-idle'
                              : 'bg-mercury-dark-tertiary'
                      }`}
                      style={{ width: `${item.utilization}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Assigned to: <span className="text-gray-400">{item.site}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="card">
          <div className="h-96 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
            <p className="text-gray-500">Maintenance Schedule Timeline will be implemented in Phase 5</p>
          </div>
        </div>
      )}

      {activeTab === 'diagnostics' && (
        <div className="card">
          <div className="h-96 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
            <p className="text-gray-500">Diagnostic Panel with Gauges will be implemented in Phase 5</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Equipment
