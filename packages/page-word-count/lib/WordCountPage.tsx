import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

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
      <LoadingProgress current={0} total={0} />
    </StandardLayout>
  );
}
