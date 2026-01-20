# Discover Mercury - Accessibility Testing Guide

## Overview

This document provides a comprehensive guide to the intentional accessibility issues implemented in the Discover Mercury application for testing practice. These issues span all four WCAG 2.1 principles: Perceivable, Operable, Understandable, and Robust.

---

## Issue Summary

| Category | Count | WCAG Principles |
|----------|-------|-----------------|
| Color Contrast | 8+ | Perceivable (1.4.3) |
| Color-Only Indicators | 6+ | Perceivable (1.4.1) |
| Missing Alt Text/Names | 5+ | Perceivable (1.1.1) |
| Keyboard Accessibility | 5+ | Operable (2.1.1, 2.1.2) |
| Focus Indicators | 6+ | Operable (2.4.7) |
| Focus Order | 2 | Operable (2.4.3) |
| Form Labels | 4+ | Understandable (3.3.2) |
| ARIA Issues | 8+ | Robust (4.1.2) |

**Total Issues: ~40+ accessibility violations**

---

## Detailed Issue List

### 1. Color Contrast Failures (WCAG 1.4.3)

These issues involve text that does not meet the minimum contrast ratio of 4.5:1 for normal text.

| Location | Component | Element | Issue |
|----------|-----------|---------|-------|
| Footer | `Footer.tsx` | "System Status:" label | `text-gray-700` on dark background (~2.5:1 ratio) |
| Footer | `Footer.tsx` | "Active Sites:" label | `text-gray-700` on dark background |
| Footer | `Footer.tsx` | "Last sync:" label | `text-gray-700` on dark background |
| Footer | `Footer.tsx` | Sync timestamp | `text-gray-600` on dark background |
| Header | `Header.tsx` | "Mercury Time" label | `text-gray-600` on dark background |
| Dashboard | `Dashboard.tsx` | Metric card labels | `text-gray-600` on dark background |
| Dashboard | `Dashboard.tsx` | Metric card units | `text-gray-600` on dark background |
| Dashboard | `Dashboard.tsx` | Alert timestamps | `text-gray-600` on dark background |
| Dashboard | `Dashboard.tsx` | Equipment legend text | `text-gray-600` on dark background |
| Dashboard | `Dashboard.tsx` | Commodity names | `text-gray-600` on dark background |
| Dashboard | `Dashboard.tsx` | Commodity symbols | `text-gray-700` on dark background |
| Export Modal | `ExportModal.tsx` | Metric names | `text-gray-500` on dark background |
| Export Modal | `ExportModal.tsx` | Metric units | `text-gray-700` on dark background |

**How to Test:**
- Use browser DevTools to inspect text colors
- Use contrast checker tools (axe, WAVE, Colour Contrast Analyser)
- Look for text that appears faded or hard to read

---

### 2. Color-Only Status Indicators (WCAG 1.4.1)

Information conveyed only through color without additional visual cues.

| Location | Component | Element | Issue |
|----------|-----------|---------|-------|
| Dashboard | `Dashboard.tsx` | Equipment status grid | Status (operational/idle/maintenance/offline) shown only by color |
| Dashboard | `Dashboard.tsx` | Metric trend indicators | Positive/negative trends shown only by green/red text |
| Dashboard | `Dashboard.tsx` | Unread alert indicator | Small amber dot with no text |
| Dashboard | `Dashboard.tsx` | Commodity price change | Green/red badges without icons |
| Equipment Modal | `EquipmentDetailModal.tsx` | Sensor warning dot | Yellow dot on Sensors tab |
| Export Modal | `ExportModal.tsx` | No additional issues | - |

**How to Test:**
- View the page in grayscale mode
- Use color blindness simulation tools
- Check if status can be determined without color

---

### 3. Missing Alt Text / Accessible Names (WCAG 1.1.1)

Images, icons, or interactive elements lacking text alternatives.

| Location | Component | Element | Issue |
|----------|-----------|---------|-------|
| Header | `Header.tsx` | Notification button | No `aria-label` attribute |
| Header | `Header.tsx` | User profile button | No `aria-label` attribute |
| Dashboard | `Dashboard.tsx` | Metric card icons | Icons marked `aria-hidden` with no text alternative |
| Dashboard | `Dashboard.tsx` | Unread indicator dot | No screen reader text |

**How to Test:**
- Use screen reader to navigate
- Check for empty button/link announcements
- Inspect elements for missing aria-labels

---

### 4. Keyboard Traps (WCAG 2.1.2)

Modal dialogs that trap keyboard focus without providing an escape mechanism.

| Location | Component | Issue |
|----------|-----------|-------|
| Equipment Detail Modal | `EquipmentDetailModal.tsx` | No Escape key handler to close modal |
| Export Modal | `ExportModal.tsx` | No Escape key handler to close modal |
| Personnel Form Wizard | `PersonnelFormWizard.tsx` | No Escape key handler to close modal |

**How to Test:**
- Open modal using keyboard
- Press Escape key - modal should close but doesn't
- Try to tab out of modal - may get trapped

---

### 5. Missing Focus Indicators (WCAG 2.4.7)

Interactive elements that lack visible focus states.

