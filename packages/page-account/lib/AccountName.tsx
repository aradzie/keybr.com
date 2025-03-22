import { type UserDetails } from "@keybr/pages-shared";
import { Header } from "@keybr/widget";
import { FormattedMessage, useIntl } from "react-intl";

export function AccountName({ user }: { user: UserDetails | null }) {
  const { formatMessage } = useIntl();

  return (
    <Header level={1}>
      <FormattedMessage
        id="t_Account_name"
        defaultMessage="Account | {name}"
        values={{
          name:
            user?.name ??
            formatMessage({
              id: "t_Anonymous_User",
              defaultMessage: "Anonymous User",
            }),
        }}
      />
    </Header>
  );
}
