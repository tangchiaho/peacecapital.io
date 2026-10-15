# Peace Capital Website

Official static website for **Peace Capital（和平資本）**.

- Domain: https://peacecapital.io
- Hosting: GitHub Pages (`legacy` / Jekyll build from repository root)
- Brand: Classic Institution (Cormorant Garamond wordmark)

## Pages

| Path | Page |
|------|------|
| `/` | Home |
| `/about/` | About |
| `/focus/` | Focus |
| `/contact/` | Contact |
| `/insights/` | Industry research index |
| `/insights/{slug}/` | Research article |

## Research publishing (source-only)

Internal ops materials live under `_research/` so GitHub Pages / Jekyll **does not deploy** them:

| Path | Purpose |
|------|---------|
| `_research/publishing/architecture.md` | Site structure & taxonomy rules |
| `_research/publishing/topics-batch-1.md` | Topic backlog (12 briefs) |
| `_research/publishing/google-search-console.md` | Manual GSC checklist |
| `_research/article-template/` | Reusable article HTML template |

Also listed in `_config.yml` `exclude`. Public GitHub source remains visible; use a private repo if these files must stay confidential.

Publishing flow: copy `_research/article-template/` → `insights/{slug}/` → list on `/insights/` → add to `sitemap.xml`. Create `/insights/topics/{topic}/` only after ≥2 published articles in that topic.

## Brand assets

- Live wordmark: HTML/CSS lockup in header & footer
- Source assets: `assets/brand/classic/`
- Root favicon / apple-touch / `assets/img/og-image.png`

## Stack

- HTML / CSS / light vanilla JS
- GitHub Pages Jekyll pipeline (no CMS theme)
