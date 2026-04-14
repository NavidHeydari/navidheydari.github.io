# CLAUDE.md — Project Guide for Claude Code

This file gives Claude Code the context it needs to work in this repository effectively.

## What this project is

A personal portfolio site for Navid Heydari (Principal Architect / AI Architect). It is a static Hugo site deployed to GitHub Pages. There is no backend, no database, and no JS bundler — Hugo renders everything at build time, with Tailwind CSS processed via Hugo's built-in transform.

## Tech stack

| Tool | Version | Role |
|---|---|---|
| Hugo extended | 0.160.1 | Static site generator |
| Tailwind CSS | 4.2.2 | Utility CSS (processed by Hugo, not a separate build step) |
| @tailwindcss/typography | 0.5.19 | Prose styles for blog/content pages |
| Bootstrap Icons | 1.13.1 | Icon font (CDN) |
| Node.js | 22 | Required only for npm dependencies used by Hugo's Tailwind transform |

## How to run

```bash
npm install        # only needed once, or after package.json changes
hugo server        # live-reload dev server at http://localhost:1313
hugo build         # production build into ./public
```

No separate `npm run build` or CSS compile step — Hugo drives everything.

## Repository layout

- `config.yaml` — site-wide settings, accordion order, theme params
- `assets/main.css` — Tailwind CSS entry point; defines custom gold theme tokens
- `tailwind.config.js` — Tailwind v4 config (content paths, dark mode, typography plugin)
- `data/*.json` — all portfolio content (profile, experiences, skills, etc.)
- `layouts/` — all Go/Hugo templates; fully self-contained, no theme submodule
- `static/` — copied as-is: `favicon.ico`, `images/profile_pic.jpg`
- `content/_index.md` — homepage front matter
- `package.json` / `package-lock.json` — Tailwind CSS npm deps
- `.github/workflows/deploy.yml` — GitHub Actions: installs Hugo + npm, runs `hugo --minify`

## Templates

All templates are in `layouts/`. There is no theme submodule — the theme was inlined from aafu in this branch and the submodule removed. Editing any file under `layouts/` directly changes the live site.

Key partials:
- `layouts/partials/head.html` — `<head>`: CDN links, Tailwind CSS inclusion, all inline JS (accordion logic, theme toggle)
- `layouts/partials/header.html` — top nav (Home link + dark/light toggle icon)
- `layouts/partials/social.html` — social links from `data/social.json`; links open in new tab
- `layouts/partials/accordion/*.html` — one file per portfolio section

Blog-specific templates:
- `layouts/blog/list.html` — blog post listing; left panel is the profile card (`view-transition-name: profile-card`)
- `layouts/blog/single.html` — individual post; left panel is the ToC (`view-transition-name: toc-card`); right panel is the archive sidebar

## Content changes

Edit JSON files in `data/` to update portfolio content. No template changes needed for content.

To add/remove/reorder accordion sections, edit `params.accordion` in `config.yaml`. Available section names: `about_me`, `experiences`, `education`, `publications`, `skills`, `projects`, `hobbies`.

## Colour scheme

Dark mode accent is gold (not the default Tailwind yellow). Tokens are in `assets/main.css`:

```css
@theme {
  --color-gold-300: #D4AF37;   /* links, borders, icons */
  --color-gold-500: #B8860B;   /* hover states, accordion text, skill bars */
}
```

Use `gold-300` / `gold-500` Tailwind classes anywhere yellow would have been used.

## Cross-document view transitions

The site uses the CSS View Transitions API for page-to-page navigation (`@view-transition { navigation: auto }` in `assets/main.css`). Key named slots:

| Name | Element | Pages | Animation |
|---|---|---|---|
| `profile-card` | profile photo + social links | `index.html`, `blog/list.html` | 280ms crossfade + subtle scale (`vt-card-out` / `vt-card-in`) |
| `toc-card` | ToC panel card | `blog/single.html` only | 150ms fade-out (old), 200ms `vt-card-in` (new background shell) |

**ToC reveal sequence (post → post navigation):**
1. Old ToC fades out in 150ms via `vt-toc-out`.
2. New page arrives with `#toc-content` pre-hidden (`max-height:0; opacity:0; overflow:hidden` inline), so the captured `::view-transition-new(toc-card)` snapshot is a compact background-only box.
3. After `viewTransition.finished` resolves (via the `pagereveal` event), `revealToc()` animates `max-height` to the element's natural `scrollHeight` and fades opacity to 1.
4. On `transitionend`, `max-height` is cleared to `none` so the panel reflows freely.
5. `initTocObserver()` (IntersectionObserver for active-heading highlighting) is called from `revealToc()` so it only runs after links are visible.

Fallback behaviour: browsers without `onpagereveal` call `revealToc()` on `DOMContentLoaded`; `prefers-reduced-motion: reduce` skips animation and reveals instantly.

Do not give any other element `view-transition-name: toc-card` or `view-transition-name: profile-card` — duplicate names break the transition.

## Deployment

Push to `main` → GitHub Actions builds with `hugo --minify` and deploys to GitHub Pages automatically. The workflow file is `.github/workflows/deploy.yml`.

## Things to avoid

- Do not re-add an aafu theme submodule — the theme is fully inlined under `layouts/`.
- Do not introduce a separate CSS/JS build step — Hugo's built-in Tailwind transform handles it.
- Do not add `yellow-*` Tailwind classes for dark mode accents — use `gold-300` / `gold-500`.
- Do not commit the `public/` directory — it is gitignored build output.
- Do not assign `view-transition-name: profile-card` to the ToC card on blog single pages — it has its own `toc-card` slot with different animation behaviour.
- Do not move `initTocObserver()` out of `revealToc()` — the observer must be set up after the ToC links become visible, otherwise IntersectionObserver callbacks fire on invisible elements.
