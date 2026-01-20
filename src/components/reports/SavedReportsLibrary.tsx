import { useState, useMemo } from 'react'
import {
  SavedReport,
  savedReports,
  getReportTypeLabel,
} from '../../data/reports'
import {
  Search,
  Play,
  Edit2,
  Download,
  Trash2,
  Calendar,
  Clock,
  FileText,
  Pickaxe,
  Wrench,
  Users,
  TrendingUp,
} from 'lucide-react'

interface SavedReportsLibraryProps {
  onRunReport: (report: SavedReport) => void
  onEditReport: (report: SavedReport) => void
  onExportReport: (report: SavedReport) => void
  onDeleteReport: (report: SavedReport) => void
}

export default function SavedReportsLibrary({
  onRunReport,
  onEditReport,
  onExportReport,
  onDeleteReport,
}: SavedReportsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [scheduleFilter, setScheduleFilter] = useState<string | null>(null)

  // Filter reports
  const filteredReports = useMemo(() => {
    return savedReports.filter(report => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !report.name.toLowerCase().includes(query) &&
          !report.description.toLowerCase().includes(query) &&
          !report.id.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Type filter
      if (typeFilter && report.type !== typeFilter) {
        return false
      }

      // Schedule filter
      if (scheduleFilter && report.schedule !== scheduleFilter) {
        return false
      }

      return true
    })
  }, [searchQuery, typeFilter, scheduleFilter])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'extraction':
        return <Pickaxe className="w-4 h-4" />
      case 'equipment':
        return <Wrench className="w-4 h-4" />
      case 'personnel':
        return <Users className="w-4 h-4" />
      case 'commodity':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getScheduleBadge = (schedule: string) => {
    const colors: Record<string, string> = {
      daily: 'text-status-active bg-status-active/10',
      weekly: 'text-blue-400 bg-blue-500/10',
      monthly: 'text-purple-400 bg-purple-500/10',
      none: 'text-gray-500 bg-gray-500/10',
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded ${colors[schedule] || colors.none}`}>
        {schedule === 'none' ? 'Manual' : schedule.charAt(0).toUpperCase() + schedule.slice(1)}
      </span>
    )
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '—'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const hasActiveFilters = typeFilter || scheduleFilter || searchQuery

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-mercury-amber"
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter || ''}
          onChange={e => setTypeFilter(e.target.value || null)}
          className="bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
        >
          <option value="">All Types</option>
          <option value="extraction">Extraction</option>
          <option value="equipment">Equipment</option>
          <option value="personnel">Personnel</option>
          <option value="commodity">Commodity</option>
        </select>

        {/* Schedule Filter */}
        <select
          value={scheduleFilter || ''}
          onChange={e => setScheduleFilter(e.target.value || null)}
          className="bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
        >
          <option value="">All Schedules</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="none">Manual</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchQuery('')
              setTypeFilter(null)
              setScheduleFilter(null)
            }}
            className="btn-secondary text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        {filteredReports.length} of {savedReports.length} reports
      </p>

      {/* Reports Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mercury-dark-tertiary">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Report</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Schedule</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Created</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Run</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr
                key={report.id}
                className="border-b border-mercury-dark-tertiary/50 hover:bg-mercury-dark-tertiary/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-mono text-mercury-amber text-xs">{report.id}</p>
                    <p className="text-sm font-medium text-gray-200">{report.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{report.description}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-mercury-amber">{getTypeIcon(report.type)}</span>
                    <span className="text-sm text-gray-300">{getReportTypeLabel(report.type)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{getScheduleBadge(report.schedule)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(report.created)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(report.lastRun)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onRunReport(report)}
                      className="p-2 text-status-active hover:bg-status-active/10 rounded transition-colors"
                      title="Run Report"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditReport(report)}
                      className="p-2 text-gray-400 hover:text-gray-200 hover:bg-mercury-dark-tertiary rounded transition-colors"
                      title="Edit Report"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExportReport(report)}
                      className="p-2 text-gray-400 hover:text-mercury-amber hover:bg-mercury-amber/10 rounded transition-colors"
                      title="Export Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteReport(report)}
                      className="p-2 text-gray-400 hover:text-status-error hover:bg-status-error/10 rounded transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No reports found</p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery('')
                setTypeFilter(null)
                setScheduleFilter(null)
              }}
              className="text-mercury-amber hover:underline mt-2 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
