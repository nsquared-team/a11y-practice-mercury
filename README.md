# Discover Mercury — A11y Practice Site

**Mercury Mining Operations (MMO)** is a deliberately imperfect web app for
practising accessibility (a11y) testing. It presents as the real-time control
dashboard for a mineral-extraction mission on Mercury — the **Caloris Basin
Extraction Complex**, where automated rigs mine regolith for ilmenite, anorthite,
pyroxene, and polar water ice under a solar-powered colony.

The dashboard surfaces the kind of operational UI a mission control crew would
live in: live production charts, an incident/alert feed, per-rig shift reports,
and rig-configuration settings — all running on simulated telemetry.

> 🚀 Not a real product, and definitely not a real space program. A deliberately
> flawed dashboard built by NSquared for accessibility training, part of a
> solar-system series of a11y-practice sites. (It replaces an earlier travel-site
> concept for this planet — that's gone; this is the mining mission now.)

**Live site:** <https://discovermercury.site>

## Two mirrored trees

This site ships the same dashboard twice, following the shared
[planet-sites toolkit](https://github.com/nsquared-team/a11y-planet-sites-toolkit)
contract:

| Version | Lives at | Purpose |
| --- | --- | --- |
| **Inaccessible** (default) | `/`, `/alerts/`, `/reports/`, `/settings/` | Real WCAG failures to find |
| **Accessible** | `/accessible/`, `/accessible/alerts/`, … | The corrected mirror |

The two trees are **parallel page sets** (not one source with conditionals), so
the intentional flaws stay legible. The version switcher (bottom-right, from the
toolkit) jumps between the equivalent page in each tree.

## UI-pattern coverage

Each route demonstrates failures and fixes for an assigned set of patterns:

| Route | Mission screen | Patterns |
| --- | --- | --- |
| `/` Dashboard | Production telemetry & KPIs | Charts (line + bar), status banner |
| `/alerts/` | Incident feed | Alerts & notifications (live regions, dismissible feed) |
| `/reports/` | Per-rig shift output | Data tables (sortable, semantic) |
| `/settings/` | Rig configuration | Forms + Tabs & panels |

## What you can practice

The **root** tree ships genuine WCAG failures to find; the **accessible** tree is
the corrected mirror, so you can scan one, scan the other, and compare. Failures
on offer include:

- Charts with no text alternative, name, or role (color-only data encoding)
- A notification feed that never announces (no live region) and color-only severity
- Data tables built without header cells, scope, captions, or `aria-sort`
- Tab widgets and form controls that are unlabeled divs — no roles, no keyboard
- Missing skip links, landmarks, focus indicators, and low-contrast text

Good for new testers, hands-on workshops, manual-audit practice, and prep for
CPACC / WAS and similar certifications — with automated tools, manual technique,
and assistive technology.

## Tech stack

- **Astro**, statically pre-rendered (default output). Every route emits real
  static HTML into both trees; interactivity is small vanilla-JS islands. A
  scanner can crawl and deep-link any page — there is no blank SPA shell.
- Shared, a11y-neutral chrome (theme, layout shell) lives in components; the
  a11y-relevant markup is authored explicitly per tree.

## Local development

```sh
npm install
npm run dev            # http://localhost:4321
npm run build          # static output to ./dist
```

The switcher and base CSS are pulled from the toolkit CDN at runtime, so the
toolkit is **not** a build dependency. Sitemaps are generated in CI (see
Deployment): `sitemap.xml` lists the inaccessible (root) tree and is linked from
`robots.txt`; `sitemap-accessible.xml` lists the `/accessible/` tree and is fed
to a scanner manually when you want to scan the accessible version.

## Deployment

Pushes to `main` build and deploy to <https://discovermercury.site> via GitHub
Actions. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) is a thin
caller to the toolkit's reusable workflow
(`a11y-planet-sites-toolkit/.github/workflows/deploy-pages.yml@v1`), which checks
out the toolkit, runs `npm install` + the build, generates the sitemaps +
`robots.txt` over `dist/`, and publishes to Pages.

One-time setup: **Settings → Pages → Source = GitHub Actions** and **Custom
domain = `discovermercury.site`** (keep `public/CNAME` with the same value so
Astro copies it into `dist/`).
