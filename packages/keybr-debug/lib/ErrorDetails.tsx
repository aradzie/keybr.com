import { Article, Header, Para } from "@keybr/widget";
import { type ReactNode } from "react";
import * as styles from "./ErrorDetails.module.less";

export function ErrorDetails({
  report,
}: {
  readonly report: string;
}): ReactNode {
  return (
    <Article>
      <Header level={1}>Error</Header>

      <Para>Oh no, something bad has happened!</Para>

      <pre className={styles.report}>{report}</pre>
    </Article>
  );
}
