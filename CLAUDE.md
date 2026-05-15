# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A personal portfolio site for Navid Heydari (Principal Architect / AI Architect). It is a static Hugo site deployed to GitHub Pages. There is no backend, no database, and no JS bundler — Hugo renders everything at build time, with Tailwind CSS processed via Hugo's built-in transform.

## Commands

```bash
npm install        # only needed once, or after package.json changes
hugo server        # live-reload dev server at http://localhost:1313
hugo build         # production build into ./public
```

To create a new blog post using the archetype (sets title, date, tags, draft):
```bash
hugo new content/blog/my-post-name.md
```

**Tests:** Open `test/accordion.test.html` directly in a browser — it is a self-contained HTML test runner for accordion logic, theme toggle, and ARIA attributes. No build step needed.

## Architecture

The site has three page types, each with a distinct layout:

**Homepage (`layouts/index.html`)** — 7-column grid: profile photo/social left, accordion sections centre, recent blog posts right.

**Blog list (`layouts/blog/list.html`)** — 7-column grid: profile card left (view-transition-name: `profile-card`), post list centre, tag/category sidebar right.

**Blog post (`layouts/blog/single.html`)** — 8-column grid: ToC panel left (view-transition-name: `toc-card`), post content centre, archive calendar sidebar right.

**Data model:** All portfolio content lives in `data/*.json`. The accordion reads `hugo.Data.<section_name>` for title, icon, and content. Section order and visibility is controlled entirely by `params.accordion` in `config.yaml` — no template changes needed to add/remove sections. Available section names: `about_me`, `experiences`, `education`, `publications`, `skills`, `projects`, `hobbies`.

**Accordion logic** lives in an inline `<script>` in `layouts/partials/head.html` (`expandAccordion()`). It is a single-open accordion: clicking a section closes all others. The skills section (`panel_id: skill-panel`) gets special treatment — navigating away from it resets `.skill-percent` bar widths to 0 so they re-animate on re-open.

**Skill bar animation:** Skill bars are DOM elements with class `skill-percent`. Their `width` is set to `0` on page load and animated to the data value only when the skills panel opens. The selector is class-based (`.skill-percent`) — never use `id="skill-percent"` since multiple bars exist.

## Colour system

Two palettes are defined in `assets/main.css` under `@theme`:

**Dark mode accent (gold):**
```css
--color-gold-300: #D4AF37;   /* links, borders, icons */
--color-gold-500: #B8860B;   /* hover states, accordion text, skill bars */
```

**Light mode palette (cool blue-gray `warm-*`):**
```css
--color-warm-50:  #F0F6FF;   /* page background */
--color-warm-100: #E1EDFB;   /* card / panel surfaces */
--color-warm-200: #B9D0EA;   /* borders, dividers, code pill bg */
--color-warm-500: #1F65B8;   /* primary accent — links, skill bars, icons */
--color-warm-600: #1550A0;   /* hover state, inline code text */
--color-warm-700: #3A5570;   /* body copy */
--color-warm-900: #0F2040;   /* headings */
```

Dark mode backgrounds use `darkest` (stone-900), `darker` (stone-800), `dark` (stone-700) from `tailwind.config.js`. Use `dark:` variants to switch between the two palettes.

## Cross-document view transitions

The site uses the CSS View Transitions API (`@view-transition { navigation: auto }`) for page-to-page navigation. Two named slots:

| Name | Element | Pages |
|---|---|---|
| `profile-card` | profile photo + social links | `index.html`, `blog/list.html` |
| `toc-card` | ToC panel card | `blog/single.html` only |

**ToC reveal sequence (post → post):** The new page arrives with `#toc-content` pre-hidden (`max-height:0; opacity:0; overflow:hidden` inline style set in the template). After `viewTransition.finished` resolves via the `pagereveal` event, `revealToc()` animates it open. `initTocObserver()` (IntersectionObserver for active-heading highlighting) is called from inside `revealToc()` — do not move it out, as it must run after the ToC links become visible.

**pageswap handler:** When leaving a post for a non-post page, the `toc-card` view-transition-name is stripped so it doesn't ghost over the incoming page.

Fallback: browsers without `onpagereveal` call `revealToc()` on `DOMContentLoaded`. `prefers-reduced-motion: reduce` skips animation and reveals instantly.

## Shortcodes

- `{{< figure >}}` — enhanced image/figure shortcode (`layouts/shortcodes/figure.html`)
- `{{< raw_html >}}` — embed arbitrary HTML in Markdown (`layouts/shortcodes/raw_html.html`)

## Code highlighting

Hugo's built-in Chroma highlighter with `style: monokai` and `noClasses: true` (inline styles, no separate CSS file). Code blocks on dark backgrounds use `pre { background-color: #0F1C2E }` in `tailwind.config.js` typography config.

## Things to avoid

- Do not re-add an aafu theme submodule — the theme is fully inlined under `layouts/`.
- Do not introduce a separate CSS/JS build step — Hugo's built-in Tailwind transform handles it.
- Do not add `yellow-*` Tailwind classes for dark mode accents — use `gold-300` / `gold-500`.
- Do not commit the `public/` directory — it is gitignored build output.
- Do not assign `view-transition-name: profile-card` or `view-transition-name: toc-card` to any other element — duplicate names break transitions.
- Do not move `initTocObserver()` out of `revealToc()`.
- Do not use `id="skill-percent"` — use the `.skill-percent` class selector; multiple bars share it.

## Deployment

Push to `main` → GitHub Actions builds with `hugo --minify` and deploys to GitHub Pages. Google Analytics is injected only in production builds (`hugo.IsProduction`).
