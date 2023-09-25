import { Para } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function LoadingBanner(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <>
      <Para>
        {formatMessage({
          id: "common.loadingText",
          description: "Common text.",
          defaultMessage: "The application is loading, please wait a second...",
        })}
      </Para>
      <noscript>
        <Para>
          {formatMessage({
            id: "common.javaScriptDisabledText",
            description: "Common text.",
            defaultMessage:
              "This application will not work because JavaScript is disabled in your browser!",
          })}
        </Para>
      </noscript>
    </>
  );
}
