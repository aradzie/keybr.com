import { Header } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function AccountName({ name }: { readonly name: ReactNode }): ReactNode {
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
