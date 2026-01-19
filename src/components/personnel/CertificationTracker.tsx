import { useState, useMemo } from 'react'
import { Search, Filter, ChevronDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import {
  getAllCertifications,
  getDaysUntilExpiration,
  CertificationStatus,
  availableCertificationTypes,
} from '../../data/personnel'

export default function CertificationTracker() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CertificationStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all')
  const [filterOpen, setFilterOpen] = useState(false)

  // Get all certifications with personnel info
  const allCertifications = useMemo(() => getAllCertifications(), [])

  // Filter certifications
  const filteredCertifications = useMemo(() => {
    return allCertifications.filter(cert => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !cert.name.toLowerCase().includes(query) &&
          !cert.personnelName.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Status filter
      if (statusFilter !== 'all' && cert.status !== statusFilter) {
        return false
      }

      // Type filter
      if (typeFilter !== 'all' && cert.name !== typeFilter) {
        return false
      }

      return true
    })
  }, [allCertifications, searchQuery, statusFilter, typeFilter])

  // Group by status for summary
  const summary = useMemo(() => {
    return {
      valid: allCertifications.filter(c => c.status === 'valid').length,
      expiring: allCertifications.filter(c => c.status === 'expiring').length,
      expired: allCertifications.filter(c => c.status === 'expired').length,
      total: allCertifications.length,
    }
  }, [allCertifications])

  // Sort filtered certs: expired first, then expiring, then valid
  const sortedCertifications = useMemo(() => {
    return [...filteredCertifications].sort((a, b) => {
      const statusOrder = { expired: 0, expiring: 1, valid: 2 }
      const orderDiff = statusOrder[a.status] - statusOrder[b.status]
      if (orderDiff !== 0) return orderDiff
      // Within same status, sort by days until expiration
      return getDaysUntilExpiration(a) - getDaysUntilExpiration(b)
    })
  }, [filteredCertifications])

  // Get progress bar width and color based on days until expiration
  const getProgressInfo = (daysUntil: number, status: CertificationStatus) => {
    if (status === 'expired') {
      return { width: 100, color: 'bg-status-error' }
    }
    if (status === 'expiring') {
      // Map 0-30 days to 70-100% (filling up as deadline approaches)
      const progress = Math.min(100, 70 + (30 - daysUntil) * (30 / 30))
      return { width: progress, color: 'bg-status-warning' }
    }
    // Valid: map days to percentage (more days = less filled)
    const progress = Math.max(0, Math.min(70, (180 - daysUntil) / 180 * 70))
    return { width: progress, color: 'bg-status-active' }
  }

  // Status icon
  const getStatusIcon = (status: CertificationStatus) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-status-active" />
      case 'expiring':
        return <AlertTriangle className="w-4 h-4 text-status-warning" />
      case 'expired':
        return <XCircle className="w-4 h-4 text-status-error" />
    }
  }

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || searchQuery

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-lg text-left transition-colors ${
            statusFilter === 'all'
              ? 'bg-mercury-amber/20 border border-mercury-amber/30'
              : 'bg-mercury-dark hover:bg-mercury-dark-tertiary'
          }`}
        >
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-semibold text-gray-200">{summary.total}</p>
        </button>
        <button
          onClick={() => setStatusFilter('valid')}
          className={`p-4 rounded-lg text-left transition-colors ${
            statusFilter === 'valid'
              ? 'bg-status-active/20 border border-status-active/30'
              : 'bg-mercury-dark hover:bg-mercury-dark-tertiary'
          }`}
        >
          <p className="text-sm text-gray-500">Valid</p>
          <p className="text-2xl font-semibold text-status-active">{summary.valid}</p>
        </button>
        <button
          onClick={() => setStatusFilter('expiring')}
          className={`p-4 rounded-lg text-left transition-colors ${
            statusFilter === 'expiring'
              ? 'bg-status-warning/20 border border-status-warning/30'
              : 'bg-mercury-dark hover:bg-mercury-dark-tertiary'
          }`}
        >
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-semibold text-status-warning">{summary.expiring}</p>
        </button>
        <button
          onClick={() => setStatusFilter('expired')}
          className={`p-4 rounded-lg text-left transition-colors ${
            statusFilter === 'expired'
              ? 'bg-status-error/20 border border-status-error/30'
              : 'bg-mercury-dark hover:bg-mercury-dark-tertiary'
          }`}
        >
          <p className="text-sm text-gray-500">Expired</p>
          <p className="text-2xl font-semibold text-status-error">{summary.expired}</p>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by certification or personnel name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'border-mercury-amber text-mercury-amber' : ''}`}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className="w-4 h-4" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg shadow-lg z-10 p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Certification Type</h4>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-mercury-amber"
                >
                  <option value="all">All Types</option>
                  {availableCertificationTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setStatusFilter('all')
                    setTypeFilter('all')
                    setSearchQuery('')
                  }}
                  className="text-sm text-mercury-amber hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {sortedCertifications.length} of {allCertifications.length} certifications
      </p>

      {/* Certifications Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mercury-dark-tertiary">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Certification</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Personnel</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Expiration</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-48">Time Remaining</th>
            </tr>
          </thead>
          <tbody>
            {sortedCertifications.map(cert => {
              const daysUntil = getDaysUntilExpiration(cert)
              const { width, color } = getProgressInfo(daysUntil, cert.status)

              return (
                <tr
                  key={`${cert.personnelId}-${cert.id}`}
                  className="border-b border-mercury-dark-tertiary hover:bg-mercury-dark-tertiary/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    {getStatusIcon(cert.status)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-200">{cert.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-400">{cert.personnelName}</p>
                    <p className="text-xs text-gray-600">{cert.personnelId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-400 text-sm">
                      {cert.expirationDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={
                          cert.status === 'expired'
                            ? 'text-status-error'
                            : cert.status === 'expiring'
                              ? 'text-status-warning'
                              : 'text-gray-500'
                        }>
                          {cert.status === 'expired'
                            ? `${Math.abs(daysUntil)} days overdue`
                            : `${daysUntil} days left`}
                        </span>
                      </div>
                      <div className="h-2 bg-mercury-dark rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {sortedCertifications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No certifications match your criteria</p>
          <button
            onClick={() => {
              setStatusFilter('all')
              setTypeFilter('all')
              setSearchQuery('')
            }}
            className="text-mercury-amber hover:underline mt-2 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-mercury-dark-tertiary">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-status-active" />
          <span className="text-xs text-gray-500">Valid (30+ days)</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning" />
          <span className="text-xs text-gray-500">Expiring Soon (&lt;30 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-status-error" />
          <span className="text-xs text-gray-500">Expired</span>
        </div>
      </div>
    </div>
  )
}
