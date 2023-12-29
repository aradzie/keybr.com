import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function FreeAccountOverview(): ReactNode {
  return (
    <FormattedMessage
      id="account.freeAccountOverview"
      defaultMessage={
        "<p>Buy a <strong>premium account</strong> to unlock additional features and enjoy an ad-free experience. Here is the list of premium account benefits:</p>" +
        "<ul>" +
        "<li><strong>No ads.</strong> Ads may be distracting and impede your learning progress. This is a good way to get rid of them.</li>" +
        "<li><strong>No trackers.</strong> Trackers inevitably come with ads. Remove all trackers for complete online privacy.</li>" +
        "<li><strong>Ultra-fast responsiveness.</strong> Ads take quite some time to load. Getting rid of them means faster loading times for all pages.</li>" +
        "</ul>" +
        "<p>It is a single payment that provides lifetime access.</p>"
      }
    />
  );
}
