import { LoadingBanner, StandardLayout } from "@keybr/pages-server";
import {
  LoadingProgress,
  Screen,
  Sitemap,
  usePageData,
} from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function PublicProfilePage(): ReactNode {
  const { formatMessage } = useIntl();
  const {
    extra: { profileOwner },
  } = usePageData();
  if (profileOwner == null || profileOwner.id == null) {
    throw new Error();
  }

  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.publicProfile.bind(profileOwner),
        title: formatMessage(
          {
            id: "page.publicProfile.title",
            description: "Page title.",
            defaultMessage: "{name} | Public Profile",
          },
          { name: profileOwner.name },
        ),
        description: formatMessage(
          {
            id: "page.publicProfile.description",
            description: "Page description.",
            defaultMessage: "Public profile of user ''{name}''.",
          },
          { name: profileOwner.name },
        ),
        entrypoint: "page-profile",
      }}
    >
      <Screen>
        <LoadingBanner />
        <LoadingProgress total={0} current={0} />
      </Screen>
    </StandardLayout>
  );
}
