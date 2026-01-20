import { useState, useEffect, useCallback, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { miningSites, MiningSite } from '../data/sites'
import { equipmentData, Equipment } from '../data/equipment'
import { alertsData, Alert, AlertSeverity, AlertCategory } from '../data/alerts'
import { commoditiesData, Commodity } from '../data/alerts'
import { generateExtractionData, ExtractionDataPoint, generateNewDataPoint } from '../utils/chartData'

export interface SimulationState {
  sites: MiningSite[]
  equipment: Equipment[]
  alerts: Alert[]
  commodities: Commodity[]
  extractionData: ExtractionDataPoint[]
  lastUpdate: Date
  isRunning: boolean
}

// Alert templates for generating new alerts
const alertTemplates: Array<{
  severity: AlertSeverity
  category: AlertCategory
  title: string
  messageTemplate: string
}> = [
  {
    severity: 'warning',
    category: 'equipment',
    title: 'Sensor Warning',
    messageTemplate: 'Equipment {equipment} reporting elevated readings',
  },
  {
    severity: 'info',
    category: 'production',
    title: 'Production Update',
    messageTemplate: 'Site {site} reached {value}% of daily target',
  },
  {
    severity: 'success',
    category: 'production',
    title: 'Milestone Achieved',
    messageTemplate: 'Site {site} exceeded production expectations',
  },
  {
    severity: 'warning',
    category: 'safety',
    title: 'Temperature Alert',
    messageTemplate: 'Surface temperature spike detected at {site}',
  },
  {
    severity: 'info',
    category: 'personnel',
    title: 'Shift Update',
    messageTemplate: 'Personnel rotation completed for {shift} shift',
  },
]

const equipmentNames = [
  'Thermal Drill Unit 1',
  'Thermal Drill Unit 2',
  'Conveyor Hauler 3',
  'Processing Module 2',
  'Environmental Shield 1',
  'Transport Vehicle 4',
  'Sensor Array 5',
]

const siteNames = [
  'Caloris Basin Alpha',
  'Rachmaninoff Crater Deep',
  'Raditladi Thermal Zone',
  'Polar Shadow Mine',
  'Tolstoj Crater Site',
]

const shifts = ['Alpha', 'Beta', 'Gamma']

function generateRandomAlert(): Alert {
  const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)]
  const equipment = equipmentNames[Math.floor(Math.random() * equipmentNames.length)]
  const site = siteNames[Math.floor(Math.random() * siteNames.length)]
  const shift = shifts[Math.floor(Math.random() * shifts.length)]
  const value = Math.floor(Math.random() * 30) + 70

  const message = template.messageTemplate
    .replace('{equipment}', equipment)
    .replace('{site}', site)
    .replace('{shift}', shift)
    .replace('{value}', value.toString())

  return {
    id: `ALT-SIM-${Date.now()}`,
    severity: template.severity,
    category: template.category,
    title: template.title,
    message,
    timestamp: new Date(),
    isRead: false,
  }
}

