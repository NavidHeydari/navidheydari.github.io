---
name: blog-substack-mix
description: Mix Substack RSS feed articles into the Hugo blog list, sorted by date, with a subtle Substack badge
metadata:
  type: project
---

# Blog + Substack Feed Mix

**Date:** 2026-06-09
**Branch:** features/v1_convert_to_hugo

## Goal

Merge Substack newsletter posts into the existing Hugo blog list page. All posts — local Hugo pages and remote Substack articles — appear in a single chronologically sorted feed. Substack posts are visually identical to blog posts except for a subtle inline badge.

## Scope

- Modify `layouts/blog/list.html` only
- Remove existing pagination (post count is small)
- Leave `layouts/newsletter/list.html` untouched

## Data Normalization

Both sources are converted to a common map shape before rendering:

| Field | Blog post | Substack item |
|---|---|---|
| `title` | `.Title` | `index $item "title"` |
| `url` | `.Permalink \| relURL` | `index $item "link"` |
| `date` | `.Date` | `time.AsTime (index $item "pubDate")` |
| `dateUnix` | `.Date.Unix` | `$t.Unix` |
| `description` | `.Description` | `index $item "description"` |
| `tags` | `.Params.tags` | `slice` (empty) |
| `source` | `"blog"` | `"substack"` |
| `readingTime` | `.ReadingTime` | `0` |

Sort key: `dateUnix` (int64, descending) — avoids `time.Time` comparison ambiguity.

## Feed Fetching

- URL: `{{ .Site.Params.substackURL }}/feed`
- Uses `try (resources.GetRemote $feedURL)` — same pattern as newsletter
- Single-item normalization: `reflect.IsSlice` check, wrap bare map in `slice` if needed
- Failure: `warnf` only — local posts still render, no build error

## Card Rendering

One `<article>` block handles both sources:

- **Title link**: internal `href` for blog, `target="_blank" rel="noopener noreferrer"` for Substack
- **Substack badge**: inline pill `<span>` after the title — `bi-box-arrow-up-right` icon + "Substack" text — shown only when `source == "substack"`
- **Date line**: formatted date; reading time shown only when `> 0`
- **Description**: raw `.Description` for blog; `plainify | truncate 220 "…"` for Substack (RSS descriptions contain HTML)
- **Tags**: rendered only when `len tags > 0` (Substack entries have empty slice)

## Badge Styling

```html
<span class="inline-flex items-center gap-1 text-xs text-warm-500 dark:text-gold-300
             border border-warm-200 dark:border-gold-500/30 rounded px-1.5 py-0.5 ml-2 align-middle">
  <i class="bi bi-box-arrow-up-right"></i> Substack
</span>
```

## Error Handling

| Scenario | Behavior |
|---|---|
| Feed fetch fails | `warnf` logged, local posts render normally |
| Feed returns 0 items | Local posts only, no empty-state message |
| Single RSS item (map, not slice) | Normalized to `slice $item` via `reflect.IsSlice` |

## What Is NOT Changing

- `layouts/newsletter/list.html` — unchanged
- Blog post single layout — unchanged
- Homepage recent-posts widget — unchanged
- `config.yaml` — no new params needed (`substackURL` already exists)
