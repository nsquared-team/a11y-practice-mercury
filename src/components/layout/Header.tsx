import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, User, Menu } from 'lucide-react'
import mercuryLogo from '../../assets/mercury.svg'
import SearchResults from './SearchResults'
import { getUnreadAlerts } from '../../data/alerts'

interface HeaderProps {
  onMenuToggle: () => void
}

function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const notificationCount = getUnreadAlerts().length
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchClose = () => {
    setIsSearchFocused(false)
    setSearchQuery('')
  }

  // Simulated Mercury time (Mercury's day is 176 Earth days)
  const getMercuryTime = () => {
    const now = new Date()
    // Simplified Mercury time display
    const mercuryHour = Math.floor((now.getHours() * 176) / 24) % 176
    const mercuryMinute = now.getMinutes()
    return `Sol ${mercuryHour.toString().padStart(3, '0')}:${mercuryMinute.toString().padStart(2, '0')}`
  }

  return (
    <header className="h-16 bg-mercury-dark-secondary border-b border-mercury-dark-tertiary flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      {/* Left section - Logo and menu toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex items-center gap-3">
          <img
            src={mercuryLogo}
            alt="Mercury logo"
            className="w-8 h-8"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-100">Helios Mining</h1>
            <p className="text-xs text-mercury-amber font-mono">MERCURY OPERATIONS</p>
          </div>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search operations, personnel, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber transition-colors"
            aria-label="Search operations, personnel, and equipment"
            aria-expanded={isSearchFocused && searchQuery.length >= 2}
            aria-haspopup="listbox"
          />
          {isSearchFocused && (
            <SearchResults query={searchQuery} onClose={handleSearchClose} />
          )}
        </div>
      </div>

      {/* Right section - Mercury time, notifications, profile */}
      <div className="flex items-center gap-4">
        {/* Mercury Time Display */}
        {/* A11Y ISSUE: Low contrast text - gray-600 on dark background fails WCAG 1.4.3 */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-gray-600">Mercury Time</span>
          <span className="font-mono text-mercury-amber text-sm">{getMercuryTime()}</span>
        </div>

        {/* Notifications */}
        {/* A11Y ISSUE: Missing accessible name - button has no aria-label */}
        {/* A11Y ISSUE: Missing focus indicator - no visible focus ring */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors focus:outline-none"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-mercury-orange text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        {/* A11Y ISSUE: Missing accessible name - button lacks aria-label */}
        {/* A11Y ISSUE: Missing focus indicator */}
        <button className="flex items-center gap-2 p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors focus:outline-none">
          <div className="w-8 h-8 bg-mercury-dark-tertiary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span className="hidden sm:block text-sm text-gray-300">Supervisor</span>
        </button>
      </div>
    </header>
  )
}

export default Header
