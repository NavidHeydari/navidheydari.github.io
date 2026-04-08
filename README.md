# Navid Heydari — Personal Portfolio

Personal portfolio website built with [Hugo](https://gohugo.io/) and the [aafu](https://github.com/darshanbaral/aafu) theme. Features a clean accordion-style layout with dark/light theme support, powered by Tailwind CSS.

## Tech Stack

- **Hugo** — static site generator (v0.145+)
- **aafu theme** — accordion portfolio theme with Tailwind CSS
- **GitHub Pages** — hosting

## Project Structure

```
navidheydari.github.io/
├── config.yaml             # Hugo site configuration and theme settings
├── package.json            # npm dependencies (Tailwind CSS)
├── tailwind.config.js      # Tailwind CSS configuration
├── assets/
│   └── main.css            # Tailwind CSS entry point
├── content/
│   └── _index.md           # Homepage content
├── data/
│   ├── profile.json        # Name, tagline, location, photo
│   ├── about_me.json       # About section text
│   ├── social.json         # Social media links
│   ├── experiences.json    # Work experience entries
│   ├── education.json      # Education entries
│   └── skills.json         # Skills with ratings
├── static/
│   └── profile_pic.jpg     # Profile photo
├── themes/
│   └── aafu/               # aafu theme (git submodule)
└── deploy.sh               # GitHub Pages deployment script
```

## Local Development

### Prerequisites

- Hugo extended v0.145+ — [install guide](https://gohugo.io/installation/)
- Node.js / npm

### Setup

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/NavidHeydari/navidheydari.github.io.git
cd navidheydari.github.io

# Install npm dependencies (Tailwind CSS)
npm install
```

### Run locally

```bash
hugo server --config config.yaml
```

Then open `http://localhost:1313/` in your browser.

## Updating Content

All content is driven by JSON files in the `data/` directory — no template editing required.

| File | What it controls |
|---|---|
| `data/profile.json` | Name, tagline, location, profile photo |
| `data/about_me.json` | About Me section description |
| `data/social.json` | Social/contact links (LinkedIn, GitHub, etc.) |
| `data/experiences.json` | Work experience list |
| `data/education.json` | Education list |
| `data/skills.json` | Skills with proficiency ratings |

### Accordion sections

Sections and their display order are configured in `config.yaml` under `params.accordion`. To add, remove, or reorder sections, edit that list.

## Deployment

The site deploys automatically to GitHub Pages via the `deploy.sh` script:

```bash
./deploy.sh
```

Or push to the `main` branch and let GitHub Pages serve the built output.

## Theme

This site uses the [aafu](https://github.com/darshanbaral/aafu) theme by Darshan Baral (MIT license), added as a git submodule at `themes/aafu`.
