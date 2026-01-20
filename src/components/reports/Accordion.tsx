import { useState, ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface AccordionItem {
  id: string
  title: string
  subtitle?: string
  icon?: ReactNode
  content: ReactNode
  defaultOpen?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export default function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    items.forEach(item => {
      if (item.defaultOpen) {
        initial.add(item.id)
      }
    })
    return initial
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map(item => {
        const isOpen = openItems.has(item.id)

        return (
          <div
            key={item.id}
            className="border border-mercury-dark-tertiary rounded-lg overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                isOpen
                  ? 'bg-mercury-dark-tertiary/50'
                  : 'bg-mercury-dark hover:bg-mercury-dark-tertiary/30'
              }`}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="text-mercury-amber">{item.icon}</span>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-200">{item.title}</h3>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              </div>
              <span className="text-gray-400 transition-transform duration-200">
                {isOpen ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </span>
            </button>

            {/* Content */}
            <div
              id={`accordion-content-${item.id}`}
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4 bg-mercury-dark-secondary border-t border-mercury-dark-tertiary">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Single accordion item component for simpler use cases
interface SingleAccordionProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function SingleAccordion({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  className = '',
}: SingleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`border border-mercury-dark-tertiary rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isOpen
            ? 'bg-mercury-dark-tertiary/50'
            : 'bg-mercury-dark hover:bg-mercury-dark-tertiary/30'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-mercury-amber">{icon}</span>}
          <div>
            <h3 className="text-sm font-medium text-gray-200">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <span className="text-gray-400 transition-transform duration-200">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </span>
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-mercury-dark-secondary border-t border-mercury-dark-tertiary">
          {children}
        </div>
      </div>
    </div>
  )
}
