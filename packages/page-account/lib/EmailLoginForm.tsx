import {
  Button,
  Field,
  FieldList,
  Icon,
  Para,
  styleSizeExtraWide,
  styleSizeWide,
  TextField,
} from "@keybr/widget";
import { mdiRepeat, mdiSend } from "@mdi/js";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { type SignInActions } from "./types.ts";

export function EmailLoginForm({
  actions,
}: {
  readonly actions: SignInActions;
}): ReactNode {
  const { formatMessage } = useIntl();
  const [email, setEmail] = useState("");
  const [{ state, message }, setState] = useState<{
    state: "normal" | "sending" | "success" | "error";
    message: string | null;
  }>({ state: "normal", message: null });

  const handleChangeEmail = (value: string): void => {
    setEmail(value);
  };

  const handleClickLogin = (): void => {
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

  const handleClickRetry = (): void => {
    setState({ state: "normal", message: null });
  };

  switch (state) {
    case "sending":
      return (
        <>
          <Para>
            <FormattedMessage
              id="account.emailState.sendingText"
              description="Text message."
              defaultMessage="Sending an e‑mail with the login link to <strong>{email}</strong>... Please wait a second."
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
              description="Text message."
              defaultMessage="We have sent an e‑mail with the login link to <strong>{email}</strong>. It should arrive soon, please check your inbox in a minute or two."
              values={{ email }}
            />
          </Para>

          <Para>
            <Button
              onClick={handleClickRetry}
              className={styleSizeWide}
              icon={<Icon shape={mdiRepeat} />}
              label={formatMessage({
                id: "account.resendButtonLabel",
                description: "Button label.",
                defaultMessage: "Resend",
              })}
              title={formatMessage({
                id: "account.resendButtonTitle",
                description: "Button title.",
                defaultMessage: "Send one more e‑mail.",
              })}
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
              description="Text message."
              defaultMessage="Could not send e‑mail to <strong>{email}</strong>: {message}"
              values={{ email, message }}
            />
          </Para>

          <Para>
            <Button
              onClick={handleClickRetry}
              className={styleSizeWide}
              icon={<Icon shape={mdiRepeat} />}
              label={formatMessage({
                id: "account.retryButtonLabel",
                description: "Button label.",
                defaultMessage: "Retry",
              })}
              title={formatMessage({
                id: "account.retryButtonTitle",
                description: "Button title.",
                defaultMessage: "Send another e‑mail.",
              })}
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
                onChange={handleChangeEmail}
                className={styleSizeExtraWide}
                type="email"
                placeholder={formatMessage({
                  id: "account.emailPlaceholder",
                  description: "Input field placeholder.",
                  defaultMessage: "Your e‑mail address...",
                })}
                title={formatMessage({
                  id: "account.emailTitle",
                  description: "Input field title.",
                  defaultMessage:
                    "This is the e‑mail address we will send the sign‑in link to.",
                })}
                value={email}
              />
            </Field>
            <Field>
              <Button
                onClick={handleClickLogin}
                className={styleSizeWide}
                icon={<Icon shape={mdiSend} />}
                label={formatMessage({
                  id: "account.sendButtonLabel",
                  description: "Button label.",
                  defaultMessage: "Send Sign‑in Link",
                })}
                title={formatMessage({
                  id: "account.sendButtonTitle",
                  description: "Button title.",
                  defaultMessage: "Sign-in with e-mail.",
                })}
              />
            </Field>
          </FieldList>

          <Para>
            <FormattedMessage
              id="account.emailFormDescription"
              description="Freeform text."
              defaultMessage={
                "Simple sign‑in that does not use passwords. " +
                "Just enter your e‑mail address, and we will send you a login link. " +
                "Go to your inbox, click the link to create a new account or to open an existing account for the e‑mail address given. " +
                "The link is temporary and expires in a few hours. " +
                "To sign‑in again later, enter the same e‑mail address, and we will send a new link for the same account."
              }
            />
          </Para>
        </>
      );
  }
}
