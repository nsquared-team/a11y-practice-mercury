import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Check, User, Briefcase, Phone, Award, AlertCircle } from 'lucide-react'
import {
  Role,
  Shift,
  PersonnelStatus,
  availableRoles,
  availableShifts,
  availableCertificationTypes,
} from '../../data/personnel'

// Form data types
interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
}

interface AssignmentInfo {
  role: Role | ''
  shift: Shift | ''
  status: PersonnelStatus
  currentAssignment: string
  hireDate: string
}

interface EmergencyContactInfo {
  name: string
  relationship: string
  phone: string
}

interface CertificationEntry {
  id: string
  name: string
  issueDate: string
  expirationDate: string
}

interface FormData {
  personal: PersonalInfo
  assignment: AssignmentInfo
  emergencyContact: EmergencyContactInfo
  certifications: CertificationEntry[]
}

interface ValidationErrors {
  [key: string]: string
}

interface PersonnelFormWizardProps {
  onClose: () => void
  onSubmit: (data: FormData) => void
}

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Assignment', icon: Briefcase },
  { id: 3, title: 'Emergency Contact', icon: Phone },
  { id: 4, title: 'Certifications', icon: Award },
]

const initialFormData: FormData = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
  },
  assignment: {
    role: '',
    shift: '',
    status: 'Off Duty',
    currentAssignment: '',
    hireDate: new Date().toISOString().split('T')[0],
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  certifications: [],
}

