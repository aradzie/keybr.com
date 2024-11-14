import { type KeyId } from "@keybr/keyboard";
import { exportLayout, importLayout, LayoutBuilder } from "@keybr/keyboard-io";
import { Button, ErrorAlert, Field, FieldList, Para } from "@keybr/widget";
import { useRef, useState } from "react";
import { CustomLayoutProvider, useCustomLayout } from "./context.tsx";
import { LayoutView } from "./LayoutView.tsx";
import { LiveImport } from "./LiveImport.tsx";

export function CustomLayoutDesigner() {
  return (
    <CustomLayoutProvider>
      <DesignPane />
    </CustomLayoutProvider>
  );
}

function DesignPane() {
  const exportRef = useRef<HTMLAnchorElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const { layout, setLayout } = useCustomLayout();
  const [keyId, setKeyId] = useState<KeyId>("Space");
  return (
    <section>
      <a
        ref={exportRef}
        href="#"
        download="layout.json"
        hidden={true}
        style={{ inlineSize: 0, blockSize: 0, overflow: "hidden" }}
      />
      <input
        ref={importRef}
        type="file"
        accept="*/*"
        hidden={true}
        style={{ inlineSize: 0, blockSize: 0, overflow: "hidden" }}
        onChange={() => {
          const el = importRef.current!;
          const files = el.files;
          if (files != null && files.length > 0) {
            importLayout(files[0])
              .then((result) => {
                if (result == null) {
                  ErrorAlert.report("Invalid layout file");
                } else {
                  const { layout, warnings } = result;
                  setLayout(layout);
                  if (warnings.length > 0) {
                    ErrorAlert.report(new AggregateError(warnings));
                  }
                }
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
      <Para align="center">
        This is a preview of the feature that is still a work in progress.
      </Para>
      <LayoutView keyId={keyId} setKeyId={setKeyId} />
      <LiveImport onChange={setKeyId} />
      <FieldList>
        <Field>
          <Button
            label="Export"
            onClick={() => {
              exportLayout(layout)
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
        <Field>
          <Button
            label="Import"
            onClick={() => {
              const el = importRef.current!;
              el.click();
            }}
          />
        </Field>
        <Field.Filler />
        <Field>
          <Button
            label="Reset"
            onClick={() => {
              setLayout(new LayoutBuilder());
            }}
          />
        </Field>
      </FieldList>
    </section>
  );
}
