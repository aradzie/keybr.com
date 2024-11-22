import { type NamedUser } from "@keybr/pages-shared";
import {
  Button,
  Field,
  FieldList,
  Icon,
  TextField,
  type TextFieldRef,
  useClipboard,
} from "@keybr/widget";
import { mdiContentCopy, mdiOpenInNew } from "@mdi/js";
import { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function ShareProfileLink({ user }: { user: NamedUser }) {
  const { formatMessage } = useIntl();
  const textFieldRef = useRef<TextFieldRef>(null);
  const { copyText } = useClipboard();

  const url = new URL(window.location.href);
  url.pathname = `/profile/${user.id}`;
  const href = String(url);

  return (
    <FieldList>
      <Field>
        <FormattedMessage
          id="profile.widget.shareText"
          defaultMessage="Share your profile:"
        />
      </Field>
      <Field>
        <TextField
          ref={textFieldRef}
          size={24}
          value={href}
          onFocus={() => {
            const { current } = textFieldRef;
            if (current != null) {
              current.select();
            }
          }}
        />
      </Field>
      <Field>
        <Button
          icon={<Icon shape={mdiContentCopy} />}
          label={formatMessage({
            id: "profile.widget.share.label",
            defaultMessage: "Copy",
          })}
          title={formatMessage({
            id: "profile.widget.share.description",
            defaultMessage: "Copy profile link to the clipboard.",
          })}
          onClick={() => {
            const { current } = textFieldRef;
            if (current != null) {
              current.select();
              copyText(href);
            }
          }}
        />
      </Field>
      <Field>
        <Button
          icon={<Icon shape={mdiOpenInNew} />}
          label={formatMessage({
            id: "profile.widget.visit.label",
            defaultMessage: "Visit",
          })}
          title={formatMessage({
            id: "profile.widget.visit.description",
            defaultMessage: "Visit your public profile page.",
          })}
          onClick={() => {
            document.location = href;
          }}
        />
      </Field>
    </FieldList>
  );
}
