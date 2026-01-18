# Discover Mercury - Development Plan

## Project Overview

**Project:** Discover Mercury - Mining Operations Dashboard
**Purpose:** Accessibility testing demonstration site
**Repository:** https://github.com/nsquared-team/a11y-practice-mercury
**Hosting:** GitHub Pages
**Created:** January 18, 2026

---

## Technical Stack

| Technology | Choice | Notes |
|------------|--------|-------|
| Framework | React 18+ | Functional components with hooks |
| Language | TypeScript | For type safety and better DX |
| Build Tool | Vite | Fast development and optimized builds |
| Styling | Tailwind CSS | Custom theme with dark mode |
| State Management | React Context | Add Zustand only if complexity requires |
| Charts | Recharts | React-native charting library |
| Icons | Lucide React | Modern icon library |
| Routing | React Router | HashRouter for GitHub Pages compatibility |
| Deployment | GitHub Actions | Automatic deployment on push to main |

---

## Design System

### Color Palette

```
Background Colors:
- Primary Dark: #0d0d0d
- Secondary Dark: #1a1a1a
- Tertiary Dark: #262626

Accent Colors:
- Amber: #f59e0b
- Orange: #ea580c
- Warm Gray: #78716c

Status Colors:
- Active/Success: #22c55e
- Warning: #f59e0b
- Error/Offline: #ef4444
- Idle/Neutral: #6b7280
```

### Typography

- **Data Displays:** JetBrains Mono, IBM Plex Mono (monospace)
- **UI Elements:** Inter, system-ui (sans-serif)

### Visual Elements

- Glowing borders on active/focused elements
- Subtle scan-line effects for industrial aesthetic
- Terminal-style text rendering for data displays

---

## Project Structure

