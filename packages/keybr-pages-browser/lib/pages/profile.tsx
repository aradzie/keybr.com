import { ProfilePage, PublicProfilePage } from "@keybr/page-profile";
import { PublicResultLoader, ResultLoader } from "@keybr/result-loader";
import { SettingsLoader } from "@keybr/settings-loader";
import { useParams } from "react-router";
import { ProfileLoader } from "../loader/ProfileLoader.tsx";

export default function Page() {
  const { userId = "me" } = useParams();
  if (userId === "me") {
    return <Profile />;
  } else {
    return <PublicProfile userId={userId} />;
  }
}

function Profile() {
  return (
    <SettingsLoader>
      <ResultLoader>
        <ProfilePage />
      </ResultLoader>
    </SettingsLoader>
  );
}

function PublicProfile({ userId }: { readonly userId: string }) {
  return (
    <SettingsLoader>
      <ProfileLoader userId={userId}>
        {(user) => (
          <PublicResultLoader user={user}>
            <PublicProfilePage user={user} />
          </PublicResultLoader>
        )}
      </ProfileLoader>
    </SettingsLoader>
  );
}
