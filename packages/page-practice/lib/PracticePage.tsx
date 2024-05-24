import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function PracticePage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.practice.bind(null),
        title: formatMessage({
          id: "page.practice.title",
          defaultMessage: "Typing Practice",
        }),
        description: formatMessage({
          id: "page.practice.description",
          defaultMessage:
            "Take a typing test, practice typing lessons, learn to type faster.",
        }),
        entrypoint: "page-practice",
      }}
    >
      <LoadingProgress current={0} total={0} />
    </StandardLayout>
  );
}
