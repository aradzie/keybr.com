import { useEffect, useRef } from "react";
import { cookiebotClientId } from "./config.ts";

export const CookieDeclaration = ({
  id = cookiebotClientId,
}: {
  id?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const script = document.createElement("script");
    script.id = "CookieDeclaration";
    script.src = `https://consent.cookiebot.com/${id}/cd.js`;
    element?.appendChild(script);
    return () => {
      element?.removeChild(script);
    };
  }, [id]);
  return <div ref={ref} />;
};
