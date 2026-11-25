# 03 – Design System: Colours, Typography, Spacing

## Theme concept
"Forest & Linen": deep forest green for trust and premium feel, warm ivory surfaces for a home/furniture mood, terracotta accent for sales and calls to attention. Replaces the original retailer's palette so the site has its own identity.

All pairs below were checked for WCAG contrast.

## Colour tokens
| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#1F4D3F` | Primary buttons, links, active states |
| `--color-primary-hover` | `#163A2F` | Hover/pressed |
| `--color-accent` | `#B84A23` | Sale price, badges, key highlights |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F7F4EF` | Alternate sections, cards, inputs |
| `--color-border` | `#E5DFD5` | Dividers, card borders |
| `--color-text` | `#1C1917` | Body and headings |
| `--color-text-muted` | `#5C554D` | Secondary text |
| `--color-footer` | `#14231D` | Footer background |
| `--color-footer-text` | `#CFE0D8` | Footer text |
| `--color-gold` | `#E8C27A` | Premium "Luxe" badge background |
| `--color-success` | `#1E7B4B` | Confirmation |
| `--color-danger` | `#B42318` | Errors |
| `--color-warning-bg` / `-text` | `#FFF4D6` / `#8A5A00` | Notices |

## Verified contrast ratios
| Combination | Ratio | Result |
|---|---|---|
| Text on white | 17.49 | AAA |
| Muted text on white | 7.34 | AAA |
| Muted text on surface | 6.69 | AA |
| White on primary | 9.58 | AAA |
| White on primary-hover | 12.5 | AAA |
| White on accent | 5.2 | AA |
| Accent on white | 5.2 | AA |
| Accent on surface | 4.74 | AA |
| Footer text on footer bg | 11.89 | AAA |
| Text on gold | 10.35 | AAA |

## CSS variables (`src/index.css`)
```css
:root {
  --color-primary: #1F4D3F;
  --color-primary-hover: #163A2F;
  --color-accent: #B84A23;
  --color-bg: #FFFFFF;
  --color-surface: #F7F4EF;
  --color-border: #E5DFD5;
  --color-text: #1C1917;
  --color-text-muted: #5C554D;
  --color-footer: #14231D;
  --color-footer-text: #CFE0D8;
  --color-gold: #E8C27A;
  --color-success: #1E7B4B;
  --color-danger: #B42318;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 2px rgba(28,25,23,.06);
  --shadow-md: 0 6px 20px rgba(28,25,23,.10);
  --shadow-lg: 0 16px 40px rgba(28,25,23,.16);
}
```

## Tailwind config (`tailwind.config.js`)
```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        primary: { DEFAULT: "var(--color-primary)", hover: "var(--color-primary-hover)" },
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        line: "var(--color-border)",
        ink: { DEFAULT: "var(--color-text)", muted: "var(--color-text-muted)" },
        footer: { DEFAULT: "var(--color-footer)", text: "var(--color-footer-text)" },
        gold: "var(--color-gold)",
        success: "var(--color-success)",
        danger: "var(--color-danger)"
      },
      fontFamily: {
        heading: ["'Playfair Display'", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: { sm: "6px", md: "10px", lg: "16px" }
    }
  }
};
```

## Typography
| Role | Font | Weight | Size (desktop / mobile) |
|---|---|---|---|
| H1 | Playfair Display | 700 | 44 / 30 px |
| H2 | Playfair Display | 600 | 32 / 24 px |
| H3 | Inter | 600 | 20 / 18 px |
| Body | Inter | 400 | 16 / 16 px |
| Small | Inter | 400 | 14 px |
| Price | Inter | 700 | 20 px (card), 28 px (PDP) |
| Button | Inter | 600 | 15 px, uppercase off |

- Load fonts with `font-display: swap`, **self-host** (e.g. `@fontsource/inter`, `@fontsource/playfair-display`) to avoid third-party requests.
- Line height: body 1.6, headings 1.2.

## Spacing and layout
- Base unit 4 px; use Tailwind scale (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Container max width 1280 px, side padding 16 px (mobile) / 24 px (desktop).
- Section vertical padding: 48 px mobile, 80 px desktop.
- Grid: 12 columns desktop; product grid 2 cols (mobile), 3 (tablet), 4 (desktop).

## Components style rules
- **Primary button:** bg primary, white text, radius 6, height 48, hover primary-hover, focus ring 3 px `rgba(31,77,63,.35)` + 2 px offset.
- **Secondary button:** white bg, 1.5 px primary border, primary text.
- **Accent button:** only for "Add to Cart" on sale items if desired; default is primary.
- **Cards:** white, 1 px border `line`, radius 10, shadow-sm; hover shadow-md.
- **Badges:** radius 4, 11 px uppercase, letter-spacing .06em. "Exclusive" = primary bg/white text. "Luxe" = gold bg/ink text. "Sale" = accent bg/white text.
- **Inputs:** 48 px height, 1 px border `line`, radius 6, focus border primary.
- **Price:** sale price in accent, original price muted with line-through.

## Dark mode
Not required. Optional later via `prefers-color-scheme` by redefining variables.
