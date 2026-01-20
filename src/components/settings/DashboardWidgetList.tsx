import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { DashboardWidget } from '../../context/SettingsContext'

interface DashboardWidgetListProps {
  widgets: DashboardWidget[]
  onReorder: (widgets: DashboardWidget[]) => void
  onToggle: (widgetId: string) => void
  onReset: () => void
}

interface SortableWidgetItemProps {
  widget: DashboardWidget
  onToggle: (widgetId: string) => void
}

function SortableWidgetItem({ widget, onToggle }: SortableWidgetItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-mercury-dark-secondary rounded-lg border border-mercury-dark-tertiary ${
        isDragging ? 'opacity-50 shadow-lg shadow-mercury-amber/20' : ''
      } ${!widget.enabled ? 'opacity-60' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-300 transition-colors"
        aria-label={`Drag to reorder ${widget.name}`}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <span className={`text-sm ${widget.enabled ? 'text-gray-200' : 'text-gray-500'}`}>
          {widget.name}
        </span>
      </div>

      <button
        onClick={() => onToggle(widget.id)}
        className={`p-2 rounded-lg transition-colors ${
          widget.enabled
            ? 'text-mercury-amber hover:bg-mercury-dark-tertiary'
            : 'text-gray-500 hover:bg-mercury-dark-tertiary hover:text-gray-300'
        }`}
        aria-label={widget.enabled ? `Hide ${widget.name}` : `Show ${widget.name}`}
      >
        {widget.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  )
}

function DashboardWidgetList({ widgets, onReorder, onToggle, onReset }: DashboardWidgetListProps) {
  const [items, setItems] = useState(widgets)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index,
        }))
        onReorder(newItems)
        return newItems
      })
    }
  }

  // Sync items with parent when widgets prop changes
  if (JSON.stringify(items.map(i => ({ id: i.id, enabled: i.enabled }))) !==
      JSON.stringify(widgets.map(w => ({ id: w.id, enabled: w.enabled })))) {
    setItems(widgets)
  }

  const enabledCount = widgets.filter((w) => w.enabled).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {enabledCount} of {widgets.length} widgets visible
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-mercury-amber transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((widget) => (
              <SortableWidgetItem
                key={widget.id}
                widget={widget}
                onToggle={onToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-4 border-t border-mercury-dark-tertiary">
        <p className="text-xs text-gray-500">
          Drag widgets to reorder them on the dashboard. Click the eye icon to show/hide widgets.
        </p>
      </div>
    </div>
  )
}

export default DashboardWidgetList
