// Shared, a11y-neutral data for the Discover Mercury Mining Operations dashboard.
// Imported by BOTH trees (root + /accessible/) so the two mirrors show the
// same numbers and the only difference between them is the accessibility of
// the markup. Do not put presentation or a11y logic here — data only.

export const SITE = {
  name: 'Discover Mercury Mining Operations',
  short: 'Discover Mercury',
  colony: 'Caloris Basin Extraction Complex',
  sol: 'Sol 4,182',
};

// Primary nav — same routes in both trees. `href` is tree-relative; pages pass
// the correct base ('/' or '/accessible/') so links stay within their tree.
export const NAV = [
  { key: 'dashboard', label: 'Dashboard', path: 'dashboard/' },
  { key: 'operations', label: 'Operations', path: 'operations/' },
  { key: 'personnel', label: 'Personnel', path: 'personnel/' },
  { key: 'equipment', label: 'Equipment', path: 'equipment/' },
  { key: 'alerts', label: 'Alerts', path: 'alerts/' },
  { key: 'reports', label: 'Reports', path: 'reports/' },
  { key: 'settings', label: 'Settings', path: 'settings/' },
];

// --- Dashboard KPIs ---------------------------------------------------------
export const KPIS = [
  { id: 'yield', label: 'Regolith Yield', value: '1,284', unit: 't / sol', delta: +4.2, good: true },
  { id: 'power', label: 'Solar Array Output', value: '92.6', unit: 'MW', delta: -1.1, good: false },
  { id: 'rigs', label: 'Rigs Online', value: '11 / 14', unit: 'active', delta: 0, good: true },
  { id: 'core', label: 'Core Temp Margin', value: '38', unit: '°C', delta: -6.0, good: false },
];

// --- Production trend (charts pattern) --------------------------------------
// Tonnes of refined regolith extracted per 2-hour window across one sol.
export const PRODUCTION_SERIES = {
  unit: 't',
  label: 'Refined output per 2-hour window (this sol)',
  points: [
    { t: '00:00', value: 96 },
    { t: '02:00', value: 104 },
    { t: '04:00', value: 118 },
    { t: '06:00', value: 132 },
    { t: '08:00', value: 121 },
    { t: '10:00', value: 140 },
    { t: '12:00', value: 152 },
    { t: '14:00', value: 138 },
    { t: '16:00', value: 109 },
    { t: '18:00', value: 88 },
    { t: '20:00', value: 73 },
    { t: '22:00', value: 81 },
  ],
};

// Output by mineral stream — drives a small bar chart / legend.
export const STREAM_MIX = {
  unit: 't / sol',
  label: 'Output by mineral stream (this sol)',
  bars: [
    { stream: 'Ilmenite (Fe-Ti)', value: 512, code: 'IL' },
    { stream: 'Anorthite (Al)', value: 388, code: 'AN' },
    { stream: 'Pyroxene (Mg)', value: 244, code: 'PX' },
    { stream: 'Water ice (polar)', value: 140, code: 'WI' },
  ],
};

// Multi-series extraction rate (kg/h) by commodity across the last 24h.
// Static + deterministic (the ported chartData generators use Math.random/Date).
export const EXTRACTION_SERIES = {
  unit: 'kg/h',
  label: 'Extraction rate by commodity — last 24h',
  labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  series: [
    { key: 'mrc', label: 'Mercurium', color: '#ff9e3d', values: [86, 92, 104, 118, 121, 134, 142, 138, 120, 99, 84, 88] },
    { key: 'spl', label: 'Solar Platinum', color: '#38e0c8', values: [48, 52, 58, 63, 61, 68, 72, 69, 60, 52, 46, 49] },
    { key: 'txl', label: 'Thermal Crystals', color: '#5aa6ff', values: [33, 36, 40, 44, 42, 47, 50, 48, 41, 35, 31, 34] },
  ],
};

