# Discover Mercury — Build Plan (Astro two-tree port of `mining-ops`)

Plan to bring the full feature set from the earlier `mining-ops` React/Vite SPA
onto `main`'s statically pre-rendered Astro site, honouring the
[planet-sites toolkit](https://github.com/nsquared-team/a11y-planet-sites-toolkit)
two-tree contract.

## Locked decisions

1. **Fidelity: faithful re-create.** Rebuild every page / widget / modal / gauge
   from the React app as static HTML + small vanilla-JS islands, in **both
   trees** (inaccessible root + accessible `/accessible/`). Phases A–I below.
2. **Live data + drag-and-drop → two-tree contrast.** Drag-and-drop: the root
   tree is pointer-only (the failure); the accessible tree adds a keyboard
   reorder (move ↑/↓) + an `aria-live` status. Live "simulation" stays minimal —
   only where it demonstrates a pattern (e.g. the alert live region).
3. **Enrich `/alerts/`** as the Notifications centre (severity/category filters +
   stat cards). The dashboard shows an alert-feed widget that links to it. **No
   separate `/notifications/` route.**

## Core principle

The React app distributed ~40 issues throughout one SPA and catalogued them in a
hidden `/admin` page. On `main` the **root tree IS that catalogue of failures**
and the `/accessible/` tree is the corrected mirror. Every `mining-ops` page
becomes a **page-pair**, authored explicitly per tree (never via conditionals),
sharing only a11y-neutral chrome. The documented issues from
`mining-ops/docs/TESTING-GUIDE.md` become the root-tree failure set.

## Route + nav map (both trees)

| Route | Status | Notes |
|---|---|---|
| `/` | have | Operator sign-in (login) |
| `/dashboard/` | expand | + equipment-status grid, commodity widget, multi-series 24h extraction chart, alert-feed widget |
| `/operations/` | new | sites table (sort/filter/paginate/select) + site-detail modal |
| `/personnel/` | new | directory + shift schedule (reorder) + cert tracker + add/edit form wizard |
| `/equipment/` | new | inventory cards + maintenance timeline + diagnostics gauges + detail modal + request form |
| `/reports/` | expand | report builder + live preview + saved library + comparison charts + export modal |
| `/alerts/` | expand | Notifications centre: severity/category filters + stat cards |
| `/settings/` | expand | display + notification prefs (sliders) + dashboard widget customization (reorder) + account |

Sidebar nav (`src/data/ops.js` `NAV`) grows to: Dashboard, Operations, Personnel,
Equipment, Reports, Alerts, Settings.

## Stack replacements (no React / no new heavy deps)

| React app | Build on `main` as |
|---|---|
| `recharts` | static inline SVG (extend `src/lib/chart.js`: multi-series area, line/bar) + sr-only data table in the accessible tree |
| `react-circular-progressbar` | SVG `stroke-dasharray` gauge component |
| `@dnd-kit` drag-drop | root: pointer-only DnD (failure); accessible: keyboard reorder + live region |
| `lucide-react` | small inline-SVG icon set (`src/components/icons/`) |
| Context + `useSimulation` | minimal per-page vanilla islands; no global store |

## Shared pattern components (each authored broken + fixed)

Modal dialog (focus-trap / Esc / `role="dialog"`), tabs, accordion, toggle switch
(`role="switch"`), range slider, circular gauge, progress bar, multi-step form
wizard, data table (sort/filter/paginate/select), reorder list, toast/live region.

## Data fixtures

Port `sites`, `personnel`, `equipment`, `alerts`+commodities, `reports` from the
branch's `.ts` files → `.js` into `src/data/` (strip types). A11y-neutral and
shared by both trees: 17 sites, 60 personnel, 35 equipment, 15 alerts, 5 reports.
Keep the chart/cycle utilities as pure `.js` helpers.

## Theme

Already ~90% aligned (dark + amber). Keep `main`'s `#ff9e3d`. Optional polish:
JetBrains Mono for data displays, glow/scan-line accents, Mercury day/night
overlay component.

## Phases (each = both trees, then build + browser-verify)

- **A — Foundation.** Port data fixtures; grow Sidebar nav; add Header (global
  search + notifications bell + Mercury time) and Footer (system status) to the
  chrome with root-tree failures (per TESTING-GUIDE: low-contrast labels,
  unlabeled search, `focus:outline-none`, missing button names); build the shared
  pattern components.
- **B — Dashboard expansion.** Equipment-status grid (root: color-only +
  non-focusable; accessible: text+icon, focusable), commodity-prices widget,
  multi-series extraction chart, alert-feed widget → `/alerts/`.
- **C — Operations.** Sortable/filterable/paginated/selectable sites table +
  batch toolbar + site-detail **modal** (root: no `role=dialog`/Esc, `tabindex`
  order; accessible: full dialog semantics + focus management).
- **D — Equipment.** Inventory cards + maintenance timeline + diagnostics gauges
  (SVG) + detail modal (tabbed) + maintenance request form.
- **E — Personnel.** Directory + shift schedule (reorder per decision #2) + cert
  tracker (progress bars) + 4-step form wizard (root: `tabindex` order, no Esc,
  missing dialog role; accessible: corrected).
- **F — Reports expansion.** Report builder + live preview (SVG charts) + saved
  library table + comparison charts + export modal (root: ExportModal issues from
  TESTING-GUIDE; accessible: fixed).
- **G — Notifications.** Enrich `/alerts/` into the Notifications centre.
- **H — Settings expansion.** Display + notification prefs (toggles, sliders),
  dashboard widget customization (reorder), account form.
- **I — Audit + ship.** Verify each pattern's failure/fix asymmetry across both
  trees, optional testing-guide page, build → sitemaps → deploy.

Phases C/D/E/F are the high-effort ones (tables, modals, gauges, wizard). Run
each page-pair like the first four: parallel authoring, then build + verify.
