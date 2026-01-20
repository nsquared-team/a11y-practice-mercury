import { createContext, useContext, useState, ReactNode } from 'react'

export interface DashboardWidget {
  id: string
  name: string
  enabled: boolean
  order: number
}

export interface Settings {
  // Display preferences
  units: 'metric' | 'imperial'
  timeFormat: '24h' | '12h'
  temperatureScale: 'celsius' | 'fahrenheit'
  refreshRate: number

  // Simulation
  simulationEnabled: boolean

  // Notifications
  alertsEnabled: boolean
  alertVolume: number
  alertThreshold: number
  alertCategories: {
    equipment: boolean
    safety: boolean
    production: boolean
    personnel: boolean
  }

  // Dashboard customization
  dashboardWidgets: DashboardWidget[]

  // Account
  displayName: string
  email: string
}

interface SettingsContextType {
  settings: Settings
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  updateAlertCategory: (category: keyof Settings['alertCategories'], value: boolean) => void
  updateWidgetOrder: (widgets: DashboardWidget[]) => void
  toggleWidget: (widgetId: string) => void
  resetSettings: () => void
}

const defaultWidgets: DashboardWidget[] = [
  { id: 'metrics', name: 'Key Metrics', enabled: true, order: 0 },
  { id: 'extraction-chart', name: 'Extraction Chart', enabled: true, order: 1 },
  { id: 'equipment-status', name: 'Equipment Status', enabled: true, order: 2 },
  { id: 'alert-feed', name: 'Alert Feed', enabled: true, order: 3 },
  { id: 'commodity-prices', name: 'Commodity Prices', enabled: true, order: 4 },
]

const defaultSettings: Settings = {
  units: 'metric',
  timeFormat: '24h',
  temperatureScale: 'celsius',
  refreshRate: 30,
  simulationEnabled: true,
  alertsEnabled: true,
  alertVolume: 70,
  alertThreshold: 80,
  alertCategories: {
    equipment: true,
    safety: true,
    production: true,
    personnel: false,
  },
  dashboardWidgets: defaultWidgets,
  displayName: 'Operations Supervisor',
  email: 'supervisor@heliosmining.corp',
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateAlertCategory = (category: keyof Settings['alertCategories'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      alertCategories: { ...prev.alertCategories, [category]: value },
    }))
  }

  const updateWidgetOrder = (widgets: DashboardWidget[]) => {
    setSettings((prev) => ({ ...prev, dashboardWidgets: widgets }))
  }

  const toggleWidget = (widgetId: string) => {
    setSettings((prev) => ({
      ...prev,
      dashboardWidgets: prev.dashboardWidgets.map((w) =>
        w.id === widgetId ? { ...w, enabled: !w.enabled } : w
      ),
    }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateAlertCategory,
        updateWidgetOrder,
        toggleWidget,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
