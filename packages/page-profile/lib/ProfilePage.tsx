import { StandardLayout } from "@keybr/pages-server";
import { LoadingProgress, Sitemap } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function ProfilePage(): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.profile.bind(null),
        title: formatMessage({
          id: "page.profile.title",
          defaultMessage: "My Profile",
        }),
        description: formatMessage({
          id: "page.profile.description",
          defaultMessage: "My detailed profile.",
        }),
        entrypoint: "page-profile",
      }}
    >
      <LoadingProgress total={0} current={0} />
    </StandardLayout>
  );
}
