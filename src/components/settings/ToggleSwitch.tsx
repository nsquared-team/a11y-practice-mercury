interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  description?: string
}

function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'left-4', initial: 'left-0.5' },
    md: { track: 'w-12 h-6', thumb: 'w-4 h-4', translate: 'left-7', initial: 'left-1' },
    lg: { track: 'w-14 h-7', thumb: 'w-5 h-5', translate: 'left-8', initial: 'left-1' },
  }

  const classes = sizeClasses[size]

  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative ${classes.track} rounded-full transition-colors ${
        enabled ? 'bg-mercury-amber' : 'bg-mercury-dark-tertiary'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 ${classes.thumb} rounded-full bg-white transition-all ${
          enabled ? classes.translate : classes.initial
        }`}
      />
    </button>
  )

  if (label) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-200">{label}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {toggle}
      </div>
    )
  }

  return toggle
}

export default ToggleSwitch
