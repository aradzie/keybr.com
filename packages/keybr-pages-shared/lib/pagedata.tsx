import { createContext, type ReactNode, useContext } from "react";
import { type AnyUser, type PageData } from "./types.ts";

const pageDataGlobalName = "__PAGE_DATA__";

export function getPageData(): PageData {
  return (globalThis as any)[pageDataGlobalName];
}

export function PageDataScript(): ReactNode {
  const pageDataJson = JSON.stringify(usePageData())
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
  return (
    <script
      id="page-data"
      dangerouslySetInnerHTML={{
        __html: `var ${pageDataGlobalName} = ${pageDataJson};`,
      }}
    />
  );
}

export const PageDataContext = createContext<PageData>(null!);

export function usePageData(): PageData {
  const value = useContext(PageDataContext);
  if (value == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? "PageDataContext is missing"
        : undefined,
    );
  }
  return value;
}

export function isPremiumUser(user: AnyUser): boolean {
  return user.id != null && user.premium;
}
