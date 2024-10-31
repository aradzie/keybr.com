import { useSettings } from "@keybr/settings";
import { Button, Field, FieldList, Icon, Link } from "@keybr/widget";
import { mdiCog } from "@mdi/js";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { durations } from "../session/index.ts";
import { toCompositeSettings, typingTestProps } from "../settings.ts";
import * as styles from "./Toolbar.module.less";

export const Toolbar = memo(function Toolbar({
  onConfigure,
}: {
  readonly onConfigure: () => void;
}): ReactNode {
  return (
    <FieldList>
      <Field>
        <DurationSwitcher />
      </Field>
      <Field.Filler />
      <Field>
        <Button
          icon={<Icon shape={mdiCog} />}
          label="Settings..."
          title="Change test settings."
          onClick={onConfigure}
        />
      </Field>
    </FieldList>
  );
});

export const DurationSwitcher = memo(function DurationSwitcher(): ReactNode {
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
