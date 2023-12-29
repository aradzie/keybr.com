import { Para } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function LoadingBanner(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <>
      <Para>
        {formatMessage({
          id: "common.loading.message",
          defaultMessage: "The application is loading, please wait a second...",
        })}
      </Para>
      <noscript>
        <Para>
          {formatMessage({
            id: "common.javaScriptDisabled.message",
            defaultMessage:
              "This application will not work because JavaScript is disabled in your browser!",
          })}
        </Para>
      </noscript>
    </>
  );
}
