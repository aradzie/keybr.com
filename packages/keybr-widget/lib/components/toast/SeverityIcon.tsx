import {
  mdiAlertCircleOutline,
  mdiCheckCircleOutline,
  mdiInformationOutline,
} from "@mdi/js";
import { type ReactNode } from "react";
import { Icon } from "../icon/index.ts";

export function SeverityIcon({
  severity,
}: {
  readonly severity: "info" | "success" | "error" | null;
}): ReactNode {
  switch (severity) {
    case "info":
      return <InfoIcon />;
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    default:
      return null;
  }
}

export function InfoIcon(): ReactNode {
  return <Icon shape={mdiInformationOutline} />;
}

export function SuccessIcon(): ReactNode {
  return <Icon shape={mdiCheckCircleOutline} />;
}

export function ErrorIcon(): ReactNode {
  return <Icon shape={mdiAlertCircleOutline} />;
}
