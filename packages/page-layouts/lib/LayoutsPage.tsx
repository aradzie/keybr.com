import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function LayoutsPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.layouts.bind(null),
        title: formatMessage({
          id: "page.layouts.title",
          defaultMessage: "Keyboard Layouts.",
        }),
        description: formatMessage({
          id: "page.layouts.description",
          defaultMessage: "Keyboard layouts comparison charts.",
        }),
        entrypoint: "page-layouts",
      }}
    >
      <LoadingProgress current={0} total={0} />
    </StandardLayout>
  );
}
