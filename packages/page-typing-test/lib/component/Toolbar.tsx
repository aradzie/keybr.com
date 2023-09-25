import {
  Button,
  Field,
  FieldList,
  Icon,
  IconButton,
  Link,
} from "@keybr/widget";
import { mdiCog, mdiHelpCircleOutline } from "@mdi/js";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { limits } from "../session/index.ts";
import { type CompositeSettings } from "./settings/index.ts";
import * as styles from "./Toolbar.module.less";

export const Toolbar = memo(function Toolbar({
  settings,
  onChangeSettings,
  onHelp,
  onConfigure,
}: {
  readonly settings: CompositeSettings;
  readonly onChangeSettings: (settings: CompositeSettings) => void;
  readonly onHelp: () => void;
  readonly onConfigure: () => void;
}): ReactNode {
  return (
    <FieldList className={styles.toolbar}>
      <Field>
        <LimitSwitcher
          settings={settings}
          onChangeSettings={onChangeSettings}
        />
      </Field>
      <Field.Filler />
      <Field>
        <IconButton
          onClick={onHelp}
          icon={<Icon shape={mdiHelpCircleOutline} />}
          title="Show instructions."
        />
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

export const LimitSwitcher = memo(function LimitSwitcher({
  settings,
  onChangeSettings,
}: {
  readonly settings: CompositeSettings;
  readonly onChangeSettings: (settings: CompositeSettings) => void;
}): ReactNode {
  const children: ReactNode[] = [];
  limits.forEach(({ limit, label }, index) => {
    if (index > 0) {
      children.push(
        <span //
          key={children.length}
        >
          {" | "}
        </span>,
      );
    }
    children.push(
      <Link
        key={children.length}
        className={clsx(
          styles.item,
          limit === settings.limit && styles.item_active,
        )}
        href="#"
        onClick={(ev) => {
          ev.preventDefault();
          onChangeSettings({ ...settings, limit });
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
