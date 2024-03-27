import { Article, Header } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AccountName } from "./AccountName.tsx";
import { EmailLoginForm } from "./EmailLoginForm.tsx";
import { FreeAccountOverview } from "./FreeAccountOverview.tsx";
import { OAuthLoginForm } from "./OAuthLoginForm.tsx";
import { type SignInActions } from "./types.ts";

export function SignInSection({
  actions = {} as SignInActions,
}: {
  readonly actions?: SignInActions;
}): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <Article>
      <AccountName
        name={formatMessage({
          id: "account.anonymousUserName",
          defaultMessage: "Anonymous User",
        })}
      />

      <FormattedMessage
        id="account.signInPage.description"
        defaultMessage={
          "<p>Create an account to store your typing data on our servers in the cloud. This allows you to access your profile from any computer or browser. If you don’t have an account then your typing data is stored locally and is accessible only from your current computer.</p>" +
          "<p>We don’t store any passwords. Instead we use third-party services to authenticate our users. We offer several convenient ways to create an account and sign-in.</p>" +
          "<p>You can opt-out at any time. Deleting an account is as simple as creating one.</p>"
        }
      />

      <Header level={2}>
        <FormattedMessage
          id="account.premiumAccount.header"
          defaultMessage="Premium Account"
        />
      </Header>

      <FreeAccountOverview />

      <Header level={2}>
        <FormattedMessage
          id="account.socialSignIn.header"
          defaultMessage="Sign-In with Social Networks"
        />
      </Header>

      <OAuthLoginForm />

      <Header level={2}>
        <FormattedMessage
          id="account.emailSignIn.header"
          defaultMessage="Sign-In with E-mail"
        />
      </Header>

      <EmailLoginForm actions={actions} />
    </Article>
  );
}
