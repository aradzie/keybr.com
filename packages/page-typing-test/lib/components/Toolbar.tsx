import { useSettings } from "@keybr/settings";
import { Field, FieldList, Icon, IconButton, Link } from "@keybr/widget";
import { mdiCog } from "@mdi/js";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { durations } from "../session/index.ts";
import { toCompositeSettings, typingTestProps } from "../settings.ts";
import * as styles from "./Toolbar.module.less";

export const Toolbar = memo(function Toolbar({
  onChange,
  onConfigure,
}: {
  readonly onChange: () => void;
  readonly onConfigure: () => void;
}): ReactNode {
  return (
    <FieldList>
      <Field>
        <DurationSwitcher onChange={onChange} />
      </Field>
      <Field.Filler />
      <Field>
        <IconButton
          icon={<Icon shape={mdiCog} />}
          title="Settings..."
          onClick={onConfigure}
        />
      </Field>
    </FieldList>
  );
});

export const DurationSwitcher = memo(function DurationSwitcher({
  onChange,
}: {
  readonly onChange: () => void;
}): ReactNode {
  const { settings, updateSettings } = useSettings();
  const compositeSettings = toCompositeSettings(settings);
  const children: ReactNode[] = [];
  durations.forEach(({ duration, label }, index) => {
    if (index > 0) {
      children.push(<span key={children.length}>{" | "}</span>);
    }
    children.push(
      <Link
        key={children.length}
        className={clsx(
          styles.item,
          duration.type === compositeSettings.duration.type &&
            duration.value === compositeSettings.duration.value &&
            styles.item_active,
        )}
        href="#"
        onClick={(ev) => {
          ev.preventDefault();
          updateSettings(
            settings
              .set(typingTestProps.duration.type, duration.type)
              .set(typingTestProps.duration.value, duration.value),
          );
          onChange();
        }}
      >
        {label}
      </Link>,
    );
  });
  return (
    <>
      <span>Test duration:</span> {children}
    </>
  );
});
