import { Header } from "@keybr/widget";
import { FormattedMessage } from "react-intl";

export function AccountName({ name }: { name: string }) {
  return (
    <Header level={1}>
      <FormattedMessage
        id="account.accountName.header"
        defaultMessage="Account | {name}"
        values={{ name }}
      />
    </Header>
  );
}
