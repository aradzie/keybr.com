import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import { querySelector } from "../../utils/query.ts";
import * as styles from "./Portal.module.less";

export function Portal({
  children,
  key,
}: {
  readonly children: ReactNode;
  readonly key?: null | string;
}): ReactNode {
  return createPortal(children, querySelector(`#${PortalContainer.id}`), key);
}

export function PortalContainer(): ReactNode {
  return <div id={PortalContainer.id} />;
}

PortalContainer.id = styles.portalContainer;
