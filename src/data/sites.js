const miningSites = [
  {
    id: "CB-001",
    name: "Caloris Basin Alpha",
    location: "Sector 7-Alpha",
    mineralType: "Mercurium",
    extractionRate: 156.4,
    status: "active",
    equipmentAssigned: ["TDU-01", "TDU-02", "CH-05"],
    personnelCount: 8,
    temperature: 327,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 3750,
    dailyProgress: 2847
  },
  {
    id: "RC-002",
    name: "Rachmaninoff Crater Deep",
    location: "Sector 3-Beta",
    mineralType: "Solar Platinum",
    extractionRate: 89.2,
    status: "active",
    equipmentAssigned: ["TDU-03", "PM-01"],
    personnelCount: 5,
    temperature: 198,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 2100,
    dailyProgress: 1605
  },
  {
    id: "RT-003",
    name: "Raditladi Thermal Zone",
    location: "Sector 12-Gamma",
    mineralType: "Thermal Crystals",
    extractionRate: 234.1,
    status: "active",
    equipmentAssigned: ["TDU-04", "TDU-05", "CH-02", "PM-02"],
    personnelCount: 12,
    temperature: 412,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 5600,
    dailyProgress: 4218
  },
  {
    id: "CB-004",
    name: "Caloris Basin Beta",
    location: "Sector 7-Beta",
    mineralType: "Mercurium",
    extractionRate: 0,
    status: "maintenance",
    equipmentAssigned: ["TDU-06", "CH-03"],
    personnelCount: 3,
    temperature: 305,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 2800,
    dailyProgress: 0
  },
  {
    id: "PS-005",
    name: "Polar Shadow Mine",
    location: "Sector 1-North",
    mineralType: "Thermal Crystals",
    extractionRate: 45.7,
    status: "idle",
    equipmentAssigned: ["TDU-07"],
    personnelCount: 2,
    temperature: -145,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 1200,
    dailyProgress: 548
  },
  {
    id: "TC-006",
    name: "Tolstoj Crater Site",
    location: "Sector 9-Alpha",
    mineralType: "Solar Platinum",
    extractionRate: 112.8,
    status: "active",
    equipmentAssigned: ["TDU-08", "TDU-09", "CH-06"],
    personnelCount: 7,
    temperature: 256,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 2700,
    dailyProgress: 2032
  },
  {
    id: "DZ-007",
    name: "Derain Zone Alpha",
    location: "Sector 5-Delta",
    mineralType: "Mercurium",
    extractionRate: 178.3,
    status: "active",
    equipmentAssigned: ["TDU-10", "TDU-11", "PM-03"],
    personnelCount: 9,
    temperature: 378,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 4200,
    dailyProgress: 3210
  },
  {
    id: "HV-008",
    name: "Hokusai Volcanic Rift",
    location: "Sector 11-Epsilon",
    mineralType: "Thermal Crystals",
    extractionRate: 0,
    status: "offline",
    equipmentAssigned: ["TDU-12"],
    personnelCount: 0,
    temperature: 445,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 1800,
    dailyProgress: 0
  },
  {
    id: "MV-009",
    name: "Mena Valley Extraction",
    location: "Sector 6-Gamma",
    mineralType: "Solar Platinum",
    extractionRate: 67.5,
    status: "active",
    equipmentAssigned: ["TDU-13", "CH-07"],
    personnelCount: 4,
    temperature: 189,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 1600,
    dailyProgress: 1215
  },
  {
    id: "CB-010",
    name: "Caloris Basin Gamma",
    location: "Sector 7-Gamma",
    mineralType: "Mercurium",
    extractionRate: 145.2,
    status: "active",
    equipmentAssigned: ["TDU-14", "TDU-15", "CH-08"],
    personnelCount: 6,
    temperature: 334,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 3500,
    dailyProgress: 2612
  },
  {
    id: "SC-011",
    name: "Sobkou Crater Mine",
    location: "Sector 4-Alpha",
    mineralType: "Thermal Crystals",
    extractionRate: 98.7,
    status: "active",
    equipmentAssigned: ["TDU-16", "PM-04"],
    personnelCount: 5,
    temperature: 287,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 2400,
    dailyProgress: 1776
  },
  {
    id: "KR-012",
    name: "Kuiper Ridge Site",
    location: "Sector 8-Beta",
    mineralType: "Solar Platinum",
    extractionRate: 134.9,
    status: "active",
    equipmentAssigned: ["TDU-17", "TDU-18", "CH-09"],
    personnelCount: 8,
    temperature: 223,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 3200,
    dailyProgress: 2428
  },
  {
    id: "PN-013",
    name: "Polar North Station",
    location: "Sector 1-East",
    mineralType: "Thermal Crystals",
    extractionRate: 56.3,
    status: "idle",
    equipmentAssigned: ["TDU-19"],
    personnelCount: 2,
    temperature: -168,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 1400,
    dailyProgress: 676
  },
  {
    id: "VP-014",
    name: "Vivaldi Plains East",
    location: "Sector 10-Alpha",
    mineralType: "Mercurium",
    extractionRate: 0,
    status: "maintenance",
    equipmentAssigned: ["TDU-20", "CH-10"],
    personnelCount: 4,
    temperature: 298,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 2600,
    dailyProgress: 845
  },
  {
    id: "BF-015",
    name: "Beethoven Formation",
    location: "Sector 2-Delta",
    mineralType: "Solar Platinum",
    extractionRate: 78.4,
    status: "active",
    equipmentAssigned: ["TDU-21", "PM-05"],
    personnelCount: 4,
    temperature: 267,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 1900,
    dailyProgress: 1411
  },
  {
    id: "DR-016",
    name: "Discovery Rupes Mine",
    location: "Sector 13-Beta",
    mineralType: "Mercurium",
    extractionRate: 167.8,
    status: "active",
    equipmentAssigned: ["TDU-22", "TDU-23", "CH-11"],
    personnelCount: 7,
    temperature: 356,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 4e3,
    dailyProgress: 3021
  },
  {
    id: "SM-017",
    name: "Suisei Mare Facility",
    location: "Sector 14-Gamma",
    mineralType: "Thermal Crystals",
    extractionRate: 189.5,
    status: "active",
    equipmentAssigned: ["TDU-24", "TDU-25", "PM-06", "CH-12"],
    personnelCount: 10,
    temperature: 398,
    lastUpdated: /* @__PURE__ */ new Date(),
    dailyTarget: 4500,
    dailyProgress: 3412
  }
];
function getSitesByStatus(status) {
  return miningSites.filter((site) => site.status === status);
}
function getSitesByMineral(mineral) {
  return miningSites.filter((site) => site.mineralType === mineral);
}
function getSiteById(id) {
  return miningSites.find((site) => site.id === id);
}
function getTotalExtractionRate() {
  return miningSites.filter((site) => site.status === "active").reduce((sum, site) => sum + site.extractionRate, 0);
}
function getStatusCounts() {
  return {
    active: miningSites.filter((s) => s.status === "active").length,
    idle: miningSites.filter((s) => s.status === "idle").length,
    maintenance: miningSites.filter((s) => s.status === "maintenance").length,
    offline: miningSites.filter((s) => s.status === "offline").length
  };
}
export {
  getSiteById,
  getSitesByMineral,
  getSitesByStatus,
  getStatusCounts,
  getTotalExtractionRate,
  miningSites
};
