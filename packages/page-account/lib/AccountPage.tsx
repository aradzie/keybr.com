import { StandardLayout } from "@keybr/pages-server";
import { Sitemap, usePageData } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { AccountSection } from "./AccountSection.tsx";
import { SignInSection } from "./SignInSection.tsx";

export function AccountPage(): ReactNode {
  const intl = useIntl();
  const { user, publicUser } = usePageData();
  const pageLink = Sitemap.accountLink(publicUser);
  const { name, title } = pageLink.format(intl);

  return (
    <StandardLayout
      pageMeta={{
        pageLink: pageLink,
        title: name,
        description: title,
        entrypoint: "page-account",
      }}
    >
      {user != null ? (
        <AccountSection user={user} publicUser={publicUser} />
      ) : (
        <SignInSection />
      )}
    </StandardLayout>
  );
}
