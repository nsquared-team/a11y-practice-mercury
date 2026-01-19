import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
import {
  Personnel,
  personnelData,
  getFullName,
  getInitials,
  Shift,
} from '../../data/personnel'

// Get the week days starting from a given date
function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  const start = new Date(startDate)
  // Adjust to Monday
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1)
  start.setDate(diff)

  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push(date)
  }
  return days
}

// Format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// Format date as key
function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Check if date is today
function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// Draggable personnel card
interface DraggablePersonnelProps {
  person: Personnel
  isOverlay?: boolean
}

function DraggablePersonnel({ person, isOverlay = false }: DraggablePersonnelProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: person.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const shiftColors = {
    Alpha: 'border-l-purple-500',
    Beta: 'border-l-cyan-500',
    Gamma: 'border-l-orange-500',
  }

  return (
    <div
      ref={setNodeRef}
      style={isOverlay ? {} : style}
      {...attributes}
      className={`bg-mercury-dark rounded p-2 border-l-2 ${shiftColors[person.shift]} ${
        isDragging ? 'shadow-lg ring-2 ring-mercury-amber' : ''
      } ${isOverlay ? 'shadow-2xl ring-2 ring-mercury-amber' : ''}`}
    >
      <div className="flex items-center gap-2">
        <button
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-mercury-dark-tertiary rounded"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-3 h-3 text-gray-500" />
        </button>
        <div className="w-6 h-6 bg-mercury-dark-tertiary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-mercury-amber">
            {getInitials(person)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-200 truncate">{getFullName(person)}</p>
          <p className="text-[10px] text-gray-500 truncate">{person.role}</p>
        </div>
      </div>
    </div>
  )
}

// Drop zone for a shift slot
interface ShiftSlotProps {
  shift: Shift
  date: Date
  personnel: Personnel[]
  onDrop: (personnelId: string, targetShift: Shift, targetDate: Date) => void
}

function ShiftSlot({ shift, date, personnel }: ShiftSlotProps) {
  const dateKey = formatDateKey(date)
  const slotId = `${shift}-${dateKey}`

  const shiftBgColors = {
    Alpha: 'bg-purple-500/5',
    Beta: 'bg-cyan-500/5',
    Gamma: 'bg-orange-500/5',
  }

  return (
    <div
      className={`min-h-[100px] p-2 rounded ${shiftBgColors[shift]} border border-mercury-dark-tertiary`}
      data-slot-id={slotId}
    >
      <SortableContext
        items={personnel.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {personnel.map(person => (
            <DraggablePersonnel key={person.id} person={person} />
          ))}
          {personnel.length === 0 && (
            <p className="text-[10px] text-gray-600 text-center py-4">
              Drop here
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

// Main Shift Schedule component
export default function ShiftSchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now)
    monday.setDate(diff)
    return monday
  })

  // Local state for schedule (simulating assignments)
  const [scheduleOverrides, setScheduleOverrides] = useState<Map<string, { shift: Shift; dateKey: string }>>(
    new Map()
  )

  const [activeId, setActiveId] = useState<string | null>(null)

  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  // Get personnel for a specific shift and day
  const getPersonnelForSlot = (shift: Shift, date: Date): Personnel[] => {
    const dateKey = formatDateKey(date)

    return personnelData.filter(person => {
      // Check if there's an override for this person
      const override = scheduleOverrides.get(person.id)
      if (override) {
        return override.shift === shift && override.dateKey === dateKey
      }
      // Default: show in their assigned shift for all days (simplified)
      return person.shift === shift
    })
  }

  // Navigation
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  const goToToday = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now)
    monday.setDate(diff)
    setCurrentWeekStart(monday)
  }

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activePersonId = active.id as string

    // For now, just log the drag - full implementation would parse the drop target
    // and update the scheduleOverrides state
    console.log(`Moved ${activePersonId} to ${over.id}`)

    // In a full implementation, you'd parse over.id to get the target shift and date
    // and update scheduleOverrides accordingly
  }

  const activePerson = activeId ? personnelData.find(p => p.id === activeId) : null

  const shifts: Shift[] = ['Alpha', 'Beta', 'Gamma']

  const shiftLabels = {
    Alpha: { label: 'Alpha Shift', time: '06:00 - 14:00', color: 'text-purple-400' },
    Beta: { label: 'Beta Shift', time: '14:00 - 22:00', color: 'text-cyan-400' },
    Gamma: { label: 'Gamma Shift', time: '22:00 - 06:00', color: 'text-orange-400' },
  }

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm text-mercury-amber hover:bg-mercury-amber/10 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
        <h3 className="text-lg font-medium text-gray-200">
          {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="text-sm text-gray-500">
          Week of {formatDate(weekDays[0])}
        </div>
      </div>

      {/* Schedule Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header Row - Days */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="p-2" /> {/* Empty cell for shift labels */}
              {weekDays.map(day => (
                <div
                  key={formatDateKey(day)}
                  className={`p-2 text-center rounded-lg ${
                    isToday(day) ? 'bg-mercury-amber/20 border border-mercury-amber/30' : 'bg-mercury-dark'
                  }`}
                >
                  <p className={`text-sm font-medium ${isToday(day) ? 'text-mercury-amber' : 'text-gray-300'}`}>
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-xs ${isToday(day) ? 'text-mercury-amber' : 'text-gray-500'}`}>
                    {day.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Shift Rows */}
            {shifts.map(shift => (
              <div key={shift} className="grid grid-cols-8 gap-2 mb-2">
                {/* Shift Label */}
                <div className="p-2 flex flex-col justify-center">
                  <p className={`text-sm font-medium ${shiftLabels[shift].color}`}>
                    {shiftLabels[shift].label}
                  </p>
                  <p className="text-[10px] text-gray-500">{shiftLabels[shift].time}</p>
                </div>

                {/* Day Slots */}
                {weekDays.map(day => (
                  <ShiftSlot
                    key={`${shift}-${formatDateKey(day)}`}
                    shift={shift}
                    date={day}
                    personnel={getPersonnelForSlot(shift, day)}
                    onDrop={() => {}}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activePerson ? <DraggablePersonnel person={activePerson} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-mercury-dark-tertiary">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500/30 border-l-2 border-purple-500" />
          <span className="text-xs text-gray-500">Alpha Shift</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-500/30 border-l-2 border-cyan-500" />
          <span className="text-xs text-gray-500">Beta Shift</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500/30 border-l-2 border-orange-500" />
          <span className="text-xs text-gray-500">Gamma Shift</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-gray-500 text-center">
        Drag personnel cards between shifts to reassign. Changes are for demonstration only.
      </p>
    </div>
  )
}
