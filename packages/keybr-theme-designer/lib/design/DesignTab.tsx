import {
  applyTheme,
  darkTheme,
  defaultCustomTheme,
  lightTheme,
} from "@keybr/themes";
import { Box, Button, Field, FieldList, useDialog } from "@keybr/widget";
import { useCustomTheme } from "../context/context.ts";
import { BackgroundImage } from "./BackgroundImage.tsx";
import * as styles from "./DesignTab.module.less";
import { KeyboardZoneColors } from "./KeyboardZoneColors.tsx";
import { KeySpeedColors } from "./KeySpeedColors.tsx";
import { PageColors } from "./PageColors.tsx";

export function DesignTab() {
  const { closeDialog } = useDialog();
  const { theme, setTheme } = useCustomTheme();
  return (
    <Box className={styles.root} direction="column">
      <div className={styles.scroll}>
        <FieldList>
          <Field.Filler />
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
              label="Light"
              size={6}
              onClick={() => {
                setTheme(lightTheme);
                applyTheme(lightTheme);
              }}
            />
          </Field>
          <Field>
            <Button
              label="Dark"
              size={6}
              onClick={() => {
                setTheme(darkTheme);
                applyTheme(darkTheme);
              }}
            />
          </Field>
          <Field.Filler />
        </FieldList>
        <PageColors />
        <BackgroundImage />
        <KeySpeedColors />
        <KeyboardZoneColors />
      </div>
      <FieldList>
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
    </Box>
  );
}
