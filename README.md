# Discover Mercury — A11y Practice Site

**Mercury Mining Operations** is a deliberately imperfect web app for practising
accessibility (a11y) testing. It presents as a real-time mining-operations
dashboard for a fictional colony on Mercury.

> 🚀 Not a real product. A deliberately flawed dashboard built by NSquared for
> accessibility training, part of a solar-system series of a11y-practice sites.

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

| Route | Patterns |
| --- | --- |
| `/` Dashboard | Charts (line + bar), status banner |
| `/alerts/` | Alerts & notifications (live regions, dismissible feed) |
| `/reports/` | Data tables (sortable, semantic) |
| `/settings/` | Forms + Tabs & panels |

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