// --- Alerts & notifications -------------------------------------------------
// `level` ∈ critical | warning | info | success. `category` ∈ equipment |
// safety | production | personnel | system. `live` items are the ones that
// animate into the feed (accessible tree announces them via a polite/assertive
// region). Items are ordered newest-first by `time`.
export const ALERTS = [
  {
    id: 'AL-7742',
    level: 'success',
    category: 'production',
    rig: 'Refinery',
    title: 'Refinery throughput target met',
    detail: 'Sol output reached 1,284 t — 4% above target for the current cycle.',
    time: '14:45',
    live: true,
  },
  {
    id: 'AL-7741',
    level: 'critical',
    category: 'safety',
    rig: 'Rig 07',
    title: 'Drill head over-torque — auto-shutdown engaged',
    detail: 'Torque exceeded 240 kN·m for 12 s. Rig 07 halted and isolated pending inspection.',
    time: '14:38',
    live: true,
  },
  {
    id: 'AL-7740',
    level: 'warning',
    category: 'production',
    rig: 'Array B',
    title: 'Solar Array B output below threshold',
    detail: 'Output 7.4 MW vs 9.0 MW target. Dust accumulation suspected on panels 12–18.',
    time: '14:21',
    live: true,
  },
  {
    id: 'AL-7738',
    level: 'warning',
    category: 'equipment',
    rig: 'Hauler 3',
    title: 'Hauler 3 battery margin low',
    detail: 'State of charge 16%. Re-route to charging bay C recommended within 40 min.',
    time: '13:57',
    live: false,
  },
  {
    id: 'AL-7736',
    level: 'success',
    category: 'equipment',
    rig: 'Array A',
    title: 'Solar Array A maintenance complete',
    detail: 'Panel cleaning on Array A finished; output restored to 9.2 MW.',
    time: '13:42',
    live: false,
  },
  {
    id: 'AL-7735',
    level: 'info',
    category: 'personnel',
    rig: 'Refinery',
    title: 'Shift B handover complete',
    detail: 'Refinery throughput nominal. 1,284 t logged for the sol so far.',
    time: '13:30',
    live: false,
  },
  {
    id: 'AL-7731',
    level: 'info',
    category: 'system',
    rig: 'Comms',
    title: 'Deep Space Network window opens 15:10',
    detail: 'Telemetry uplink to Earth scheduled. Buffered logs will flush automatically.',
    time: '12:48',
    live: false,
  },
];

// Notification categories used by the alerts-page filter control.
export const ALERT_CATEGORIES = ['equipment', 'safety', 'production', 'personnel', 'system'];

// Counts by severity for the alerts-page stat cards.
export function getAlertStats(alerts = ALERTS) {
  return {
    total: alerts.length,
    critical: alerts.filter((a) => a.level === 'critical').length,
    warning: alerts.filter((a) => a.level === 'warning').length,
    info: alerts.filter((a) => a.level === 'info').length,
    success: alerts.filter((a) => a.level === 'success').length,
  };
}

// --- Reports: shift output table (data tables pattern) ----------------------
export const SHIFT_REPORT = {
  caption: 'Per-rig output, current sol (Shift A + Shift B)',
  columns: [
    { key: 'rig', label: 'Rig', numeric: false },
    { key: 'sector', label: 'Sector', numeric: false },
    { key: 'tonnes', label: 'Output (t)', numeric: true },
    { key: 'uptime', label: 'Uptime (%)', numeric: true },
    { key: 'grade', label: 'Ore Grade (%)', numeric: true },
    { key: 'status', label: 'Status', numeric: false },
  ],
  rows: [
    { rig: 'Rig 01', sector: 'Caloris NW', tonnes: 142, uptime: 98.2, grade: 31.4, status: 'Nominal' },
    { rig: 'Rig 02', sector: 'Caloris NW', tonnes: 128, uptime: 95.7, grade: 29.8, status: 'Nominal' },
    { rig: 'Rig 04', sector: 'Caloris NE', tonnes: 156, uptime: 99.1, grade: 33.0, status: 'Nominal' },
    { rig: 'Rig 05', sector: 'Caloris NE', tonnes: 0, uptime: 0.0, grade: 0.0, status: 'Offline' },
    { rig: 'Rig 07', sector: 'Caloris S', tonnes: 61, uptime: 42.0, grade: 28.1, status: 'Halted' },
    { rig: 'Rig 09', sector: 'Rim Terrace', tonnes: 134, uptime: 96.4, grade: 30.6, status: 'Nominal' },
    { rig: 'Rig 11', sector: 'Polar Shadow', tonnes: 118, uptime: 93.8, grade: 27.2, status: 'Nominal' },
    { rig: 'Rig 12', sector: 'Polar Shadow', tonnes: 109, uptime: 91.2, grade: 26.9, status: 'Degraded' },
  ],
};

