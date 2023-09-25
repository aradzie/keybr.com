import { PageLink, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";

export function ExampleLink({
  index,
  children,
}: {
  readonly index: 1 | 2 | 3 | 4 | 5;
  readonly children: ReactNode;
}): ReactNode {
  return (
    <PageLink
      link={Sitemap.publicProfile.bind({
        id: `example${index}`,
        name: `Example User ${index}`,
        imageUrl: null,
        premium: false,
      })}
      target={`profile/example${index}`}
    >
      {() => children}
    </PageLink>
  );
}
