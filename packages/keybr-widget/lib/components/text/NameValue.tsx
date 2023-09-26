import { clsx } from "clsx";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import * as styles from "./NameValue.module.less";
import {
  type NameProps,
  type NameValueProps,
  type ValueProps,
} from "./NameValue.types.ts";

export function NameValue({
  className,
  title,
  name,
  value,
}: NameValueProps): ReactNode {
  return (
    <span className={clsx(styles.nameValue, className)} title={title}>
      {asName(name)}
      {asValue(value)}
    </span>
  );
}

export function asName(v: any): ReactElement<NameProps> {
  if (isValidElement<NameProps>(v) && v.type === Name) {
    return v;
  } else {
    return <Name name={v} />;
  }
}

export function Name({
  className,
  title,
  name,
  children,
}: NameProps): ReactNode {
  return (
    <span className={clsx(styles.name, className)} title={title}>
      {children || name + ":"}
    </span>
  );
}

export function asValue(v: any): ReactElement<ValueProps> {
  if (isValidElement<ValueProps>(v) && v.type === Value) {
    return v;
  } else {
    return <Value value={v} />;
  }
}

export function Value({
  className,
  title,
  value,
  delta,
  children,
}: ValueProps): ReactNode {
  return (
    <span
      className={clsx(
        styles.value,
        delta != null && delta > 0 && styles.value_more,
        delta != null && delta < 0 && styles.value_less,
        className,
      )}
      title={title}
    >
      {children || String(value)}
    </span>
  );
}
