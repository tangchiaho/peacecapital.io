# Peace Capital Website

Official static website for **Peace Capital（和平資本）**.

- Domain: https://peacecapital.io
- Hosting: GitHub Pages

## Site map

| Path | Page |
|------|------|
| `/` | Home |
| `/about/` | About — philosophy, method, background, founder |
| `/focus/` | Investment focus areas |
| `/insights/` | Research insights index |
| `/insights/<slug>/` | Individual insight articles |
| `/contact/` | Contact |

## Stack

- HTML / CSS / light vanilla JS
- No build step

## Adding an Insight article

1. Create `/insights/<slug>/index.html` using an existing article as template.
2. Add the article entry to `/insights/index.html` (and homepage preview if desired).
3. Add the URL to `sitemap.xml`.
4. Include category, author, `datetime`, canonical URL, Open Graph, and Article JSON-LD.

## Design notes

Preserve existing brand tokens in `assets/css/style.css`:

- Background `#f6f5f0`
- Accent `#c8a96e`
- Typography: DM Serif Display + DM Sans
- Logos in `assets/logo/`
