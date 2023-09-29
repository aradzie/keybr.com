import { init, Slot } from "@keybr/pages-browser";
import { usePageData } from "@keybr/pages-shared";
import { PublicResultLoader, ResultLoader } from "@keybr/result-loader";
import { SettingsLoader } from "@keybr/settings-loader";
import { type ReactNode } from "react";
import { ProfileApp } from "./ProfileApp.tsx";
import { PublicProfileApp } from "./PublicProfileApp.tsx";

init(
  <Slot selector="main">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  const {
    extra: { profileOwner },
  } = usePageData();
  return (
    <SettingsLoader>
      {profileOwner != null ? (
        <PublicResultLoader>
          <PublicProfileApp profileOwner={profileOwner} />
        </PublicResultLoader>
      ) : (
        <ResultLoader>
          <ProfileApp />
        </ResultLoader>
      )}
    </SettingsLoader>
  );
}
