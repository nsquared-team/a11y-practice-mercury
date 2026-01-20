import { useState } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Filter } from 'lucide-react'
import {
  alertsData,
  Alert,
  AlertSeverity,
  AlertCategory,
  getSeverityColor,
  formatAlertTime,
  getAlertStats,
} from '../data/alerts'

function Notifications() {
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'all'>('all')
  const stats = getAlertStats()

  // Filter alerts
  const filteredAlerts = alertsData
    .filter(alert => {
      if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false
      if (selectedCategory !== 'all' && alert.category !== selectedCategory) return false
      return true
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
    }
  }

  const getCategoryLabel = (category: AlertCategory) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const severityOptions: (AlertSeverity | 'all')[] = ['all', 'critical', 'warning', 'info', 'success']
  const categoryOptions: (AlertCategory | 'all')[] = ['all', 'equipment', 'safety', 'production', 'personnel', 'system']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <Bell className="w-7 h-7 text-mercury-amber" />
            Notifications
          </h1>
          <p className="text-gray-400 mt-1">
            {stats.unread} unread of {stats.total} total notifications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg p-4">
          <div className="flex items-center gap-2 text-status-error">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Critical</span>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-2">{stats.bySeverity.critical}</p>
        </div>
        <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg p-4">
          <div className="flex items-center gap-2 text-status-warning">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Warning</span>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-2">{stats.bySeverity.warning}</p>
        </div>
        <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Info className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Info</span>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-2">{stats.bySeverity.info}</p>
        </div>
        <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg p-4">
          <div className="flex items-center gap-2 text-status-active">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Success</span>
          </div>
          <p className="text-2xl font-bold text-gray-100 mt-2">{stats.bySeverity.success}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filters</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="severity-filter" className="block text-xs text-gray-500 mb-1">
              Severity
            </label>
            <select
              id="severity-filter"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity | 'all')}
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
            >
              {severityOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Severities' : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="category-filter" className="block text-xs text-gray-500 mb-1">
              Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AlertCategory | 'all')}
              className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
            >
              {categoryOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Categories' : getCategoryLabel(option)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg p-8 text-center">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No notifications match your filters</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-mercury-dark-secondary border rounded-lg p-4 transition-colors ${
                alert.isRead
                  ? 'border-mercury-dark-tertiary'
                  : 'border-mercury-amber/30 bg-mercury-amber/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Severity Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  {getSeverityIcon(alert.severity)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-medium ${alert.isRead ? 'text-gray-200' : 'text-gray-100'}`}>
                        {alert.title}
                      </h3>
                      <p className={`text-sm mt-1 ${alert.isRead ? 'text-gray-500' : 'text-gray-400'}`}>
                        {alert.message}
                      </p>
                    </div>
                    {!alert.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 bg-mercury-amber rounded-full mt-2" />
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs px-2 py-1 rounded bg-mercury-dark-tertiary text-gray-400">
                      {getCategoryLabel(alert.category)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatAlertTime(alert.timestamp)}
                    </span>
                    {alert.siteId && (
                      <span className="text-xs text-gray-500">
                        Site: {alert.siteId}
                      </span>
                    )}
                    {alert.equipmentId && (
                      <span className="text-xs text-gray-500">
                        Equipment: {alert.equipmentId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="text-center text-sm text-gray-500">
        Showing {filteredAlerts.length} of {alertsData.length} notifications
      </div>
    </div>
  )
}

export default Notifications
