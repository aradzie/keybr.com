import {
  applyTheme,
  darkTheme,
  defaultCustomTheme,
  lightTheme,
  useTheme,
} from "@keybr/themes";
import { Box, Button, Field, FieldList, useDialog } from "@keybr/widget";
import { useRef } from "react";
import { useCustomTheme } from "../context/context.ts";
import { themeExt, themeFileName } from "../io/constants.ts";
import { exportTheme, importTheme } from "../io/io.ts";
import { BackgroundImage } from "./BackgroundImage.tsx";
import * as styles from "./DesignTab.module.less";
import { KeyboardZoneColors } from "./KeyboardZoneColors.tsx";
import { KeySpeedColors } from "./KeySpeedColors.tsx";
import { PageColors } from "./PageColors.tsx";

export function DesignTab() {
  const { closeDialog } = useDialog();
  const { refresh } = useTheme();
  const { theme, setTheme } = useCustomTheme();
  const exportRef = useRef<HTMLAnchorElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  return (
    <Box className={styles.root} direction="column">
      <a
        ref={exportRef}
        href="#"
        download={themeFileName}
        hidden={true}
        style={{ inlineSize: 0, blockSize: 0, overflow: "hidden" }}
      />
      <input
        ref={importRef}
        type="file"
        accept={themeExt}
        hidden={true}
        style={{ inlineSize: 0, blockSize: 0, overflow: "hidden" }}
        onChange={() => {
          const el = importRef.current!;
          const files = el.files;
          if (files != null && files.length > 0) {
            importTheme(files[0])
              .then(({ theme, errors }) => {
                for (const err of errors) {
                  console.error("Theme import error", err);
                }
                setTheme(theme);
                applyTheme(theme);
                refresh();
              })
              .catch((err) => {
                console.error("Theme import error", err);
              })
              .finally(() => {
                el.value = "";
              });
          }
        }}
      />
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
                refresh();
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
                refresh();
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
                refresh();
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
              refresh();
            }}
          />
        </Field>
        <Field>
          <Button
            label="Import"
            size={6}
            onClick={() => {
              const el = importRef.current!;
              el.click();
            }}
          />
        </Field>
        <Field>
          <Button
            label="Export"
            size={6}
            onClick={() => {
              exportTheme(theme)
                .then((blob) => {
                  const el = exportRef.current!;
                  el.setAttribute("href", URL.createObjectURL(blob));
                  el.click();
                })
                .catch((err) => {
                  console.error("Theme export error", err);
                });
            }}
          />
        </Field>
        <Field.Filler />
        <Field>
          <Button
            label="Close"
            size={6}
            onClick={() => {
              applyTheme(theme);
              refresh();
              closeDialog();
            }}
          />
        </Field>
      </FieldList>
    </Box>
  );
}
