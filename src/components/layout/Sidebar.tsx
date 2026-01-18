import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Pickaxe,
  Users,
  Wrench,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  onClose: () => void
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/operations', icon: Pickaxe, label: 'Operations' },
  { path: '/personnel', icon: Users, label: 'Personnel' },
  { path: '/equipment', icon: Wrench, label: 'Equipment' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-mercury-dark-secondary border-r border-mercury-dark-tertiary
          transition-all duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Navigation */}
        <nav className="p-2 flex flex-col h-full">
          <ul className="space-y-1 flex-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-mercury-amber/10 text-mercury-amber border border-mercury-amber/30'
                      : 'text-gray-400 hover:bg-mercury-dark-tertiary hover:text-gray-200'
                    }
                    ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Collapse toggle - desktop only */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center p-2 mt-2 text-gray-500 hover:text-gray-300 hover:bg-mercury-dark-tertiary rounded-lg transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
