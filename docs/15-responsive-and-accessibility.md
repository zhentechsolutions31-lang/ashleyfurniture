# 15 – Responsive Design and Accessibility

## Breakpoints (Tailwind)
| Name | Min width | Layout |
|---|---|---|
| base | 0 | 1 column, mobile menu, bottom-sheet filters |
| `sm` | 640 | 2-column product grid |
| `md` | 768 | 3-column grid, tablet header |
| `lg` | 1024 | Desktop header + mega menu, sidebar filters |
| `xl` | 1280 | 4-column grid, container max 1280 |

Design mobile-first. Test at 360, 390, 768, 1024, 1280, 1536 px.

## Touch targets
Minimum 44×44 px for all buttons/links on touch devices (WCAG 2.2 target size ≥ 24 px; aim higher).

## Accessibility (WCAG 2.2 AA)
- Semantic landmarks: `header`, `nav`, `main`, `footer`, `aside`.
- "Skip to main content" link as first focusable element.
- One `<h1>` per page; heading levels do not skip.
- Visible focus indicator (3 px ring, 2 px offset) on all interactive elements; never `outline: none` without replacement.
- Keyboard: all menus, carousels, drawers, modals, filters, quantity steppers work with keyboard only.
- Modals/drawers: focus trap, Esc to close, return focus, `aria-modal`.
- Carousels: prev/next buttons with labels, pause control for autoplay, `aria-roledescription="carousel"`.
- Forms: visible labels, `aria-invalid`, error text linked with `aria-describedby`, `autocomplete` attributes.
- Colour is never the only signal (swatches also have text labels; errors have icons + text).
- Live regions: cart updates, filter result count ("24 products found") use `aria-live="polite"`.
- Respect `prefers-reduced-motion` and `prefers-contrast`.
- Zoom to 200 % without loss of content; text resizable; no horizontal scroll at 320 px.
- Images: meaningful `alt`; decorative `alt=""`.
- Link text descriptive ("View Harlow sofa", not "Click here").
- Language: `<html lang="en">`.

## Tools to verify
axe DevTools, Lighthouse, WAVE, keyboard-only pass, VoiceOver/NVDA spot-check.
