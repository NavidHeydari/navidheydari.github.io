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

## Deployment

Push to `main` → GitHub Actions builds with `hugo --minify` and deploys to GitHub Pages automatically. The workflow file is `.github/workflows/deploy.yml`.

## Things to avoid

- Do not re-add an aafu theme submodule — the theme is fully inlined under `layouts/`.
- Do not introduce a separate CSS/JS build step — Hugo's built-in Tailwind transform handles it.
- Do not add `yellow-*` Tailwind classes for dark mode accents — use `gold-300` / `gold-500`.
- Do not commit the `public/` directory — it is gitignored build output.
