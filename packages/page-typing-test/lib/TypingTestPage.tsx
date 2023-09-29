import { LoadingBanner, StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Screen, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function TypingTestPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.typingTest.bind(null),
        title: formatMessage({
          id: "page.typingTest.title",
          description: "Page title.",
          defaultMessage: "Speed Test",
        }),
        description: formatMessage({
          id: "page.typingTest.description",
          description: "Page description.",
          defaultMessage: "Take a typing speed test.",
        }),
        entrypoint: "page-typing-test",
      }}
    >
      <Screen>
        <FormattedMessage
          id="page.typingTest.content"
          description="Page content."
          defaultMessage={
            "<h1>Typing Speed Test</h1>" + "<p>Take a typing speed test.</p>"
          }
        />
        <LoadingBanner />
        <LoadingProgress current={0} total={0} />
      </Screen>
    </StandardLayout>
  );
}
