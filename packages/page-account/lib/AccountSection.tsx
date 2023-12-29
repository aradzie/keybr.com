import {
  type AnyUser,
  isPremiumUser,
  type UserDetails,
  UserName,
} from "@keybr/pages-shared";
import { Article, Button, CheckBox, FieldSet, Icon, Para } from "@keybr/widget";
import { mdiCreditCard, mdiDeleteForever, mdiExitToApp } from "@mdi/js";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AccountName } from "./AccountName.tsx";
import { FreeAccountOverview } from "./FreeAccountOverview.tsx";
import { PremiumAccountOverview } from "./PremiumAccountOverview.tsx";
import { type AccountActions } from "./types.ts";

export function AccountSection({
  user,
  publicUser,
  actions = {} as AccountActions,
}: {
  readonly user: UserDetails;
  readonly publicUser: AnyUser;
  readonly actions?: AccountActions;
}): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <Article>
      <AccountName name={user.email} />

      <FormattedMessage
        id="account.accountPage.description"
        defaultMessage="<p>You are using an account to store your typing data on our servers in the cloud. You will be able to access your profile from any computer or browser.</p>"
      />

      <FieldSet
        legend={formatMessage({
          id: "account.accountDetails.legend",
          defaultMessage: "Account Details",
        })}
      >
        <Para>
          <UserName user={publicUser} />
        </Para>

        <Para>
          <FormattedMessage
            id="account.avatar.description"
            defaultMessage="Your user image and name as they are visible to the public in your profile, the high scores table, and the multiplayer game."
          />
        </Para>

        <Para>
          <CheckBox
            label={formatMessage({
              id: "account.widget.anonymize.label",
              defaultMessage: "Anonymize Me",
            })}
            title={formatMessage({
              id: "account.widget.anonymize.description",
              defaultMessage:
                "Hide your real user image and name from the public.",
            })}
            checked={user.anonymized}
            onChange={() => {
              actions.patchAccount({ anonymized: !user.anonymized });
            }}
          />
        </Para>

        <Para>
          <FormattedMessage
            id="account.anonymize.description"
            defaultMessage="Anonymization replaces your real user image and name with the one that we give you. You can switch between your real and anonymous name any number of times."
          />
        </Para>

        <Para>
          <Button
            onClick={() => {
              actions.logout();
            }}
            icon={<Icon shape={mdiExitToApp} />}
            label={formatMessage({
              id: "account.widget.signOut.label",
              defaultMessage: "Sign Out",
            })}
            title={formatMessage({
              id: "account.widget.signOut.description",
              defaultMessage: "Sign out from the application.",
            })}
          />
        </Para>
      </FieldSet>

      <FieldSet
        legend={formatMessage({
          id: "account.premiumAccount.legend",
          defaultMessage: "Premium Account",
        })}
      >
        {isPremiumUser(publicUser) ? (
          <>
            <PremiumAccountOverview />
          </>
        ) : (
          <>
            <FreeAccountOverview />

            <Para>
              <Button
                onClick={() => {
                  actions.checkout();
                }}
                icon={<Icon shape={mdiCreditCard} />}
                label={formatMessage({
                  id: "account.widget.checkout.label",
                  defaultMessage: "Buy a Premium Account",
                })}
                title={formatMessage({
                  id: "account.widget.checkout.description",
                  defaultMessage: "Open the checkout form.",
                })}
              />
            </Para>
          </>
        )}
      </FieldSet>

      <FieldSet
        legend={formatMessage({
          id: "account.deleteAccount.legend",
          defaultMessage: "Delete Account",
        })}
      >
        <Para>
          <Button
            onClick={() => {
              actions.deleteAccount();
            }}
            icon={<Icon shape={mdiDeleteForever} />}
            label={formatMessage({
              id: "account.widget.deleteAccount.label",
              defaultMessage: "Delete Account",
            })}
            title={formatMessage({
              id: "account.widget.deleteAccount.description",
              defaultMessage: "Permanently delete your account.",
            })}
          />
        </Para>

        <Para>
          <FormattedMessage
            id="account.deleteAccount.description"
            defaultMessage="This will delete all your personally identifiable information, such as your name and e-mail address from our database. This operation cannot be undone! If you only want to clear your typing statistics and start over, you can do this on the profile page."
          />
        </Para>
      </FieldSet>
    </Article>
  );
}
