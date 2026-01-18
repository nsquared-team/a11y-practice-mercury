import { useState } from 'react'
import { Search, Filter, Download, ChevronDown } from 'lucide-react'

function Operations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  // Placeholder data - will be replaced with real data fixtures
  const sites = [
    { id: 'CB-001', name: 'Caloris Basin Alpha', mineral: 'Mercurium', rate: 156.4, status: 'active', equipment: 3 },
    { id: 'RC-002', name: 'Rachmaninoff Crater Deep', mineral: 'Solar Platinum', rate: 89.2, status: 'active', equipment: 2 },
    { id: 'RT-003', name: 'Raditladi Thermal Zone', mineral: 'Thermal Crystals', rate: 234.1, status: 'active', equipment: 4 },
    { id: 'CB-004', name: 'Caloris Basin Beta', mineral: 'Mercurium', rate: 0, status: 'maintenance', equipment: 2 },
    { id: 'PS-005', name: 'Polar Shadow Mine', mineral: 'Thermal Crystals', rate: 45.7, status: 'idle', equipment: 1 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-active">Active</span>
      case 'idle':
        return <span className="status-idle">Idle</span>
      case 'maintenance':
        return <span className="status-warning">Maintenance</span>
      case 'offline':
        return <span className="status-error">Offline</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Operations</h1>
          <p className="text-gray-500 mt-1">Manage and monitor extraction sites</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className="w-4 h-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-lg z-10 p-4">
                <p className="text-sm text-gray-400 mb-2">Filter options will be implemented in Phase 3</p>
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Site ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Mineral</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Extraction Rate</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Equipment</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr
                  key={site.id}
                  className="border-b border-mercury-dark-tertiary hover:bg-mercury-dark-tertiary/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-mercury-amber">{site.id}</td>
                  <td className="py-3 px-4 text-gray-200">{site.name}</td>
                  <td className="py-3 px-4 text-gray-400">{site.mineral}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-gray-200">{site.rate}</span>
                    <span className="text-gray-500 text-sm ml-1">kg/h</span>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(site.status)}</td>
                  <td className="py-3 px-4 text-gray-400">{site.equipment} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing 1-5 of 17 sites</span>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm" disabled>
            Previous
          </button>
          <button className="btn-secondary text-sm">Next</button>
        </div>
      </div>
    </div>
  )
}

export default Operations
