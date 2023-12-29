import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function PremiumAccountOverview(): ReactNode {
  return (
    <FormattedMessage
      id="account.premiumAccountOverview"
      defaultMessage="<p>Thank you for purchasing a premium account! Now you can enjoy additional features and an ad-free experience.</p>"
    />
  );
}
