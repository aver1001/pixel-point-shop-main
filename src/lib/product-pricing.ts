export const normalizeDiscountPercent = (discountPercent?: number) => {
  if (!discountPercent || discountPercent <= 0) {
    return 0;
  }

  return Math.min(100, Math.round(discountPercent));
};

export const getOriginalPriceFromDiscount = (price: number, discountPercent?: number) => {
  const normalizedDiscount = normalizeDiscountPercent(discountPercent);

  if (normalizedDiscount <= 0 || normalizedDiscount >= 100) {
    return null;
  }

  return Math.round(price / (1 - normalizedDiscount / 100));
};

export const getSalePriceFromDiscount = (price: number, discountPercent?: number) => {
  const normalizedDiscount = normalizeDiscountPercent(discountPercent);

  if (normalizedDiscount <= 0) {
    return price;
  }

  if (normalizedDiscount >= 100) {
    return 0;
  }

  return Math.round(price * (1 - normalizedDiscount / 100));
};
