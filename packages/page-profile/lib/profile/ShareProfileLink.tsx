import { type NamedUser } from "@keybr/pages-shared";
import {
  Button,
  Field,
  FieldList,
  Icon,
  styleWidth24,
  TextField,
  type TextFieldRef,
  useClipboard,
} from "@keybr/widget";
import { mdiContentCopy, mdiOpenInNew } from "@mdi/js";
import { type ReactNode, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function ShareProfileLink({
  user,
}: {
  readonly user: NamedUser;
}): ReactNode {
  const { formatMessage } = useIntl();
  const textFieldRef = useRef<TextFieldRef>(null);
  const { copyText } = useClipboard();

  const url = new URL(window.location.href);
  url.pathname = `/profile/${user.id}`;
  const href = String(url);
  const target = `/profile/${user.id}`;

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
          className={styleWidth24}
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
          href={href}
          target={target}
          label={formatMessage({
            id: "profile.widget.visit.label",
            defaultMessage: "Visit",
          })}
          title={formatMessage({
            id: "profile.widget.visit.description",
            defaultMessage: "Visit your public profile page.",
          })}
        />
      </Field>
    </FieldList>
  );
}
