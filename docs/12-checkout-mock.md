# 12 – Checkout (Mock, No Backend)

> No real payment. Never collect real card numbers. Show a clear "Demo store – no real orders are placed" banner on this page.

## Layout
Single page, two columns (form 60 % | summary 40 %), steps as collapsible sections:
1. **Contact:** email, phone (optional)
2. **Delivery:** name, address line 1/2, city, state, ZIP, delivery method (Standard delivery / Store pickup)
3. **Payment (demo):** radio list — "Pay on delivery (demo)" and "Demo card". The demo card shows a notice instead of real inputs, or accepts the test number `4242 4242 4242 4242` shown on screen and **does not store it**.
4. **Review:** list of items and totals, "Place Order" button.

## Validation
- Email regex, required fields, ZIP 5 digits, phone 10 digits, inline errors with `aria-describedby`, focus first invalid field on submit.
- Use `<form noValidate>` and custom messages.

## On "Place Order"
1. Generate `orderId` = `HO-` + 8 random uppercase alphanumerics.
2. Save order object to `localStorage` key `ho-orders-v1` (array, newest first): items, totals, delivery details (no payment info), createdAt ISO date, status "Confirmed".
3. Clear the cart.
4. Navigate to `/order/:orderId`.

## Order confirmation page
- Success icon, "Thank you, {firstName}!", order number, email notice (text only: "A confirmation would be sent to …").
- Items list, totals, delivery address, estimated delivery date.
- Buttons: "Continue shopping", "Print order" (`window.print()` with print stylesheet).
- If order id not found → NotFoundPage.

## Order history (optional)
`/orders` lists saved orders; "Reorder" re-adds items to the cart.

## Privacy
Only store what is needed for the demo; provide a "Clear my demo data" button on the footer/privacy page that removes all `ho-*` keys.
