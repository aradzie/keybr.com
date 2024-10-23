import {
  applyTheme,
  customTheme,
  darkTheme,
  lightTheme,
  useTheme,
} from "@keybr/themes";
import { Box, Button, Field, FieldList, useDialog } from "@keybr/widget";
import { useRef } from "react";
import { themeExt, themeFileName } from "../io/constants.ts";
import { reportError } from "../io/ErrorAlert.tsx";
import { exportTheme, importTheme } from "../io/io.ts";
import { BackgroundImage } from "./BackgroundImage.tsx";
import { useCustomTheme } from "./context.ts";
import * as styles from "./DesignPane.module.less";
import { KeyboardDesign } from "./KeyboardDesign.tsx";
import { LessonKeysDesign } from "./LessonKeysDesign.tsx";
import { SyntaxDesign } from "./SyntaxDesign.tsx";
import { WidgetsDesign } from "./WidgetsDesign.tsx";

export function DesignPane() {
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
                if (errors.length > 0) {
                  reportError(new AggregateError(errors));
                }
                setTheme(theme);
                applyTheme(theme);
                refresh();
              })
              .catch((err) => {
                console.error(err);
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
                setTheme(customTheme);
                applyTheme(customTheme);
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
        <WidgetsDesign />
        <BackgroundImage />
        <LessonKeysDesign />
        <KeyboardDesign />
        <SyntaxDesign />
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
                  console.error(err);
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
