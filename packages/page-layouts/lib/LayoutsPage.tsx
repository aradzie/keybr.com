import { StandardLayout } from "@keybr/pages-server";
import { Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { LayoutsApp } from "./LayoutsApp.tsx";

export function LayoutsPage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.layouts.bind(null),
        title: formatMessage({
          id: "page.layouts.title",
          description: "Page title.",
          defaultMessage: "Keyboard Layouts.",
        }),
        description: formatMessage({
          id: "page.layouts.description",
          description: "Page description.",
          defaultMessage: "Keyboard layouts comparison charts.",
        }),
        entrypoint: "page-static",
      }}
    >
      <LayoutsApp />
    </StandardLayout>
  );
}
