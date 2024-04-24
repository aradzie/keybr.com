import { ErrorDetails, ErrorHandler } from "@keybr/debug";
import { loadIntl } from "@keybr/intl";
import { ThemeProvider, ThemeSwitcher } from "@keybr/lnf";
import { getPageData, PageDataContext } from "@keybr/pages-shared";
import { querySelector } from "@keybr/widget";
import { type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { RawIntlProvider } from "react-intl";
import { type SlotProps } from "./Slot.tsx";

const pageData = getPageData();

export function init(slot: ReactElement<SlotProps> | null): void {
  loadIntl(pageData.locale).then(
    (intl) => {
      if (slot != null) {
        const { children, selector } = slot.props;
        to(selector).render(
          <RawIntlProvider value={intl}>
            <PageDataContext.Provider value={pageData}>
              <ErrorHandler details={ErrorDetails}>{children}</ErrorHandler>
            </PageDataContext.Provider>
          </RawIntlProvider>,
        );
      }
      to(ThemeSwitcher.selector).render(
        <RawIntlProvider value={intl}>
          <ThemeProvider>
            <ThemeSwitcher />
          </ThemeProvider>
        </RawIntlProvider>,
      );
    },
    (err) => {
      console.error("Cannot load translations:", err);
    },
  );
}

function to(selector: string) {
  const container = querySelector(selector);
  return {
    render: (elem: ReactElement): void => {
      createRoot(container).render(elem);
    },
  };
}
