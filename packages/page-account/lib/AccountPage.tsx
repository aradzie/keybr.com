import {
  type AnyUser,
  usePageData,
  type UserDetails,
} from "@keybr/pages-shared";
import { AccountSection } from "./AccountSection.tsx";
import { useAccountActions, useSignInActions } from "./actions.ts";
import { SignInSection } from "./SignInSection.tsx";

export function AccountPage() {
  const { user, publicUser } = usePageData();
  if (user != null) {
    return <AccountSectionWithActions user={user} publicUser={publicUser} />;
  } else {
    return <SignInSectionWithActions />;
  }
}

function AccountSectionWithActions(props: {
  user: UserDetails;
  publicUser: AnyUser;
}) {
  const { user, publicUser, actions } = useAccountActions(props);
  return (
    <AccountSection user={user} publicUser={publicUser} actions={actions} />
  );
}

function SignInSectionWithActions() {
  const { actions } = useSignInActions();
  return <SignInSection actions={actions} />;
}