export default function PersonnelFormWizard({ onClose, onSubmit }: PersonnelFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/
    return phoneRegex.test(phone)
  }

  const validateStep = useCallback((step: number): ValidationErrors => {
    const newErrors: ValidationErrors = {}

    switch (step) {
      case 1: // Personal Info
        if (!formData.personal.firstName.trim()) {
          newErrors['personal.firstName'] = 'First name is required'
        }
        if (!formData.personal.lastName.trim()) {
          newErrors['personal.lastName'] = 'Last name is required'
        }
        if (!formData.personal.email.trim()) {
          newErrors['personal.email'] = 'Email is required'
        } else if (!validateEmail(formData.personal.email)) {
          newErrors['personal.email'] = 'Please enter a valid email address'
        }
        break

      case 2: // Assignment
        if (!formData.assignment.role) {
          newErrors['assignment.role'] = 'Please select a role'
        }
        if (!formData.assignment.shift) {
          newErrors['assignment.shift'] = 'Please select a shift'
        }
        if (!formData.assignment.hireDate) {
          newErrors['assignment.hireDate'] = 'Hire date is required'
        }
        break

      case 3: // Emergency Contact
        if (!formData.emergencyContact.name.trim()) {
          newErrors['emergencyContact.name'] = 'Contact name is required'
        }
        if (!formData.emergencyContact.relationship.trim()) {
          newErrors['emergencyContact.relationship'] = 'Relationship is required'
        }
        if (!formData.emergencyContact.phone.trim()) {
          newErrors['emergencyContact.phone'] = 'Phone number is required'
        } else if (!validatePhone(formData.emergencyContact.phone)) {
          newErrors['emergencyContact.phone'] = 'Please enter a valid phone number'
        }
        break

      case 4: // Certifications (optional, but validate if entries exist)
        formData.certifications.forEach((cert, index) => {
          if (!cert.name) {
            newErrors[`certifications.${index}.name`] = 'Certification type is required'
          }
          if (!cert.issueDate) {
            newErrors[`certifications.${index}.issueDate`] = 'Issue date is required'
          }
          if (!cert.expirationDate) {
            newErrors[`certifications.${index}.expirationDate`] = 'Expiration date is required'
          }
          if (cert.issueDate && cert.expirationDate && cert.issueDate >= cert.expirationDate) {
            newErrors[`certifications.${index}.expirationDate`] = 'Expiration must be after issue date'
          }
        })
        break
    }

    return newErrors
  }, [formData])

  const handleFieldChange = <T extends keyof FormData>(
    section: T,
    field: keyof FormData[T],
    value: FormData[T][keyof FormData[T]]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Mark field as touched
    const fieldKey = `${section}.${String(field)}`
    setTouched(prev => new Set(prev).add(fieldKey))

    // Clear error for this field if it exists
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldKey]
        return newErrors
      })
    }
  }

  const handleBlur = (fieldKey: string) => {
    setTouched(prev => new Set(prev).add(fieldKey))
    // Validate the current step on blur
    const stepErrors = validateStep(currentStep)
    if (stepErrors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: stepErrors[fieldKey] }))
    }
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep)

    // Mark all fields in current step as touched
    const stepFields = getStepFields(currentStep)
    setTouched(prev => {
      const newTouched = new Set(prev)
      stepFields.forEach(field => newTouched.add(field))
      return newTouched
    })

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setErrors({})
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    // Validate all steps
    let allErrors: ValidationErrors = {}
    for (let step = 1; step <= 4; step++) {
      const stepErrors = validateStep(step)
      allErrors = { ...allErrors, ...stepErrors }
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      // Go to first step with errors
      for (let step = 1; step <= 4; step++) {
        const stepErrors = validateStep(step)
        if (Object.keys(stepErrors).length > 0) {
          setCurrentStep(step)
          break
        }
      }
      return
    }

    onSubmit(formData)
  }

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['personal.firstName', 'personal.lastName', 'personal.email']
      case 2:
        return ['assignment.role', 'assignment.shift', 'assignment.hireDate']
      case 3:
        return ['emergencyContact.name', 'emergencyContact.relationship', 'emergencyContact.phone']
      case 4:
        return formData.certifications.flatMap((_, i) => [
          `certifications.${i}.name`,
          `certifications.${i}.issueDate`,
          `certifications.${i}.expirationDate`,
        ])
      default:
        return []
    }
  }

  // Certification management
  const addCertification = () => {
    const newCert: CertificationEntry = {
      id: `cert-${Date.now()}`,
      name: '',
      issueDate: '',
      expirationDate: '',
    }
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }))
  }

  const updateCertification = (id: string, field: keyof CertificationEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }))

    const index = formData.certifications.findIndex(c => c.id === id)
    const fieldKey = `certifications.${index}.${field}`
    setTouched(prev => new Set(prev).add(fieldKey))

    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldKey]
        return newErrors
      })
    }
  }

  const removeCertification = (id: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id),
    }))
  }

  const getFieldError = (fieldKey: string): string | undefined => {
    return touched.has(fieldKey) ? errors[fieldKey] : undefined
  }

  // Input component with error handling
  const FormInput = ({
    label,
    fieldKey,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
  }: {
    label: string
    fieldKey: string
    type?: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
  }) => {
    const error = getFieldError(fieldKey)
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={() => handleBlur(fieldKey)}
          placeholder={placeholder}
          className={`w-full bg-mercury-dark border rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-colors ${
            error
              ? 'border-status-error focus:border-status-error'
              : 'border-mercury-dark-tertiary focus:border-mercury-amber'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldKey}-error` : undefined}
        />
        {error && (
          <p id={`${fieldKey}-error`} className="mt-1 text-xs text-status-error flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    )
  }

  // Select component with error handling
  const FormSelect = ({
    label,
    fieldKey,
    value,
    onChange,
    options,
    placeholder,
    required = false,
  }: {
    label: string
    fieldKey: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
    required?: boolean
  }) => {
    const error = getFieldError(fieldKey)
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
          {required && <span className="text-status-error ml-1">*</span>}
        </label>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={() => handleBlur(fieldKey)}
          className={`w-full bg-mercury-dark border rounded-lg px-4 py-2 text-sm text-gray-100 focus:outline-none transition-colors ${
            error
              ? 'border-status-error focus:border-status-error'
              : 'border-mercury-dark-tertiary focus:border-mercury-amber'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldKey}-error` : undefined}
        >
          {placeholder && (
            <option value="" className="text-gray-500">
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${fieldKey}-error`} className="mt-1 text-xs text-status-error flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    )
  }

  // A11Y ISSUE: Modal missing role="dialog" and aria-modal
  // A11Y ISSUE: No escape key handler
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-mercury-dark-tertiary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Add New Personnel</h2>
            {/* A11Y ISSUE: Close button lacks visible focus indicator */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors focus:outline-none"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    // Allow going back to previous steps
                    if (step.id < currentStep) {
                      setCurrentStep(step.id)
                    }
                  }}
                  disabled={step.id > currentStep}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    step.id === currentStep
                      ? 'bg-mercury-amber/20 text-mercury-amber'
                      : step.id < currentStep
                        ? 'text-status-active hover:bg-mercury-dark-tertiary cursor-pointer'
                        : 'text-gray-500 cursor-not-allowed'
                  }`}
                  aria-current={step.id === currentStep ? 'step' : undefined}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.id === currentStep
                        ? 'bg-mercury-amber text-mercury-dark'
                        : step.id < currentStep
                          ? 'bg-status-active text-mercury-dark'
                          : 'bg-mercury-dark-tertiary text-gray-500'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      step.id < currentStep ? 'bg-status-active' : 'bg-mercury-dark-tertiary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                Enter the basic personal information for the new personnel member.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  fieldKey="personal.firstName"
                  value={formData.personal.firstName}
                  onChange={value => handleFieldChange('personal', 'firstName', value)}
                  placeholder="Enter first name"
                  required
                />
                <FormInput
                  label="Last Name"
                  fieldKey="personal.lastName"
                  value={formData.personal.lastName}
                  onChange={value => handleFieldChange('personal', 'lastName', value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <FormInput
                label="Email Address"
                fieldKey="personal.email"
                type="email"
                value={formData.personal.email}
                onChange={value => handleFieldChange('personal', 'email', value)}
                placeholder="name@mercury-mining.com"
                required
              />
            </div>
          )}

          {/* Step 2: Assignment */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                Configure the role, shift assignment, and work status.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Role"
                  fieldKey="assignment.role"
                  value={formData.assignment.role}
                  onChange={value => handleFieldChange('assignment', 'role', value as Role)}
                  options={availableRoles.map(role => ({ value: role, label: role }))}
                  placeholder="Select a role"
                  required
                />
                <FormSelect
                  label="Shift"
                  fieldKey="assignment.shift"
                  value={formData.assignment.shift}
                  onChange={value => handleFieldChange('assignment', 'shift', value as Shift)}
                  options={availableShifts.map(shift => ({ value: shift, label: `${shift} Shift` }))}
                  placeholder="Select a shift"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Initial Status"
                  fieldKey="assignment.status"
                  value={formData.assignment.status}
                  onChange={value => handleFieldChange('assignment', 'status', value as PersonnelStatus)}
                  options={[
                    { value: 'On Duty', label: 'On Duty' },
                    { value: 'Off Duty', label: 'Off Duty' },
                    { value: 'On Break', label: 'On Break' },
                    { value: 'On Leave', label: 'On Leave' },
                  ]}
                />
                <FormInput
                  label="Hire Date"
                  fieldKey="assignment.hireDate"
                  type="date"
                  value={formData.assignment.hireDate}
                  onChange={value => handleFieldChange('assignment', 'hireDate', value)}
                  required
                />
              </div>
              <FormInput
                label="Current Assignment (Optional)"
                fieldKey="assignment.currentAssignment"
                value={formData.assignment.currentAssignment}
                onChange={value => handleFieldChange('assignment', 'currentAssignment', value)}
                placeholder="e.g., SITE-001, Sector 7"
              />
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">
                Provide emergency contact information for this personnel member.
              </p>
              <FormInput
                label="Contact Name"
                fieldKey="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={value => handleFieldChange('emergencyContact', 'name', value)}
                placeholder="Full name of emergency contact"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Relationship"
                  fieldKey="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={value => handleFieldChange('emergencyContact', 'relationship', value)}
                  options={[
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'Parent', label: 'Parent' },
                    { value: 'Sibling', label: 'Sibling' },
                    { value: 'Child', label: 'Child' },
                    { value: 'Partner', label: 'Partner' },
                    { value: 'Friend', label: 'Friend' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  placeholder="Select relationship"
                  required
                />
                <FormInput
                  label="Phone Number"
                  fieldKey="emergencyContact.phone"
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={value => handleFieldChange('emergencyContact', 'phone', value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Certifications */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400">
                  Add certifications held by this personnel member (optional).
                </p>
                <button
                  onClick={addCertification}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <Award className="w-4 h-4" />
                  Add Certification
                </button>
              </div>

              {formData.certifications.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-mercury-dark-tertiary rounded-lg">
                  <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No certifications added yet</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Click "Add Certification" to add required certifications
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="p-4 bg-mercury-dark rounded-lg border border-mercury-dark-tertiary"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-300">
                          Certification #{index + 1}
                        </span>
                        <button
                          onClick={() => removeCertification(cert.id)}
                          className="text-gray-500 hover:text-status-error transition-colors p-1"
                          aria-label="Remove certification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <FormSelect
                          label="Certification Type"
                          fieldKey={`certifications.${index}.name`}
                          value={cert.name}
                          onChange={value => updateCertification(cert.id, 'name', value)}
                          options={availableCertificationTypes.map(type => ({ value: type, label: type }))}
                          placeholder="Select certification type"
                          required
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormInput
                            label="Issue Date"
                            fieldKey={`certifications.${index}.issueDate`}
                            type="date"
                            value={cert.issueDate}
                            onChange={value => updateCertification(cert.id, 'issueDate', value)}
                            required
                          />
                          <FormInput
                            label="Expiration Date"
                            fieldKey={`certifications.${index}.expirationDate`}
                            type="date"
                            value={cert.expirationDate}
                            onChange={value => updateCertification(cert.id, 'expirationDate', value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        {/* A11Y ISSUE: Focus order disrupted by tabindex values */}
        <div className="p-6 border-t border-mercury-dark-tertiary flex items-center justify-between">
          {/* A11Y ISSUE: tabindex="3" disrupts natural reading order */}
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            tabIndex={3}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors focus:outline-none ${
              currentStep === 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 hover:bg-mercury-dark-tertiary'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {/* A11Y ISSUE: tabindex="1" makes this focus first despite visual position */}
            <button
              onClick={onClose}
              tabIndex={1}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors focus:outline-none"
            >
              Cancel
            </button>
            {currentStep < 4 ? (
              // A11Y ISSUE: tabindex="2" disrupts expected focus order
              <button onClick={handleNext} tabIndex={2} className="btn-primary flex items-center gap-2 focus:outline-none">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} tabIndex={2} className="btn-primary flex items-center gap-2 focus:outline-none">
                <Check className="w-4 h-4" />
                Add Personnel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
