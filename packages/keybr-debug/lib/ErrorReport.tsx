import { type ReactNode } from "react";
import * as styles from "./ErrorReport.module.less";

export function ErrorReport({
  report,
}: {
  readonly report: string;
}): ReactNode {
  return <pre className={styles.report}>{report}</pre>;
}
