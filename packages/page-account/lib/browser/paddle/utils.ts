import { type PaddleEventData, type PaddlePrice } from "./paddle.ts";
import { type TCheckoutResult, type TPrice } from "./types.ts";

export function convertCheckout({
  checkout,
  product,
  user,
}: PaddleEventData): TCheckoutResult {
  return {
    checkout: {
      id: checkout.id,
      createdAt: parseDate(checkout.created_at),
      completed: checkout.completed,
      customerPrice: convertPrice(checkout.prices.customer),
      vendorPrice: convertPrice(checkout.prices.vendor),
      couponCode: checkout.coupon.coupon_code,
      passthrough: checkout.passthrough,
      redirectUrl: checkout.redirect_url,
    },
    product: {
      id: product.id,
      name: product.name,
      quantity: product.quantity,
    },
    user: {
      id: user.id,
      email: user.email,
      country: user.country,
    },
  };
}

function convertPrice({
  currency,
  unit,
  unit_tax,
  total,
  total_tax,
}: PaddlePrice): TPrice {
  return {
    currency: currency,
    unit: unit,
    unitTax: unit_tax,
    total: total,
    totalTax: total_tax,
  };
}

function parseDate(s: string): Date {
  const m = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/.exec(s);
  if (m != null) {
    return new Date(
      Date.UTC(
        parseInt(m[1], 10),
        parseInt(m[2], 10) - 1,
        parseInt(m[3], 10),
        parseInt(m[4], 10),
        parseInt(m[5], 10),
        parseInt(m[6], 10),
      ),
    );
  } else {
    return new Date();
  }
}
