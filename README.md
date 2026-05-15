# Navid Heydari — Personal Portfolio

Personal portfolio website built with [Hugo](https://gohugo.io/). Features a clean accordion-style layout with dark/light theme support, powered by Tailwind CSS v4.

## Tech Stack

- **Hugo extended** v0.160.1 — static site generator
- **Tailwind CSS** v4.2.2 — utility-first CSS framework
- **@tailwindcss/typography** v0.5.19 — prose styling for content pages
- **Bootstrap Icons** v1.13.1 — icon set (CDN)
- **GitHub Pages** — hosting via GitHub Actions

## Project Structure

```
navidheydari.github.io/
├── config.yaml                     # Hugo site configuration and accordion settings
├── package.json                    # npm dependencies (Tailwind CSS)
├── package-lock.json               # locked dependency versions
├── tailwind.config.js              # Tailwind CSS configuration
├── assets/
│   └── main.css                    # Tailwind CSS entry point + custom gold theme tokens
├── content/
│   └── _index.md                   # Homepage metadata
├── data/
│   ├── profile.json                # Name, tagline, location, photo
│   ├── about_me.json               # About section text
│   ├── social.json                 # Social media links
│   ├── experiences.json            # Work experience entries
│   ├── education.json              # Education entries
│   ├── skills.json                 # Skills with proficiency ratings
│   └── publications.json           # Academic publications
├── layouts/
│   ├── index.html                  # Homepage (two-column: profile + accordion)
│   ├── 404.html                    # 404 page
│   ├── _default/
│   │   ├── baseof.html             # Base HTML shell
│   │   ├── single.html             # Blog post template
│   │   ├── list.html               # Blog/tag/category list template
│   │   └── search.html             # Search results page
│   ├── partials/
│   │   ├── head.html               # <head> with CSS, fonts, inline JS
│   │   ├── header.html             # Top navigation bar
│   │   ├── footer.html             # Footer with copyright
│   │   ├── social.html             # Social links from data/social.json
│   │   ├── profilePhoto.html       # Profile image
│   │   ├── metadata.html           # Post date, reading time, tags
│   │   ├── prevnext.html           # Previous/Next post navigation
│   │   ├── toggleTheme.html        # Dark/light theme toggle logic
│   │   └── accordion/
│   │       ├── about_me.html
│   │       ├── experiences.html
│   │       ├── education.html
│   │       ├── skills.html
│   │       ├── publications.html
│   │       ├── projects.html
│   │       └── hobbies.html
│   └── shortcodes/
│       ├── figure.html             # Enhanced image/figure shortcode
│       └── raw_html.html           # Raw HTML embed shortcode
├── static/
│   ├── favicon.ico
│   └── images/
│       └── profile_pic.jpg         # Profile photo
└── .github/
    └── workflows/
        └── deploy.yml              # GitHub Actions — build & deploy to Pages
```

## Local Development

### Prerequisites

- Hugo extended v0.160.1+ — [install guide](https://gohugo.io/installation/)
- Node.js v22 / npm

### Setup

```bash
git clone https://github.com/NavidHeydari/navidheydari.github.io.git
cd navidheydari.github.io

# Install Tailwind CSS dependencies
npm install
```

### Run locally

```bash
hugo server
```

Open `http://localhost:1313/` in your browser. The server watches all files and live-reloads on change.

## Updating Content

All portfolio content is driven by JSON files in `data/` — no template editing needed for content changes.

| File | What it controls |
|---|---|
| `data/profile.json` | Name, tagline, location, profile photo filename |
| `data/about_me.json` | About Me section description |
| `data/social.json` | Social/contact links (LinkedIn, GitHub, etc.) |
| `data/experiences.json` | Work experience entries |
| `data/education.json` | Education history |
| `data/skills.json` | Skills with proficiency ratings (0–100) |
| `data/publications.json` | Academic publications |

### Accordion sections

Which sections appear and in what order is controlled by `config.yaml` under `params.accordion`:

```yaml
params:
  accordion:
    - item: about_me
      expand: true   # expanded by default
    - item: experiences
    - item: education
    - item: publications
    - item: skills
      panel_id: skill-panel
```

Available section names: `about_me`, `experiences`, `education`, `publications`, `skills`, `projects`, `hobbies`.

### Theme (dark/light)

Default theme is set in `config.yaml` via `params.theme.mainTheme: dark`. Users can toggle with the sun/moon icon in the header. The preference is saved to `localStorage`.

### Colour scheme

The accent colour in dark mode is gold, defined as CSS custom properties in `assets/main.css`:

```css
@theme {
  --color-gold-300: #D4AF37;   /* primary accent — links, borders, icons */
  --color-gold-500: #B8860B;   /* hover/secondary — accordion text, skill bars */
}
```

## Deployment

The site deploys automatically to GitHub Pages when a commit is pushed to the `main` branch. The workflow (`.github/workflows/deploy.yml`) installs Hugo extended and npm dependencies before building.

To trigger a manual deploy, use the **Run workflow** button in the GitHub Actions tab.

TODO: add the embedding links and sections for certificates : embed this <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="a227b802-e445-45d4-b64b-0e44fc4b698f" data-share-badge-host="https://www.credly.com"></div><script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script> 
