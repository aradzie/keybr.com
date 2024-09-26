/** Additional checkout information. */
export type Metadata = {
  /** User id. */
  readonly id: string;
};

export type TCheckoutConfig = {
  /**
   * Pre-fill the customer email field on the checkout.
   */
  readonly email: string;
  /**
   * The ID of the vendor.
   */
  readonly vendorId: number;
  /**
   * The ID of the Paddle Product, Subscription or Bundle this checkout is for.
   */
  readonly productId: number;
  /**
   * Override the product’s name on the checkout page.
   */
  readonly title?: string | null;
  /**
   * A message/string of text displayed under the product name on the
   * checkout.
   */
  readonly message?: string | null;
  /**
   * Enable the quantity selector on the checkout page.
   */
  readonly allowQuantity?: boolean | null;
  /**
   * Pre-fill the quantity selector on the checkout. Please note that free
   * products/subscription plans are fixed to a quantity of 1.
   */
  readonly quantity?: number | null;
  /**
   * A string of metadata you wish to store with the checkout. Will be sent
   * alongside all associated with the order.
   */
  readonly passthrough?: Record<string, unknown> | string | null;
};

export type TCheckoutResult = {
  readonly checkout: TCheckout;
  readonly product: TProduct;
  readonly user: TUser;
};

export type TCheckout = {
  readonly id: string; // "76923558-chre93b18616ac3-735f3d3b81"
  readonly createdAt: Date; // "2020-12-15 20:26:51"
  readonly completed: boolean;
  readonly customerPrice: TPrice;
  readonly vendorPrice: TPrice;
  readonly couponCode: string | null;
  readonly redirectUrl: string | null;
  readonly passthrough: string | null;
};

export type TPrice = {
  readonly currency: string; // "USD"
  readonly unit: string; // "4.59"
  readonly unitTax: string; // "0.86"
  readonly total: string; // "4.59"
  readonly totalTax: string; // "0.86"
};

export type TProduct = {
  readonly id: number; // 594004
  readonly name: string; // "keybr.com premium account";
  readonly quantity: number; // 1
};

export type TUser = {
  readonly id: string; // "21560548"
  readonly email: string; // "aradzivanovich@gmail.com"
  readonly country: string; // "PL"
};
