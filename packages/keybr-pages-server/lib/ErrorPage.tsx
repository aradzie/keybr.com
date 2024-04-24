import { StylesheetAssets } from "@keybr/assets";
import { ThemePrefs, useTheme } from "@keybr/lnf";
import { Header, Link, Para } from "@keybr/widget";
import { type ReactNode } from "react";
import * as styles from "./ErrorPage.module.less";

export type ErrorDetails = {
  readonly status: number;
  readonly message: string;
  readonly expose: boolean;
  readonly description?: string | null;
};

export function inspectError(err: Error): ErrorDetails | null {
  if (err != null && typeof err === "object" && "message" in err) {
    const {
      message,
      status = 500,
      expose = false,
      description = null,
    } = err as any;
    return {
      status,
      message,
      expose,
      description,
    };
  }
  return null;
}

export function ErrorPage({
  error,
}: {
  readonly error: ErrorDetails;
}): ReactNode {
  const theme = useTheme();

  return (
    <html lang="en" {...ThemePrefs.dataAttributes(theme)}>
      <head>
        <meta charSet="UTF-8" />
        <title>{`${error.status} - ${error.message}`}</title>
        <StylesheetAssets entrypoint="page-static" />
      </head>
      <body className={styles.body}>
        <div className={styles.center}>
          <div className={styles.content}>
            <Header level={1}>
              {error.status} - {error.message}
            </Header>
            <Para>{getDescription(error)}</Para>
            <Para>
              <Link href="/">Start over</Link>
            </Para>
          </div>
        </div>
      </body>
    </html>
  );
}

function getDescription(error: ErrorDetails): ReactNode {
  const { status, message, description } = error;
  if (description) {
    return description;
  }
  switch (status) {
    case 400:
      return `Request contained invalid data or parameters.`;
    case 403:
      return `You cannot access this page.`;
    case 404:
      return `The page you are looking for does not exist.`;
    case 500:
      return `Something is wrong with our server. Please try again later.`;
  }
  return message;
}
