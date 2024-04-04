import { StandardLayout } from "@keybr/pages-server";
import { Sitemap } from "@keybr/pages-shared";
import { Article } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function WordCountPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.wordCount.bind(null),
        title: formatMessage({
          id: "page.wordCount.title",
          defaultMessage: "Word Count",
        }),
        description: formatMessage({
          id: "page.wordCount.description",
          defaultMessage: "Count the characters and words in your text.",
        }),
        entrypoint: "page-word-count",
      }}
    >
      <Article>
        <FormattedMessage
          id="page.wordCount.content"
          defaultMessage={
            "<h1>Word Count</h1>" +
            "<p>Count the characters and words in your text. Find out what the most common words are. Measure the time taken to type read these words.</p>"
          }
        />
        <div id="root" />
      </Article>
    </StandardLayout>
  );
}
