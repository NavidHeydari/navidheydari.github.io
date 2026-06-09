# Substack Tab Panel — Design Spec

**Date:** 2026-05-15
**Status:** Approved

## Summary

Add a two-tab toggle to the right-side panel on both blog page types. One tab shows existing content (Archive on single posts, Browse on the list page); the other tab shows the user's latest Substack posts fetched at build time from `navidheydari.substack.com/feed`.

---

## 1. Data Layer

**Source:** `https://navidheydari.substack.com/feed` (RSS 2.0)

**Fetch mechanism:** Hugo's `resources.GetRemote` at build time. Hugo caches the response to disk; repeated `hugo server` restarts do not re-hit the network.

**Parsing:** The raw RSS XML is piped through `transform.Unmarshal`, producing a Go map. The relevant path is `.channel.item` (Hugo strips the outer `<rss>` root wrapper — confirmed behaviour for RSS 2.0 feeds). Each item exposes: `title`, `link`, `pubDate`, `description`. The partial will log a warning and fall back if the path resolves to nil.

**Shared partial:** `layouts/partials/substack_feed.html` owns all fetch and render logic. Page templates call `{{ partial "substack_feed" . }}` — no fetch logic lives in page templates.

**Post count:** Display the 5 most recent posts (using Hugo's `first 5`).

**Date formatting:** Parse `pubDate` (RFC1123) with `time.AsTime`, format as `Jan 2, 2006`.

**Error handling:**
- Fetch failure or `.Err` set: render a single fallback link — *"Read on Substack →"* pointing to `https://navidheydari.substack.com`.
- Single-item feed: Hugo's XML unmarshaller returns a map (not a slice) for a single `<item>`. The partial wraps the result in `slice` if it is not already a slice.
- Empty item list: render the same fallback link.

---

## 2. Tab UI

### Appearance

Each right panel card gets two pill-style tab buttons prepended inside the existing card wrapper. The card's outer structure (`bg-warm-100 dark:bg-darker drop-shadow-md p-3 rounded-lg`) is unchanged.

**Tab labels:**
- `blog/single.html`: "Archive" | "Substack"
- `blog/list.html`: "Browse" | "Substack"

**Substack tab icon:** `bi-rss` (Bootstrap Icons, already loaded via CDN).

**Active tab styling:**
```
light: bg-warm-500 text-white
dark:  bg-gold-300 text-gray-900
```

**Inactive tab styling:**
```
light: text-warm-700 hover:bg-warm-100
dark:  text-gray-400 dark:hover:bg-stone-700
```

**Transition:** `transition-colors duration-150` on tab buttons.

### Switching Logic

A small JS snippet in each page's `{{ define "scripts" }}` block. On tab button click:
1. Remove `active` state from all tab buttons in the panel.
2. Add `active` state to the clicked button.
3. Toggle `hidden` class on the two content panels.

Scoped to the right panel container — no conflict with accordion or ToC logic. ~10 lines of vanilla JS.

**Default state on page load:** First tab (Archive / Browse) is active; Substack panel has `hidden` class.

---

## 3. Layout Changes

### `blog/single.html`

No grid change. The existing `col-span-2` right div is kept as-is. Inside its card:
- Tab buttons row added at top.
- Existing archive content wrapped in `<div data-panel="archive">`.
- New `<div data-panel="substack" class="hidden">` added after it, containing `{{ partial "substack_feed" . }}`.

### `blog/list.html`

Grid changes from 7 → 8 columns:

| Column | Before | After |
|---|---|---|
| Profile card | `col-span-2` | `col-span-2` (unchanged) |
| Post listing | `col-span-5` | `col-span-4` |
| Right panel | *(none)* | `col-span-2` (new) |

The new right panel uses the same card style and `blog-sidebar` class (already defined in `assets/main.css` for sticky + scrollable behaviour).

**"Browse" tab content:** All unique tags from `site.RegularPages` where `Section = "blog"`, rendered as `.tags` pill spans. Each links to the Hugo taxonomy page for that tag.

---

## 4. Files Changed

| File | Change |
|---|---|
| `layouts/partials/substack_feed.html` | **New** — fetch, parse, render Substack posts |
| `layouts/blog/single.html` | Add tab buttons + wrap archive in panel div + add Substack panel + tab JS |
| `layouts/blog/list.html` | Restructure grid 7→8 cols + add right panel with Browse/Substack tabs + add `{{ define "scripts" }}` block with tab JS |

No changes to `assets/main.css`, `tailwind.config.js`, or `config.yaml`.

---

## 5. Constraints

- Build-time only — no runtime JavaScript fetch.
- No new npm dependencies.
- No new Hugo config params.
- Offline dev gracefully degrades (fallback link shown).
- `view-transition-name: toc-card` and `view-transition-name: profile-card` are not touched.
