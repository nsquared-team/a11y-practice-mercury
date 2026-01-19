import { useState } from 'react'
import {
  Equipment,
  MaintenanceType,
  MaintenancePriority,
  getEquipmentTypeIcon,
} from '../../data/equipment'
import { X, Wrench, AlertTriangle, Calendar, Clock, User } from 'lucide-react'

interface MaintenanceRequestFormProps {
  equipment: Equipment
  onClose: () => void
  onSubmit: (request: MaintenanceRequest) => void
}

export interface MaintenanceRequest {
  equipmentId: string
  equipmentName: string
  type: MaintenanceType
  priority: MaintenancePriority
  description: string
  preferredDate: string
  estimatedDuration: number
  assignedTechnician?: string
  notes?: string
}

const maintenanceTypes: { value: MaintenanceType; label: string; description: string }[] = [
  { value: 'routine', label: 'Routine', description: 'Regular scheduled maintenance' },
  { value: 'repair', label: 'Repair', description: 'Fix a known issue or malfunction' },
  { value: 'inspection', label: 'Inspection', description: 'Safety or compliance check' },
  { value: 'upgrade', label: 'Upgrade', description: 'System or component upgrade' },
  { value: 'emergency', label: 'Emergency', description: 'Urgent critical repair needed' },
]

const priorityLevels: { value: MaintenancePriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-gray-400 border-gray-500/30 bg-gray-500/10' },
  { value: 'medium', label: 'Medium', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { value: 'high', label: 'High', color: 'text-status-warning border-status-warning/30 bg-status-warning/10' },
  { value: 'critical', label: 'Critical', color: 'text-status-error border-status-error/30 bg-status-error/10' },
]

const technicians = [
  'Chen Wei',
  'Maria Santos',
  "James O'Brien",
  'Yuki Tanaka',
  'Ahmed Hassan',
  'Elena Volkov',
]

export default function MaintenanceRequestForm({
  equipment,
  onClose,
  onSubmit,
}: MaintenanceRequestFormProps) {
  const [formData, setFormData] = useState<MaintenanceRequest>({
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    type: 'routine',
    priority: 'medium',
    description: '',
    preferredDate: new Date().toISOString().split('T')[0],
    estimatedDuration: 4,
    assignedTechnician: undefined,
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof MaintenanceRequest, string>>>({})

  const typeIcon = getEquipmentTypeIcon(equipment.type)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDuration' ? parseInt(value) || 0 : value,
    }))
    // Clear error when field is modified
    if (errors[name as keyof MaintenanceRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTypeSelect = (type: MaintenanceType) => {
    setFormData(prev => ({
      ...prev,
      type,
      // Auto-set priority for emergency
      priority: type === 'emergency' ? 'critical' : prev.priority,
      // Auto-set duration based on type
      estimatedDuration:
        type === 'inspection' ? 2 : type === 'routine' ? 4 : type === 'emergency' ? 12 : 6,
    }))
  }

  const handlePrioritySelect = (priority: MaintenancePriority) => {
    setFormData(prev => ({ ...prev, priority }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MaintenanceRequest, string>> = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required'
    }

    if (formData.estimatedDuration < 1 || formData.estimatedDuration > 48) {
      newErrors.estimatedDuration = 'Duration must be between 1 and 48 hours'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-mercury-dark-tertiary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-mercury-amber/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-mercury-amber" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-100">Request Maintenance</h2>
              <p className="text-sm text-gray-500">Submit a new maintenance request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Equipment Info */}
          <div className="card mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{typeIcon}</div>
              <div>
                <p className="font-mono text-mercury-amber text-sm">{equipment.id}</p>
                <p className="text-gray-200">{equipment.name}</p>
                <p className="text-xs text-gray-500">{equipment.type}</p>
              </div>
            </div>
          </div>

          {/* Maintenance Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Maintenance Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {maintenanceTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeSelect(type.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    formData.type === type.value
                      ? 'border-mercury-amber bg-mercury-amber/10 text-mercury-amber'
                      : 'border-mercury-dark-tertiary bg-mercury-dark text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <p className="text-sm font-medium">{type.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">Priority Level</label>
            <div className="flex gap-2">
              {priorityLevels.map(level => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handlePrioritySelect(level.value)}
                  disabled={formData.type === 'emergency' && level.value !== 'critical'}
                  className={`flex-1 py-2 px-3 rounded border text-sm transition-colors ${
                    formData.priority === level.value
                      ? level.color
                      : 'border-mercury-dark-tertiary text-gray-500 hover:border-gray-600'
                  } ${
                    formData.type === 'emergency' && level.value !== 'critical'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
            {formData.type === 'emergency' && (
              <p className="text-xs text-status-error mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Emergency maintenance is automatically set to Critical priority
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-status-error">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the maintenance required..."
              className={`w-full bg-mercury-dark border rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber ${
                errors.description ? 'border-status-error' : 'border-mercury-dark-tertiary'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-status-error mt-1">{errors.description}</p>
            )}
          </div>

          {/* Date and Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Preferred Date */}
            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                Preferred Date <span className="text-status-error">*</span>
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className={`w-full bg-mercury-dark border rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber ${
                  errors.preferredDate ? 'border-status-error' : 'border-mercury-dark-tertiary'
                }`}
              />
              {errors.preferredDate && (
                <p className="text-xs text-status-error mt-1">{errors.preferredDate}</p>
              )}
            </div>

            {/* Estimated Duration */}
            <div>
              <label
                htmlFor="estimatedDuration"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                <Clock className="w-4 h-4 inline mr-1" />
                Estimated Duration (hours)
              </label>
              <input
                type="number"
                id="estimatedDuration"
                name="estimatedDuration"
                min="1"
                max="48"
                value={formData.estimatedDuration}
                onChange={handleChange}
                className={`w-full bg-mercury-dark border rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber ${
                  errors.estimatedDuration ? 'border-status-error' : 'border-mercury-dark-tertiary'
                }`}
              />
              {errors.estimatedDuration && (
                <p className="text-xs text-status-error mt-1">{errors.estimatedDuration}</p>
              )}
            </div>
          </div>

          {/* Assigned Technician */}
          <div className="mb-6">
            <label
              htmlFor="assignedTechnician"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <User className="w-4 h-4 inline mr-1" />
              Assign Technician (optional)
            </label>
            <select
              id="assignedTechnician"
              name="assignedTechnician"
              value={formData.assignedTechnician || ''}
              onChange={handleChange}
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
            >
              <option value="">Auto-assign</option>
              {technicians.map(tech => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information..."
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-mercury-dark-tertiary">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="btn-primary">
            <Wrench className="w-4 h-4 mr-2" />
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}
