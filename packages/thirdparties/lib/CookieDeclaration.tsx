import { cookiebotClientId } from "./config.ts";

export const CookieDeclaration = ({
  id = cookiebotClientId,
}: {
  id?: string;
}) => {
  if (process.env.NODE_ENV === "development") {
    return null;
  }
  return (
    <script
      id="CookieDeclaration"
      src={`https://consent.cookiebot.com/${id}/cd.js`}
      defer={true}
    />
  );
};
