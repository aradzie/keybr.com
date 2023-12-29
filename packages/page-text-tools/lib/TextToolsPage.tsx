import { StandardLayout } from "@keybr/pages-server";
import { Sitemap } from "@keybr/pages-shared";
import { Article } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function TextToolsPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.textTools.bind(null),
        title: formatMessage({
          id: "page.textTools.title",
          defaultMessage: "Text Tools",
        }),
        description: formatMessage({
          id: "page.textTools.description",
          defaultMessage: "Count the characters and words in your text.",
        }),
        entrypoint: "page-text-tools",
      }}
    >
      <Article>
        <FormattedMessage
          id="page.textTools.content"
          defaultMessage={
            "<h1>Text Tools</h1>" +
            "<p>Count the characters and words in your text. Find out what the most common words are. Measure the time taken to type read these words.</p>"
          }
        />
        <div id="root" />
      </Article>
    </StandardLayout>
  );
}
