export const formatPrice = (
  cents: number,
  locale = "en-US",
  currency = "USD",
) => new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);

export const formatPriceRange = (min: number, max: number) =>
  `${formatPrice(min)} – ${formatPrice(max)}`;

export const savingsPercent = (price: number, originalPrice?: number) =>
  originalPrice && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;
