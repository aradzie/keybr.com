import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function TypingTestPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.typingTest.bind(null),
        title: formatMessage({
          id: "page.typingTest.title",
          defaultMessage: "Speed Test",
        }),
        description: formatMessage({
          id: "page.typingTest.description",
          defaultMessage: "Take a typing speed test.",
        }),
        entrypoint: "page-typing-test",
      }}
    >
      <LoadingProgress current={0} total={0} />
    </StandardLayout>
  );
}
