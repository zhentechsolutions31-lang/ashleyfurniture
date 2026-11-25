# Furniture Store Frontend – Specification Pack

A complete set of Markdown specs to build a **frontend-only furniture e-commerce site** (no backend, no database, no API) with the same structure and UX patterns as a large furniture retailer, a **new professional colour theme**, and a **working Add to Cart** saved in the browser.

> Brand name used in these docs is a placeholder: **Haven & Oak**. Rename it anywhere.

## How to use
1. Put this folder in the root of a new project.
2. Open it with an AI coding agent (Claude Code, Cursor, Copilot, etc.).
3. Paste the prompt from `docs/00-master-ai-prompt.md`.
4. Let the agent follow `docs/22-build-roadmap.md` phase by phase.

## File index
| File | Purpose |
|---|---|
| `AGENTS.md` | Short rules the coding agent must always follow |
| `docs/00-master-ai-prompt.md` | One paste-ready prompt to start the build |
| `docs/01-project-overview.md` | Goals, scope, tech stack, constraints |
| `docs/02-reference-site-analysis.md` | Page/section structure being replicated |
| `docs/03-design-system-colors-typography.md` | Colour theme, fonts, spacing, tokens |
| `docs/04-folder-structure.md` | Project tree and file responsibilities |
| `docs/05-pages-and-routing.md` | Every route and what it shows |
| `docs/06-layout-header-footer.md` | Announcement bar, header, mega menu, footer |
| `docs/07-homepage-sections.md` | Homepage sections top to bottom |
| `docs/08-product-listing-filters.md` | Category pages, filters, sort, pagination |
| `docs/09-product-detail-page.md` | Product page layout and behaviour |
| `docs/10-add-to-cart-logic.md` | Cart state, localStorage, totals (with code) |
| `docs/11-cart-drawer-and-page.md` | Mini-cart drawer and full cart page |
| `docs/12-checkout-mock.md` | Fake checkout, order confirmation |
| `docs/13-data-model-and-sample-data.md` | JSON schema and sample products |
| `docs/14-images-and-assets.md` | Images, icons, placeholders, licensing |
| `docs/15-responsive-and-accessibility.md` | Breakpoints and WCAG rules |
| `docs/16-seo-google-recommendations.md` | Google-friendly SEO, schema, vitals |
| `docs/17-performance.md` | Speed budget and techniques |
| `docs/18-animations-and-interactions.md` | Motion and micro-interactions |
| `docs/19-testing-qa-checklist.md` | Manual and automated test checklist |
| `docs/20-deployment.md` | Free static hosting steps |
| `docs/21-legal-and-branding-notes.md` | What not to copy |
| `docs/22-build-roadmap.md` | Ordered milestones |

## Important note on "exact same"
Replicate the **layout, structure and UX patterns**. Do **not** copy the original company's logo, brand name, photos, product text or code. Use your own brand, placeholder or licensed images, and original copy. See `docs/21-legal-and-branding-notes.md`.
