# DISCOVER MERCURY
## Website Requirements Document

| | |
|---|---|
| **Project** | Discover Mercury - Mining Operations Dashboard |
| **Purpose** | Accessibility testing demonstration site |
| **Version** | 1.0 Draft |
| **Date** | January 2026 |

---

## 1. Executive Summary

Discover Mercury is a fictional mining operations dashboard designed as part of the Discover Planets accessibility testing website series. The site simulates a real-time command center for a rare mineral extraction operation on the planet Mercury, providing a data-rich environment with complex interactive components ideal for accessibility evaluation.

The dashboard aesthetic draws inspiration from industrial control rooms and mission control centers, featuring a dark mode interface with amber and orange accent colors that reflect Mercury's proximity to the sun and extreme temperature environment.

This site will operate entirely on the front end with no database connectivity. All user interactions will be stored in browser state and reset when the page is refreshed or the user returns to the site.

---

## 2. Site Concept & Narrative

### 2.1 Fictional Setting

Helios Mining Corporation operates the largest rare mineral extraction facility on Mercury. Due to the planet's extreme conditions—surface temperatures ranging from -180°C at night to 430°C during the day—all operations are conducted from shielded underground facilities and automated surface equipment.

The minerals extracted include Mercurium (a fictional superconductor), Solar Platinum (enhanced by solar radiation exposure), and Thermal Crystals (formed by the extreme temperature fluctuations). These materials are essential for interplanetary commerce and advanced technology manufacturing.

### 2.2 User Scenario

Users of the Discover Mercury dashboard are operations supervisors monitoring mining activities from a central command facility. They need to track extraction rates, equipment status, worker shifts, environmental conditions, and commodity prices in real-time to make critical operational decisions.

---

## 3. Design Specifications

### 3.1 Visual Style

The design follows an industrial, utilitarian aesthetic reminiscent of control room interfaces:

