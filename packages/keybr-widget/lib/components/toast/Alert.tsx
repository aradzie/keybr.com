import { type ReactNode } from "react";
import { type MouseProps } from "../props.ts";
import * as styles from "./Alert.module.less";
import { CloseButton } from "./CloseButton.tsx";
import { toastProps, useToast } from "./context.tsx";
import { SeverityIcon } from "./SeverityIcon.tsx";

export function Alert({
  children,
  severity = null,
  closeButton = false,
  ...rest
}: {
  readonly children: ReactNode;
  readonly severity?: "info" | "success" | "error" | null;
  readonly closeButton?: boolean;
} & MouseProps): ReactNode {
  const toast = useToast();
  return (
    <div className={styles.alert} {...rest} {...toastProps(toast)}>
      {severity && <SeverityIcon severity={severity} />}
      <div className={styles.message}>{children}</div>
      {closeButton && <CloseButton />}
    </div>
  );
}
