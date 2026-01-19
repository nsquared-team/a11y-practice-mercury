import { useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {
  Equipment,
  SensorReading,
  getEquipmentStatusColor,
  getEquipmentTypeIcon,
  getDaysUntilMaintenance,
} from '../../data/equipment'
import {
  X,
  MapPin,
  Calendar,
  Wrench,
  Activity,
  Info,
  History,
  AlertTriangle,
  CheckCircle,
  Zap,
  Thermometer,
  Weight,
} from 'lucide-react'

interface EquipmentDetailModalProps {
  equipment: Equipment
  onClose: () => void
  onRequestMaintenance: (equipment: Equipment) => void
}

export default function EquipmentDetailModal({
  equipment,
  onClose,
  onRequestMaintenance,
}: EquipmentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'history'>('overview')

  const statusColor = getEquipmentStatusColor(equipment.status)
  const typeIcon = getEquipmentTypeIcon(equipment.type)
  const daysUntilMaintenance = getDaysUntilMaintenance(equipment)

  // Get gauge color based on status
  const getGaugeColor = (sensor: SensorReading): string => {
    switch (sensor.status) {
      case 'critical':
        return '#ef4444'
      case 'warning':
        return '#f59e0b'
      case 'normal':
      default:
        return '#22c55e'
    }
  }

  const getTrailColor = (sensor: SensorReading): string => {
    switch (sensor.status) {
      case 'critical':
        return 'rgba(239, 68, 68, 0.15)'
      case 'warning':
        return 'rgba(245, 158, 11, 0.15)'
      case 'normal':
      default:
        return 'rgba(34, 197, 94, 0.15)'
    }
  }

  const calculatePercentage = (sensor: SensorReading): number => {
    const range = sensor.max - sensor.min
    const value = Math.max(sensor.min, Math.min(sensor.max, sensor.value))
    return ((value - sensor.min) / range) * 100
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatValue = (value: number, unit: string): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value.toFixed(unit === '%' || unit === 'atm' ? 1 : 0)
  }

  const warningCount = equipment.sensors.filter(s => s.status === 'warning').length
  const criticalCount = equipment.sensors.filter(s => s.status === 'critical').length

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-mercury-dark-tertiary">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{typeIcon}</div>
            <div>
              <p className="font-mono text-mercury-amber">{equipment.id}</p>
              <h2 className="text-xl font-semibold text-gray-100">{equipment.name}</h2>
              <p className="text-sm text-gray-500">{equipment.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm px-3 py-1.5 rounded border ${statusColor}`}>
              {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-mercury-dark-tertiary">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'sensors', label: 'Sensors', icon: Activity },
            { id: 'history', label: 'Maintenance History', icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-mercury-amber' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'sensors' && (warningCount > 0 || criticalCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-status-warning" />
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-mercury-amber" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Details */}
              <div className="space-y-6">
                {/* Location & Assignment */}
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Location & Assignment</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-gray-200">{equipment.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-400">Assigned Site</p>
                        <p className="text-gray-200">{equipment.assignedSite || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Info */}
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Maintenance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-400">Last Maintenance</p>
                        <p className="text-gray-200">{formatDate(equipment.lastMaintenance)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-400">Next Maintenance</p>
                        <p
                          className={
                            daysUntilMaintenance < 0
                              ? 'text-status-error'
                              : daysUntilMaintenance < 7
                                ? 'text-status-warning'
                                : 'text-gray-200'
                          }
                        >
                          {formatDate(equipment.nextMaintenance)}
                          {daysUntilMaintenance < 0 && (
                            <span className="ml-2 text-xs">
                              ({Math.abs(daysUntilMaintenance)} days overdue)
                            </span>
                          )}
                          {daysUntilMaintenance >= 0 && daysUntilMaintenance < 7 && (
                            <span className="ml-2 text-xs">({daysUntilMaintenance} days)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-400">Install Date</p>
                        <p className="text-gray-200">{formatDate(equipment.installDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Specifications & Utilization */}
              <div className="space-y-6">
                {/* Utilization */}
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Utilization</h3>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24">
                      <CircularProgressbar
                        value={equipment.utilization}
                        text={`${equipment.utilization}%`}
                        styles={buildStyles({
                          textSize: '20px',
                          pathColor:
                            equipment.utilization > 80
                              ? '#22c55e'
                              : equipment.utilization > 50
                                ? '#f59e0b'
                                : '#6b7280',
                          textColor: '#d1d5db',
                          trailColor: 'rgba(255, 255, 255, 0.1)',
                        })}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Current Utilization</p>
                      <p className="text-2xl font-semibold text-gray-200">
                        {equipment.utilization}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {equipment.status === 'operational'
                          ? 'Running normally'
                          : equipment.status === 'idle'
                            ? 'Standing by'
                            : equipment.status === 'maintenance'
                              ? 'Under maintenance'
                              : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Specifications</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Manufacturer</span>
                      <span className="text-gray-300">
                        {equipment.specifications.manufacturer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Model</span>
                      <span className="text-gray-300 font-mono">
                        {equipment.specifications.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Serial Number</span>
                      <span className="text-gray-300 font-mono">
                        {equipment.specifications.serialNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Power
                      </span>
                      <span className="text-gray-300">
                        {equipment.specifications.powerConsumption} kW
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Thermometer className="w-3 h-3" /> Temp Range
                      </span>
                      <span className="text-gray-300">
                        {equipment.specifications.operatingTemp.min}°C to{' '}
                        {equipment.specifications.operatingTemp.max}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Weight className="w-3 h-3" /> Weight
                      </span>
                      <span className="text-gray-300">
                        {equipment.specifications.weight.toLocaleString()} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sensors' && (
            <div className="space-y-4">
              {/* Sensor Status Summary */}
              <div className="flex items-center gap-4 mb-6">
                {criticalCount > 0 && (
                  <span className="flex items-center gap-1 text-sm text-status-error bg-status-error/10 px-3 py-1.5 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    {criticalCount} Critical
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="flex items-center gap-1 text-sm text-status-warning bg-status-warning/10 px-3 py-1.5 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    {warningCount} Warning
                  </span>
                )}
                {warningCount === 0 && criticalCount === 0 && (
                  <span className="flex items-center gap-1 text-sm text-status-active bg-status-active/10 px-3 py-1.5 rounded">
                    <CheckCircle className="w-4 h-4" />
                    All Sensors Normal
                  </span>
                )}
              </div>

              {/* Sensor Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {equipment.sensors.map(sensor => {
                  const percentage = calculatePercentage(sensor)
                  const color = getGaugeColor(sensor)
                  const trailColor = getTrailColor(sensor)

                  return (
                    <div
                      key={sensor.id}
                      className={`p-4 rounded-lg border ${
                        sensor.status === 'critical'
                          ? 'bg-status-error/5 border-status-error/30'
                          : sensor.status === 'warning'
                            ? 'bg-status-warning/5 border-status-warning/30'
                            : 'bg-mercury-dark border-mercury-dark-tertiary'
                      }`}
                    >
                      <div className="w-20 h-20 mx-auto mb-3">
                        <CircularProgressbar
                          value={percentage}
                          text={`${formatValue(sensor.value, sensor.unit)}`}
                          styles={buildStyles({
                            textSize: '22px',
                            pathTransitionDuration: 0.5,
                            pathColor: color,
                            textColor: color,
                            trailColor: trailColor,
                          })}
                        />
                      </div>
                      <p className="text-sm text-gray-300 text-center font-medium">{sensor.name}</p>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {sensor.min} - {sensor.max} {sensor.unit}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {equipment.maintenanceHistory.length > 0 ? (
                <div className="space-y-3">
                  {equipment.maintenanceHistory.map(record => (
                    <div
                      key={record.id}
                      className="card flex items-start gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          record.type === 'repair'
                            ? 'bg-status-warning/10 text-status-warning'
                            : record.type === 'emergency'
                              ? 'bg-status-error/10 text-status-error'
                              : 'bg-mercury-dark text-gray-400'
                        }`}
                      >
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-200 capitalize">
                            {record.type}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{record.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Technician: {record.technician}</span>
                          <span>Duration: {record.duration}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No maintenance history available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-mercury-dark-tertiary">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button onClick={() => onRequestMaintenance(equipment)} className="btn-primary">
            <Wrench className="w-4 h-4 mr-2" />
            Request Maintenance
          </button>
        </div>
      </div>
    </div>
  )
}
