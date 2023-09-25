import { type ReactNode } from "react";

export const defaultRichTextElements: Record<string, () => ReactNode> = {
  h1: (...chunks) => <h1>{chunks}</h1>,
  h2: (...chunks) => <h2>{chunks}</h2>,
  h3: (...chunks) => <h3>{chunks}</h3>,
  p: (...chunks) => <p>{chunks}</p>,
  ol: (...chunks) => <ol>{chunks}</ol>,
  ul: (...chunks) => <ul>{chunks}</ul>,
  li: (...chunks) => <li>{chunks}</li>,
  dl: (...chunks) => <dl>{chunks}</dl>,
  dt: (...chunks) => <dt>{chunks}</dt>,
  dd: (...chunks) => <dd>{chunks}</dd>,
  em: (...chunks) => <em>{chunks}</em>,
  strong: (...chunks) => <strong>{chunks}</strong>,
  br: () => <br />,
};
