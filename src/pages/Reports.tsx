import { useState } from 'react'
import { FileText, Plus, Download, Calendar, BarChart3 } from 'lucide-react'

function Reports() {
  const [activeTab, setActiveTab] = useState<'builder' | 'saved' | 'analytics'>('builder')

  // Placeholder saved reports
  const savedReports = [
    { id: 'R001', name: 'Weekly Extraction Summary', type: 'Extraction', created: '2026-01-15', lastRun: '2026-01-18' },
    { id: 'R002', name: 'Equipment Utilization Q4', type: 'Equipment', created: '2026-01-10', lastRun: '2026-01-17' },
    { id: 'R003', name: 'Personnel Shift Analysis', type: 'Personnel', created: '2026-01-05', lastRun: '2026-01-16' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-100">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate and analyze operational reports</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
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
          <div className="lg:col-span-1 card">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Configure Report</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Report Type</label>
                <select className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber">
                  <option>Extraction Summary</option>
                  <option>Equipment Status</option>
                  <option>Personnel Analysis</option>
                  <option>Commodity Trends</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date Range</label>
                <select className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Visualization</label>
                <select className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber">
                  <option>Line Chart</option>
                  <option>Bar Chart</option>
                  <option>Area Chart</option>
                  <option>Table</option>
                </select>
              </div>
              <button className="btn-primary w-full mt-4">Generate Report</button>
            </div>
          </div>

          {/* Report Preview */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-100">Preview</h2>
              <button className="btn-secondary flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="h-80 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
              <p className="text-gray-500">Report preview will be implemented in Phase 6</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mercury-dark-tertiary">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Report ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Run</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-mercury-dark-tertiary hover:bg-mercury-dark-tertiary/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-mercury-amber">{report.id}</td>
                    <td className="py-3 px-4 text-gray-200">{report.name}</td>
                    <td className="py-3 px-4 text-gray-400">{report.type}</td>
                    <td className="py-3 px-4 text-gray-400">{report.created}</td>
                    <td className="py-3 px-4 text-gray-400">{report.lastRun}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-sm text-mercury-amber hover:underline">Run</button>
                        <button className="text-sm text-gray-400 hover:text-gray-200">Edit</button>
                        <button className="text-sm text-status-error hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="card">
          <div className="h-96 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
            <p className="text-gray-500">Comparison Charts will be implemented in Phase 6</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
