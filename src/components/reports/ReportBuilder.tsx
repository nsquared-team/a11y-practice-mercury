import { useState } from 'react'
import {
  ReportType,
  VisualizationType,
  DateRangePreset,
  ReportConfig,
  reportMetrics,
  getReportTypeLabel,
  getVisualizationLabel,
} from '../../data/reports'
import { miningSites } from '../../data/sites'
import {
  FileText,
  BarChart3,
  LineChart,
  AreaChart,
  Table,
  Calendar,
  Filter,
  Settings,
  Pickaxe,
  Wrench,
  Users,
  TrendingUp,
} from 'lucide-react'
import { SingleAccordion } from './Accordion'

interface ReportBuilderProps {
  onConfigChange: (config: ReportConfig) => void
  onGenerate: () => void
  initialConfig?: ReportConfig
}

export default function ReportBuilder({
  onConfigChange,
  onGenerate,
  initialConfig,
}: ReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>(
    initialConfig || {
      type: 'extraction',
      dateRange: '7days',
      visualization: 'line',
      metrics: ['totalOutput', 'efficiency'],
      filters: {},
    }
  )

  const updateConfig = (updates: Partial<ReportConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const toggleMetric = (metricId: string) => {
    const newMetrics = config.metrics.includes(metricId)
      ? config.metrics.filter(m => m !== metricId)
      : [...config.metrics, metricId]
    updateConfig({ metrics: newMetrics })
  }

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'extraction':
        return <Pickaxe className="w-5 h-5" />
      case 'equipment':
        return <Wrench className="w-5 h-5" />
      case 'personnel':
        return <Users className="w-5 h-5" />
      case 'commodity':
        return <TrendingUp className="w-5 h-5" />
    }
  }

  const getVisualizationIcon = (vis: VisualizationType) => {
    switch (vis) {
      case 'line':
        return <LineChart className="w-5 h-5" />
      case 'bar':
        return <BarChart3 className="w-5 h-5" />
      case 'area':
        return <AreaChart className="w-5 h-5" />
      case 'table':
        return <Table className="w-5 h-5" />
    }
  }

  const reportTypes: ReportType[] = ['extraction', 'equipment', 'personnel', 'commodity']
  const visualizationTypes: VisualizationType[] = ['line', 'bar', 'area', 'table']
  const dateRangePresets: { value: DateRangePreset; label: string }[] = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' },
  ]

  const availableMetrics = reportMetrics[config.type] || []

  return (
    <div className="space-y-4">
      {/* Report Type Selection */}
      <SingleAccordion
        title="Report Type"
        subtitle={getReportTypeLabel(config.type)}
        icon={<FileText className="w-4 h-4" />}
        defaultOpen={true}
      >
        <div className="grid grid-cols-2 gap-2">
          {reportTypes.map(type => (
            <button
              key={type}
              onClick={() => {
                // Reset metrics when changing type
                const defaultMetrics = reportMetrics[type].slice(0, 2).map(m => m.id)
                updateConfig({ type, metrics: defaultMetrics })
              }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                config.type === type
                  ? 'border-mercury-amber bg-mercury-amber/10 text-mercury-amber'
                  : 'border-mercury-dark-tertiary bg-mercury-dark text-gray-400 hover:border-gray-600'
              }`}
            >
              {getReportTypeIcon(type)}
              <span className="text-sm font-medium">{getReportTypeLabel(type)}</span>
            </button>
          ))}
        </div>
      </SingleAccordion>

      {/* Date Range Selection */}
      <SingleAccordion
        title="Date Range"
        subtitle={dateRangePresets.find(d => d.value === config.dateRange)?.label}
        icon={<Calendar className="w-4 h-4" />}
        defaultOpen={true}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {dateRangePresets.map(preset => (
              <button
                key={preset.value}
                onClick={() => updateConfig({ dateRange: preset.value })}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  config.dateRange === preset.value
                    ? 'border-mercury-amber bg-mercury-amber/10 text-mercury-amber'
                    : 'border-mercury-dark-tertiary text-gray-400 hover:border-gray-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {config.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                  onChange={e =>
                    updateConfig({ customDateStart: new Date(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                  onChange={e =>
                    updateConfig({ customDateEnd: new Date(e.target.value) })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </SingleAccordion>

      {/* Metrics Selection */}
      <SingleAccordion
        title="Metrics"
        subtitle={`${config.metrics.length} selected`}
        icon={<Settings className="w-4 h-4" />}
        defaultOpen={true}
      >
        <div className="space-y-2">
          {availableMetrics.map(metric => (
            <label
              key={metric.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                config.metrics.includes(metric.id)
                  ? 'border-mercury-amber/50 bg-mercury-amber/5'
                  : 'border-mercury-dark-tertiary bg-mercury-dark hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.metrics.includes(metric.id)}
                  onChange={() => toggleMetric(metric.id)}
                  className="w-4 h-4 rounded border-gray-600 text-mercury-amber focus:ring-mercury-amber focus:ring-offset-0 bg-mercury-dark"
                />
                <span className="text-sm text-gray-300">{metric.name}</span>
              </div>
              {metric.unit && (
                <span className="text-xs text-gray-500">{metric.unit}</span>
              )}
            </label>
          ))}
        </div>
      </SingleAccordion>

      {/* Visualization Type */}
      <SingleAccordion
        title="Visualization"
        subtitle={getVisualizationLabel(config.visualization)}
        icon={<BarChart3 className="w-4 h-4" />}
        defaultOpen={false}
      >
        <div className="grid grid-cols-2 gap-2">
          {visualizationTypes.map(vis => (
            <button
              key={vis}
              onClick={() => updateConfig({ visualization: vis })}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                config.visualization === vis
                  ? 'border-mercury-amber bg-mercury-amber/10 text-mercury-amber'
                  : 'border-mercury-dark-tertiary bg-mercury-dark text-gray-400 hover:border-gray-600'
              }`}
            >
              {getVisualizationIcon(vis)}
              <span className="text-sm font-medium">{getVisualizationLabel(vis)}</span>
            </button>
          ))}
        </div>
      </SingleAccordion>

      {/* Filters (for extraction reports) */}
      {config.type === 'extraction' && (
        <SingleAccordion
          title="Filters"
          subtitle={
            config.filters.siteIds?.length
              ? `${config.filters.siteIds.length} sites selected`
              : 'All sites'
          }
          icon={<Filter className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-2">Filter by mining sites:</p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {miningSites.map(site => (
                <label
                  key={site.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-mercury-dark-tertiary/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={config.filters.siteIds?.includes(site.id) || false}
                    onChange={() => {
                      const currentIds = config.filters.siteIds || []
                      const newIds = currentIds.includes(site.id)
                        ? currentIds.filter(id => id !== site.id)
                        : [...currentIds, site.id]
                      updateConfig({
                        filters: { ...config.filters, siteIds: newIds.length > 0 ? newIds : undefined },
                      })
                    }}
                    className="w-4 h-4 rounded border-gray-600 text-mercury-amber focus:ring-mercury-amber focus:ring-offset-0 bg-mercury-dark"
                  />
                  <span className="text-sm text-gray-300">{site.name}</span>
                  <span
                    className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                      site.status === 'active'
                        ? 'text-status-active bg-status-active/10'
                        : site.status === 'idle'
                          ? 'text-status-idle bg-status-idle/10'
                          : 'text-gray-500 bg-gray-500/10'
                    }`}
                  >
                    {site.status}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </SingleAccordion>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={config.metrics.length === 0}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Report
      </button>
    </div>
  )
}
