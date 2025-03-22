import {
  type AnyUser,
  isPremiumUser,
  type UserDetails,
  UserName,
} from "@keybr/pages-shared";
import { Article, Button, CheckBox, FieldSet, Icon, Para } from "@keybr/widget";
import { mdiCreditCard, mdiDeleteForever, mdiExitToApp } from "@mdi/js";
import { FormattedMessage, useIntl } from "react-intl";
import { AccountName } from "./AccountName.tsx";
import { AccountPricePreview } from "./AccountPricePreview.tsx";
import { type AccountActions } from "./actions.ts";

export function AccountSection({
  user,
  publicUser,
  actions,
}: {
  user: UserDetails;
  publicUser: AnyUser;
  actions: AccountActions;
}) {
  const { formatMessage } = useIntl();

  return (
    <Article>
      <AccountName user={user} />

      <FormattedMessage
        id="account.accountPage.description"
        defaultMessage="<p>You are using an account to store your typing data on our servers in the cloud. You will be able to access your profile from any computer or browser.</p>"
      />

      <FieldSet
        legend={formatMessage({
          id: "t_Account_details",
          defaultMessage: "Account details",
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
              id: "t_Anonymize_me",
              defaultMessage: "Anonymize me",
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
              id: "t_Sing_out",
              defaultMessage: "Sign out",
            })}
          />
        </Para>
      </FieldSet>

      <FieldSet
        legend={formatMessage({
          id: "t_Premium_account",
          defaultMessage: "Premium account",
        })}
      >
        {isPremiumUser(publicUser) ? (
          <FormattedMessage
            id="account.premiumAccount.description"
            defaultMessage="<p>Thank you for purchasing a premium account! Now you can enjoy additional features and an ad-free experience.</p>"
          />
        ) : (
          <>
            <FormattedMessage
              id="account.freeAccount.description"
              defaultMessage={
                "<p>Buy a <strong>premium account</strong> to unlock additional features and enjoy an ad-free experience. Here is the list of premium account benefits:</p>" +
                "<ul>" +
                "<li><strong>No ads.</strong> Ads may be distracting and impede your learning progress. This is a good way to get rid of them.</li>" +
                "<li><strong>No trackers.</strong> Trackers inevitably come with ads. Remove all trackers for complete online privacy.</li>" +
                "<li><strong>Ultra-fast responsiveness.</strong> Ads take quite some time to load. Getting rid of them means faster loading times for all pages.</li>" +
                "</ul>" +
                "<p>It is a single time payment that provides lifetime access. It is NOT a recurring subscription.</p>"
              }
            />

            <AccountPricePreview />

            <Para>
              <Button
                onClick={() => {
                  actions.checkout();
                }}
                icon={<Icon shape={mdiCreditCard} />}
                label={formatMessage({
                  id: "t_Buy_a_premium_",
                  defaultMessage: "Buy a premium account",
                })}
              />
            </Para>
          </>
        )}
      </FieldSet>

      <FieldSet
        legend={formatMessage({
          id: "t_Delete_account",
          defaultMessage: "Delete account",
        })}
      >
        <Para>
          <Button
            onClick={() => {
              actions.deleteAccount();
            }}
            icon={<Icon shape={mdiDeleteForever} />}
            label={formatMessage({
              id: "t_Delete_account",
              defaultMessage: "Delete account",
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
