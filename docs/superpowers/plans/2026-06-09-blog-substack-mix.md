# Blog + Substack Feed Mix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blog list page with a unified feed that merges local Hugo posts and remote Substack RSS items, sorted by date descending, with a subtle Substack badge on external posts.

**Architecture:** A single template file change — `layouts/blog/list.html`. Both data sources are normalized into a common `map[string]interface{}` slice inside the template, sorted by `dateUnix` (int64), and rendered with one shared `<article>` card loop. No new files, no config changes.

**Tech Stack:** Hugo templates (Go templates), Tailwind CSS (existing), Bootstrap Icons (existing), `resources.GetRemote` for RSS fetch.

---

### Task 1: Baseline — confirm current build passes

**Files:**
- (no changes)

- [ ] **Step 1: Run the build**

```bash
hugo build
```

Expected: exits 0, summary line shows pages built, no `ERROR` lines.

- [ ] **Step 2: Note any existing warnings**

```bash
hugo build 2>&1 | grep -i warn
```

Save these mentally — any new warnings after the change are ours to own.

---

### Task 2: Rewrite `layouts/blog/list.html`

**Files:**
- Modify: `layouts/blog/list.html`

This is a full replacement. The existing file has ~61 lines. The new file:

1. Builds a `$combined` slice from Hugo pages + Substack RSS items
2. Sorts by `dateUnix` descending
3. Renders with one `<article>` loop (no pagination)

- [ ] **Step 1: Replace the file with the complete new template**

