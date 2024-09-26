import { type Pages } from "@keybr/pages-shared";
import { type ReactNode, useEffect } from "react";
import { useIntl } from "react-intl";

export function Meta({
  page: { meta },
  title,
  description,
}: {
  readonly page: Pages.Meta;
  readonly title?: string | null;
  readonly description?: string | null;
}): ReactNode {
  const { formatMessage } = useIntl();
  title =
    title ??
    (typeof meta.title === "string" //
      ? meta.title
      : formatMessage(meta.title));
  description =
    description ??
    (typeof meta.description === "string" //
      ? meta.description
      : formatMessage(meta.description));
  useEffect(() => {
    document.title = title;
    const el = document.querySelector<HTMLMetaElement>(
      "meta[name=description]",
    );
    if (el != null) {
      el.content = description;
    }
  }, [title, description]);
  return null;
}
