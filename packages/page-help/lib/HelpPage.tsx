import { StandardLayout } from "@keybr/pages-server";
import { Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { HelpApp } from "./HelpApp.tsx";

export function HelpPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.help.bind(null),
        title: formatMessage({
          id: "page.help.title",
          defaultMessage: "Help",
        }),
        description: formatMessage({
          id: "page.help.description",
          defaultMessage: "Learn to type faster.",
        }),
        entrypoint: "page-static",
      }}
    >
      <HelpApp />
    </StandardLayout>
  );
}
