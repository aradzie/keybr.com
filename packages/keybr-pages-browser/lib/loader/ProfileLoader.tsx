import { catchError } from "@keybr/debug";
import { LoadingProgress, type NamedUser } from "@keybr/pages-shared";
import { expectType, request } from "@keybr/request";
import { type ReactNode, useEffect, useState } from "react";

export function ProfileLoader({
  userId,
  children,
  fallback = <LoadingProgress />,
}: {
  readonly userId: string;
  readonly children: (user: NamedUser) => ReactNode;
  readonly fallback?: ReactNode;
}) {
  const result = useProfileLoader(userId);
  if (result == null) {
    return fallback;
  } else {
    return children(result);
  }
}

export function useProfileLoader(userId: string): NamedUser | null {
  const [profile, setProfile] = useState<NamedUser | null>(null);

  useEffect(() => {
    let didCancel = false;

    loadProfile(userId)
      .then((entries) => {
        if (!didCancel) {
          setProfile(entries);
        }
      })
      .catch(catchError);

    return () => {
      didCancel = true;
    };
  }, [userId]);

  return profile;
}

async function loadProfile(userId: string): Promise<NamedUser> {
  const response = await request
    .use(expectType("application/json"))
    .GET(`/_/profile/${encodeURIComponent(userId)}`)
    .send();
  return await response.json<NamedUser>();
}
