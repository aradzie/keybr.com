import * as styles from "./ErrorReport.module.less";

export function ErrorReport({ report }: { readonly report: string }) {
  return <pre className={styles.report}>{report}</pre>;
}
