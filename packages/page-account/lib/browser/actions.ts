import { catchError } from "@keybr/debug";
import { type AnyUser, type UserDetails } from "@keybr/pages-shared";
import { paddleProductId, paddleVendorId } from "@keybr/thirdparties";
import { useState } from "react";
import { useIntl } from "react-intl";
import { type AccountActions, type SignInActions } from "../types.ts";
import { checkoutProduct, type Metadata } from "./paddle/index.ts";
import { AccountService, type PatchAccountRequest } from "./service.ts";

export function useAccountActions(props: {
  readonly user: UserDetails;
  readonly publicUser: AnyUser;
}) {
  const { formatMessage } = useIntl();
  const [{ user, publicUser }, setState] = useState(props);

  const patchAccount = (request: PatchAccountRequest): void => {
    AccountService.patchAccount(request)
      .then(({ user, publicUser }) => {
        setState({ user, publicUser });
      })
      .catch(catchError);
  };

  const deleteAccount = (): void => {
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

  const logout = (): void => {
    reload("/auth/logout");
  };

  const checkout = (): void => {
    checkoutProduct({
      email: user.email,
      vendorId: paddleVendorId,
      productId: paddleProductId,
      title: formatMessage({
        id: "account.checkout.title",
        defaultMessage: "Premium Account",
      }),
      message: formatMessage({
        id: "account.checkout.description",
        defaultMessage:
          "Purchase a premium account to unlock additional features " +
          "and enjoy an ad-free experience.",
      }),
      allowQuantity: false,
      quantity: 1,
      passthrough: { id: user.id } as Metadata,
    })
      .then((result) => {
        if (result != null) {
          // Give webhook a change to process the transaction.
          setTimeout(() => {
            reload("/"); // Checkout succeeded, reload page.
          }, 3000);
        }
      })
      .catch(catchError);
  };

  return {
    actions: {
      patchAccount,
      deleteAccount,
      logout,
      checkout,
    } as AccountActions,
    user,
    publicUser,
  };
}

export function useSignInActions() {
  const registerEmail = (email: string): Promise<unknown> => {
    return AccountService.registerEmail(email);
  };
  return {
    actions: {
      registerEmail,
    } as SignInActions,
  };
}

function reload(path: string): void {
  window.location.href = path;
}
