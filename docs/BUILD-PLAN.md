# Discover Mercury — Build Plan (Astro two-tree port of `mining-ops`)

Plan to bring the full feature set from the earlier `mining-ops` React/Vite SPA
onto `main`'s statically pre-rendered Astro site, honouring the
[planet-sites toolkit](https://github.com/nsquared-team/a11y-planet-sites-toolkit)
two-tree contract.

## Status & resume notes (last updated: through Phase H)

**Done — phases A–H (committed + deployed to `main`):**

| Phase | What landed | Commit |
|---|---|---|
| A | Ported data fixtures (`src/data/*.js`, `src/lib/{chart,chartData,mercuryCycle}.js`); enriched chrome: Header (search + Mercury time + notifications bell) + Footer (system status); `Icon.astro` | `d9b82ee` |
| B | Dashboard widgets: multi-series extraction chart, equipment-status grid, commodity widget, alert feed | `b703276` |
| C | Operations page-pair: sortable/filterable/paginated/selectable sites table + batch bar + site-detail **modal** | `a445414` |
| D | Equipment page-pair: 3 tabs (inventory cards / maintenance timeline / diagnostics **gauges**) + tabbed detail modal; `Gauge.astro` | `4bf4525` |
| E | Personnel page-pair: directory + shift-schedule **reorder** + cert table + 4-step **form wizard** | `18e90bf` |
| F | Reports module: builder (accordion + live preview) + saved library + analytics + export modal | `b494cc6` |
| G | Notifications centre: 4 stat cards (`getAlertStats()`) + severity & category **filter selects** over the feed; fixture gains `category` field + `success` severity (`ALERT_CATEGORIES` + `getAlertStats()` in `ops.js`; now 7 alerts). Root: unlabeled selects, colour-only stat cards/severity. Accessible: `<label for>` selects, text stat cards, `success` text badge (`badge--ok`/`badge--info`), filter result announced via `#alert-count` `role="status"` | `2ec92f3` |
| H | Settings expansion: 4 tabs (Display / Notifications / Dashboard / Account). New patterns — **toggle switches** + **range sliders** + dashboard-widget **reorder** + account form. `ops.js` gains `DISPLAY_PREFS`/`DISPLAY_TOGGLES`/`NOTIFICATION_SLIDERS`/`NOTIFICATION_CATEGORIES`/`DASHBOARD_WIDGETS`/`ACCOUNT` (SETTINGS_TABS now the 4 sections; old rig config kept as `SETTINGS_TABS_LEGACY`). Root: `<div>` toggles (no role/keyboard), unlabeled sliders + selects, pointer-only widget DnD, clickable-div Save. Accessible: `role="switch" aria-checked` buttons, `<label for>` + live-value sliders, keyboard widget reorder (Move ↑/↓ + `aria-live` status, reuses `.roster`/`.movebtn`), `aria-pressed` show/hide, real submit | _pending_ |

**Remaining — resume here:**

- **I ⬜ — Audit + ship.** Cross-tree asymmetry sweep, optional `/about` testing-guide
  page, final build → the deploy workflow auto-runs sitemaps.

**Hard-won conventions a new session MUST follow:**

1. **Page-pairs, not conditionals.** Each route = `src/pages/<r>/index.astro`
   (root, uses `ChromeRoot`, `variant="root"`) + `src/pages/accessible/<r>/index.astro`
   (uses `ChromeAccessible`, `variant="accessible"`). Add the route to `NAV` in
   `src/data/ops.js`. Imports use aliases: `@layouts`, `@components`, `@data`, `@lib`.
2. **Inline `<script define:vars>` ships VERBATIM** — any comment in it that names a
   failure leaks the answer into the root HTML. Keep those script comments neutral
   (e.g. `// detail modal`, not `// modal with no dialog role`). Frontmatter
   docblock comments (`---` block) and bundled non-`define:vars` `<script>` are
   stripped/minified, so they're safe. In templates use `{/* */}`, never `<!-- -->`.
3. **Reusable accessible JS already exists** — copy from
   `src/pages/accessible/equipment/index.astro`: `wireTabs()` (ARIA tablist + roving
   tabindex + arrow/Home/End) and the modal pattern (`focusable()`, `onKeydown`
   Esc+Tab-trap, `lastFocused` focus-return, `open/close`). The Personnel page has
   the keyboard **reorder** (move ↑/↓ buttons + `aria-live` status); reuse for H.
4. **Charts** = inline SVG via `src/lib/chart.js` (`linePlot`/`barPlot`/`multiSeriesPlot`)
   or hand-built SVG strings in islands; accessible tree adds `role="img"` +
   aria-label + an `class="data sr-only"` table. Gauges via `Gauge.astro`.
5. **Verify each page-pair:** `node_modules/.bin/astro build`, then grep the built
   HTML for failure/fix asymmetry (use `grep -o … | wc -l` for occurrences, not
   `grep -c`), run the leak check, and browser-test with the `agent-browser` skill
   (use `eval("…click()")` for reliable clicks; `find role` can miss reordered rows).
6. **Env:** the global npm cache is root-owned — install with
   `npm install --cache /tmp/<name>`; run the local binary `node_modules/.bin/astro`
   (not `npx astro`). The `mining-ops` source is on `origin/mining-ops`
   (`git worktree add /tmp/mo origin/mining-ops` to read it).
7. **Big accessible mirrors can be delegated** to a subagent given the root file +
   a precise per-section fix list + the reference accessible pages (worked well for
   Personnel and Reports). Then verify + fix leaks yourself.

Current nav order: Dashboard, Operations, Personnel, Equipment, Alerts, Reports,
Settings (16 pages build: 8 routes × 2 trees). Deploy is automatic on push to
`main`; live at <https://discovermercury.site>.

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

- **A ✅ — Foundation.** Port data fixtures; grow Sidebar nav; add Header (global
  search + notifications bell + Mercury time) and Footer (system status) to the
  chrome with root-tree failures (per TESTING-GUIDE: low-contrast labels,
  unlabeled search, `focus:outline-none`, missing button names); build the shared
  pattern components.
- **B ✅ — Dashboard expansion.** Equipment-status grid (root: color-only +
  non-focusable; accessible: text+icon, focusable), commodity-prices widget,
  multi-series extraction chart, alert-feed widget → `/alerts/`.
- **C ✅ — Operations.** Sortable/filterable/paginated/selectable sites table +
  batch toolbar + site-detail **modal** (root: no `role=dialog`/Esc, `tabindex`
  order; accessible: full dialog semantics + focus management).
- **D ✅ — Equipment.** Inventory cards + maintenance timeline + diagnostics gauges
  (SVG) + detail modal (tabbed) + maintenance request form.
- **E ✅ — Personnel.** Directory + shift schedule (reorder per decision #2) + cert
  tracker (progress bars) + 4-step form wizard (root: `tabindex` order, no Esc,
  missing dialog role; accessible: corrected).
- **F ✅ — Reports expansion.** Report builder + live preview (SVG charts) + saved
  library table + comparison charts + export modal (root: ExportModal issues from
  TESTING-GUIDE; accessible: fixed).
- **G ✅ — Notifications.** Enrich `/alerts/` into the Notifications centre.
- **H ✅ — Settings expansion.** Display + notification prefs (toggles, sliders),
  dashboard widget customization (reorder), account form.
- **I ⬜ — Audit + ship.** Verify each pattern's failure/fix asymmetry across both
  trees, optional testing-guide page, build → sitemaps → deploy.

Phases C/D/E/F are the high-effort ones (tables, modals, gauges, wizard). Run
each page-pair like the first four: parallel authoring, then build + verify.
