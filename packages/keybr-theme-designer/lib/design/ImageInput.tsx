import { getBlobUrl } from "@keybr/themes";
import { useDocumentEvent } from "@keybr/widget";
import { useRef } from "react";
import * as styles from "./ImageInput.module.less";
import { acceptFileTypes, acceptsFileType } from "./images.ts";

export function ImageInput({
  blob,
  onChange,
}: {
  readonly blob: Blob | null;
  readonly onChange: (blob: Blob) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const changeFile = (blob: Blob) => {
    if (blob.size > 0 && acceptsFileType(blob.type)) {
      onChange(blob);
    }
  };

  useDocumentEvent("paste", (ev) => {
    const files = ev.clipboardData?.files;
    if (files != null && files.length > 0) {
      ev.preventDefault();
      changeFile(files[0]);
    }
  });

  return (
    <div
      className={styles.root}
      onDragOver={(ev) => {
        ev.preventDefault();
      }}
      onDrop={(ev) => {
        ev.preventDefault();
        const files = ev.dataTransfer.files;
        if (files != null && files.length > 0) {
          changeFile(files[0]);
        }
      }}
    >
      {blob && (
        <img className={styles.preview} src={getBlobUrl(blob)} alt="Preview" />
      )}
      <input
        ref={inputRef}
        id={styles.inputId}
        className={styles.input}
        type="file"
        accept={acceptFileTypes}
        onChange={() => {
          const files = inputRef.current?.files;
          if (files != null && files.length > 0) {
            changeFile(files[0]);
          }
        }}
      />
      <label className={styles.label} htmlFor={styles.inputId}>
        Select, drop or paste a file...
      </label>
    </div>
  );
}
