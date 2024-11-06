import { useState } from "react";
import { useDocumentEvent } from "./use-document-event.ts";

export const useDocumentVisibility = () => {
  const [visible, setVisible] = useState(isDocumentVisible());
  useDocumentEvent("visibilitychange", () => {
    setVisible(isDocumentVisible());
  });
  return visible;
};

export const isDocumentVisible = () => {
  return document.visibilityState === "visible";
};
