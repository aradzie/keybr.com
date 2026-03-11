import { type AnyUser, type UserDetails, UserName } from "@keybr/pages-shared";
import { Article, Button, FieldSet, Icon, Para } from "@keybr/widget";
import { mdiExitToApp } from "@mdi/js";
import { FormattedMessage, useIntl } from "react-intl";
import { AccountName } from "./AccountName.tsx";
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
        defaultMessage="<p>Je bent ingelogd. Je typvoortgang wordt automatisch bewaard op de schoolserver.</p>"
      />

      <FieldSet
        legend={formatMessage({
          id: "t_Account_details",
          defaultMessage: "Account",
        })}
      >
        <Para>
          <UserName user={publicUser} />
        </Para>

        <Para>
          <Button
            onClick={() => {
              actions.logout();
            }}
            icon={<Icon shape={mdiExitToApp} />}
            label={formatMessage({
              id: "t_Sing_out",
              defaultMessage: "Uitloggen",
            })}
          />
        </Para>
      </FieldSet>
    </Article>
  );
}
