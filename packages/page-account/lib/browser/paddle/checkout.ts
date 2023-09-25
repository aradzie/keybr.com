import { loadPaddle } from "./loader.ts";
import { type TCheckoutConfig, type TCheckoutResult } from "./types.ts";
import { convertCheckout } from "./utils.ts";

export function checkoutProduct({
  email,
  vendorId,
  productId,
  title,
  message,
  allowQuantity,
  quantity,
  passthrough,
}: TCheckoutConfig): Promise<TCheckoutResult | null> {
  return loadPaddle().then(
    () =>
      new Promise((resolve, reject) => {
        try {
          Paddle.Setup({
            vendor: vendorId,
            eventCallback: ({ event, eventData, checkoutData }) => {
              if (process.env.NODE_ENV !== "production") {
                console.log("Paddle event", { event, eventData, checkoutData });
              }
            },
          });
          Paddle.Checkout.open({
            email: email,
            product: productId,
            title: title,
            message: message,
            allowQuantity: allowQuantity,
            quantity: quantity,
            passthrough:
              passthrough != null && typeof passthrough === "object"
                ? JSON.stringify(passthrough)
                : passthrough,
            successCallback: (event) => {
              resolve(convertCheckout(event));
            },
            closeCallback: () => {
              resolve(null);
            },
          });
        } catch (err: any) {
          reject(err);
        }
      }),
  );
}
