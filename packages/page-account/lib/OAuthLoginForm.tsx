import {
  Button,
  Field,
  FieldList,
  Icon,
  Para,
  styleWidthWide,
} from "@keybr/widget";
import { mdiFacebook, mdiGoogle, mdiMicrosoft } from "@mdi/js";
import { type ReactNode } from "react";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";

const providers: readonly {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
}[] = [
  {
    id: "google",
    name: "Google",
    icon: mdiGoogle,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    icon: mdiMicrosoft,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: mdiFacebook,
  },
];

export function OAuthLoginForm(): ReactNode {
  const { formatMessage } = useIntl();
  const signInButtonLabel = defineMessage({
    id: "account.socialSignInButtonLabel",
    description: "Button title.",
    defaultMessage: "Sign‑in with {name}",
  });
  const signInButtonTitle = defineMessage({
    id: "account.socialSignInButtonTitle",
    description: "Button title.",
    defaultMessage: "Sign‑in with a social network.",
  });

  return (
    <>
      <FieldList>
        {providers.map(({ id, name, icon }) => (
          <Field key={id}>
            <Button
              className={styleWidthWide}
              href={`/auth/oauth-init/${id}`}
              icon={<Icon shape={icon} />}
              label={formatMessage(signInButtonLabel, { name })}
              title={formatMessage(signInButtonTitle)}
            />
          </Field>
        ))}
      </FieldList>

      <Para>
        <FormattedMessage
          id="account.socialFormDescription"
          description="Freeform text."
          defaultMessage="Sign‑in with your preferred social network. We respect your privacy and promise to never spam your wall, friends, or e‑mail."
        />
      </Para>
    </>
  );
}
