const now = /* @__PURE__ */ new Date();
const minutesAgo = (mins) => new Date(now.getTime() - mins * 60 * 1e3);
const hoursAgo = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1e3);
const alertsData = [
  {
    id: "ALT-001",
    severity: "warning",
    category: "equipment",
    title: "Maintenance Required",
    message: "Thermal Drill Unit 7 has exceeded scheduled maintenance interval by 48 hours",
    timestamp: minutesAgo(15),
    isRead: false,
    equipmentId: "TDU-002",
    siteId: "RC-002"
  },
  {
    id: "ALT-002",
    severity: "info",
    category: "personnel",
    title: "Shift Change",
    message: "Alpha to Beta shift transition scheduled in 2 hours",
    timestamp: hoursAgo(1),
    isRead: false
  },
  {
    id: "ALT-003",
    severity: "success",
    category: "production",
    title: "Target Achieved",
    message: "Caloris Basin Alpha reached daily extraction target of 3,750 kg",
    timestamp: hoursAgo(2),
    isRead: true,
    siteId: "CB-001"
  },
  {
    id: "ALT-004",
    severity: "critical",
    category: "safety",
    title: "Temperature Warning",
    message: "Hokusai Volcanic Rift surface temperature exceeds safe operating limits (445\xB0C)",
    timestamp: hoursAgo(3),
    isRead: false,
    siteId: "HV-008"
  },
  {
    id: "ALT-005",
    severity: "warning",
    category: "equipment",
    title: "Sensor Anomaly",
    message: "Processing Module 3 reporting intermittent pressure sensor readings",
    timestamp: hoursAgo(4),
    isRead: true,
    equipmentId: "PM-003"
  },
  {
    id: "ALT-006",
    severity: "info",
    category: "system",
    title: "System Update",
    message: "Scheduled maintenance window for communication systems at 03:00 Mercury Standard Time",
    timestamp: hoursAgo(5),
    isRead: true
  },
  {
    id: "ALT-007",
    severity: "success",
    category: "production",
    title: "Efficiency Record",
    message: "Raditladi Thermal Zone achieved 98.5% extraction efficiency - new facility record",
    timestamp: hoursAgo(6),
    isRead: true,
    siteId: "RT-003"
  },
  {
    id: "ALT-008",
    severity: "warning",
    category: "personnel",
    title: "Certification Expiring",
    message: "3 personnel have certifications expiring within the next 14 days",
    timestamp: hoursAgo(8),
    isRead: false
  },
  {
    id: "ALT-009",
    severity: "critical",
    category: "equipment",
    title: "Equipment Offline",
    message: "Environmental Shield 4 has gone offline at Discovery Rupes site",
    timestamp: hoursAgo(10),
    isRead: true,
    equipmentId: "ES-004",
    siteId: "DR-016"
  },
  {
    id: "ALT-010",
    severity: "info",
    category: "production",
    title: "Commodity Update",
    message: "Mercurium spot price increased 2.3% in the last trading session",
    timestamp: hoursAgo(12),
    isRead: true
  },
  {
    id: "ALT-011",
    severity: "warning",
    category: "safety",
    title: "Radiation Levels",
    message: "Elevated radiation detected in Sector 11-Epsilon. Personnel advised to use enhanced shielding.",
    timestamp: hoursAgo(14),
    isRead: true,
    siteId: "HV-008"
  },
  {
    id: "ALT-012",
    severity: "success",
    category: "equipment",
    title: "Maintenance Complete",
    message: "Conveyor Hauler 5 maintenance completed successfully and returned to operation",
    timestamp: hoursAgo(18),
    isRead: true,
    equipmentId: "CH-005"
  },
  {
    id: "ALT-013",
    severity: "info",
    category: "personnel",
    title: "New Assignment",
    message: "Marcus Chen assigned as lead operator for Kuiper Ridge expansion project",
    timestamp: hoursAgo(20),
    isRead: true,
    personnelId: "P002",
    siteId: "KR-012"
  },
  {
    id: "ALT-014",
    severity: "warning",
    category: "production",
    title: "Below Target",
    message: "Polar Shadow Mine production 35% below daily target due to thermal cycling",
    timestamp: hoursAgo(22),
    isRead: true,
    siteId: "PS-005"
  },
  {
    id: "ALT-015",
    severity: "critical",
    category: "system",
    title: "Communication Delay",
    message: "Earth relay satellite experiencing 2.3 second latency increase - monitoring",
    timestamp: hoursAgo(24),
    isRead: true
  }
];
function getAlertsBySeverity(severity) {
  return alertsData.filter((alert) => alert.severity === severity);
}
function getAlertsByCategory(category) {
  return alertsData.filter((alert) => alert.category === category);
}
function getUnreadAlerts() {
  return alertsData.filter((alert) => !alert.isRead);
}
function getRecentAlerts(count = 10) {
  return [...alertsData].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, count);
}
function getAlertStats() {
  return {
    total: alertsData.length,
    unread: alertsData.filter((a) => !a.isRead).length,
    bySeverity: {
      critical: alertsData.filter((a) => a.severity === "critical").length,
      warning: alertsData.filter((a) => a.severity === "warning").length,
      info: alertsData.filter((a) => a.severity === "info").length,
      success: alertsData.filter((a) => a.severity === "success").length
    },
    byCategory: {
      equipment: alertsData.filter((a) => a.category === "equipment").length,
      safety: alertsData.filter((a) => a.category === "safety").length,
      production: alertsData.filter((a) => a.category === "production").length,
      personnel: alertsData.filter((a) => a.category === "personnel").length,
      system: alertsData.filter((a) => a.category === "system").length
    }
  };
}
function getSeverityColor(severity) {
  switch (severity) {
    case "critical":
      return "bg-status-error/10 border-status-error text-status-error";
    case "warning":
      return "bg-status-warning/10 border-status-warning text-status-warning";
    case "info":
      return "bg-mercury-dark-tertiary border-mercury-gray text-gray-300";
    case "success":
      return "bg-status-active/10 border-status-active text-status-active";
  }
}
function formatAlertTime(timestamp) {
  const now2 = /* @__PURE__ */ new Date();
  const diffMs = now2.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / (1e3 * 60));
  const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
const commoditiesData = [
  {
    symbol: "MRC",
    name: "Mercurium",
    price: 12450,
    change24h: 2.3,
    trend: "up",
    history: [11800, 11950, 12100, 12050, 12200, 12180, 12450]
  },
  {
    symbol: "SPT",
    name: "Solar Platinum",
    price: 8720,
    change24h: -1.2,
    trend: "down",
    history: [8900, 8850, 8920, 8800, 8780, 8850, 8720]
  },
  {
    symbol: "THC",
    name: "Thermal Crystals",
    price: 3280,
    change24h: 5.7,
    trend: "up",
    history: [3050, 3100, 3080, 3150, 3200, 3180, 3280]
  }
];
function getCommodityTrendColor(trend) {
  switch (trend) {
    case "up":
      return "text-status-active bg-status-active/20";
    case "down":
      return "text-status-error bg-status-error/20";
    case "stable":
      return "text-gray-400 bg-gray-500/20";
  }
}
export {
  alertsData,
  commoditiesData,
  formatAlertTime,
  getAlertStats,
  getAlertsByCategory,
  getAlertsBySeverity,
  getCommodityTrendColor,
  getRecentAlerts,
  getSeverityColor,
  getUnreadAlerts
};
