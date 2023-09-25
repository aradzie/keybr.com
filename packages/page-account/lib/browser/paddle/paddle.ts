declare global {
  const Paddle: Paddle;

  // eslint-disable-next-line
  interface Window {
    readonly Paddle: Paddle;
  }
}

export type Paddle = {
  readonly Setup: (arg: {
    readonly vendor: number;
    readonly eventCallback?: (data: PaddleEventCallbackData) => void;
  }) => void;
  readonly Options: (arg: { readonly debug: boolean }) => void;
  readonly Spinner: {
    readonly show: () => void;
    readonly hide: () => void;
  };
  readonly Checkout: {
    readonly open: (arg: {
      /**
       * Pre-fill the customer email field on the checkout.
       */
      readonly email: string;
      /**
       * The ID of the Paddle Product, Subscription or Bundle this checkout is
       * for.
       */
      readonly product: number;
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
       * Pre-fill a coupon code on the checkout.
       */
      readonly coupon?: string | null;
      /**
       * Force the checkout to a specific locale.
       */
      readonly locale?: string | null;
      /**
       * A string of metadata you wish to store with the checkout. Will be sent
       * alongside all associated with the order.
       */
      readonly passthrough?: string | null;
      /**
       * Open the checkout with a custom pay link, cancel url or payment method
       * update url.
       */
      readonly override?: string | null;
      /**
       * A function to call upon checkout load.
       */
      readonly loadCallback?: (() => void) | null;
      /**
       * A function to call upon checkout completion.
       */
      readonly successCallback?: ((data: PaddleEventData) => void) | null;
      /**
       * A function to call on checkout close.
       */
      readonly closeCallback?: ((data: PaddleEventData) => void) | null;
    }) => void;
  };
  readonly Order: {
    readonly DetailsPopup: (checkoutId: string) => void;
    readonly details: (checkoutId: string, callback: () => void) => void;
  };
};

export type PaddleEventName =
  | "Checkout.Close"
  | "Checkout.Complete"
  | "Checkout.Coupon.Add"
  | "Checkout.Coupon.Applied"
  | "Checkout.Coupon.Cancel"
  | "Checkout.Coupon.Remove"
  | "Checkout.Coupon.Submit"
  | "Checkout.Error"
  | "Checkout.Language.Change"
  | "Checkout.Loaded"
  | "Checkout.Location.Submit"
  | "Checkout.Login"
  | "Checkout.Logout"
  | "Checkout.PaymentComplete"
  | "Checkout.PaymentMethodSelected"
  | "Checkout.Quantity.Change"
  | "Checkout.Vat.Add"
  | "Checkout.Vat.Applied"
  | "Checkout.Vat.Cancel"
  | "Checkout.Vat.Remove"
  | "Checkout.Vat.Submit"
  | "Checkout.WireTransfer.Complete";

export type PaddleEventCallbackData = {
  readonly event: PaddleEventName;
  readonly eventData: PaddleEventData;
  readonly checkoutData: PaddleCheckoutData;
};

export type PaddleEventData = {
  readonly checkout: PaddleCheckout;
  readonly product: PaddleProduct;
  readonly user: PaddleUser;
};

export type PaddleCheckout = {
  readonly id: string; // "76923558-chre93b18616ac3-735f3d3b81"
  readonly created_at: string; // "2020-12-15 20:26:51"
  readonly completed: boolean;
  readonly coupon: {
    readonly coupon_code: string | null;
  };
  readonly passthrough: string | null;
  readonly prices: {
    readonly customer: PaddlePrice;
    readonly vendor: PaddlePrice;
  };
  readonly redirect_url: string | null;
  readonly test_variant: string; // "newCheckout"
};

export type PaddlePrice = {
  readonly currency: string; // "USD"
  readonly unit: string; // "4.59"
  readonly unit_tax: string; // "0.86"
  readonly total: string; // "4.59"
  readonly total_tax: string; // "0.86"
};

export type PaddleProduct = {
  readonly id: number; // 594004
  readonly name: string; // "keybr.com premium account";
  readonly quantity: number; // 1
};

export type PaddleUser = {
  readonly id: string; // "21560548"
  readonly email: string; // "aradzivanovich@gmail.com"
  readonly country: string; // "PL"
};

export type PaddleCheckoutData = {
  readonly product: number; // 594004
  readonly quantity: number; // 1
  readonly method: string; // "overlay"
  readonly referring_domain: string; // "www.keybr.com / www.keybr.com";
  readonly guest_email: string; // "aradzivanovich@gmail.com";
  readonly quantity_variable: string; // "0";
  readonly checkout_layout: string; // "multipage";
  readonly checkout_layout_forced: string; // "false";
  readonly display_mode: string; // "overlay";
  readonly apple_pay_enabled: string; // "false";
  readonly popup: string; // "true";
  readonly paddle_js: string; // "true";
  readonly is_popup: string; // "true";
  readonly parent_url: string; // "https://www.keybr.com/account";
};
