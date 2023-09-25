import { type ReactNode } from "react";
import { cloudflareAnalyticsId } from "./config.ts";

export const CloudflareAnalytics = ({
  id = cloudflareAnalyticsId,
}: {
  readonly id?: string;
}): ReactNode => {
  if (process.env.NODE_ENV === "development") {
    return null;
  }
  return (
    <script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      defer={true}
      data-cf-beacon={`{"token": "${id}"}`}
    />
  );
};
