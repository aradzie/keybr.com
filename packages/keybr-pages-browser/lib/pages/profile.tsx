import { ProfilePage, PublicProfilePage } from "@keybr/page-profile";
import { PublicResultLoader, ResultLoader } from "@keybr/result-loader";
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
    <ResultLoader>
      <ProfilePage />
    </ResultLoader>
  );
}

function PublicProfile({ userId }: { readonly userId: string }) {
  return (
    <ProfileLoader userId={userId}>
      {(user) => (
        <PublicResultLoader user={user}>
          <PublicProfilePage user={user} />
        </PublicResultLoader>
      )}
    </ProfileLoader>
  );
}
