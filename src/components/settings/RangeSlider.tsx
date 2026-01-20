interface RangeSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  description?: string
  showValue?: boolean
  valueFormatter?: (value: number) => string
}

function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  description,
  showValue = true,
  valueFormatter = (v) => `${v}`,
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  const slider = (
    <div className="relative flex items-center gap-3">
      <div className="relative flex-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full h-2 bg-mercury-dark-tertiary rounded-lg appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-mercury-amber
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-mercury-amber/30
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-mercury-amber
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            background: `linear-gradient(to right, #f59e0b ${percentage}%, #262626 ${percentage}%)`,
          }}
        />
      </div>
      {showValue && (
        <span className="text-sm text-gray-300 font-mono min-w-[3rem] text-right">
          {valueFormatter(value)}
        </span>
      )}
    </div>
  )

  if (label) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200">{label}</p>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        {slider}
      </div>
    )
  }

  return slider
}

export default RangeSlider
