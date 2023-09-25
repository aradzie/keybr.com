import { useState } from "react";

export type ClipboardResult =
  | { readonly type: "copying" }
  | { readonly type: "copied" }
  | {
      readonly type: "error";
      readonly error: Error;
    };

export const useClipboard = (): {
  reset: () => void;
  copyText: (text: string) => void;
  // copyItems: (items: ClipboardItems) => void;
  result: ClipboardResult;
} => {
  const [result, setResult] = useState<ClipboardResult>({ type: "copying" });

  const reset = (): void => {
    setResult({ type: "copying" });
  };

  const withClipboard = (cb: (clipboard: Clipboard) => Promise<void>): void => {
    if ("clipboard" in navigator) {
      reset();
      cb(navigator.clipboard)
        .then(() => {
          setResult({ type: "copied" });
        })
        .catch((error) => {
          setResult({ type: "error", error });
        });
    } else {
      setResult({ type: "error", error: new Error("Not supported") });
    }
  };

  const copyText = (text: string): void => {
    withClipboard((clipboard) => clipboard.writeText(text));
  };

  // const copyItems = (items: ClipboardItems): void => {
  //   withClipboard((clipboard) => clipboard.write(items));
  // };

  return { reset, copyText, result };
};
