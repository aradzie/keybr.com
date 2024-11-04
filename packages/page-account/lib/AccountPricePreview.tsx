import { paddlePriceId } from "@keybr/thirdparties";
import { Para } from "@keybr/widget";
import { type PricePreviewResponse } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { usePaddle } from "./paddle/use-paddle.ts";

export function AccountPricePreview() {
  const paddle = usePaddle();
  const [preview, setPreview] = useState<PricePreviewResponse | null>(null);
  useEffect(() => {
    let didCancel = false;
    if (paddle != null) {
      paddle
        .PricePreview({
          items: [
            {
              priceId: paddlePriceId,
              quantity: 1,
            },
          ],
        })
        .then((preview) => {
          if (!didCancel) {
            setPreview(preview);
          }
        });
    }
    return () => {
      didCancel = true;
    };
  }, [paddle]);
  const [item = null] = preview?.data?.details?.lineItems ?? [];
  return (
    <Para>Premium account price: {item?.formattedTotals?.total ?? "..."}</Para>
  );
}