// --- Settings: rig configuration (forms + tabs pattern) ---------------------
export const RIGS = [
  { id: 'rig-01', label: 'Rig 01' },
  { id: 'rig-02', label: 'Rig 02' },
  { id: 'rig-04', label: 'Rig 04' },
  { id: 'rig-09', label: 'Rig 09' },
];

// Settings sections. Each tab is a panel of preference controls; the page-pair
// contrasts custom <div> toggles / unlabeled sliders / pointer-only widget DnD
// (root) against role="switch" / labelled range inputs / keyboard reorder
// (accessible).
export const SETTINGS_TABS = [
  { key: 'display', label: 'Display' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'account', label: 'Account' },
];

// Display-preference selects (label + options + default value).
export const DISPLAY_PREFS = [
  { key: 'units', label: 'Units', hint: 'Measurement system for distances and mass.',
    options: [{ value: 'metric', label: 'Metric' }, { value: 'imperial', label: 'Imperial' }], value: 'metric' },
  { key: 'timeFormat', label: 'Time format', hint: 'How clock times are displayed.',
    options: [{ value: '24h', label: '24-hour' }, { value: '12h', label: '12-hour' }], value: '24h' },
  { key: 'temperatureScale', label: 'Temperature scale', hint: 'Units for temperature readouts.',
    options: [{ value: 'celsius', label: 'Celsius (°C)' }, { value: 'fahrenheit', label: 'Fahrenheit (°F)' }], value: 'celsius' },
  { key: 'refreshRate', label: 'Data refresh rate', hint: 'How often live readings update.',
    options: [{ value: '15', label: '15 seconds' }, { value: '30', label: '30 seconds' }, { value: '60', label: '1 minute' }, { value: '300', label: '5 minutes' }], value: '30' },
];

// Toggle switches: { key, label, description, on }. Used in Display + Notifications.
export const DISPLAY_TOGGLES = [
  { key: 'simulation', label: 'Enable real-time simulation', description: 'Animate live data updates for demonstration.', on: true },
  { key: 'reducedMotion', label: 'Reduce motion', description: 'Minimise non-essential animation across the console.', on: false },
];

// Notification range sliders: { key, label, description, min, max, value, unit }.
export const NOTIFICATION_SLIDERS = [
  { key: 'alertVolume', label: 'Alert sound volume', description: 'Loudness of audible alert notifications.', min: 0, max: 100, value: 70, unit: '%' },
  { key: 'alertThreshold', label: 'Equipment warning threshold', description: 'Raise alerts when equipment utilisation exceeds this level.', min: 50, max: 100, value: 80, unit: '%' },
];

// Per-category alert toggles (mirror the alert categories).
export const NOTIFICATION_CATEGORIES = [
  { key: 'equipment', label: 'Equipment alerts', on: true },
  { key: 'safety', label: 'Safety alerts', on: true },
  { key: 'production', label: 'Production alerts', on: true },
  { key: 'personnel', label: 'Personnel alerts', on: false },
];

// Dashboard widgets the operator can reorder + show/hide.
export const DASHBOARD_WIDGETS = [
  { id: 'metrics', name: 'Key Metrics', enabled: true },
  { id: 'extraction-chart', name: 'Extraction Chart', enabled: true },
  { id: 'equipment-status', name: 'Equipment Status', enabled: true },
  { id: 'alert-feed', name: 'Alert Feed', enabled: true },
  { id: 'commodity-prices', name: 'Commodity Prices', enabled: true },
];

// Account profile defaults.
export const ACCOUNT = {
  displayName: 'Operations Supervisor',
  email: 'supervisor@discovermercury.site',
  role: 'Shift Operations Lead',
};

// Legacy rig-config fields retained for reference (no longer surfaced as a tab).
export const SETTINGS_TABS_LEGACY = [
  { key: 'general', label: 'General' },
  { key: 'thresholds', label: 'Alert Thresholds' },
  { key: 'crew', label: 'Crew & Shifts' },
];

// Small helper so pages can build tree-correct links.
// base is '/' (root tree) or '/accessible/' (accessible tree).
export function href(base, path) {
  return base + path;
}
