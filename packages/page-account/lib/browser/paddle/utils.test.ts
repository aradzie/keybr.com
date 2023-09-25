import test from "ava";
import { convertCheckout } from "./utils.ts";

test("convert", (t) => {
  t.deepEqual(
    convertCheckout({
      checkout: {
        id: "76923558-chre93b18616ac3-735f3d3b81",
        created_at: "2001-02-03 04:05:06",
        completed: true,
        coupon: {
          coupon_code: null,
        },
        passthrough: "extra",
        prices: {
          customer: {
            currency: "USD",
            unit: "4.58",
            unit_tax: "0.86",
            total: "4.58",
            total_tax: "0.86",
          },
          vendor: {
            currency: "USD",
            unit: "1.26",
            unit_tax: "0.23",
            total: "1.26",
            total_tax: "0.23",
          },
        },
        redirect_url: null,
        test_variant: "wtf",
      },
      product: {
        id: 594004,
        name: "Premium Account",
        quantity: 1,
      },
      user: {
        id: "21560548",
        email: "user@keybr.com",
        country: "PL",
      },
    }),
    {
      checkout: {
        id: "76923558-chre93b18616ac3-735f3d3b81",
        createdAt: new Date("2001-02-03T04:05:06.000Z"),
        completed: true,
        customerPrice: {
          currency: "USD",
          unit: "4.58",
          unitTax: "0.86",
          total: "4.58",
          totalTax: "0.86",
        },
        vendorPrice: {
          currency: "USD",
          unit: "1.26",
          unitTax: "0.23",
          total: "1.26",
          totalTax: "0.23",
        },
        couponCode: null,
        passthrough: "extra",
        redirectUrl: null,
      },
      product: {
        id: 594004,
        name: "Premium Account",
        quantity: 1,
      },
      user: {
        id: "21560548",
        email: "user@keybr.com",
        country: "PL",
      },
    },
  );
});
