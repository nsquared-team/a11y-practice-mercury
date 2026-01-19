import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  X,
  Eye,
  CheckSquare,
  Square,
  MinusSquare,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { miningSites, MiningSite, MineralType, SiteStatus } from '../data/sites'
import { generateSiteHistoricalData, SiteHistoricalDataPoint } from '../utils/chartData'

type SortField = 'id' | 'name' | 'mineralType' | 'extractionRate' | 'status' | 'equipmentAssigned'
type SortDirection = 'asc' | 'desc'

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20]

function Operations() {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedSite, setSelectedSite] = useState<MiningSite | null>(null)

  // Generate historical data for selected site
  const siteHistoricalData = useMemo<SiteHistoricalDataPoint[]>(() => {
    if (!selectedSite) return []
    return generateSiteHistoricalData(selectedSite.extractionRate, selectedSite.dailyTarget)
  }, [selectedSite])

  // Filters
  const [mineralFilters, setMineralFilters] = useState<Set<MineralType>>(new Set())
  const [statusFilters, setStatusFilters] = useState<Set<SiteStatus>>(new Set())

  // Filter and sort data
  const filteredAndSortedSites = useMemo(() => {
    let result = [...miningSites]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        site =>
          site.id.toLowerCase().includes(query) ||
          site.name.toLowerCase().includes(query) ||
          site.location.toLowerCase().includes(query)
      )
    }

    // Apply mineral filter
    if (mineralFilters.size > 0) {
      result = result.filter(site => mineralFilters.has(site.mineralType))
    }

    // Apply status filter
    if (statusFilters.size > 0) {
      result = result.filter(site => statusFilters.has(site.status))
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'id':
          comparison = a.id.localeCompare(b.id)
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'mineralType':
          comparison = a.mineralType.localeCompare(b.mineralType)
          break
        case 'extractionRate':
          comparison = a.extractionRate - b.extractionRate
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'equipmentAssigned':
          comparison = a.equipmentAssigned.length - b.equipmentAssigned.length
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [searchQuery, mineralFilters, statusFilters, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSites.length / itemsPerPage)
  const paginatedSites = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAndSortedSites.slice(start, start + itemsPerPage)
  }, [filteredAndSortedSites, currentPage, itemsPerPage])

  // Selection helpers
  const allPageSelected = paginatedSites.every(site => selectedIds.has(site.id))
  const somePageSelected = paginatedSites.some(site => selectedIds.has(site.id))

  const toggleSelectAll = () => {
    if (allPageSelected) {
      // Deselect all on current page
      const newSelected = new Set(selectedIds)
      paginatedSites.forEach(site => newSelected.delete(site.id))
      setSelectedIds(newSelected)
    } else {
      // Select all on current page
      const newSelected = new Set(selectedIds)
      paginatedSites.forEach(site => newSelected.add(site.id))
      setSelectedIds(newSelected)
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter handlers
  const toggleMineralFilter = (mineral: MineralType) => {
    const newFilters = new Set(mineralFilters)
    if (newFilters.has(mineral)) {
      newFilters.delete(mineral)
    } else {
      newFilters.add(mineral)
    }
    setMineralFilters(newFilters)
    setCurrentPage(1)
  }

  const toggleStatusFilter = (status: SiteStatus) => {
    const newFilters = new Set(statusFilters)
    if (newFilters.has(status)) {
      newFilters.delete(status)
    } else {
      newFilters.add(status)
    }
    setStatusFilters(newFilters)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setMineralFilters(new Set())
    setStatusFilters(new Set())
    setSearchQuery('')
    setCurrentPage(1)
  }

  const hasActiveFilters = mineralFilters.size > 0 || statusFilters.size > 0 || searchQuery

  // Status badge helper
  const getStatusBadge = (status: SiteStatus) => {
    const classes = {
      active: 'bg-status-active/20 text-status-active border border-status-active/30',
      idle: 'bg-status-idle/20 text-status-idle border border-status-idle/30',
      maintenance: 'bg-status-warning/20 text-status-warning border border-status-warning/30',
      offline: 'bg-status-error/20 text-status-error border border-status-error/30',
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Sort indicator
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-600" />
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-mercury-amber" />
    ) : (
      <ChevronDown className="w-3 h-3 text-mercury-amber" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Operations</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor extraction sites ({filteredAndSortedSites.length} sites)
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Batch Actions Bar (appears when items selected) */}
      {selectedIds.size > 0 && (
        <div className="bg-mercury-amber/10 border border-mercury-amber/30 rounded-lg p-3 flex items-center justify-between">
          <span className="text-mercury-amber text-sm font-medium">
            {selectedIds.size} site{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs py-1">Change Status</button>
            <button className="btn-secondary text-xs py-1">Export Selected</button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="btn-secondary text-xs py-1 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search sites by ID, name, or location..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'border-mercury-amber text-mercury-amber' : ''}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-mercury-amber text-mercury-dark text-xs px-1.5 py-0.5 rounded-full">
                  {mineralFilters.size + statusFilters.size}
                </span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-lg z-10 p-4">
                {/* Mineral Type Filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Mineral Type</h4>
                  <div className="space-y-2">
                    {(['Mercurium', 'Solar Platinum', 'Thermal Crystals'] as MineralType[]).map(mineral => (
                      <label key={mineral} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mineralFilters.has(mineral)}
                          onChange={() => toggleMineralFilter(mineral)}
                          className="rounded border-mercury-dark-tertiary bg-mercury-dark text-mercury-amber focus:ring-mercury-amber"
                        />
                        <span className="text-sm text-gray-400">{mineral}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
                  <div className="space-y-2">
                    {(['active', 'idle', 'maintenance', 'offline'] as SiteStatus[]).map(status => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusFilters.has(status)}
                          onChange={() => toggleStatusFilter(status)}
                          className="rounded border-mercury-dark-tertiary bg-mercury-dark text-mercury-amber focus:ring-mercury-amber"
                        />
                        <span className="text-sm text-gray-400 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-mercury-amber hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sites Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mercury-dark-tertiary">
                <th className="py-3 px-4 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-400 hover:text-gray-200"
                    aria-label={allPageSelected ? 'Deselect all' : 'Select all'}
                  >
                    {allPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-mercury-amber" />
                    ) : somePageSelected ? (
                      <MinusSquare className="w-4 h-4 text-mercury-amber" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('id')}
                    className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Site ID <SortIndicator field="id" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Name <SortIndicator field="name" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('mineralType')}
                    className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Mineral <SortIndicator field="mineralType" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('extractionRate')}
                    className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Rate <SortIndicator field="extractionRate" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Status <SortIndicator field="status" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('equipmentAssigned')}
                    className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-200"
                  >
                    Equipment <SortIndicator field="equipmentAssigned" />
                  </button>
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSites.map(site => (
                <tr
                  key={site.id}
                  className={`border-b border-mercury-dark-tertiary hover:bg-mercury-dark-tertiary/50 transition-colors ${
                    selectedIds.has(site.id) ? 'bg-mercury-amber/5' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleSelect(site.id)}
                      className="text-gray-400 hover:text-gray-200"
                      aria-label={selectedIds.has(site.id) ? 'Deselect' : 'Select'}
                    >
                      {selectedIds.has(site.id) ? (
                        <CheckSquare className="w-4 h-4 text-mercury-amber" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono text-mercury-amber">{site.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-200">{site.name}</div>
                      <div className="text-xs text-gray-500">{site.location}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{site.mineralType}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-gray-200">{site.extractionRate}</span>
                    <span className="text-gray-500 text-sm ml-1">kg/h</span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(site.status)}</td>
                  <td className="py-3 px-4 text-gray-400">{site.equipmentAssigned.length} units</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedSite(site)}
                      className="p-1.5 hover:bg-mercury-dark-tertiary rounded text-gray-400 hover:text-mercury-amber transition-colors"
                      aria-label="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredAndSortedSites.length)} of{' '}
            {filteredAndSortedSites.length} sites
          </span>
          <select
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="bg-mercury-dark border border-mercury-dark-tertiary rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-mercury-amber"
          >
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-sm ${
                  page === currentPage
                    ? 'bg-mercury-amber text-mercury-dark font-medium'
                    : 'hover:bg-mercury-dark-tertiary text-gray-400'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Site Detail Modal (simple version - to be enhanced) */}
      {selectedSite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">{selectedSite.name}</h2>
                  <p className="text-mercury-amber font-mono">{selectedSite.id}</p>
                </div>
                <button
                  onClick={() => setSelectedSite(null)}
                  className="p-2 hover:bg-mercury-dark-tertiary rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-200">{selectedSite.location}</p>
                </div>
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Mineral Type</p>
                  <p className="text-gray-200">{selectedSite.mineralType}</p>
                </div>
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Extraction Rate</p>
                  <p className="text-gray-200 font-mono">
                    {selectedSite.extractionRate} <span className="text-gray-500">kg/h</span>
                  </p>
                </div>
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedSite.status)}</div>
                </div>
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Surface Temperature</p>
                  <p className={`font-mono ${selectedSite.temperature > 0 ? 'text-orange-400' : 'text-blue-400'}`}>
                    {selectedSite.temperature}°C
                  </p>
                </div>
                <div className="p-4 bg-mercury-dark rounded-lg">
                  <p className="text-sm text-gray-500">Personnel</p>
                  <p className="text-gray-200">{selectedSite.personnelCount} workers</p>
                </div>
              </div>

              {/* Daily Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Daily Target Progress</span>
                  <span className="text-gray-200">
                    {selectedSite.dailyProgress.toLocaleString()} / {selectedSite.dailyTarget.toLocaleString()} kg
                  </span>
                </div>
                <div className="h-3 bg-mercury-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-mercury-amber rounded-full transition-all"
                    style={{ width: `${Math.min(100, (selectedSite.dailyProgress / selectedSite.dailyTarget) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((selectedSite.dailyProgress / selectedSite.dailyTarget) * 100)}% complete
                </p>
              </div>

              {/* Equipment */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Assigned Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSite.equipmentAssigned.map(eq => (
                    <span
                      key={eq}
                      className="px-2 py-1 bg-mercury-dark rounded text-xs font-mono text-gray-400"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Historical Performance Chart */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">7-Day Extraction History</h3>
                <div className="h-48 bg-mercury-dark rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={siteHistoricalData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="extractionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        axisLine={{ stroke: '#374151' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        axisLine={{ stroke: '#374151' }}
                        tickLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6',
                        }}
                        formatter={(value) => [`${Number(value).toLocaleString()} kg`, 'Extracted']}
                        labelStyle={{ color: '#9CA3AF' }}
                      />
                      <ReferenceLine
                        y={selectedSite?.dailyTarget || 0}
                        stroke="#10B981"
                        strokeDasharray="5 5"
                        label={{
                          value: 'Target',
                          fill: '#10B981',
                          fontSize: 10,
                          position: 'right',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="extraction"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        fill="url(#extractionGradient)"
                        dot={{ fill: '#F59E0B', strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, fill: '#F59E0B' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Daily extraction vs. target ({selectedSite?.dailyTarget.toLocaleString()} kg/day)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Operations
