import { miningSites } from "./sites.js";
import { equipmentData } from "./equipment.js";
import { personnelData } from "./personnel.js";
const reportMetrics = {
  extraction: [
    { id: "totalOutput", name: "Total Output", unit: "kg" },
    { id: "avgRate", name: "Average Rate", unit: "kg/hr" },
    { id: "peakRate", name: "Peak Rate", unit: "kg/hr" },
    { id: "efficiency", name: "Efficiency", unit: "%" },
    { id: "downtime", name: "Downtime", unit: "hrs" }
  ],
  equipment: [
    { id: "utilization", name: "Utilization", unit: "%" },
    { id: "operational", name: "Operational Hours", unit: "hrs" },
    { id: "maintenance", name: "Maintenance Hours", unit: "hrs" },
    { id: "faults", name: "Fault Count", unit: "" },
    { id: "mtbf", name: "Mean Time Between Failures", unit: "hrs" }
  ],
  personnel: [
    { id: "activeCount", name: "Active Personnel", unit: "" },
    { id: "shiftHours", name: "Total Shift Hours", unit: "hrs" },
    { id: "overtime", name: "Overtime Hours", unit: "hrs" },
    { id: "certExpiring", name: "Expiring Certifications", unit: "" },
    { id: "productivity", name: "Productivity Index", unit: "" }
  ],
  commodity: [
    { id: "mercurium", name: "Mercurium Price", unit: "cr/kg" },
    { id: "solarPlatinum", name: "Solar Platinum Price", unit: "cr/kg" },
    { id: "thermalCrystals", name: "Thermal Crystals Price", unit: "cr/kg" },
    { id: "volume", name: "Trade Volume", unit: "kg" },
    { id: "revenue", name: "Revenue", unit: "cr" }
  ]
};
function generateReportData(config, days = 7) {
  const data = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const point = { date: dateStr };
    config.metrics.forEach((metricId) => {
      switch (config.type) {
        case "extraction":
          point[metricId] = generateExtractionMetric(metricId, i);
          break;
        case "equipment":
          point[metricId] = generateEquipmentMetric(metricId, i);
          break;
        case "personnel":
          point[metricId] = generatePersonnelMetric(metricId, i);
          break;
        case "commodity":
          point[metricId] = generateCommodityMetric(metricId, i);
          break;
      }
    });
    data.push(point);
  }
  return data;
}
function generateExtractionMetric(metricId, _dayOffset) {
  const baseValues = {
    totalOutput: 45e3,
    avgRate: 120,
    peakRate: 180,
    efficiency: 87,
    downtime: 2
  };
  const base = baseValues[metricId] || 100;
  const variance = base * 0.15;
  return Math.round((base + (Math.random() - 0.5) * variance * 2) * 10) / 10;
}
function generateEquipmentMetric(metricId, _dayOffset) {
  const baseValues = {
    utilization: 78,
    operational: 20,
    maintenance: 4,
    faults: 2,
    mtbf: 168
  };
  const base = baseValues[metricId] || 50;
  const variance = base * 0.2;
  return Math.round((base + (Math.random() - 0.5) * variance * 2) * 10) / 10;
}
function generatePersonnelMetric(metricId, _dayOffset) {
  const baseValues = {
    activeCount: 45,
    shiftHours: 360,
    overtime: 24,
    certExpiring: 3,
    productivity: 92
  };
  const base = baseValues[metricId] || 50;
  const variance = base * 0.1;
  return Math.round((base + (Math.random() - 0.5) * variance * 2) * 10) / 10;
}
function generateCommodityMetric(metricId, _dayOffset) {
  const baseValues = {
    mercurium: 2450,
    solarPlatinum: 8920,
    thermalCrystals: 3150,
    volume: 12e3,
    revenue: 45e6
  };
  const base = baseValues[metricId] || 1e3;
  const variance = base * 0.08;
  return Math.round((base + (Math.random() - 0.5) * variance * 2) * 10) / 10;
}
function getDaysFromPreset(preset) {
  switch (preset) {
    case "7days":
      return 7;
    case "30days":
      return 30;
    case "quarter":
      return 90;
    case "year":
      return 365;
    default:
      return 7;
  }
}
const savedReports = [
  {
    id: "RPT-001",
    name: "Weekly Extraction Summary",
    type: "extraction",
    description: "Overview of extraction performance across all sites",
    created: /* @__PURE__ */ new Date("2026-01-10"),
    lastRun: /* @__PURE__ */ new Date("2026-01-18"),
    schedule: "weekly",
    config: {
      type: "extraction",
      dateRange: "7days",
      visualization: "area",
      metrics: ["totalOutput", "efficiency"],
      filters: {}
    }
  },
  {
    id: "RPT-002",
    name: "Equipment Utilization Report",
    type: "equipment",
    description: "Monthly equipment utilization and maintenance metrics",
    created: /* @__PURE__ */ new Date("2026-01-05"),
    lastRun: /* @__PURE__ */ new Date("2026-01-17"),
    schedule: "monthly",
    config: {
      type: "equipment",
      dateRange: "30days",
      visualization: "bar",
      metrics: ["utilization", "maintenance"],
      filters: {}
    }
  },
  {
    id: "RPT-003",
    name: "Personnel Shift Analysis",
    type: "personnel",
    description: "Weekly breakdown of shift hours and overtime",
    created: /* @__PURE__ */ new Date("2026-01-08"),
    lastRun: /* @__PURE__ */ new Date("2026-01-16"),
    schedule: "weekly",
    config: {
      type: "personnel",
      dateRange: "7days",
      visualization: "line",
      metrics: ["shiftHours", "overtime", "productivity"],
      filters: {}
    }
  },
  {
    id: "RPT-004",
    name: "Commodity Price Trends",
    type: "commodity",
    description: "Quarterly commodity price analysis and revenue tracking",
    created: /* @__PURE__ */ new Date("2025-12-15"),
    lastRun: /* @__PURE__ */ new Date("2026-01-15"),
    schedule: "monthly",
    config: {
      type: "commodity",
      dateRange: "quarter",
      visualization: "line",
      metrics: ["mercurium", "solarPlatinum", "thermalCrystals"],
      filters: {}
    }
  },
  {
    id: "RPT-005",
    name: "Site Performance Comparison",
    type: "extraction",
    description: "Compare extraction rates across multiple sites",
    created: /* @__PURE__ */ new Date("2026-01-12"),
    lastRun: null,
    schedule: "none",
    config: {
      type: "extraction",
      dateRange: "30days",
      visualization: "bar",
      metrics: ["avgRate", "efficiency"],
      filters: {
        siteIds: ["SITE-001", "SITE-002", "SITE-003"]
      }
    }
  }
];
function generateCSV(data, metrics) {
  if (data.length === 0) return "";
  const headers = ["Date", ...metrics.map((m) => {
    const metricInfo = Object.values(reportMetrics).flat().find((metric) => metric.id === m);
    return metricInfo?.name || m;
  })];
  const rows = data.map((point) => {
    return [point.date, ...metrics.map((m) => point[m]?.toString() || "")];
  });
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(","))
  ].join("\n");
  return csvContent;
}
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function generateExtractionReportFromSites(days = 7) {
  const data = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const activeSites = miningSites.filter((s) => s.status === "active");
    const totalOutput = activeSites.reduce((sum, s) => sum + s.extractionRate * 24, 0);
    const avgRate = activeSites.length > 0 ? activeSites.reduce((sum, s) => sum + s.extractionRate, 0) / activeSites.length : 0;
    const peakRate = Math.max(...activeSites.map((s) => s.extractionRate), 0);
    const efficiency = 85 + Math.random() * 10;
    const downtime = Math.random() * 4;
    data.push({
      date: dateStr,
      totalOutput: Math.round(totalOutput * (0.9 + Math.random() * 0.2)),
      avgRate: Math.round(avgRate * (0.95 + Math.random() * 0.1) * 10) / 10,
      peakRate: Math.round(peakRate * (0.98 + Math.random() * 0.04)),
      efficiency: Math.round(efficiency * 10) / 10,
      downtime: Math.round(downtime * 10) / 10
    });
  }
  return data;
}
function generateEquipmentReportFromData(days = 7) {
  const data = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const operational = equipmentData.filter((e) => e.status === "operational");
    const inMaintenance = equipmentData.filter((e) => e.status === "maintenance");
    const avgUtilization = operational.length > 0 ? operational.reduce((sum, e) => sum + e.utilization, 0) / operational.length : 0;
    const operationalHours = operational.length * 20 + Math.random() * operational.length * 4;
    const maintenanceHours = inMaintenance.length * 8 + Math.random() * 4;
    const faults = Math.floor(Math.random() * 5);
    const mtbf = 150 + Math.random() * 50;
    data.push({
      date: dateStr,
      utilization: Math.round(avgUtilization * (0.95 + Math.random() * 0.1) * 10) / 10,
      operational: Math.round(operationalHours * 10) / 10,
      maintenance: Math.round(maintenanceHours * 10) / 10,
      faults,
      mtbf: Math.round(mtbf)
    });
  }
  return data;
}
function generatePersonnelReportFromData(days = 7) {
  const data = [];
  const now = /* @__PURE__ */ new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const activeCount = personnelData.filter((p) => p.currentAssignment !== null).length;
    const totalPersonnel = personnelData.length;
    const shiftHours = totalPersonnel * 8 * (0.9 + Math.random() * 0.2);
    const overtime = totalPersonnel * 0.5 * Math.random();
    const certExpiring = personnelData.filter(
      (p) => p.certifications.some((c) => c.status === "expiring")
    ).length;
    const productivity = 85 + Math.random() * 12;
    data.push({
      date: dateStr,
      activeCount: activeCount + Math.floor(Math.random() * 5 - 2),
      shiftHours: Math.round(shiftHours),
      overtime: Math.round(overtime * 10) / 10,
      certExpiring,
      productivity: Math.round(productivity * 10) / 10
    });
  }
  return data;
}
function getReportTypeLabel(type) {
  switch (type) {
    case "extraction":
      return "Extraction";
    case "equipment":
      return "Equipment";
    case "personnel":
      return "Personnel";
    case "commodity":
      return "Commodity";
  }
}
function getVisualizationLabel(vis) {
  switch (vis) {
    case "line":
      return "Line Chart";
    case "bar":
      return "Bar Chart";
    case "area":
      return "Area Chart";
    case "table":
      return "Data Table";
  }
}
export {
  downloadCSV,
  generateCSV,
  generateEquipmentReportFromData,
  generateExtractionReportFromSites,
  generatePersonnelReportFromData,
  generateReportData,
  getDaysFromPreset,
  getReportTypeLabel,
  getVisualizationLabel,
  reportMetrics,
  savedReports
};
