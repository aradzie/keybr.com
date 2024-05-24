import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function MultiplayerPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.multiplayer.bind(null),
        title: formatMessage({
          id: "page.multiplayer.title",
          defaultMessage: "Multiplayer",
        }),
        description: formatMessage({
          id: "page.multiplayer.description",
          defaultMessage: "Online multiplayer type racing game.",
        }),
        entrypoint: "page-multiplayer",
      }}
    >
      <LoadingProgress current={0} total={0} />
    </StandardLayout>
  );
}
