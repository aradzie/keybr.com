import { type CSSProperties } from "react";

export const syntaxStyleMap = {
  keyword: { color: `var(--syntax-keyword)` },
  string: { color: `var(--syntax-string)` },
  number: { color: `var(--syntax-number)` },
  comment: { color: `var(--syntax-comment)` },
} as Record<string, CSSProperties>;
