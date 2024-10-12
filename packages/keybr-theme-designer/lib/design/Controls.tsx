import { applyTheme, defaultCustomTheme } from "@keybr/themes";
import { Button, Field, FieldList, useDialog } from "@keybr/widget";
import { useCustomTheme } from "../context/context.ts";

export function Controls() {
  const { closeDialog } = useDialog();
  const { theme, setTheme } = useCustomTheme();
  return (
    <FieldList>
      <Field>
        <Button
          label="Reset"
          size={6}
          onClick={() => {
            setTheme(defaultCustomTheme);
            applyTheme(defaultCustomTheme);
          }}
        />
      </Field>
      <Field>
        <Button
          label="Apply"
          size={6}
          onClick={() => {
            applyTheme(theme);
          }}
        />
      </Field>
      <Field>
        <Button label="Import" size={6} disabled={true} />
      </Field>
      <Field>
        <Button label="Export" size={6} disabled={true} />
      </Field>
      <Field.Filler />
      <Field>
        <Button
          label="Close"
          size={6}
          onClick={() => {
            applyTheme(theme);
            closeDialog();
          }}
        />
      </Field>
    </FieldList>
  );
}
