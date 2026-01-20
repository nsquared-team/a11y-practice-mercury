import { useState } from 'react'
import { Monitor, Bell, Layout, User } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import ToggleSwitch from '../components/settings/ToggleSwitch'
import RangeSlider from '../components/settings/RangeSlider'
import DashboardWidgetList from '../components/settings/DashboardWidgetList'

function Settings() {
  const [activeTab, setActiveTab] = useState<'display' | 'notifications' | 'dashboard' | 'account'>('display')
  const { settings, updateSetting, updateAlertCategory, updateWidgetOrder, toggleWidget, resetSettings } = useSettings()

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
                  onChange={(e) => updateSetting('units', e.target.value as 'metric' | 'imperial')}
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
                  onChange={(e) => updateSetting('timeFormat', e.target.value as '24h' | '12h')}
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
                  onChange={(e) => updateSetting('temperatureScale', e.target.value as 'celsius' | 'fahrenheit')}
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
            <ToggleSwitch
              enabled={settings.simulationEnabled}
              onChange={(enabled) => updateSetting('simulationEnabled', enabled)}
              label="Enable Real-Time Simulation"
              description="Simulates live data updates for demo purposes"
            />
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-2xl space-y-6">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Notification Settings</h2>
            <div className="space-y-4">
              {/* Master Toggle */}
              <ToggleSwitch
                enabled={settings.alertsEnabled}
                onChange={(enabled) => updateSetting('alertsEnabled', enabled)}
                label="Enable Alerts"
                description="Receive system notifications"
              />

              {/* Alert Volume Slider */}
              <div className="border-t border-mercury-dark-tertiary pt-4">
                <RangeSlider
                  value={settings.alertVolume}
                  onChange={(value) => updateSetting('alertVolume', value)}
                  min={0}
                  max={100}
                  disabled={!settings.alertsEnabled}
                  label="Alert Sound Volume"
                  description="Adjust the volume for alert notifications"
                  valueFormatter={(v) => `${v}%`}
                />
              </div>

              {/* Alert Threshold Slider */}
              <div className="border-t border-mercury-dark-tertiary pt-4">
                <RangeSlider
                  value={settings.alertThreshold}
                  onChange={(value) => updateSetting('alertThreshold', value)}
                  min={50}
                  max={100}
                  disabled={!settings.alertsEnabled}
                  label="Equipment Warning Threshold"
                  description="Trigger alerts when equipment utilization exceeds this level"
                  valueFormatter={(v) => `${v}%`}
                />
              </div>

              {/* Category Toggles */}
              <div className="border-t border-mercury-dark-tertiary pt-4 space-y-3">
                <p className="text-sm text-gray-400 mb-2">Alert Categories</p>
                {(Object.entries(settings.alertCategories) as [keyof typeof settings.alertCategories, boolean][]).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <p className="text-gray-300 capitalize">{key} Alerts</p>
                    <ToggleSwitch
                      enabled={value && settings.alertsEnabled}
                      onChange={(enabled) => updateAlertCategory(key, enabled)}
                      disabled={!settings.alertsEnabled}
                      size="sm"
                    />
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
          <p className="text-sm text-gray-400 mb-4">
            Customize which widgets appear on your dashboard and their order.
          </p>
          <DashboardWidgetList
            widgets={settings.dashboardWidgets}
            onReorder={updateWidgetOrder}
            onToggle={toggleWidget}
            onReset={resetSettings}
          />
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
                  <p className="text-gray-200 font-medium">{settings.displayName}</p>
                  <p className="text-sm text-gray-500">{settings.email}</p>
                </div>
              </div>
              <div className="border-t border-mercury-dark-tertiary pt-4">
                <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => updateSetting('displayName', e.target.value)}
                  className="w-full bg-mercury-dark border border-mercury-dark-tertiary rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-mercury-amber"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
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
