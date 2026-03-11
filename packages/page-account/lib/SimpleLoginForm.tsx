import { Button, Field, FieldList, Icon, Para, TextField } from "@keybr/widget";
import { mdiLogin } from "@mdi/js";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { type SignInActions } from "./actions.ts";

export function SimpleLoginForm({ actions }: { actions: SignInActions }) {
  const { formatMessage } = useIntl();
  const [username, setUsername] = useState("");
  const [{ state, message }, setState] = useState<{
    state: "normal" | "sending" | "success" | "error";
    message: string | null;
  }>({ state: "normal", message: null });

  const handleChangeUsername = (value: string) => {
    setUsername(value);
  };

  const handleClickLogin = () => {
    if (username.trim() !== "") {
      setState({ state: "sending", message: null });
      actions
        .loginSimple(username.trim())
        .then(() => {
          setState({ state: "success", message: null });
          window.location.href = "/account";
        })
        .catch((error) => {
          setState({ state: "error", message: error.message });
        });
    }
  };

  const handleClickRetry = () => {
    setState({ state: "normal", message: null });
  };

  switch (state) {
    case "sending":
      return (
        <Para>
          <FormattedMessage
            id="account.simpleLogin.sending"
            defaultMessage="Even geduld..."
          />
        </Para>
      );

    case "error":
      return (
        <>
          <Para>
            <FormattedMessage
              id="account.simpleLogin.error"
              defaultMessage="Inloggen mislukt: {message}"
              values={{ message }}
            />
          </Para>
          <Para>
            <Button
              size={16}
              label={formatMessage({
                id: "t_Retry",
                defaultMessage: "Retry",
              })}
              onClick={handleClickRetry}
            />
          </Para>
        </>
      );

    default:
      return (
        <>
          <FieldList>
            <Field>
              <TextField
                size={24}
                type="text"
                placeholder={formatMessage({
                  id: "account.simpleLogin.placeholder",
                  defaultMessage: "voornaam.naam (bv. emma.peeters)",
                })}
                value={username}
                onChange={handleChangeUsername}
              />
            </Field>
            <Field>
              <Button
                size={16}
                icon={<Icon shape={mdiLogin} />}
                label={formatMessage({
                  id: "account.simpleLogin.button",
                  defaultMessage: "Inloggen",
                })}
                onClick={handleClickLogin}
              />
            </Field>
          </FieldList>

          <Para>
            <FormattedMessage
              id="account.simpleLogin.description"
              defaultMessage="Typ je naam in als voornaam.naam (kleine letters, met een punt). Als je naam nog niet bestaat, wordt er automatisch een account aangemaakt. Gebruik elke les dezelfde naam zodat je voortgang bewaard blijft."
            />
          </Para>
        </>
      );
  }
}
