# 20 – Deployment (Static, Free)

## Build
```bash
npm install
npm run build        # outputs /dist
npm run preview      # test production build locally
```

## SPA fallback (needed for BrowserRouter)
| Host | How |
|---|---|
| **Netlify** | `public/_redirects`: `/*  /index.html  200` |
| **Vercel** | `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` |
| **Cloudflare Pages** | Automatic SPA mode, or `_redirects` as Netlify |
| **GitHub Pages** | Use `HashRouter`, or copy `index.html` to `404.html`; set Vite `base: "/repo-name/"` |

If using pre-rendering (docs/16), each route has its own HTML file and no fallback is needed.

## Headers (Netlify `_headers` / Vercel config)
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```
Add a Content-Security-Policy that allows only `'self'` for scripts/styles/images/fonts (no third parties are needed).

## Steps
1. Push to GitHub.
2. Connect the repo to Netlify/Vercel/Cloudflare Pages (build command `npm run build`, output `dist`).
3. Add custom domain + HTTPS (automatic).
4. Update `sitemap.xml`, `robots.txt`, canonical URLs and JSON-LD with the real domain.
5. Submit sitemap in Google Search Console.

## Environment
No environment variables or secrets are required. Never commit API keys (there should be none).
