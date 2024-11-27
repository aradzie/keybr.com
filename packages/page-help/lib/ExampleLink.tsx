import { Pages } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { Link } from "react-router";

export function ExampleLink({
  index,
  children,
}: {
  readonly index: 1 | 2 | 3 | 4 | 5;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <Link
      to={Pages.profileOf(`example${index}`)}
      target={`example-profile-${index}`}
    >
      {children}
    </Link>
  );
}
