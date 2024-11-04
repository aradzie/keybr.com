import { catchError } from "@keybr/debug";
import { type AnyUser, type UserDetails } from "@keybr/pages-shared";
import { useState } from "react";
import { useIntl } from "react-intl";
import { checkoutProduct } from "./checkout.ts";
import { AccountService, type PatchAccountRequest } from "./service.ts";

export type AccountActions = {
  readonly patchAccount: (request: PatchAccountRequest) => void;
  readonly deleteAccount: () => void;
  readonly logout: () => void;
  readonly checkout: () => void;
};

export type SignInActions = {
  readonly registerEmail: (email: string) => Promise<unknown>;
};

export function useAccountActions(props: {
  user: UserDetails;
  publicUser: AnyUser;
}) {
  const { formatMessage } = useIntl();
  const [{ user, publicUser }, setState] = useState(props);

  const patchAccount = (request: PatchAccountRequest) => {
    AccountService.patchAccount(request)
      .then(({ user, publicUser }) => {
        setState({ user, publicUser });
      })
      .catch(catchError);
  };

  const deleteAccount = () => {
    const message = formatMessage({
      id: "account.deleteAccount.message",
      defaultMessage:
        "Are you sure you want to delete your account? " +
        "This operation is permanent and cannot be undone! " +
        "However, you can create a new account at any time.",
    });
    if (window.confirm(message)) {
      AccountService.deleteAccount()
        .then(() => {
          reload("/");
        })
        .catch(catchError);
    }
  };

  const logout = () => {
    reload("/auth/logout");
  };

  const checkout = () => {
    checkoutProduct(user).catch(catchError);
  };

  return {
    user,
    publicUser,
    actions: {
      patchAccount,
      deleteAccount,
      logout,
      checkout,
    } as AccountActions,
  };
}

export function useSignInActions() {
  const registerEmail = (email: string) => {
    return AccountService.registerEmail(email);
  };
  return {
    actions: {
      registerEmail,
    } as SignInActions,
  };
}

function reload(path: string) {
  window.location.href = path;
}
