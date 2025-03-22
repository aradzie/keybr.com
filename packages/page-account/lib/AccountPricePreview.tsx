import { Tasks } from "@keybr/lang";
import { paddlePriceId } from "@keybr/thirdparties";
import { Para } from "@keybr/widget";
import { type PricePreviewResponse } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
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
    <Para>
      <FormattedMessage
        id="t_Premium_account_price:"
        defaultMessage="Premium account price:"
      />{" "}
      {item?.formattedTotals?.total ?? <Spinner />}
    </Para>
  );
}

function Spinner() {
  const [size, setSize] = useState(3);
  useEffect(() => {
    const tasks = new Tasks();
    tasks.delayed(100, () => {
      if (size >= 3) {
        setSize(0);
      } else {
        setSize(size + 1);
      }
    });
    return () => {
      tasks.cancelAll();
    };
  }, [size]);
  return <span>{"".padStart(size, ".")}</span>;
}
