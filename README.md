# Personal Portfolio Website

A lightweight, responsive portfolio website designed for easy deployment to GitHub Pages. Built with clean HTML, CSS, and JavaScript - no frameworks or build tools required.

## Features

- ✨ **Minimal & Clean Design** - Professional, typography-focused layout
- 🌓 **Dark/Light Theme** - Toggle between themes with persistent preference
- 📱 **Fully Responsive** - Optimized for all screen sizes (mobile, tablet, desktop)
- ⚡ **Fast Loading** - No external dependencies, pure vanilla JavaScript
- 🎨 **Smooth Animations** - Subtle scroll animations and transitions
- 📝 **Easy to Update** - Modular structure for quick content updates

## Project Structure

```
portfolio-site/
├── index.html          # Main HTML file with content
├── css/
│   └── style.css       # All styles and responsive design
├── js/
│   └── main.js         # Interactive features and animations
├── deploy.sh           # Automated deployment script
└── README.md           # This file
```

## Quick Start

### 1. Customize Your Content

Edit `index.html` to update:
- Your name and title
- About section
- Skills and competencies
- Professional experience
- Education and publications
- Contact information
- Social media links

### 2. Preview Locally

Simply open `index.html` in your web browser to preview your changes.

Alternatively, use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Deployment to GitHub Pages

### Option 1: Automated Deployment (Recommended)

1. Create a new repository on GitHub (e.g., `my-portfolio`)

2. Run the deployment script:
```bash
cd portfolio-site
./deploy.sh
```

3. Follow the prompts to enter your GitHub repository URL

4. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click **Settings** > **Pages**
   - Under **Source**, select the `main` branch
   - Select **/ (root)** as the folder
   - Click **Save**

5. Your site will be live at: `https://navid.heydari.github.io/navidheydari/`

### Option 2: Manual Deployment

1. Create a new repository on GitHub

2. Initialize git and push your code:
```bash
cd portfolio-site
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/NavidHeydari/navidheydari.git
git push -u origin main
```

3. Enable GitHub Pages (same as Option 1, step 4)

## Updating Your Portfolio

### Updating Content

1. Edit `index.html` with your new content
2. Test locally by opening the file in a browser
3. Deploy changes:
```bash
./deploy.sh
```

### Customizing Styles

1. Edit `css/style.css` to modify:
   - Colors and theme
   - Typography and fonts
   - Spacing and layout
   - Animations and transitions

2. Test and deploy:
```bash
./deploy.sh
```

### Adding New Features

1. Edit `js/main.js` to add interactivity
2. Test thoroughly in different browsers
3. Deploy when ready

## Content Update Guide

### Adding New Experience

In `index.html`, find the `#experience` section and add:

```html
<div class="timeline-item">
    <h3>Job Title</h3>
    <h4>Company Name, Location • Start Date — End Date</h4>
    <p>Brief description of your role and achievements.</p>
    <ul>
        <li>Key achievement or responsibility</li>
        <li>Another important contribution</li>
    </ul>
</div>
```

### Adding New Skills

In the `#skills` section:

```html
<div class="skill-item">
    <span class="skill-icon">🎯</span>
    <h3>Skill Category</h3>
    <p>List of technologies, tools, or expertise</p>
</div>
```

### Updating Social Links

In the `<footer>` section:

```html
<div class="social-links">
    <a href="https://linkedin.com/in/navidheydari" target="_blank">LinkedIn</a>
    <a href="https://github.com/navidheydari" target="_blank">GitHub</a>
    <a href="mailto:your.email@example.com">Email</a>
</div>
```

## Customization Tips

### Changing Theme Colors

Edit `css/style.css`:

```css
/* Light theme */
body {
    background: #fafafa;  /* Change background */
    color: #333;           /* Change text color */
}

/* Dark theme */
body.dark-theme {
    background: #121212;  /* Change dark background */
    color: #e0e0e0;       /* Change dark text color */
}
```

### Changing Fonts

Add to the `<head>` section in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400&display=swap" rel="stylesheet">
```

Then update in `css/style.css`:

```css
body {
    font-family: 'Your Font', serif;
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- 🚀 No external dependencies
- 📦 Total size: ~50KB (HTML + CSS + JS)
- ⚡ Loads in under 1 second on average connection
- 🎯 Optimized for Core Web Vitals

## Troubleshooting

### Site not updating after deployment?
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- GitHub Pages can take 1-2 minutes to reflect changes

### Animations not working?
- Check browser console for JavaScript errors
- Ensure `js/main.js` is properly linked in `index.html`

### Responsive design issues?
- Test with browser DevTools responsive mode
- Check for overriding CSS in `style.css`

## Contributing

This is a personal portfolio template. Feel free to:
- Fork and customize for your own use
- Submit issues for bugs
- Suggest improvements

## License

Free to use for personal and commercial projects. No attribution required.

## Support

For questions or issues:
1. Check the Troubleshooting section
2. Review the code comments in each file
3. Create an issue on GitHub

---

**Made with ❤️ for developers who want a simple, fast portfolio Structure - Navid Heydari**
