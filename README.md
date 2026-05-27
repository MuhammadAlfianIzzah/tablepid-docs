# TablePID Landing Page

Modern landing page for TablePID database client.

## Structure

```
web/
├── index.html          # Main landing page
├── styles/
│   └── main.css        # All styles
├── js/
│   └── app.js          # Animations & interactions
├── assets/
│   └── screenshots/    # Screenshot images
├── robots.txt          # SEO
└── README.md           # This file
```

## Deployment

### GitHub Pages

1. Push this folder to a `gh-pages` branch
2. Enable GitHub Pages in repo settings
3. Set source to `gh-pages` branch

### Manual

Upload all files to any static hosting:
- Netlify
- Vercel
- Cloudflare Pages
- Any web server

## Customization

### Colors

Edit CSS variables in `styles/main.css`:

```css
:root {
  --accent: #8b5cf6;        /* Purple */
  --neon-blue: #3b82f6;     /* Blue */
  --neon-green: #22d3ee;    /* Cyan */
}
```

### Content

Edit `index.html` directly. All content is in the HTML file.

### Screenshots

Add images to `assets/screenshots/` and update the HTML.

## Performance

- No build step required
- Pure HTML/CSS/JS
- Minimal dependencies (just Google Fonts)
- Optimized for Core Web Vitals

## License

Proprietary. See main project LICENSE.
