import { LoadingBanner, StandardLayout } from "@keybr/pages-server";
import {
  LoadingProgress,
  Sitemap,
  usePageData,
  UserName,
} from "@keybr/pages-shared";
import { Article, Header } from "@keybr/widget";
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
      <Article>
        <Header level={1}>
          <UserName user={profileOwner} />
        </Header>
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
