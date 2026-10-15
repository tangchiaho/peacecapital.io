# Peace Capital Website

Official static website for **Peace Capital（和平資本）**.

- Domain: https://peacecapital.io
- Hosting: GitHub Pages
- Brand: Classic Institution (Cormorant Garamond wordmark)

## Pages

| Path | Page |
|------|------|
| `/` | Home |
| `/about/` | About |
| `/focus/` | Focus |
| `/contact/` | Contact |
| `/insights/` | Industry research library |
| `/insights/{slug}/` | Research article |

## Research publishing

Long-term Insights architecture (SEO / taxonomy / template / topic pipeline):

- Plan: `docs/research-publishing/architecture.md`
- Topic backlog: `docs/research-publishing/topics-batch-1.md`
- Search Console checklist: `docs/research-publishing/google-search-console.md`
- Reusable article template: `templates/research-article/` (`noindex`, not in sitemap)

Publishing flow: copy template → fill content & JSON-LD → list on `/insights/` → add to `sitemap.xml`. Create `/insights/topics/{topic}/` only after ≥2 published articles in that topic.

## Brand assets

- Live wordmark: HTML/CSS lockup in header & footer
- Source assets: `assets/brand/classic/`
- Root favicon / apple-touch / `assets/img/og-image.png`

## Stack

- HTML / CSS / light vanilla JS
- No build step