| Location | Component | Element | Issue |
|----------|-----------|---------|-------|
| Header | `Header.tsx` | Notification button | `focus:outline-none` removes focus ring |
| Header | `Header.tsx` | Profile button | `focus:outline-none` removes focus ring |
| Dashboard | `Dashboard.tsx` | Alert cards | Clickable but no focus state |
| Equipment Modal | `EquipmentDetailModal.tsx` | Tab buttons | `focus:outline-none` removes focus ring |
| Personnel Form | `PersonnelFormWizard.tsx` | Close button | `focus:outline-none` removes focus ring |
| Personnel Form | `PersonnelFormWizard.tsx` | Navigation buttons | `focus:outline-none` removes focus ring |
| Export Modal | `ExportModal.tsx` | Checkboxes | `focus:outline-none` on inputs |

**How to Test:**
- Navigate using Tab key only
- Look for visible focus indication on each element
- Note any elements that receive focus but show no visual change

---

### 6. Non-Keyboard Accessible Elements (WCAG 2.1.1)

Interactive elements that cannot be operated via keyboard.

| Location | Component | Element | Issue |
|----------|-----------|---------|-------|
| Dashboard | `Dashboard.tsx` | Alert cards | `<div>` with `onClick` but no keyboard handler |
| Dashboard | `Dashboard.tsx` | Equipment grid squares | Not focusable, info only in `title` attribute |

**How to Test:**
- Try to activate elements using Enter/Space keys
- Check if all clickable elements are focusable
- Use Tab key to ensure all interactive elements are reachable

---

### 7. Focus Order Issues (WCAG 2.4.3)

Tab order that doesn't match visual/logical reading order.

| Location | Component | Issue |
|----------|-----------|-------|
| Equipment Modal | `EquipmentDetailModal.tsx` | Footer buttons have `tabindex` values (1, 2) that disrupt order |
| Personnel Form | `PersonnelFormWizard.tsx` | Footer buttons have `tabindex` values (1, 2, 3) creating illogical order |

**How to Test:**
- Tab through the modal/form
- Note if focus jumps unexpectedly
- Check if focus order matches visual layout

---

### 8. Missing/Incorrect Form Labels (WCAG 3.3.2, 4.1.2)

Form inputs without proper label associations.

| Location | Component | Element | Issue |
|----------|-----------|---------|-------|
| Header | `Header.tsx` | Search input | No `<label>` element, only placeholder |
| Export Modal | `ExportModal.tsx` | Metrics group | `<span>` used instead of `<label>`, not associated |
| Export Modal | `ExportModal.tsx` | Checkbox inputs | Wrapped in label but missing explicit `id`/`for` |

**How to Test:**
- Click on label text - input should focus but may not
- Use screen reader to check input announcements
- Inspect for proper label/input associations

---

### 9. ARIA Issues (WCAG 4.1.2)

Missing or incorrect ARIA attributes.

| Location | Component | Issue |
|----------|-----------|-------|
| Dashboard | `Dashboard.tsx` | Alert feed missing `aria-live` region |
| Equipment Modal | `EquipmentDetailModal.tsx` | Modal missing `role="dialog"` and `aria-modal="true"` |
| Equipment Modal | `EquipmentDetailModal.tsx` | Tabs missing `role="tablist"` |
| Equipment Modal | `EquipmentDetailModal.tsx` | Tab buttons missing `role="tab"`, `aria-selected` |
| Equipment Modal | `EquipmentDetailModal.tsx` | Tab panels missing `role="tabpanel"`, `aria-labelledby` |
| Export Modal | `ExportModal.tsx` | Modal missing `role="dialog"` and `aria-modal="true"` |
| Personnel Form | `PersonnelFormWizard.tsx` | Modal missing `role="dialog"` and `aria-modal="true"` |

**How to Test:**
- Use screen reader to navigate tabs
- Check if tab selection is announced
- Verify dialog announcement when modal opens

---

## Testing Tools Recommended

### Automated Testing
- **axe DevTools** - Browser extension for automated accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Chrome DevTools accessibility audit

### Manual Testing
- **Keyboard-only navigation** - Tab, Enter, Space, Escape, Arrow keys
- **Screen readers** - NVDA (Windows), VoiceOver (Mac), JAWS
- **Color contrast analyzers** - Colour Contrast Analyser, WebAIM Contrast Checker
- **Color blindness simulators** - Sim Daltonism, Chrome DevTools rendering emulation

### Browser DevTools
- Accessibility tree inspection
- Focus order visualization
- Color contrast ratio calculation

---

## WCAG 2.1 Success Criteria Reference

| Criterion | Level | Description |
|-----------|-------|-------------|
| 1.1.1 | A | Non-text Content |
| 1.4.1 | A | Use of Color |
| 1.4.3 | AA | Contrast (Minimum) |
| 2.1.1 | A | Keyboard |
| 2.1.2 | A | No Keyboard Trap |
| 2.4.3 | A | Focus Order |
| 2.4.7 | AA | Focus Visible |
| 3.3.2 | A | Labels or Instructions |
| 4.1.2 | A | Name, Role, Value |

---

## Additional Notes

- All issues are marked with comments in the source code starting with `// A11Y ISSUE:`
- Issues are distributed across different pages and components
- Some issues may only be apparent during specific interactions (e.g., modal dialogs)
- The hidden Admin page (`/admin`) contains a complete interactive list of all issues

---

*This document is for accessibility testing practice purposes. In a production application, all these issues should be fixed.*
