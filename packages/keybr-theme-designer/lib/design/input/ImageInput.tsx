import { getBlobUrl } from "@keybr/themes";
import { useDocumentEvent } from "@keybr/widget";
import { useRef } from "react";
import { acceptImageTypes, acceptsImageType } from "../../io/images.ts";
import * as styles from "./ImageInput.module.less";

export function ImageInput({
  blob,
  onChange,
}: {
  readonly blob: Blob | null;
  readonly onChange: (blob: Blob) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const changeFile = (blob: Blob) => {
    if (blob.size > 0 && acceptsImageType(blob.type)) {
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
        accept={acceptImageTypes}
        onChange={() => {
          const el = inputRef.current!;
          const files = el.files;
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