```html
{{ define "main" }}
{{ $substackURL := .Site.Params.substackURL }}
{{ $feedURL := printf "%s/feed" (strings.TrimSuffix "/" $substackURL) }}

{{/* ── 1. Normalise Hugo blog pages ── */}}
{{ $combined := slice }}
{{ range .Pages }}
  {{ $combined = $combined | append (dict
    "title"       .Title
    "url"         (.Permalink | relURL)
    "date"        .Date
    "dateUnix"    .Date.Unix
    "description" .Description
    "tags"        .Params.tags
    "source"      "blog"
    "readingTime" .ReadingTime
  ) }}
{{ end }}

{{/* ── 2. Fetch and normalise Substack RSS items ── */}}
{{ with try (resources.GetRemote $feedURL) }}
  {{ with .Err }}
    {{ warnf "Could not fetch Substack feed (%s): %s" $feedURL . }}
  {{ else with .Value }}
    {{ $data := . | transform.Unmarshal }}
    {{ $items := slice }}
    {{ if $data.channel }}
      {{ $items = $data.channel.item }}
    {{ else if $data.rss }}
      {{ $items = $data.rss.channel.item }}
    {{ end }}
    {{ $itemList := slice }}
    {{ if reflect.IsSlice $items }}
      {{ $itemList = $items }}
    {{ else if $items }}
      {{ $itemList = slice $items }}
    {{ end }}
    {{ range $itemList }}
      {{ $item := . }}
      {{ $t := time.AsTime (index $item "pubDate") }}
      {{ $combined = $combined | append (dict
        "title"       (index $item "title")
        "url"         (index $item "link")
        "date"        $t
        "dateUnix"    $t.Unix
        "description" (index $item "description")
        "tags"        slice
        "source"      "substack"
        "readingTime" 0
      ) }}
    {{ end }}
  {{ end }}
{{ end }}

{{/* ── 3. Sort by date descending ── */}}
{{ $sorted := sort $combined "dateUnix" "desc" }}

<div class="grid grid-cols-1 md:grid-cols-7 gap-3 py-2 md:items-start">

  {{/* ── Left: profile card ── */}}
  <div class="md:col-span-2 md:sticky md:top-0 md:self-start">
    <div class="bg-warm-100 dark:bg-darker drop-shadow-md p-2 rounded-lg">
      <div class="flex flex-col justify-center">
        {{ partial "profilePhoto" . }}
        <div class="px-2 text-center">{{ partial "social" . }}</div>
      </div>
    </div>
  </div>

  {{/* ── Right: unified post listing ── */}}
  <div class="md:col-span-5 md:sticky md:top-0 md:self-start md:overflow-y-auto post-panel">
    <div class="px-1 sm:px-3">

      <h1 class="!mb-1 pb-2 border-b border-warm-200 dark:border-gray-600">
        <i class="bi bi-journal-text mr-2"></i>Blog
      </h1>

      {{ if eq (len $sorted) 0 }}
      <p class="text-warm-700 dark:text-gray-400 italic mt-4">No posts yet.</p>
      {{ end }}

      {{ range $sorted }}
      {{ $isSubstack := eq (index . "source") "substack" }}
      <article class="mt-6 pb-5 border-b border-warm-200 dark:border-gray-700 last:border-0">

        {{/* Title + optional Substack badge */}}
        {{ if $isSubstack }}
        <a href="{{ index . "url" }}" target="_blank" rel="noopener noreferrer"
           class="text-lg font-semibold text-warm-500 dark:text-gold-300 hover:text-warm-600 dark:hover:text-gold-500 hover:underline leading-snug">
          {{ index . "title" }}
        </a>
        <span class="inline-flex items-center gap-1 text-xs text-warm-500 dark:text-gold-300 border border-warm-200 dark:border-gold-500/30 rounded px-1.5 py-0.5 ml-2 align-middle">
          <i class="bi bi-box-arrow-up-right"></i> Substack
        </span>
        {{ else }}
        <a href="{{ index . "url" }}"
           class="text-lg font-semibold text-warm-500 dark:text-gold-300 hover:text-warm-600 dark:hover:text-gold-500 hover:underline leading-snug">
          {{ index . "title" }}
        </a>
        {{ end }}

        {{/* Date + reading time */}}
        <p class="text-xs text-warm-700 dark:text-gray-400 mt-0.5 mb-2">
          {{ (index . "date").Format "January 2, 2006" }}
          {{ with index . "readingTime" }}{{ if gt . 0 }}&thinsp;·&thinsp;{{ . }} min read{{ end }}{{ end }}
        </p>

        {{/* Description — HTML-stripped + truncated for Substack, raw for blog */}}
        {{ with index . "description" }}
        <p class="text-sm text-warm-700 dark:text-gray-300 mt-0 leading-relaxed">
          {{ if $isSubstack }}{{ . | plainify | truncate 220 "…" }}{{ else }}{{ . }}{{ end }}
        </p>
        {{ end }}

        {{/* Tags (blog only — Substack entries have an empty slice) */}}
        {{ with index . "tags" }}
        <div class="mt-2 flex flex-wrap gap-1">
          {{ range . }}
          <span class="tags">{{ . }}</span>
          {{ end }}
        </div>
        {{ end }}

      </article>
      {{ end }}

    </div>
  </div>

</div>
{{ end }}
```

- [ ] **Step 2: Run the build**

```bash
hugo build 2>&1
```

Expected: exits 0, no `ERROR` lines. A warning about the Substack feed is acceptable if there is a transient network issue — the build must still succeed.

- [ ] **Step 3: Start the dev server and spot-check the blog list**

```bash
hugo server
```

Open `http://localhost:1313/blog/` and verify:

- Local posts appear with their titles, dates, reading times, and tags
- Substack posts appear with the "↗ Substack" badge and open externally
- Posts are ordered newest-first across both sources
- No pagination controls visible

- [ ] **Step 4: Stop the dev server (`Ctrl-C`)**

---

### Task 3: Commit

**Files:**
- Modify: `layouts/blog/list.html`

- [ ] **Step 1: Stage and commit**

```bash
git add layouts/blog/list.html
git commit -m "feat: mix Substack RSS feed into blog list, sorted by date"
```

Expected: commit created, one file changed.
