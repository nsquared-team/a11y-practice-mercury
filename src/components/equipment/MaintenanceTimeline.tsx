import { useMemo } from 'react'
import {
  ScheduledMaintenance,
  getMaintenancePriorityColor,
  getEquipmentTypeIcon,
} from '../../data/equipment'
import { Clock, User, AlertTriangle, CheckCircle, Calendar, Wrench } from 'lucide-react'

interface MaintenanceTimelineProps {
  maintenanceTasks: ScheduledMaintenance[]
}

export default function MaintenanceTimeline({ maintenanceTasks }: MaintenanceTimelineProps) {
  const now = new Date()

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    const overdue: ScheduledMaintenance[] = []
    const today: ScheduledMaintenance[] = []
    const thisWeek: ScheduledMaintenance[] = []
    const upcoming: ScheduledMaintenance[] = []

    maintenanceTasks.forEach(task => {
      const daysDiff = Math.ceil((task.scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff < 0) {
        overdue.push(task)
      } else if (daysDiff === 0) {
        today.push(task)
      } else if (daysDiff <= 7) {
        thisWeek.push(task)
      } else {
        upcoming.push(task)
      }
    })

    return { overdue, today, thisWeek, upcoming }
  }, [maintenanceTasks])

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (hours: number): string => {
    if (hours === 1) return '1 hour'
    return `${hours} hours`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'routine':
        return <Wrench className="w-4 h-4" />
      case 'repair':
        return <AlertTriangle className="w-4 h-4" />
      case 'inspection':
        return <CheckCircle className="w-4 h-4" />
      case 'upgrade':
        return <Calendar className="w-4 h-4" />
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-status-error" />
      default:
        return <Wrench className="w-4 h-4" />
    }
  }

  const renderTaskCard = (task: ScheduledMaintenance, isOverdue: boolean = false) => {
    const priorityColor = getMaintenancePriorityColor(task.priority)
    const equipmentIcon = getEquipmentTypeIcon(task.equipmentType)
    const daysDiff = Math.ceil((task.scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return (
      <div
        key={task.id}
        className={`p-4 rounded-lg border ${
          isOverdue
            ? 'bg-status-error/5 border-status-error/30'
            : 'bg-mercury-dark border-mercury-dark-tertiary'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{equipmentIcon}</span>
            <div>
              <p className="font-mono text-sm text-mercury-amber">{task.equipmentId}</p>
              <p className="text-sm text-gray-300">{task.equipmentName}</p>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded border ${priorityColor}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>

        <div className="space-y-2">
          {/* Type and Description */}
          <div className="flex items-center gap-2 text-sm">
            {getTypeIcon(task.type)}
            <span className="text-gray-400 capitalize">{task.type}</span>
          </div>
          <p className="text-xs text-gray-500">{task.description}</p>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-2 border-t border-mercury-dark-tertiary">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(task.estimatedDuration)}
              </span>
              {task.assignedTechnician && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {task.assignedTechnician}
                </span>
              )}
            </div>
            <span className={`text-xs ${isOverdue ? 'text-status-error' : 'text-gray-500'}`}>
              {isOverdue ? `${Math.abs(daysDiff)} days overdue` : formatDate(task.scheduledDate)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const renderSection = (
    title: string,
    tasks: ScheduledMaintenance[],
    dotColor: string,
    isOverdue: boolean = false
  ) => {
    if (tasks.length === 0) return null

    return (
      <div className="relative">
        {/* Timeline dot */}
        <div className="absolute left-0 top-0 flex items-center justify-center w-8">
          <div className={`w-3 h-3 rounded-full ${dotColor}`} />
        </div>

        {/* Section content */}
        <div className="ml-12">
          <h3 className={`text-sm font-medium mb-3 ${isOverdue ? 'text-status-error' : 'text-gray-300'}`}>
            {title}
            <span className="ml-2 text-gray-500">({tasks.length})</span>
          </h3>
          <div className="space-y-3">
            {tasks.map(task => renderTaskCard(task, isOverdue))}
          </div>
        </div>
      </div>
    )
  }

  const totalTasks = maintenanceTasks.length

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-200">{totalTasks}</p>
            <p className="text-xs text-gray-500">Total Tasks</p>
          </div>
          {groupedTasks.overdue.length > 0 && (
            <div className="text-center px-4 border-l border-mercury-dark-tertiary">
              <p className="text-2xl font-semibold text-status-error">{groupedTasks.overdue.length}</p>
              <p className="text-xs text-gray-500">Overdue</p>
            </div>
          )}
          {groupedTasks.today.length > 0 && (
            <div className="text-center px-4 border-l border-mercury-dark-tertiary">
              <p className="text-2xl font-semibold text-mercury-amber">{groupedTasks.today.length}</p>
              <p className="text-xs text-gray-500">Today</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-mercury-dark-tertiary" />

        {/* Sections */}
        <div className="space-y-8">
          {renderSection('Overdue', groupedTasks.overdue, 'bg-status-error', true)}
          {renderSection('Today', groupedTasks.today, 'bg-mercury-amber')}
          {renderSection('This Week', groupedTasks.thisWeek, 'bg-status-warning')}
          {renderSection('Upcoming', groupedTasks.upcoming, 'bg-gray-500')}
        </div>
      </div>

      {totalTasks === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No maintenance tasks scheduled</p>
        </div>
      )}
    </div>
  )
}
