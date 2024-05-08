import { clsx } from "clsx";
import { type ReactNode, useEffect, useRef } from "react";
import { Button } from "../button/index.ts";
import { Field, FieldList } from "../fieldlist/index.ts";
import { Portal } from "../portal/index.ts";
import * as styles from "./Dialog.module.less";
import { type DialogProps } from "./Dialog.types.ts";

export function Dialog({
  className,
  children,
  actions = [{ label: "Close", action: () => {} }],
  ...props
}: DialogProps): ReactNode {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.showModal();
    }
  }, []);
  return (
    <Portal>
      <dialog {...props} ref={ref} className={clsx(styles.root, className)}>
        <div className={styles.content}>{children}</div>
        <FieldList>
          <Field.Filler />
          {actions.map(({ label, action, ...buttonProps }, index) => (
            <Field key={index}>
              <Button
                {...buttonProps}
                onClick={() => {
                  if (ref.current != null) {
                    ref.current.close();
                  }
                  action();
                }}
              >
                {label}
              </Button>
            </Field>
          ))}
          <Field.Filler />
        </FieldList>
      </dialog>
    </Portal>
  );
}
