import { useNavigate } from 'react-router-dom'
import { User, Wrench, MapPin } from 'lucide-react'
import { personnelData, getFullName } from '../../data/personnel'
import { equipmentData } from '../../data/equipment'
import { miningSites } from '../../data/sites'

interface SearchResultsProps {
  query: string
  onClose: () => void
}

interface SearchResult {
  id: string
  title: string
  subtitle: string
  type: 'personnel' | 'equipment' | 'site'
  route: string
}

function SearchResults({ query, onClose }: SearchResultsProps) {
  const navigate = useNavigate()
  const normalizedQuery = query.toLowerCase().trim()

  // Don't show results for very short queries
  if (normalizedQuery.length < 2) {
    return null
  }

  // Search personnel
  const personnelResults: SearchResult[] = personnelData
    .filter(person => {
      const fullName = getFullName(person).toLowerCase()
      return (
        fullName.includes(normalizedQuery) ||
        person.email.toLowerCase().includes(normalizedQuery) ||
        person.role.toLowerCase().includes(normalizedQuery) ||
        person.id.toLowerCase().includes(normalizedQuery) ||
        person.shift.toLowerCase().includes(normalizedQuery)
      )
    })
    .slice(0, 4)
    .map(person => ({
      id: person.id,
      title: getFullName(person),
      subtitle: `${person.role} • ${person.shift} Shift`,
      type: 'personnel' as const,
      route: '/personnel',
    }))

  // Search equipment
  const equipmentResults: SearchResult[] = equipmentData
    .filter(equip => {
      return (
        equip.id.toLowerCase().includes(normalizedQuery) ||
        equip.name.toLowerCase().includes(normalizedQuery) ||
        equip.type.toLowerCase().includes(normalizedQuery) ||
        equip.assignedSite?.toLowerCase().includes(normalizedQuery) ||
        equip.status.toLowerCase().includes(normalizedQuery)
      )
    })
    .slice(0, 4)
    .map(equip => ({
      id: equip.id,
      title: equip.name,
      subtitle: `${equip.id} • ${equip.status}`,
      type: 'equipment' as const,
      route: '/equipment',
    }))

  // Search sites
  const siteResults: SearchResult[] = miningSites
    .filter(site => {
      return (
        site.id.toLowerCase().includes(normalizedQuery) ||
        site.name.toLowerCase().includes(normalizedQuery) ||
        site.location.toLowerCase().includes(normalizedQuery) ||
        site.mineralType.toLowerCase().includes(normalizedQuery) ||
        site.status.toLowerCase().includes(normalizedQuery)
      )
    })
    .slice(0, 4)
    .map(site => ({
      id: site.id,
      title: site.name,
      subtitle: `${site.mineralType} • ${site.status}`,
      type: 'site' as const,
      route: '/operations',
    }))

  const hasResults = personnelResults.length > 0 || equipmentResults.length > 0 || siteResults.length > 0

  const handleResultClick = (result: SearchResult) => {
    navigate(result.route)
    onClose()
  }

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'personnel':
        return <User className="w-4 h-4 text-mercury-amber" />
      case 'equipment':
        return <Wrench className="w-4 h-4 text-blue-400" />
      case 'site':
        return <MapPin className="w-4 h-4 text-green-400" />
    }
  }

  const getCategoryLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'personnel':
        return 'Personnel'
      case 'equipment':
        return 'Equipment'
      case 'site':
        return 'Mining Sites'
    }
  }

  const renderCategory = (results: SearchResult[], type: SearchResult['type']) => {
    if (results.length === 0) return null

    return (
      <div className="py-2">
        <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {getCategoryLabel(type)}
        </div>
        {results.map(result => (
          <button
            key={result.id}
            onClick={() => handleResultClick(result)}
            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-mercury-dark-tertiary transition-colors text-left"
          >
            <div className="flex-shrink-0">
              {getIcon(result.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-200 truncate">{result.title}</div>
              <div className="text-xs text-gray-500 truncate">{result.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
      {hasResults ? (
        <>
          {renderCategory(personnelResults, 'personnel')}
          {personnelResults.length > 0 && (equipmentResults.length > 0 || siteResults.length > 0) && (
            <div className="border-t border-mercury-dark-tertiary" />
          )}
          {renderCategory(equipmentResults, 'equipment')}
          {equipmentResults.length > 0 && siteResults.length > 0 && (
            <div className="border-t border-mercury-dark-tertiary" />
          )}
          {renderCategory(siteResults, 'site')}
        </>
      ) : (
        <div className="px-4 py-6 text-center">
          <p className="text-gray-500 text-sm">No results found for "{query}"</p>
          <p className="text-gray-600 text-xs mt-1">Try searching for personnel names, equipment IDs, or site names</p>
        </div>
      )}
    </div>
  )
}

export default SearchResults
