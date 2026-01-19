import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Equipment, SensorReading } from '../../data/equipment'
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react'

interface DiagnosticPanelProps {
  equipment: Equipment[]
}

export default function DiagnosticPanel({ equipment }: DiagnosticPanelProps) {
  // Get operational equipment with sensors
  const activeEquipment = equipment.filter(
    e => e.status === 'operational' || e.status === 'idle'
  )

  // Calculate aggregate sensor stats
  const sensorStats = {
    total: 0,
    normal: 0,
    warning: 0,
    critical: 0,
  }

  activeEquipment.forEach(e => {
    e.sensors.forEach(s => {
      sensorStats.total++
      sensorStats[s.status]++
    })
  })

  // Get gauge color based on percentage and status
  const getGaugeColor = (sensor: SensorReading): string => {
    switch (sensor.status) {
      case 'critical':
        return '#ef4444' // red
      case 'warning':
        return '#f59e0b' // amber
      case 'normal':
      default:
        return '#22c55e' // green
    }
  }

  // Get trail color (background)
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

  // Calculate percentage for gauge
  const calculatePercentage = (sensor: SensorReading): number => {
    const range = sensor.max - sensor.min
    const value = Math.max(sensor.min, Math.min(sensor.max, sensor.value))
    return ((value - sensor.min) / range) * 100
  }

  // Format sensor value for display
  const formatValue = (value: number, unit: string): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value.toFixed(unit === '%' || unit === 'atm' ? 1 : 0)
  }

  const renderSensorGauge = (sensor: SensorReading, equipmentId: string) => {
    const percentage = calculatePercentage(sensor)
    const color = getGaugeColor(sensor)
    const trailColor = getTrailColor(sensor)

    return (
      <div
        key={`${equipmentId}-${sensor.id}`}
        className="flex flex-col items-center p-3 bg-mercury-dark rounded-lg border border-mercury-dark-tertiary"
      >
        <div className="w-20 h-20 mb-2">
          <CircularProgressbar
            value={percentage}
            text={`${formatValue(sensor.value, sensor.unit)}`}
            styles={buildStyles({
              textSize: '22px',
              pathTransitionDuration: 0.5,
              pathColor: color,
              textColor: color,
              trailColor: trailColor,
              backgroundColor: 'transparent',
            })}
          />
        </div>
        <p className="text-xs text-gray-400 text-center font-medium">{sensor.name}</p>
        <p className="text-[10px] text-gray-500">
          {sensor.min} - {sensor.max} {sensor.unit}
        </p>
      </div>
    )
  }

  const renderEquipmentDiagnostics = (equip: Equipment) => {
    const warningCount = equip.sensors.filter(s => s.status === 'warning').length
    const criticalCount = equip.sensors.filter(s => s.status === 'critical').length
    const hasIssues = warningCount > 0 || criticalCount > 0

    return (
      <div
        key={equip.id}
        className={`card ${hasIssues ? 'border-status-warning/30' : 'border-mercury-dark-tertiary'}`}
      >
        {/* Equipment Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-mercury-amber text-sm">{equip.id}</p>
            <h3 className="font-medium text-gray-100">{equip.name}</h3>
            <p className="text-xs text-gray-500">{equip.location}</p>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-status-error bg-status-error/10 px-2 py-1 rounded">
                <AlertTriangle className="w-3 h-3" />
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-status-warning bg-status-warning/10 px-2 py-1 rounded">
                <AlertTriangle className="w-3 h-3" />
                {warningCount} Warning
              </span>
            )}
            {!hasIssues && (
              <span className="flex items-center gap-1 text-xs text-status-active bg-status-active/10 px-2 py-1 rounded">
                <CheckCircle className="w-3 h-3" />
                All Normal
              </span>
            )}
          </div>
        </div>

        {/* Sensor Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {equip.sensors.map(sensor => renderSensorGauge(sensor, equip.id))}
        </div>
      </div>
    )
  }

  // Filter to show equipment with issues first, then by utilization
  const sortedEquipment = [...activeEquipment].sort((a, b) => {
    const aIssues = a.sensors.filter(s => s.status !== 'normal').length
    const bIssues = b.sensors.filter(s => s.status !== 'normal').length
    if (aIssues !== bIssues) return bIssues - aIssues
    return b.utilization - a.utilization
  })

  // Show top 6 equipment with most activity/issues
  const displayEquipment = sortedEquipment.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <Activity className="w-6 h-6 text-mercury-amber mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-200">{sensorStats.total}</p>
          <p className="text-xs text-gray-500">Active Sensors</p>
        </div>
        <div className="card text-center">
          <CheckCircle className="w-6 h-6 text-status-active mx-auto mb-2" />
          <p className="text-2xl font-semibold text-status-active">{sensorStats.normal}</p>
          <p className="text-xs text-gray-500">Normal</p>
        </div>
        <div className="card text-center">
          <AlertTriangle className="w-6 h-6 text-status-warning mx-auto mb-2" />
          <p className="text-2xl font-semibold text-status-warning">{sensorStats.warning}</p>
          <p className="text-xs text-gray-500">Warnings</p>
        </div>
        <div className="card text-center">
          <AlertTriangle className="w-6 h-6 text-status-error mx-auto mb-2" />
          <p className="text-2xl font-semibold text-status-error">{sensorStats.critical}</p>
          <p className="text-xs text-gray-500">Critical</p>
        </div>
      </div>

      {/* Equipment Diagnostics */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400">
          Real-time Equipment Diagnostics
          <span className="text-gray-500 ml-2">
            (Showing {displayEquipment.length} of {activeEquipment.length} active units)
          </span>
        </h3>
        {displayEquipment.map(equip => renderEquipmentDiagnostics(equip))}
      </div>

      {activeEquipment.length === 0 && (
        <div className="card text-center py-12">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No active equipment to monitor</p>
        </div>
      )}
    </div>
  )
}
