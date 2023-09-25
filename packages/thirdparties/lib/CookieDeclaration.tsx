import { type ReactNode } from "react";
import { cookiebotClientId } from "./config.ts";

export const CookieDeclaration = ({
  id = cookiebotClientId,
}: {
  readonly id?: string;
}): ReactNode => {
  return (
    <script
      id="CookieDeclaration"
      src={`https://consent.cookiebot.com/${id}/cd.js`}
      defer={true}
    />
  );
};
