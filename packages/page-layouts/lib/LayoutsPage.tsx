import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
      <FormattedMessage
        id="page.layouts.content"
        defaultMessage={
          "<h1>Keyboard Layouts</h1>" +
          "<p>These charts visualize the efficiency of different keyboard layouts. An efficiency is a measure of how easy it is to type on a keyboard.</p>" +
          "<p>The circles show relative key frequencies, and the arcs show relative key pair frequencies.</p>" +
          "<p>It is easier to type when the most frequent keys are on the home row, and when the most frequent key pairs are typed with different fingers and hands. Therefore an efficient layout has the largest circles on the home row. It also has arcs that are evenly distributed across the keyboard, long and horizontal, rather than short and diagonal, because it indicates the frequent switching of fingers and hands.</p>"
        }
      />
      <LoadingProgress current={0} total={0} />
    </StandardLayout>
  );
}
