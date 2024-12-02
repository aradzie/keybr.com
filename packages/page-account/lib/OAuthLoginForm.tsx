import { Button, Field, FieldList, Icon, Para } from "@keybr/widget";
import { mdiFacebook, mdiGoogle, mdiMicrosoft } from "@mdi/js";
import { FormattedMessage, useIntl } from "react-intl";

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

export function OAuthLoginForm() {
  const { formatMessage } = useIntl();

  return (
    <>
      <FieldList>
        {providers.map(({ id, name, icon }) => (
          <Field key={id}>
            <Button
              size={16}
              icon={<Icon shape={icon} />}
              label={formatMessage(
                {
                  id: "account.socialSignInButton.label",
                  defaultMessage: "Sign-in with {name}",
                },
                { name },
              )}
              onClick={() => {
                document.location = `/auth/oauth-init/${id}`;
              }}
            />
          </Field>
        ))}
      </FieldList>

      <Para>
        <FormattedMessage
          id="account.socialForm.description"
          defaultMessage="Sign-in with your preferred social network. We respect your privacy and promise to never spam your wall, friends, or e-mail."
        />
      </Para>
    </>
  );
}
