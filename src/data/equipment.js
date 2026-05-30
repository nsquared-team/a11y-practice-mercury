function getEquipmentStatusColor(status) {
  switch (status) {
    case "operational":
      return "text-status-active border-status-active/30 bg-status-active/10";
    case "idle":
      return "text-status-idle border-status-idle/30 bg-status-idle/10";
    case "maintenance":
      return "text-status-warning border-status-warning/30 bg-status-warning/10";
    case "offline":
      return "text-status-error border-status-error/30 bg-status-error/10";
  }
}
function getSensorStatusColor(status) {
  switch (status) {
    case "normal":
      return "text-status-active";
    case "warning":
      return "text-status-warning";
    case "critical":
      return "text-status-error";
  }
}
function getMaintenancePriorityColor(priority) {
  switch (priority) {
    case "low":
      return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    case "medium":
      return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    case "high":
      return "text-status-warning bg-status-warning/10 border-status-warning/30";
    case "critical":
      return "text-status-error bg-status-error/10 border-status-error/30";
  }
}
function getDaysUntilMaintenance(equipment) {
  const now = /* @__PURE__ */ new Date();
  const diff = equipment.nextMaintenance.getTime() - now.getTime();
  return Math.ceil(diff / (1e3 * 60 * 60 * 24));
}
function getEquipmentTypeIcon(type) {
  switch (type) {
    case "Thermal Drill Unit":
      return "\u{1F529}";
    case "Conveyor Hauler":
      return "\u{1F69A}";
    case "Processing Module":
      return "\u2699\uFE0F";
    case "Environmental Shield":
      return "\u{1F6E1}\uFE0F";
    case "Transport Vehicle":
      return "\u{1F69B}";
    case "Sensor Array":
      return "\u{1F4E1}";
  }
}
function generateSensors(type, status) {
  const baseSensors = [];
  const isOperational = status === "operational" || status === "idle";
  switch (type) {
    case "Thermal Drill Unit":
      baseSensors.push(
        {
          id: "temp-core",
          name: "Core Temperature",
          value: isOperational ? 180 + Math.random() * 40 : 25,
          unit: "\xB0C",
          min: 0,
          max: 300,
          status: isOperational ? Math.random() > 0.9 ? "warning" : "normal" : "normal"
        },
        {
          id: "drill-rpm",
          name: "Drill RPM",
          value: isOperational ? 2800 + Math.random() * 400 : 0,
          unit: "RPM",
          min: 0,
          max: 4e3,
          status: "normal"
        },
        {
          id: "pressure",
          name: "Hydraulic Pressure",
          value: isOperational ? 280 + Math.random() * 40 : 0,
          unit: "bar",
          min: 0,
          max: 400,
          status: isOperational ? Math.random() > 0.85 ? "warning" : "normal" : "normal"
        },
        {
          id: "vibration",
          name: "Vibration Level",
          value: isOperational ? 2 + Math.random() * 3 : 0,
          unit: "mm/s",
          min: 0,
          max: 10,
          status: isOperational ? Math.random() > 0.92 ? "warning" : "normal" : "normal"
        }
      );
      break;
    case "Conveyor Hauler":
      baseSensors.push(
        {
          id: "belt-speed",
          name: "Belt Speed",
          value: isOperational ? 1.5 + Math.random() * 0.5 : 0,
          unit: "m/s",
          min: 0,
          max: 3,
          status: "normal"
        },
        {
          id: "load",
          name: "Current Load",
          value: isOperational ? 70 + Math.random() * 25 : 0,
          unit: "%",
          min: 0,
          max: 100,
          status: isOperational ? Math.random() > 0.9 ? "warning" : "normal" : "normal"
        },
        {
          id: "motor-temp",
          name: "Motor Temperature",
          value: isOperational ? 45 + Math.random() * 20 : 22,
          unit: "\xB0C",
          min: 0,
          max: 100,
          status: isOperational ? Math.random() > 0.88 ? "warning" : "normal" : "normal"
        }
      );
      break;
    case "Processing Module":
      baseSensors.push(
        {
          id: "throughput",
          name: "Throughput",
          value: isOperational ? 85 + Math.random() * 15 : 0,
          unit: "kg/hr",
          min: 0,
          max: 120,
          status: "normal"
        },
        {
          id: "chamber-temp",
          name: "Chamber Temperature",
          value: isOperational ? 450 + Math.random() * 100 : 25,
          unit: "\xB0C",
          min: 0,
          max: 800,
          status: isOperational ? Math.random() > 0.87 ? "warning" : "normal" : "normal"
        },
        {
          id: "chamber-pressure",
          name: "Chamber Pressure",
          value: isOperational ? 2.5 + Math.random() * 1 : 1,
          unit: "atm",
          min: 0,
          max: 5,
          status: "normal"
        },
        {
          id: "purity",
          name: "Output Purity",
          value: isOperational ? 96 + Math.random() * 3.5 : 0,
          unit: "%",
          min: 0,
          max: 100,
          status: isOperational ? Math.random() > 0.95 ? "warning" : "normal" : "normal"
        }
      );
      break;
    case "Environmental Shield":
      baseSensors.push(
        {
          id: "shield-integrity",
          name: "Shield Integrity",
          value: isOperational ? 92 + Math.random() * 8 : 0,
          unit: "%",
          min: 0,
          max: 100,
          status: isOperational ? Math.random() > 0.9 ? "warning" : "normal" : "normal"
        },
        {
          id: "power-level",
          name: "Power Level",
          value: isOperational ? 75 + Math.random() * 25 : 0,
          unit: "%",
          min: 0,
          max: 100,
          status: "normal"
        },
        {
          id: "radiation",
          name: "Radiation Block",
          value: isOperational ? 99 + Math.random() * 0.9 : 0,
          unit: "%",
          min: 0,
          max: 100,
          status: "normal"
        }
      );
      break;
    case "Transport Vehicle":
      baseSensors.push(
        {
          id: "fuel-level",
          name: "Fuel Level",
          value: 30 + Math.random() * 70,
          unit: "%",
          min: 0,
          max: 100,
          status: Math.random() > 0.7 ? "normal" : "warning"
        },
        {
          id: "engine-temp",
          name: "Engine Temperature",
          value: isOperational ? 85 + Math.random() * 25 : 20,
          unit: "\xB0C",
          min: 0,
          max: 150,
          status: isOperational ? Math.random() > 0.85 ? "warning" : "normal" : "normal"
        },
        {
          id: "cargo-weight",
          name: "Cargo Weight",
          value: isOperational ? 500 + Math.random() * 1500 : 0,
          unit: "kg",
          min: 0,
          max: 2500,
          status: "normal"
        }
      );
      break;
    case "Sensor Array":
      baseSensors.push(
        {
          id: "signal-strength",
          name: "Signal Strength",
          value: isOperational ? 85 + Math.random() * 15 : 0,
          unit: "%",
          min: 0,
          max: 100,
          status: "normal"
        },
        {
          id: "data-rate",
          name: "Data Rate",
          value: isOperational ? 450 + Math.random() * 100 : 0,
          unit: "Mbps",
          min: 0,
          max: 600,
          status: "normal"
        },
        {
          id: "active-sensors",
          name: "Active Sensors",
          value: isOperational ? 22 + Math.floor(Math.random() * 10) : 0,
          unit: "units",
          min: 0,
          max: 32,
          status: isOperational ? Math.random() > 0.9 ? "warning" : "normal" : "normal"
        }
      );
      break;
  }
  baseSensors.push({
    id: "power",
    name: "Power Draw",
    value: isOperational ? 60 + Math.random() * 35 : 5,
    unit: "kW",
    min: 0,
    max: 100,
    status: isOperational ? Math.random() > 0.92 ? "warning" : "normal" : "normal"
  });
  return baseSensors;
}
function generateMaintenanceHistory(installDate) {
  const history = [];
  const types = ["routine", "repair", "inspection", "upgrade"];
  const technicians = [
    "Chen Wei",
    "Maria Santos",
    "James O'Brien",
    "Yuki Tanaka",
    "Ahmed Hassan"
  ];
  const now = /* @__PURE__ */ new Date();
  let currentDate = new Date(installDate);
  while (currentDate < now) {
    const daysToAdd = 30 + Math.floor(Math.random() * 60);
    currentDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1e3);
    if (currentDate < now) {
      const type = types[Math.floor(Math.random() * types.length)];
      history.push({
        id: `maint-${history.length + 1}`,
        date: new Date(currentDate),
        type,
        description: getMaintenanceDescription(type),
        technician: technicians[Math.floor(Math.random() * technicians.length)],
        duration: type === "inspection" ? 2 : type === "routine" ? 4 : 8
      });
    }
  }
  return history.slice(-5);
}
function getMaintenanceDescription(type) {
  const descriptions = {
    routine: [
      "Standard quarterly maintenance",
      "Scheduled lubrication and calibration",
      "Regular component inspection",
      "Preventive maintenance check"
    ],
    repair: [
      "Replaced worn bearings",
      "Fixed hydraulic leak",
      "Repaired electrical fault",
      "Replaced damaged sensor"
    ],
    inspection: [
      "Safety compliance inspection",
      "Performance audit",
      "Structural integrity check",
      "Operational efficiency review"
    ],
    upgrade: [
      "Firmware update installed",
      "Control system upgrade",
      "Sensor array enhancement",
      "Power efficiency improvement"
    ],
    emergency: [
      "Emergency shutdown repair",
      "Critical fault resolution",
      "Safety system restoration"
    ]
  };
  const options = descriptions[type];
  return options[Math.floor(Math.random() * options.length)];
}
const miningSites = [
  { id: "SITE-001", name: "Caloris Basin Alpha" },
  { id: "SITE-002", name: "Caloris Basin Beta" },
  { id: "SITE-003", name: "Rachmaninoff Crater Deep" },
  { id: "SITE-004", name: "Raditladi Thermal Zone" },
  { id: "SITE-005", name: "Polar Shadow Mine" },
  { id: "SITE-006", name: "Beethoven Ridge East" },
  { id: "SITE-007", name: "Tolstoj Basin Central" },
  { id: "SITE-008", name: "Kuiper Escarpment" },
  { id: "SITE-009", name: "Discovery Rupes Alpha" },
  { id: "SITE-010", name: "Vivaldi Crater North" }
];
const manufacturers = [
  "Mercury Mining Corp",
  "Solar Dynamics Inc",
  "Thermal Systems Ltd",
  "Planetary Equipment Co",
  "Deep Core Industries"
];
function generateEquipment() {
  const equipment = [];
  const types = [
    "Thermal Drill Unit",
    "Conveyor Hauler",
    "Processing Module",
    "Environmental Shield",
    "Transport Vehicle",
    "Sensor Array"
  ];
  const typeCount = {
    "Thermal Drill Unit": 0,
    "Conveyor Hauler": 0,
    "Processing Module": 0,
    "Environmental Shield": 0,
    "Transport Vehicle": 0,
    "Sensor Array": 0
  };
  const typePrefixes = {
    "Thermal Drill Unit": "TDU",
    "Conveyor Hauler": "CH",
    "Processing Module": "PM",
    "Environmental Shield": "ES",
    "Transport Vehicle": "TV",
    "Sensor Array": "SA"
  };
  for (let i = 0; i < 35; i++) {
    const type = types[i % types.length];
    typeCount[type]++;
    const prefix = typePrefixes[type];
    const num = String(typeCount[type]).padStart(3, "0");
    const id = `${prefix}-${num}`;
    const statusRand = Math.random();
    let status;
    if (statusRand < 0.65) status = "operational";
    else if (statusRand < 0.8) status = "idle";
    else if (statusRand < 0.95) status = "maintenance";
    else status = "offline";
    const site = Math.random() > 0.15 ? miningSites[Math.floor(Math.random() * miningSites.length)] : null;
    const installDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const lastMaintenance = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1e3);
    const nextMaintenance = new Date(Date.now() + (Math.random() * 90 - 15) * 24 * 60 * 60 * 1e3);
    let utilization;
    switch (status) {
      case "operational":
        utilization = 60 + Math.floor(Math.random() * 40);
        break;
      case "idle":
        utilization = 0;
        break;
      case "maintenance":
        utilization = 0;
        break;
      case "offline":
        utilization = 0;
        break;
    }
    equipment.push({
      id,
      name: `${type} ${typeCount[type]}`,
      type,
      status,
      utilization,
      assignedSite: site?.name || null,
      siteId: site?.id || null,
      location: site ? `Sector ${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}` : "Storage Bay",
      lastMaintenance,
      nextMaintenance,
      installDate,
      sensors: generateSensors(type, status),
      maintenanceHistory: generateMaintenanceHistory(installDate),
      specifications: {
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        model: `${prefix}-${2024 + Math.floor(Math.random() * 3)}${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        serialNumber: `SN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        powerConsumption: 50 + Math.floor(Math.random() * 150),
        operatingTemp: {
          min: -40 + Math.floor(Math.random() * 20),
          max: 200 + Math.floor(Math.random() * 200)
        },
        weight: 500 + Math.floor(Math.random() * 4500)
      }
    });
  }
  return equipment;
}
const equipmentData = generateEquipment();
function generateScheduledMaintenance() {
  const scheduled = [];
  const types = ["routine", "repair", "inspection", "upgrade", "emergency"];
  const priorities = ["low", "medium", "high", "critical"];
  const technicians = [
    "Chen Wei",
    "Maria Santos",
    "James O'Brien",
    "Yuki Tanaka",
    "Ahmed Hassan",
    "Elena Volkov"
  ];
  for (let i = 0; i < 20; i++) {
    const equip = equipmentData[Math.floor(Math.random() * equipmentData.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    let priority;
    if (type === "emergency") {
      priority = "critical";
    } else if (type === "repair") {
      priority = Math.random() > 0.5 ? "high" : "medium";
    } else {
      priority = priorities[Math.floor(Math.random() * priorities.length)];
    }
    const daysOffset = Math.floor(Math.random() * 60) - 10;
    const scheduledDate = new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1e3);
    scheduled.push({
      id: `MAINT-${String(i + 1).padStart(4, "0")}`,
      equipmentId: equip.id,
      equipmentName: equip.name,
      equipmentType: equip.type,
      scheduledDate,
      type,
      priority,
      description: getMaintenanceDescription(type),
      estimatedDuration: type === "inspection" ? 2 : type === "routine" ? 4 : type === "emergency" ? 12 : 6,
      assignedTechnician: Math.random() > 0.2 ? technicians[Math.floor(Math.random() * technicians.length)] : void 0
    });
  }
  return scheduled.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
}
const scheduledMaintenance = generateScheduledMaintenance();
function getEquipmentStats() {
  const stats = {
    total: equipmentData.length,
    byStatus: {
      operational: 0,
      idle: 0,
      maintenance: 0,
      offline: 0
    },
    byType: {},
    averageUtilization: 0,
    needingMaintenance: 0
  };
  let totalUtilization = 0;
  const now = /* @__PURE__ */ new Date();
  equipmentData.forEach((equip) => {
    stats.byStatus[equip.status]++;
    stats.byType[equip.type] = (stats.byType[equip.type] || 0) + 1;
    totalUtilization += equip.utilization;
    if (equip.nextMaintenance < now) {
      stats.needingMaintenance++;
    }
  });
  stats.averageUtilization = Math.round(totalUtilization / equipmentData.length);
  return stats;
}
function filterEquipment(data, options) {
  return data.filter((equip) => {
    if (options.search) {
      const query = options.search.toLowerCase();
      if (!equip.id.toLowerCase().includes(query) && !equip.name.toLowerCase().includes(query) && !equip.type.toLowerCase().includes(query) && !equip.assignedSite?.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (options.types && options.types.length > 0) {
      if (!options.types.includes(equip.type)) {
        return false;
      }
    }
    if (options.statuses && options.statuses.length > 0) {
      if (!options.statuses.includes(equip.status)) {
        return false;
      }
    }
    if (options.siteId) {
      if (equip.siteId !== options.siteId) {
        return false;
      }
    }
    return true;
  });
}
const availableEquipmentTypes = [
  "Thermal Drill Unit",
  "Conveyor Hauler",
  "Processing Module",
  "Environmental Shield",
  "Transport Vehicle",
  "Sensor Array"
];
const availableEquipmentStatuses = [
  "operational",
  "idle",
  "maintenance",
  "offline"
];
export {
  availableEquipmentStatuses,
  availableEquipmentTypes,
  equipmentData,
  filterEquipment,
  generateScheduledMaintenance,
  getDaysUntilMaintenance,
  getEquipmentStats,
  getEquipmentStatusColor,
  getEquipmentTypeIcon,
  getMaintenancePriorityColor,
  getSensorStatusColor,
  scheduledMaintenance
};
