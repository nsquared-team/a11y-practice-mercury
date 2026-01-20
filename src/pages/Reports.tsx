import { useState } from 'react'
import { FileText, Calendar, BarChart3, Plus } from 'lucide-react'
import ReportBuilder from '../components/reports/ReportBuilder'
import ReportPreview from '../components/reports/ReportPreview'
import ExportModal from '../components/reports/ExportModal'
import SavedReportsLibrary from '../components/reports/SavedReportsLibrary'
import ComparisonChart from '../components/reports/ComparisonChart'
import { ReportConfig, SavedReport } from '../data/reports'

function Reports() {
  const [activeTab, setActiveTab] = useState<'builder' | 'saved' | 'analytics'>('builder')
  const [showExportModal, setShowExportModal] = useState(false)

  // Report builder state
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'extraction',
    dateRange: '7days',
    visualization: 'line',
    metrics: ['totalOutput', 'efficiency'],
    filters: {},
  })

  const handleConfigChange = (newConfig: ReportConfig) => {
    setReportConfig(newConfig)
  }

  const handleGenerateReport = () => {
    // Config is already updated via onConfigChange, just trigger re-render if needed
    // The ReportPreview component generates its own data based on config
  }

  const handleRunReport = (report: SavedReport) => {
    setReportConfig(report.config)
    setActiveTab('builder')
  }

  const handleEditReport = (report: SavedReport) => {
    setReportConfig(report.config)
    setActiveTab('builder')
  }

  const handleDeleteReport = (report: SavedReport) => {
    // In a real app, this would call an API to delete the report
    console.log('Delete report:', report.id)
  }

  const handleExportReport = (report: SavedReport) => {
    setReportConfig(report.config)
    setShowExportModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate and analyze operational reports</p>
        </div>
        <button
          onClick={() => {
            setReportConfig({
              type: 'extraction',
              dateRange: '7days',
              visualization: 'line',
              metrics: ['totalOutput', 'efficiency'],
              filters: {},
            })
            setActiveTab('builder')
          }}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-mercury-dark-tertiary">
        {[
          { id: 'builder', label: 'Report Builder', icon: FileText },
          { id: 'saved', label: 'Saved Reports', icon: Calendar },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-mercury-amber'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-mercury-amber"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-1">
            <ReportBuilder
              initialConfig={reportConfig}
              onConfigChange={handleConfigChange}
              onGenerate={handleGenerateReport}
            />
          </div>

          {/* Report Preview */}
          <div className="lg:col-span-2">
            <ReportPreview
              config={reportConfig}
              onExport={() => setShowExportModal(true)}
            />
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <SavedReportsLibrary
          onRunReport={handleRunReport}
          onEditReport={handleEditReport}
          onDeleteReport={handleDeleteReport}
          onExportReport={handleExportReport}
        />
      )}

      {activeTab === 'analytics' && (
        <ComparisonChart />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          config={reportConfig}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  )
}

export default Reports
