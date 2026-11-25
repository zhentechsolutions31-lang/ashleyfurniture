# 11 – Cart Drawer and Cart Page

## Mini-cart drawer (`CartDrawer.tsx`)
- Slides in from the right, width 420 px (100 % on mobile), overlay `rgba(20,35,29,.5)`.
- Opens automatically after Add to Cart and when the header cart icon is clicked.
- **Header:** "Your Cart (n)" + close button.
- **Body (scrollable):** `CartLineItem` list.
- **Footer (sticky):** subtotal, "Shipping & taxes calculated at checkout", buttons: **Checkout** (primary) and **View Cart** (secondary).
- **Free-shipping progress bar:** "You're $240 away from free delivery" (primary fill on `line` track).
- **Empty state:** illustration, "Your cart is empty", button "Continue shopping", and 3 suggested products.
- Accessibility: `role="dialog" aria-modal="true" aria-labelledby`, focus trap, Esc closes, restore focus to the trigger, body scroll lock.
- Animation: translateX 250 ms ease-out (disabled for reduced motion).

## CartLineItem
```
[img 88px] Title (link to PDP)             [🗑 Remove]
           Variant label
           [ − 2 + ]                       $1,299.99
           Save for later (moves to wishlist)
```
- Quantity stepper with `aria-label`s ("Decrease quantity of Harlow sofa").
- Line total = unitPrice × qty.
- Remove shows an "Undo" toast for 5 s (restores item).

## Cart page (`/cart`)
Two columns on desktop: items (65 %) + sticky order summary (35 %).
- Page title "Shopping Cart (n items)".
- Optional "Clear cart" link with confirm modal.
- **OrderSummary:** subtotal, discount (with promo label), shipping, estimated tax, **total** (bold, 24 px).
- **PromoCodeForm:** input + Apply; shows applied code chip with remove (×).
- **Trust row:** secure checkout, easy returns icons.
- **Financing estimate:** "As low as $X/mo" = total / 24, demo disclaimer.
- Below: "You may also like" carousel.
- Empty cart state same as drawer but full-page.

## Header badge
- Shows `count` (sum of qty), hides at 0, shows "9+" above 9.
- `aria-live="polite"` visually hidden text announces changes.

## Toasts
Position bottom-center (mobile) / top-right (desktop), auto-dismiss 4 s, `role="status"`.
