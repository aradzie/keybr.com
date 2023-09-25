import {
  type AnyUser,
  usePageData,
  type UserDetails,
} from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { AccountSection } from "../AccountSection.tsx";
import { SignInSection } from "../SignInSection.tsx";
import { useAccountActions, useSignInActions } from "./actions.ts";

export function AccountApp(): ReactNode {
  const { user, publicUser } = usePageData();
  if (user != null) {
    return <BrowserAccountSection user={user} publicUser={publicUser} />;
  } else {
    return <BrowserSignInSection />;
  }
}

function BrowserAccountSection(props: {
  readonly user: UserDetails;
  readonly publicUser: AnyUser;
}): ReactNode {
  const { actions, user, publicUser } = useAccountActions(props);
  return (
    <AccountSection actions={actions} user={user} publicUser={publicUser} />
  );
}

function BrowserSignInSection(): ReactNode {
  const { actions } = useSignInActions();
  return <SignInSection actions={actions} />;
}
