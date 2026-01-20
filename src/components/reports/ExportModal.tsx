import { useState } from 'react'
import {
  ReportConfig,
  ReportDataPoint,
  generateCSV,
  downloadCSV,
  reportMetrics,
  getReportTypeLabel,
  getDaysFromPreset,
  generateExtractionReportFromSites,
  generateEquipmentReportFromData,
  generatePersonnelReportFromData,
  generateReportData,
} from '../../data/reports'
import { X, Download, FileText, CheckCircle } from 'lucide-react'

interface ExportModalProps {
  config: ReportConfig
  reportName?: string
  onClose: () => void
}

export default function ExportModal({ config, reportName, onClose }: ExportModalProps) {
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(config.metrics)
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success'>('idle')

  const availableMetrics = reportMetrics[config.type] || []
  const metricsInfo = availableMetrics.filter(m => config.metrics.includes(m.id))

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId) ? prev.filter(m => m !== metricId) : [...prev, metricId]
    )
  }

  const handleExport = () => {
    setExportStatus('exporting')

    // Generate data based on config
    const days = getDaysFromPreset(config.dateRange)
    let data: ReportDataPoint[]

    switch (config.type) {
      case 'extraction':
        data = generateExtractionReportFromSites(days)
        break
      case 'equipment':
        data = generateEquipmentReportFromData(days)
        break
      case 'personnel':
        data = generatePersonnelReportFromData(days)
        break
      case 'commodity':
      default:
        data = generateReportData(config, days)
    }

    // Generate and download CSV
    const csvContent = generateCSV(data, selectedMetrics)
    const filename = reportName
      ? reportName.replace(/\s+/g, '_').toLowerCase()
      : `${config.type}_report_${new Date().toISOString().split('T')[0]}`

    downloadCSV(csvContent, filename)

    // Show success state
    setTimeout(() => {
      setExportStatus('success')
      setTimeout(() => {
        onClose()
      }, 1500)
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-mercury-dark-secondary border border-mercury-dark-tertiary rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-mercury-dark-tertiary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-mercury-amber/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-mercury-amber" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-100">Export Report</h2>
              <p className="text-sm text-gray-500">Download as CSV file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {exportStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-status-active/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-status-active" />
              </div>
              <h3 className="text-lg font-medium text-gray-200">Export Complete!</h3>
              <p className="text-sm text-gray-500 mt-1">Your CSV file has been downloaded.</p>
            </div>
          ) : (
            <>
              {/* Report Info */}
              <div className="p-4 rounded-lg bg-mercury-dark border border-mercury-dark-tertiary">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-mercury-amber" />
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      {reportName || `${getReportTypeLabel(config.type)} Report`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getDaysFromPreset(config.dateRange)} days of data • {selectedMetrics.length}{' '}
                      metrics
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Include Metrics
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {metricsInfo.map(metric => (
                    <label
                      key={metric.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-mercury-dark-tertiary/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => toggleMetric(metric.id)}
                        className="w-4 h-4 rounded border-gray-600 text-mercury-amber focus:ring-mercury-amber focus:ring-offset-0 bg-mercury-dark"
                      />
                      <span className="text-sm text-gray-300">{metric.name}</span>
                      {metric.unit && (
                        <span className="text-xs text-gray-500 ml-auto">({metric.unit})</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="border-t border-mercury-dark-tertiary pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHeaders}
                    onChange={e => setIncludeHeaders(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-mercury-amber focus:ring-mercury-amber focus:ring-offset-0 bg-mercury-dark"
                  />
                  <span className="text-sm text-gray-300">Include column headers</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {exportStatus !== 'success' && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-mercury-dark-tertiary">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedMetrics.length === 0 || exportStatus === 'exporting'}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportStatus === 'exporting' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download CSV
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
