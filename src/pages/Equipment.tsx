import { useState, useMemo } from 'react'
import { Search, Plus, Wrench, Activity, AlertCircle, Filter, X } from 'lucide-react'
import {
  equipmentData,
  scheduledMaintenance,
  Equipment as EquipmentType,
  EquipmentStatus,
  EquipmentType as EquipType,
  filterEquipment,
  getEquipmentStats,
  availableEquipmentTypes,
  availableEquipmentStatuses,
} from '../data/equipment'
import EquipmentCard from '../components/equipment/EquipmentCard'
import MaintenanceTimeline from '../components/equipment/MaintenanceTimeline'
import DiagnosticPanel from '../components/equipment/DiagnosticPanel'
import EquipmentDetailModal from '../components/equipment/EquipmentDetailModal'
import MaintenanceRequestForm, { MaintenanceRequest } from '../components/equipment/MaintenanceRequestForm'

function Equipment() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'inventory' | 'maintenance' | 'diagnostics'>('inventory')
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null)
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false)
  const [maintenanceEquipment, setMaintenanceEquipment] = useState<EquipmentType | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<EquipType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<EquipmentStatus[]>([])

  // Get stats
  const stats = useMemo(() => getEquipmentStats(), [])

  // Filter equipment based on search and filters
  const filteredEquipment = useMemo(() => {
    return filterEquipment(equipmentData, {
      search: searchQuery,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    })
  }, [searchQuery, selectedTypes, selectedStatuses])

  const handleEquipmentClick = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment)
  }

  const handleCloseDetailModal = () => {
    setSelectedEquipment(null)
  }

  const handleRequestMaintenance = (equipment: EquipmentType) => {
    setMaintenanceEquipment(equipment)
    setShowMaintenanceForm(true)
    setSelectedEquipment(null)
  }

  const handleOpenMaintenanceForm = () => {
    // Open form with first equipment as default, or null
    setMaintenanceEquipment(filteredEquipment[0] || null)
    setShowMaintenanceForm(true)
  }

  const handleCloseMaintenanceForm = () => {
    setShowMaintenanceForm(false)
    setMaintenanceEquipment(null)
  }

  const handleSubmitMaintenance = (request: MaintenanceRequest) => {
    // In a real app, this would submit to an API
    console.log('Maintenance request submitted:', request)
    alert(`Maintenance request submitted for ${request.equipmentName}`)
    handleCloseMaintenanceForm()
  }

  const toggleTypeFilter = (type: EquipType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleStatusFilter = (status: EquipmentStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSelectedStatuses([])
    setSearchQuery('')
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedStatuses.length > 0 || searchQuery

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Equipment Monitoring</h1>
          <p className="text-gray-500 mt-1">
            {stats.total} units • {stats.byStatus.operational} operational • {stats.needingMaintenance} need maintenance
          </p>
        </div>
        <button
          onClick={handleOpenMaintenanceForm}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          Request Maintenance
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-semibold text-status-active">{stats.byStatus.operational}</p>
          <p className="text-xs text-gray-500">Operational</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-semibold text-status-idle">{stats.byStatus.idle}</p>
          <p className="text-xs text-gray-500">Idle</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-semibold text-status-warning">{stats.byStatus.maintenance}</p>
          <p className="text-xs text-gray-500">Maintenance</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-semibold text-status-error">{stats.byStatus.offline}</p>
          <p className="text-xs text-gray-500">Offline</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-mercury-dark-tertiary">
        {[
          { id: 'inventory', label: 'Inventory', icon: Wrench, count: stats.total },
          { id: 'maintenance', label: 'Maintenance Schedule', icon: AlertCircle, count: scheduledMaintenance.length },
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
            {tab.count !== undefined && (
              <span className="text-xs text-gray-500">({tab.count})</span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-mercury-amber"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'border-mercury-amber text-mercury-amber' : ''}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-mercury-amber" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-secondary flex items-center gap-2 text-gray-400"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Filters */}
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-3">Equipment Type</p>
                  <div className="flex flex-wrap gap-2">
                    {availableEquipmentTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleTypeFilter(type)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedTypes.includes(type)
                            ? 'border-mercury-amber bg-mercury-amber/10 text-mercury-amber'
                            : 'border-mercury-dark-tertiary text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filters */}
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-3">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {availableEquipmentStatuses.map(status => (
                      <button
                        key={status}
                        onClick={() => toggleStatusFilter(status)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                          selectedStatuses.includes(status)
                            ? 'border-mercury-amber bg-mercury-amber/10 text-mercury-amber'
                            : 'border-mercury-dark-tertiary text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-gray-500">
            Showing {filteredEquipment.length} of {stats.total} equipment units
          </p>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onClick={handleEquipmentClick}
              />
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="card text-center py-12">
              <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">No equipment found matching your criteria</p>
              <button
                onClick={clearFilters}
                className="text-mercury-amber hover:underline mt-2 text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="card">
          <MaintenanceTimeline maintenanceTasks={scheduledMaintenance} />
        </div>
      )}

      {activeTab === 'diagnostics' && (
        <DiagnosticPanel equipment={equipmentData} />
      )}

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={handleCloseDetailModal}
          onRequestMaintenance={handleRequestMaintenance}
        />
      )}

      {/* Maintenance Request Form Modal */}
      {showMaintenanceForm && maintenanceEquipment && (
        <MaintenanceRequestForm
          equipment={maintenanceEquipment}
          onClose={handleCloseMaintenanceForm}
          onSubmit={handleSubmitMaintenance}
        />
      )}
    </div>
  )
}

export default Equipment
