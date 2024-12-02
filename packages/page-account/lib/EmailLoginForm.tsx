import { Button, Field, FieldList, Icon, Para, TextField } from "@keybr/widget";
import { mdiRepeat, mdiSend } from "@mdi/js";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { type SignInActions } from "./actions.ts";

export function EmailLoginForm({ actions }: { actions: SignInActions }) {
  const { formatMessage } = useIntl();
  const [email, setEmail] = useState("");
  const [{ state, message }, setState] = useState<{
    state: "normal" | "sending" | "success" | "error";
    message: string | null;
  }>({ state: "normal", message: null });

  const handleChangeEmail = (value: string) => {
    setEmail(value);
  };

  const handleClickLogin = () => {
    if (email !== "") {
      setState({ state: "sending", message: null });
      actions
        .registerEmail(email.trim())
        .then(() => {
          setState({ state: "success", message: null });
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
        <>
          <Para>
            <FormattedMessage
              id="account.emailState.sendingText"
              defaultMessage="Sending an e-mail with the login link to <strong>{email}</strong>... Please wait a second."
              values={{ email }}
            />
          </Para>
        </>
      );

    case "success":
      return (
        <>
          <Para>
            <FormattedMessage
              id="account.emailState.sentText"
              defaultMessage="We have sent an e-mail with the login link to <strong>{email}</strong>. It should arrive soon, please check your inbox in a minute or two."
              values={{ email }}
            />
          </Para>

          <Para>
            <Button
              size={16}
              icon={<Icon shape={mdiRepeat} />}
              label={formatMessage({
                id: "account.widget.resend.label",
                defaultMessage: "Resend",
              })}
              onClick={handleClickRetry}
            />
          </Para>
        </>
      );

    case "error":
      return (
        <>
          <Para>
            <FormattedMessage
              id="account.emailState.errorText"
              defaultMessage="Could not send e-mail to <strong>{email}</strong>: {message}"
              values={{ email, message }}
            />
          </Para>

          <Para>
            <Button
              size={16}
              icon={<Icon shape={mdiRepeat} />}
              label={formatMessage({
                id: "account.widget.retrySend.label",
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
                type="email"
                placeholder={formatMessage({
                  id: "account.widget.email.placeholder",
                  defaultMessage: "Your e-mail address...",
                })}
                value={email}
                onChange={handleChangeEmail}
              />
            </Field>
            <Field>
              <Button
                size={16}
                icon={<Icon shape={mdiSend} />}
                label={formatMessage({
                  id: "account.widget.send.label",
                  defaultMessage: "Send Sign-in Link",
                })}
                onClick={handleClickLogin}
              />
            </Field>
          </FieldList>

          <Para>
            <FormattedMessage
              id="account.emailForm.description"
              defaultMessage={
                "Simple sign-in that does not use passwords. " +
                "Just enter your e-mail address, and we will send you a login link. " +
                "Go to your inbox, click the link to create a new account or to open an existing account for the e-mail address given. " +
                "The link is temporary and expires in a few hours. " +
                "To sign-in again later, enter the same e-mail address, and we will send a new link for the same account."
              }
            />
          </Para>
        </>
      );
  }
}