export function useSimulation(): SimulationState & {
  refreshData: () => void
  markAlertRead: (alertId: string) => void
} {
  const { settings } = useSettings()
  const { simulationEnabled, refreshRate } = settings

  // Initialize state with data fixtures
  const [sites, setSites] = useState<MiningSite[]>(() => [...miningSites])
  const [equipment, setEquipment] = useState<Equipment[]>(() => [...equipmentData])
  const [alerts, setAlerts] = useState<Alert[]>(() => [...alertsData])
  const [commodities, setCommodities] = useState<Commodity[]>(() => [...commoditiesData])
  const [extractionData, setExtractionData] = useState<ExtractionDataPoint[]>(() =>
    generateExtractionData()
  )
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Update site extraction rates with small random variations
  const updateSites = useCallback(() => {
    setSites((prevSites) =>
      prevSites.map((site) => {
        if (site.status !== 'active') return site

        // Small variation in extraction rate (±5%)
        const variation = 0.95 + Math.random() * 0.1
        const newRate = Math.round(site.extractionRate * variation * 10) / 10

        // Update daily progress
        const timeFactor = refreshRate / 3600 // fraction of an hour
        const progressIncrement = Math.round(newRate * timeFactor)
        const newProgress = Math.min(site.dailyProgress + progressIncrement, site.dailyTarget * 1.2)

        // Small temperature variation
        const tempVariation = (Math.random() - 0.5) * 10
        const newTemp = Math.round(site.temperature + tempVariation)

        return {
          ...site,
          extractionRate: newRate,
          dailyProgress: newProgress,
          temperature: newTemp,
          lastUpdated: new Date(),
        }
      })
    )
  }, [refreshRate])

  // Update equipment sensor readings
  const updateEquipment = useCallback(() => {
    setEquipment((prevEquipment) =>
      prevEquipment.map((equip) => {
        if (equip.status !== 'operational') return equip

        // Update sensor readings with small variations
        const updatedSensors = equip.sensors.map((sensor) => {
          const variation = (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.05
          const newValue = Math.max(
            sensor.min,
            Math.min(sensor.max, sensor.value + variation)
          )

          // Determine status based on value
          const range = sensor.max - sensor.min
          const normalizedValue = (newValue - sensor.min) / range
          let status = sensor.status
          if (normalizedValue > 0.9) {
            status = 'critical'
          } else if (normalizedValue > 0.75) {
            status = 'warning'
          } else {
            status = 'normal'
          }

          return {
            ...sensor,
            value: Math.round(newValue * 10) / 10,
            status,
          }
        })

        // Small utilization variation for operational equipment
        const utilizationVariation = (Math.random() - 0.5) * 5
        const newUtilization = Math.max(
          0,
          Math.min(100, equip.utilization + utilizationVariation)
        )

        return {
          ...equip,
          sensors: updatedSensors,
          utilization: Math.round(newUtilization),
        }
      })
    )
  }, [])

  // Update commodity prices
  const updateCommodities = useCallback(() => {
    setCommodities((prevCommodities) =>
      prevCommodities.map((commodity) => {
        // Small price change (±0.5%)
        const changePercent = (Math.random() - 0.5) * 1
        const newPrice = Math.round(commodity.price * (1 + changePercent / 100))

        // Update 24h change
        const newChange24h = Math.round((commodity.change24h + changePercent * 0.1) * 10) / 10

        // Determine trend
        let trend: 'up' | 'down' | 'stable' = 'stable'
        if (newChange24h > 0.5) trend = 'up'
        else if (newChange24h < -0.5) trend = 'down'

        return {
          ...commodity,
          price: newPrice,
          change24h: Math.max(-10, Math.min(10, newChange24h)),
          trend,
        }
      })
    )
  }, [])

  // Add new chart data point
  const updateExtractionData = useCallback(() => {
    setExtractionData((prevData) => {
      const newPoint = generateNewDataPoint(prevData)
      // Keep last 24 data points
      const updatedData = [...prevData.slice(-23), newPoint]
      return updatedData
    })
  }, [])

  // Occasionally add a new alert
  const maybeAddAlert = useCallback(() => {
    // 20% chance of adding a new alert each update cycle
    if (Math.random() < 0.2) {
      const newAlert = generateRandomAlert()
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts].slice(0, 20)) // Keep max 20 alerts
    }
  }, [])

  // Mark alert as read
  const markAlertRead = useCallback((alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    )
  }, [])

  // Manual refresh function
  const refreshData = useCallback(() => {
    updateSites()
    updateEquipment()
    updateCommodities()
    updateExtractionData()
    setLastUpdate(new Date())
  }, [updateSites, updateEquipment, updateCommodities, updateExtractionData])

  // Set up simulation interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (simulationEnabled) {
      intervalRef.current = setInterval(() => {
        updateSites()
        updateEquipment()
        updateCommodities()
        updateExtractionData()
        maybeAddAlert()
        setLastUpdate(new Date())
      }, refreshRate * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [
    simulationEnabled,
    refreshRate,
    updateSites,
    updateEquipment,
    updateCommodities,
    updateExtractionData,
    maybeAddAlert,
  ])

  return {
    sites,
    equipment,
    alerts,
    commodities,
    extractionData,
    lastUpdate,
    isRunning: simulationEnabled,
    refreshData,
    markAlertRead,
  }
}

// Calculate aggregated metrics from simulation state
export function useSimulationMetrics(state: SimulationState) {
  const totalExtractionToday = state.sites
    .filter((s) => s.status === 'active')
    .reduce((sum, site) => sum + site.dailyProgress, 0)

  const activeEquipmentCount = state.equipment.filter(
    (e) => e.status === 'operational'
  ).length

  const personnelOnShift = state.sites
    .filter((s) => s.status === 'active')
    .reduce((sum, site) => sum + site.personnelCount, 0)

  const unreadAlertCount = state.alerts.filter((a) => !a.isRead).length

  const equipmentStatusCounts = {
    operational: state.equipment.filter((e) => e.status === 'operational').length,
    idle: state.equipment.filter((e) => e.status === 'idle').length,
    maintenance: state.equipment.filter((e) => e.status === 'maintenance').length,
    offline: state.equipment.filter((e) => e.status === 'offline').length,
  }

  return {
    totalExtractionToday,
    activeEquipmentCount,
    personnelOnShift,
    unreadAlertCount,
    equipmentStatusCounts,
  }
}