- **Color Palette:** Dark backgrounds (#0d0d0d, #1a1a1a, #262626) with amber (#f59e0b), orange (#ea580c), and warm gray accents
- **Typography:** Monospace fonts for data displays (JetBrains Mono, IBM Plex Mono); sans-serif for UI elements (Inter, system-ui)
- **Visual Elements:** Glowing borders on active elements, subtle scan-line effects, terminal-style text rendering
- **Iconography:** Technical, geometric icons suggesting industrial equipment and scientific instruments

### 3.2 Layout Structure

The dashboard uses a fixed header with collapsible sidebar navigation:

- **Header:** Logo, global search, notifications bell, user profile menu, current Mercury time
- **Sidebar:** Collapsible navigation with icon-only and expanded states; sections for Dashboard, Operations, Personnel, Equipment, Reports, Settings
- **Main Content:** Responsive grid of data cards/widgets that can be rearranged
- **Footer:** System status indicators, connection status, last data sync timestamp

---

## 4. Feature Requirements

### 4.1 Dashboard Home

The main dashboard view presents an overview of all mining operations:

- **Key Metrics Cards:** Large numerical displays showing today's extraction totals, active equipment count, personnel on shift, and safety incident count
- **Real-Time Extraction Chart:** Line/area chart showing extraction rates over the past 24 hours with Mercury day/night cycle overlay
- **Equipment Status Grid:** Visual grid of mining units showing operational status (active, idle, maintenance, offline) with color coding
- **Alert Feed:** Scrolling list of recent system alerts and notifications with severity indicators
- **Commodity Prices Widget:** Current market prices for extracted minerals with trend indicators

### 4.2 Operations View

Detailed operational data and controls:

- **Extraction Sites Table:** Sortable data table listing all active mining sites with columns for site ID, location, mineral type, extraction rate, equipment assigned, and status
- **Site Detail Modal:** Clicking a site row opens a modal with detailed metrics, historical performance charts, and equipment assignments
- **Filter Controls:** Filter sites by mineral type, status, location sector, or performance threshold
- **Batch Actions:** Select multiple sites to perform batch status changes or generate combined reports

### 4.3 Personnel Management

Staff scheduling and monitoring features:

- **Shift Schedule Calendar:** Interactive calendar showing staff assignments across three shifts (Alpha, Beta, Gamma) with drag-and-drop rescheduling
- **Personnel Directory:** Searchable list of all staff with role, certification status, current assignment, and contact actions
- **Add/Edit Personnel Form:** Multi-step form wizard for adding new staff or editing existing records with validation
- **Certification Tracker:** Visual progress indicators showing certification status and upcoming renewal dates

### 4.4 Equipment Monitoring

Equipment status and maintenance tracking:

- **Equipment Inventory:** Card-based grid view of all mining equipment with status badges, utilization meters, and quick action buttons
- **Maintenance Schedule:** Timeline view of upcoming and past maintenance activities with expandable details
- **Diagnostic Panel:** Real-time sensor readings displayed as gauges and meters for selected equipment
- **Maintenance Request Form:** Form to submit new maintenance requests with equipment selection, priority level, and description

### 4.5 Reports & Analytics

Data analysis and report generation:

- **Report Builder:** Interface to select metrics, date ranges, and visualization types to create custom reports
- **Saved Reports Library:** List of previously generated reports with options to view, edit parameters, or delete
- **Export Options:** Buttons to export data in various formats (simulated download actions)
- **Comparison Charts:** Side-by-side visualizations comparing performance across sites, time periods, or equipment

### 4.6 Settings & Preferences

User customization options:

- **Display Preferences:** Toggle switches for units (metric/imperial), time format, temperature scale, and data refresh rate
- **Notification Settings:** Checkboxes to enable/disable different alert categories with threshold sliders
- **Dashboard Customization:** Drag-and-drop interface to rearrange dashboard widgets with show/hide toggles
- **Account Settings:** Profile information form with avatar upload and password change (simulated)

---

## 5. Interactive Component Inventory

The following interactive components will be implemented across the site, providing diverse patterns for accessibility testing:

| Component | Location(s) | A11y Testing Focus |
|-----------|-------------|-------------------|
| Data Tables | Operations, Personnel | Table semantics, sort controls, row selection |
| Charts/Graphs | Dashboard, Reports | Data alternatives, interactive elements |
| Modal Dialogs | Operations, Equipment | Focus trap, escape key, announcements |
| Form Wizard | Personnel, Maintenance | Step navigation, validation, progress |
| Tabs | Equipment, Settings | Tab semantics, arrow key nav, panels |
| Accordion/Collapse | Dashboard, Reports | Expand/collapse state, button labels |
| Notifications | Header, Dashboard | Live regions, toast timing, dismiss |
| Dropdowns/Menus | Header, Sidebar, Forms | Menu semantics, keyboard nav, focus |
| Toggle Switches | Settings | Switch role, state changes, labels |
| Sliders/Range | Settings, Reports | Slider role, value feedback, keyboard |
| Date Picker | Personnel, Reports | Grid navigation, date selection, labels |
| Progress Indicators | Dashboard, Personnel | Progressbar role, value announcements |
| Drag and Drop | Personnel, Settings | Keyboard alternatives, live feedback |

---

## 6. Technical Requirements

### 6.1 Technology Stack

- **Framework:** React 18+ with functional components and hooks
- **Styling:** Tailwind CSS for utility-first styling with custom theme configuration
- **State Management:** React Context and/or Zustand for global state
- **Charts:** Recharts or Chart.js for data visualizations
- **Icons:** Lucide React or Heroicons
- **Build Tool:** Vite for development and production builds

### 6.2 State Management Approach

All data will be stored in browser memory using React state. The site will initialize with a predefined dataset representing current mining operations, personnel, and equipment. User interactions (filtering, sorting, form submissions, preference changes) will update this state locally. Refreshing the page or closing the browser will reset all data to the initial state.

Initial data fixtures will include:

- 15-20 mining sites with varied statuses and mineral types
- 50-75 personnel records across different roles and shifts
- 30-40 equipment units of various types
- Historical data points for charts (simulated 30-day history)
- 10-15 notification/alert records

### 6.3 Simulated Real-Time Updates

To create the impression of a live dashboard, the site will use JavaScript intervals to periodically update certain values (extraction rates, equipment status changes, new alerts). These updates will occur every 30-60 seconds and will modify the in-memory state, demonstrating how the UI responds to changing data. Users should be able to disable these simulated updates in Settings.

### 6.4 Responsive Behavior

The dashboard will be optimized for desktop use but should degrade gracefully on tablet and mobile devices:

- **Desktop (1280px+):** Full dashboard with sidebar navigation, multi-column widget layouts
- **Tablet (768px-1279px):** Collapsed sidebar by default, two-column widget layouts, touch-friendly controls
- **Mobile (below 768px):** Bottom navigation bar, single-column layout, simplified data views

---

## 7. Accessibility Testing Considerations

As an accessibility testing demonstration site, Discover Mercury will intentionally include a variety of accessibility issues that can be discovered through both automated scanning and manual testing. The site should also include examples of correct accessibility implementations for comparison and educational purposes.

### 7.1 Categories of Issues to Include

The following categories of accessibility issues should be distributed throughout the site:

**Perceivable Issues**

- Color contrast failures (text on backgrounds, UI elements, status indicators)
- Missing alternative text on images and icons
- Information conveyed by color alone (status indicators without text/icon alternatives)
- Missing captions or transcripts for any audio/video content
- Data visualizations without accessible data tables or descriptions

**Operable Issues**

- Keyboard traps (focus gets stuck in components)
- Missing or illogical focus indicators
- Non-keyboard-accessible interactive elements
- Missing skip links
- Timeout issues without warnings or extensions
- Focus order that doesn't match visual order

**Understandable Issues**

- Missing or incorrect form labels
- Error messages that don't identify the field or describe the error
- Inconsistent navigation patterns
- Missing page language declaration
- Unclear or missing instructions for complex interactions

**Robust Issues**

- Missing or incorrect ARIA roles, states, and properties
- Invalid HTML that affects assistive technology parsing
- Dynamic content changes not announced to screen readers
- Name/role/value failures on custom components

### 7.2 Distribution Strategy

Accessibility issues should be distributed across all pages and components to provide comprehensive testing scenarios. Each page should contain a mix of automated-detectable issues (contrast, missing alt text, missing labels) and manual-testing-required issues (keyboard traps, focus management, screen reader announcements). Some components should be implemented correctly to demonstrate best practices alongside the problematic implementations.

### 7.3 Documentation for Testers

A separate "Testing Guide" document or hidden admin page will catalog all intentional accessibility issues, their locations, the WCAG success criteria they violate, and the expected remediation approach. This allows the site to be used for training exercises where testers can verify their findings against known issues.

---

## 8. Content Requirements

### 8.1 Copy and Terminology

All interface copy should use consistent mining and space industry terminology. Labels, headings, and instructional text should feel authentic to an industrial operations context. Error messages and system notifications should match the tone of a professional control system.

### 8.2 Data Fixtures

Realistic sample data should be created for:

- **Mining Sites:** Names like "Caloris Basin Alpha", "Rachmaninoff Crater Deep", "Raditladi Thermal Zone"
- **Personnel:** Diverse names representing various cultural backgrounds, with roles like Extraction Technician, Equipment Operator, Safety Coordinator, Shift Supervisor
- **Equipment:** Types including Thermal Drill Unit, Conveyor Hauler, Processing Module, Environmental Shield
- **Minerals:** Mercurium, Solar Platinum, Thermal Crystals, with fictional market prices and extraction rates

### 8.3 Visual Assets

The site will require:

- Logo for Helios Mining Corporation
- Icon set for navigation, equipment types, status indicators
- Placeholder images for equipment and personnel profiles
- Background textures or patterns for the industrial aesthetic

---

## 9. Deliverables & Milestones

### 9.1 Project Deliverables

1. Complete React application source code
2. Production build ready for deployment
3. Sample data fixtures (JSON)
4. Accessibility issues documentation
5. Deployment instructions

### 9.2 Suggested Development Phases

- **Phase 1:** Core layout (header, sidebar, main content area) and navigation structure
- **Phase 2:** Dashboard home page with key metrics and primary widgets
- **Phase 3:** Operations view with data tables and filtering
- **Phase 4:** Personnel management including calendar and forms
- **Phase 5:** Equipment monitoring and maintenance features
- **Phase 6:** Reports and analytics section
- **Phase 7:** Settings, preferences, and final polish
- **Phase 8:** Intentional accessibility issues insertion and documentation

---

## 10. Appendix: Reference Materials

### 10.1 Mercury Facts for Authenticity

The following real facts about Mercury can inform the fictional narrative:

- Mercury's day (sunrise to sunrise) lasts 176 Earth days
- Surface temperatures range from -180°C to 430°C
- Mercury has no atmosphere to distribute heat
- The Caloris Basin is one of the largest impact craters in the solar system
- Mercury has a large iron core, making up about 75% of its radius
- Permanently shadowed craters at the poles may contain water ice

### 10.2 Design Inspiration

Visual references for the industrial dashboard aesthetic:

- NASA Mission Control Center interfaces
- Industrial SCADA systems
- Sci-fi film interfaces (Alien, Moon, The Martian)
- Bloomberg Terminal design patterns
- Modern dark-mode analytics dashboards

---

*— End of Document —*
