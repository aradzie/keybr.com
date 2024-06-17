import { cloneElement, type ReactElement, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { getDir } from "./locale.ts";

/**
 * Expects exactly two child components and swaps their properties depending
 * on the reading direction, "ltr" or "rtl".
 */
export function Dir({
  children,
  swap,
}: {
  readonly children: readonly [ReactElement, ReactElement];
  readonly swap: string;
}): ReactNode {
  const { locale } = useIntl();
  if (!(Array.isArray(children) && children.length === 2)) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? `Excepting exactly two child components`
        : undefined,
    );
  }
  const [a, b] = children;
  const { props: ap } = a;
  const { props: bp } = b;
  if (!(swap in ap && swap in bp)) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? `Property [${swap}] is missing in the child component props`
        : undefined,
    );
  }
  if (getDir(locale) === "rtl") {
    return (
      <>
        {cloneElement(a, { ...ap, [swap]: bp[swap] })}
        {cloneElement(b, { ...bp, [swap]: ap[swap] })}
      </>
    );
  } else {
    return (
      <>
        {cloneElement(a, { ...ap, [swap]: ap[swap] })}
        {cloneElement(b, { ...bp, [swap]: bp[swap] })}
      </>
    );
  }
}
