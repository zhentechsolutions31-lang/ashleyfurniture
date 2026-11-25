# 18 – Animations and Micro-interactions

Keep motion subtle and fast (150–300 ms, `cubic-bezier(.2,.8,.2,1)`). All motion disabled under `prefers-reduced-motion: reduce`.

| Element | Interaction |
|---|---|
| Header | Shadow fades in after scroll; shrinks 72 → 60 px |
| Mega menu | Fade + translateY(8px → 0), 150 ms |
| Product card | Hover: lift (translateY -2px) + shadow-md; image swaps to 2nd photo with 200 ms cross-fade |
| Wishlist heart | Scale pop (1 → 1.25 → 1) + fill colour |
| Add to Cart button | Label morphs to "Added ✓" with check icon; subtle background flash to success colour |
| Cart badge | Pulse (scale 1.3 → 1) on count change |
| Cart drawer | Slide from right 250 ms; overlay fade 200 ms |
| Line removal | Height collapse 200 ms + Undo toast |
| Carousels | Snap scrolling, momentum swipe; arrows fade on hover |
| Skeletons | Shimmer on `surface` → `line` gradient |
| Accordion | Height animation 200 ms, chevron rotates 180° |
| Toasts | Slide + fade in/out |
| Page transitions | None (avoid hurting INP); scroll to top instantly |
| Buttons | Press: scale .98 |

## Rules
- Animate only `transform` and `opacity`.
- No auto-playing video with sound; hero video optional, muted, with pause control.
- No parallax on mobile.
