import { LoadingBanner, StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { Article } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function PracticePage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.practice.bind(null),
        title: formatMessage({
          id: "page.practice.title",
          description: "Page title.",
          defaultMessage: "Typing Practice",
        }),
        description: formatMessage({
          id: "page.practice.description",
          description: "Page description.",
          defaultMessage:
            "Take a typing test, practice typing lessons, learn to type faster.",
        }),
        entrypoint: "page-practice",
      }}
    >
      <Article>
        <FormattedMessage
          id="page.practice.content"
          description="Page content."
          defaultMessage={
            "<h1>Typing Lessons</h1>" +
            "<p>Take a typing speed test, learn to type faster and with fewer errors with this free online typing tutor.</p>"
          }
        />
        <LoadingBanner />
        <LoadingProgress current={0} total={0} />
      </Article>
    </StandardLayout>
  );
}
