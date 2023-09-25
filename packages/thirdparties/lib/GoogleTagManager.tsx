import { type ReactNode } from "react";
import { googleTagManagerId } from "./config.ts";

export const GoogleTagManager = ({
  id = googleTagManagerId,
}: {
  readonly id?: string;
}): ReactNode => {
  if (process.env.NODE_ENV === "development") {
    return null;
  }
  const html =
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments)};` +
    `gtag("js",new Date());` +
    `gtag("config","${id}");`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: html }} />
      <script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        defer={true}
      />
    </>
  );
};
