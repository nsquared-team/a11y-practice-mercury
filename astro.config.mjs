// @ts-check
import { defineConfig } from 'astro/config';

// Statically pre-rendered (default output). Every route emits real static HTML
// into both the root (inaccessible) tree and the /accessible/ mirror.
//
// build.format: 'directory' (Astro default) → /alerts/ ships as alerts/index.html.
// trailingSlash: 'always' keeps in-site links pointing at the directory URLs the
// toolkit version switcher expects (it prepends/strips the /accessible prefix on
// window.location.pathname, e.g. /alerts/ <-> /accessible/alerts/).
export default defineConfig({
  site: 'https://discovermercury.site',
  base: '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
