import { useState } from 'react'
import { Monitor, Bell, Layout, User } from 'lucide-react'

function Settings() {
  const [activeTab, setActiveTab] = useState<'display' | 'notifications' | 'dashboard' | 'account'>('display')

  // Settings state
  const [settings, setSettings] = useState({
    units: 'metric',
    timeFormat: '24h',
    temperatureScale: 'celsius',
    refreshRate: 30,
    simulationEnabled: true,
    alertsEnabled: true,
    alertCategories: {
      equipment: true,
      safety: true,
      production: true,
      personnel: false,
    },
  })

  const updateSetting = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your dashboard preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-mercury-dark-tertiary">
        {[
          { id: 'display', label: 'Display', icon: Monitor },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'dashboard', label: 'Dashboard', icon: Layout },
          { id: 'account', label: 'Account', icon: User },
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
      {activeTab === 'display' && (
        <div className="max-w-2xl space-y-6">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Display Preferences</h2>
            <div className="space-y-4">
              {/* Units */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-200">Units</p>
                  <p className="text-sm text-gray-500">Choose measurement system</p>
                </div>
                <select
                  value={settings.units}
                  onChange={(e) => updateSetting('units', e.target.value)}
                  className="bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>

              {/* Time Format */}
              <div className="flex items-center justify-between border-t border-mercury-dark-tertiary pt-4">
                <div>
                  <p className="text-gray-200">Time Format</p>
                  <p className="text-sm text-gray-500">Choose time display format</p>
                </div>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => updateSetting('timeFormat', e.target.value)}
                  className="bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                >
                  <option value="24h">24-hour</option>
                  <option value="12h">12-hour</option>
                </select>
              </div>

              {/* Temperature Scale */}
              <div className="flex items-center justify-between border-t border-mercury-dark-tertiary pt-4">
                <div>
                  <p className="text-gray-200">Temperature Scale</p>
                  <p className="text-sm text-gray-500">Choose temperature display</p>
                </div>
                <select
                  value={settings.temperatureScale}
                  onChange={(e) => updateSetting('temperatureScale', e.target.value)}
                  className="bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>

              {/* Refresh Rate */}
              <div className="flex items-center justify-between border-t border-mercury-dark-tertiary pt-4">
                <div>
                  <p className="text-gray-200">Data Refresh Rate</p>
                  <p className="text-sm text-gray-500">How often to update data</p>
                </div>
                <select
                  value={settings.refreshRate}
                  onChange={(e) => updateSetting('refreshRate', Number(e.target.value))}
                  className="bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                >
                  <option value={15}>15 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulation Toggle */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Simulation</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200">Enable Real-Time Simulation</p>
                <p className="text-sm text-gray-500">Simulates live data updates for demo purposes</p>
              </div>
              <button
                onClick={() => updateSetting('simulationEnabled', !settings.simulationEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.simulationEnabled ? 'bg-mercury-amber' : 'bg-mercury-dark-tertiary'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.simulationEnabled ? 'left-7' : 'left-1'
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-2xl space-y-6">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Notification Settings</h2>
            <div className="space-y-4">
              {/* Master Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-200">Enable Alerts</p>
                  <p className="text-sm text-gray-500">Receive system notifications</p>
                </div>
                <button
                  onClick={() => updateSetting('alertsEnabled', !settings.alertsEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.alertsEnabled ? 'bg-mercury-amber' : 'bg-mercury-dark-tertiary'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.alertsEnabled ? 'left-7' : 'left-1'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Category Toggles */}
              <div className="border-t border-mercury-dark-tertiary pt-4 space-y-3">
                <p className="text-sm text-gray-400 mb-2">Alert Categories</p>
                {Object.entries(settings.alertCategories).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <p className="text-gray-300 capitalize">{key} Alerts</p>
                    <button
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          alertCategories: { ...prev.alertCategories, [key]: !value },
                        }))
                      }
                      disabled={!settings.alertsEnabled}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        value && settings.alertsEnabled
                          ? 'bg-mercury-amber'
                          : 'bg-mercury-dark-tertiary'
                      } ${!settings.alertsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          value && settings.alertsEnabled ? 'left-5' : 'left-0.5'
                        }`}
                      ></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="card max-w-2xl">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Dashboard Customization</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-mercury-dark-tertiary rounded-lg">
            <p className="text-gray-500">Drag-and-drop widget customization will be implemented in Phase 7</p>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="max-w-2xl space-y-6">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-mercury-dark-tertiary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-mercury-amber" />
                </div>
                <div>
                  <p className="text-gray-200 font-medium">Operations Supervisor</p>
                  <p className="text-sm text-gray-500">supervisor@heliosmining.corp</p>
                </div>
              </div>
              <div className="border-t border-mercury-dark-tertiary pt-4">
                <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                <input
                  type="text"
                  defaultValue="Operations Supervisor"
                  className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="supervisor@heliosmining.corp"
                  className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                />
              </div>
              <button className="btn-primary mt-4">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
