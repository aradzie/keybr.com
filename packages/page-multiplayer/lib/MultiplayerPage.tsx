import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
      <FormattedMessage
        id="page.multiplayer.content"
        defaultMessage={
          "<h1>Online Multiplayer Typing Game</h1>" +
          "<p>Compete against other players in this online multiplayer typing game. The faster you type, the faster your car goes. Type as fast as you can to win the race!</p>"
        }
      />
      <LoadingProgress current={0} total={0} />
    </StandardLayout>
  );
}