```
a11y-practice-mercury/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── docs/
│   ├── project-requirements.md # Full requirements document
│   └── DEVELOPMENT-PLAN.md     # This document
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── images/             # Logos, backgrounds, placeholders
│   ├── components/
│   │   ├── common/             # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── operations/         # Operations view components
│   │   ├── personnel/          # Personnel management components
│   │   ├── equipment/          # Equipment monitoring components
│   │   ├── reports/            # Reports & analytics components
│   │   └── settings/           # Settings components
│   ├── context/
│   │   ├── AppContext.tsx      # Global application state
│   │   └── SettingsContext.tsx # User preferences
│   ├── data/
│   │   ├── sites.ts            # Mining sites fixture data
│   │   ├── personnel.ts        # Personnel fixture data
│   │   ├── equipment.ts        # Equipment fixture data
│   │   ├── alerts.ts           # Alert/notification data
│   │   └── commodities.ts      # Mineral prices data
│   ├── hooks/
│   │   ├── useSimulation.ts    # Real-time update simulation
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Operations.tsx
│   │   ├── Personnel.tsx
│   │   ├── Equipment.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── ...                 # Helper functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind imports & global styles
├── DEVELOPMENT-PLAN.md         # This document
├── README.md                   # Project readme
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

---

## Development Phases

### Phase 1: Project Setup & Core Layout
**Estimated Components:** 8-10

- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS with custom theme
- [ ] Set up GitHub Actions deployment workflow
- [ ] Create base layout structure
- [ ] Build Header component (logo, search, notifications, profile, Mercury time)
- [ ] Build Sidebar component (collapsible, icon/expanded states)
- [ ] Build Footer component (system status, connection, sync timestamp)
- [ ] Implement React Router with HashRouter
- [ ] Create responsive navigation (sidebar desktop, bottom nav mobile)
- [ ] Set up basic Context providers

### Phase 2: Dashboard Home Page
**Estimated Components:** 10-12

- [ ] Create Dashboard page layout
- [ ] Build Key Metrics Cards component
- [ ] Build Real-Time Extraction Chart (24-hour line/area chart)
- [ ] Build Equipment Status Grid component
- [ ] Build Alert Feed component (scrolling list)
- [ ] Build Commodity Prices Widget
- [ ] Create chart data utilities
- [ ] Implement Mercury day/night cycle overlay
- [ ] Style all components with industrial aesthetic

### Phase 3: Operations View
**Estimated Components:** 8-10

- [ ] Create Operations page layout
- [ ] Build Extraction Sites Table (sortable, selectable)
- [ ] Build Filter Controls component
- [ ] Build Site Detail Modal
- [ ] Add historical performance charts to modal
- [ ] Implement batch selection functionality
- [ ] Build Batch Actions toolbar
- [ ] Add table pagination or virtual scrolling

### Phase 4: Personnel Management
**Estimated Components:** 10-12

- [ ] Create Personnel page layout
- [ ] Build Shift Schedule Calendar component
- [ ] Implement drag-and-drop rescheduling
- [ ] Build Personnel Directory (searchable list)
- [ ] Build Add/Edit Personnel Form Wizard (multi-step)
- [ ] Implement form validation
- [ ] Build Certification Tracker component
- [ ] Create progress indicators for certifications
- [ ] Build Date Picker component

### Phase 5: Equipment Monitoring
**Estimated Components:** 10-12

- [ ] Create Equipment page layout
- [ ] Build Equipment Inventory grid (card-based)
- [ ] Build Equipment Card component with status badges
- [ ] Build Maintenance Schedule Timeline
- [ ] Build Diagnostic Panel with gauges/meters
- [ ] Build Maintenance Request Form
- [ ] Implement Tabs for equipment sections
- [ ] Create utilization meter visualizations

### Phase 6: Reports & Analytics
**Estimated Components:** 8-10

- [ ] Create Reports page layout
- [ ] Build Report Builder interface
- [ ] Build metric/date range selectors
- [ ] Build visualization type picker
- [ ] Build Saved Reports Library
- [ ] Implement Export Options (simulated downloads)
- [ ] Build Comparison Charts component
- [ ] Create Accordion components for report sections

### Phase 7: Settings & Preferences
**Estimated Components:** 8-10

- [ ] Create Settings page layout
- [ ] Build Display Preferences section (toggles for units, time, temp)
- [ ] Build Notification Settings section (checkboxes, sliders)
- [ ] Build Dashboard Customization (drag-and-drop widgets)
- [ ] Build Account Settings form
- [ ] Implement Toggle Switch components
- [ ] Implement Slider/Range components
- [ ] Create Settings Context for persistence during session

### Phase 8: Data Fixtures & Simulation
**Estimated Files:** 5-8

- [ ] Create mining sites data (15-20 sites)
- [ ] Create personnel data (50-75 records)
- [ ] Create equipment data (30-40 units)
- [ ] Create historical chart data (30-day simulation)
- [ ] Create alerts/notifications data (10-15 records)
- [ ] Implement real-time simulation hook (30-60 second updates)
- [ ] Add simulation toggle to Settings
- [ ] Test all data flows

### Phase 9: Accessibility Issues & Documentation
**Deliverables:** Testing guide, documented issues

- [ ] Insert color contrast failures strategically
- [ ] Add missing alt text on select images/icons
- [ ] Create color-only status indicators (some locations)
- [ ] Implement keyboard traps (specific components)
- [ ] Add focus indicator issues
- [ ] Create non-keyboard-accessible elements
- [ ] Add missing/incorrect form labels
- [ ] Insert ARIA issues (roles, states, properties)
- [ ] Create focus order mismatches
- [ ] Document all issues in Testing Guide
- [ ] Create hidden admin page listing all issues

---

## Data Fixtures Specification

### Mining Sites (15-20)

```typescript
interface MiningSite {
  id: string;
  name: string;           // e.g., "Caloris Basin Alpha"
  location: string;       // Sector designation
  mineralType: 'Mercurium' | 'Solar Platinum' | 'Thermal Crystals';
  extractionRate: number; // kg/hour
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  equipmentAssigned: string[];
  personnelCount: number;
  temperature: number;    // Current surface temp
  lastUpdated: Date;
}
```

### Personnel (50-75)

```typescript
interface Personnel {
  id: string;
  name: string;
  role: 'Extraction Technician' | 'Equipment Operator' | 'Safety Coordinator' | 'Shift Supervisor' | 'Maintenance Engineer' | 'Analyst';
  shift: 'Alpha' | 'Beta' | 'Gamma';
  certifications: Certification[];
  currentAssignment: string | null;
  hireDate: Date;
  avatar?: string;
}

