import { Article, Header } from "@keybr/widget";
import { FormattedMessage } from "react-intl";
import { AccountName } from "./AccountName.tsx";
import { type SignInActions } from "./actions.ts";
import { SimpleLoginForm } from "./SimpleLoginForm.tsx";

export function SignInSection({ actions }: { actions: SignInActions }) {
  return (
    <Article>
      <AccountName user={null} />

      <FormattedMessage
        id="account.signInPage.description"
        defaultMessage={
          "<p>Log in met je naam om je voortgang te bewaren. Je gegevens worden opgeslagen op de schoolserver.</p>"
        }
      />

      <Header level={2}>
        <FormattedMessage
          id="t_Signin_simple"
          defaultMessage="Inloggen"
        />
      </Header>

      <SimpleLoginForm actions={actions} />
    </Article>
  );
}
