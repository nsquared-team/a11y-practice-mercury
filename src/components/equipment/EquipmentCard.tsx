import { Equipment, getEquipmentStatusColor, getDaysUntilMaintenance, getEquipmentTypeIcon } from '../../data/equipment'
import { Wrench, MapPin, Calendar } from 'lucide-react'

interface EquipmentCardProps {
  equipment: Equipment
  onClick: (equipment: Equipment) => void
}

export default function EquipmentCard({ equipment, onClick }: EquipmentCardProps) {
  const daysUntilMaintenance = getDaysUntilMaintenance(equipment)
  const statusColor = getEquipmentStatusColor(equipment.status)
  const typeIcon = getEquipmentTypeIcon(equipment.type)

  // Utilization bar color
  const getUtilizationColor = (util: number): string => {
    if (util > 80) return 'bg-status-active'
    if (util > 50) return 'bg-status-warning'
    if (util > 0) return 'bg-status-idle'
    return 'bg-mercury-dark-tertiary'
  }

  // Maintenance urgency indicator
  const getMaintenanceIndicator = () => {
    if (daysUntilMaintenance < 0) {
      return (
        <span className="text-xs text-status-error flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-status-error animate-pulse" />
          Overdue by {Math.abs(daysUntilMaintenance)} days
        </span>
      )
    }
    if (daysUntilMaintenance < 7) {
      return (
        <span className="text-xs text-status-warning flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-status-warning" />
          Due in {daysUntilMaintenance} days
        </span>
      )
    }
    return (
      <span className="text-xs text-gray-500 flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {daysUntilMaintenance} days
      </span>
    )
  }

  return (
    <div
      onClick={() => onClick(equipment)}
      className="card-hover cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{typeIcon}</div>
          <div>
            <p className="font-mono text-mercury-amber text-sm">{equipment.id}</p>
            <h3 className="font-medium text-gray-100 mt-0.5">{equipment.name}</h3>
            <p className="text-xs text-gray-500">{equipment.type}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded border ${statusColor}`}>
          {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
        </span>
      </div>

      {/* Utilization Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Utilization</span>
          <span className="text-gray-400">{equipment.utilization}%</span>
        </div>
        <div className="h-2 bg-mercury-dark rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${getUtilizationColor(equipment.utilization)}`}
            style={{ width: `${equipment.utilization}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="w-3 h-3" />
          <span className="text-gray-400 truncate">
            {equipment.assignedSite || 'Unassigned'}
          </span>
        </div>

        {/* Sensors Status */}
        <div className="flex items-center gap-2 text-gray-500">
          <Wrench className="w-3 h-3" />
          <span className="text-gray-400">
            {equipment.sensors.length} sensors
            {equipment.sensors.some(s => s.status === 'warning') && (
              <span className="text-status-warning ml-1">
                • {equipment.sensors.filter(s => s.status === 'warning').length} warning
              </span>
            )}
            {equipment.sensors.some(s => s.status === 'critical') && (
              <span className="text-status-error ml-1">
                • {equipment.sensors.filter(s => s.status === 'critical').length} critical
              </span>
            )}
          </span>
        </div>

        {/* Maintenance */}
        {getMaintenanceIndicator()}
      </div>
    </div>
  )
}
