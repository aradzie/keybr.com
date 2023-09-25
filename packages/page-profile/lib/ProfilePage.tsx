import { LoadingBanner, StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { Article } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function ProfilePage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.profile.bind(null),
        title: formatMessage({
          id: "page.profile.title",
          description: "Page title.",
          defaultMessage: "My Profile",
        }),
        description: formatMessage({
          id: "page.profile.description",
          description: "Page description.",
          defaultMessage: "My detailed profile.",
        }),
        entrypoint: "page-profile",
      }}
    >
      <Article>
        <FormattedMessage
          id="page.profile.content"
          description="Page content."
          defaultMessage={
            "<h1>My Profile</h1>" +
            "<p>This is a page with detailed statistics about your learning progress. The more lessons you complete, the more detailed and accurate these statistics will be.</p>"
          }
        />
      </Article>

      <div id="root">
        <Article>
          <LoadingBanner />
          <LoadingProgress total={0} current={0} />
        </Article>
      </div>
    </StandardLayout>
  );
}