interface Certification {
  name: string;
  status: 'valid' | 'expiring' | 'expired';
  expirationDate: Date;
}
```

### Equipment (30-40)

```typescript
interface Equipment {
  id: string;
  name: string;
  type: 'Thermal Drill Unit' | 'Conveyor Hauler' | 'Processing Module' | 'Environmental Shield' | 'Transport Vehicle' | 'Sensor Array';
  status: 'operational' | 'idle' | 'maintenance' | 'offline';
  utilization: number;    // Percentage
  assignedSite: string | null;
  lastMaintenance: Date;
  nextMaintenance: Date;
  sensors: SensorReading[];
}

interface SensorReading {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}
```

### Commodities

```typescript
interface Commodity {
  name: string;
  symbol: string;
  price: number;          // Credits per kg
  change24h: number;      // Percentage
  trend: 'up' | 'down' | 'stable';
}
```

---

## Interactive Components Inventory

| Component | Pages | A11y Testing Focus |
|-----------|-------|-------------------|
| Data Tables | Operations, Personnel | Table semantics, sort controls, row selection |
| Line/Area Charts | Dashboard, Reports | Data alternatives, interactive tooltips |
| Modal Dialogs | Operations, Equipment | Focus trap, escape key, announcements |
| Form Wizard | Personnel, Equipment | Step navigation, validation, progress |
| Tabs | Equipment, Settings | Tab semantics, arrow key nav, panels |
| Accordion | Dashboard, Reports | Expand/collapse state, button labels |
| Toast Notifications | Header, Dashboard | Live regions, timing, dismiss |
| Dropdown Menus | Header, Sidebar, Forms | Menu semantics, keyboard nav |
| Toggle Switches | Settings | Switch role, state changes |
| Range Sliders | Settings, Reports | Slider role, value feedback |
| Date Picker | Personnel, Reports | Grid navigation, selection |
| Progress Bars | Dashboard, Personnel | Progressbar role, values |
| Drag and Drop | Personnel, Settings | Keyboard alternatives |

---

## GitHub Actions Deployment

The deployment workflow will:

1. Trigger on push to `main` branch
2. Install dependencies
3. Run TypeScript type checking
4. Build production bundle
5. Deploy to `gh-pages` branch

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Desktop | 1280px+ | Full sidebar, multi-column widgets |
| Tablet | 768px-1279px | Collapsed sidebar, two-column layout |
| Mobile | <768px | Bottom nav, single-column, simplified views |

---

## Success Criteria

1. **Functional:** All pages and components work as specified
2. **Visual:** Matches industrial/control room aesthetic
3. **Responsive:** Usable on desktop, tablet, and mobile
4. **Performance:** Fast initial load, smooth interactions
5. **Deployment:** Automatic deployment via GitHub Actions
6. **Accessibility Testing:** Contains documented a11y issues for testing practice

---

## Notes & Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-18 | Use TypeScript | Better type safety and developer experience |
| 2026-01-18 | React Context over Zustand initially | Simpler for expected state complexity |
| 2026-01-18 | GitHub Actions deployment | Automatic, no manual deployment steps |
| 2026-01-18 | HashRouter for routing | Required for GitHub Pages SPA support |

---

*This document will be updated as development progresses.*
