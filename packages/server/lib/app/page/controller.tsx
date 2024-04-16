import { controller, http, pathParam, use } from "@fastr/controller";
import { Context } from "@fastr/core";
import { inject, injectable } from "@fastr/invert";
import { CanonicalHandler } from "@fastr/middleware-canonical";
import { type RouterState } from "@fastr/middleware-router";
import { preloadLinks } from "@keybr/assets";
import { HighScoresFactory } from "@keybr/highscores";
import {
  defaultLocale,
  loadIntl,
  type LocaleId,
  PreferredLocaleContext,
} from "@keybr/intl";
import { ThemeContext, type ThemeControl, ThemePrefs } from "@keybr/lnf";
import { AccountPage } from "@keybr/page-account";
import { HelpPage } from "@keybr/page-help";
import { HighScoresPage, mapHighScoresEntries } from "@keybr/page-highscores";
import { LayoutsPage } from "@keybr/page-layouts";
import { MultiplayerPage } from "@keybr/page-multiplayer";
import { PracticePage } from "@keybr/page-practice";
import { ProfilePage, PublicProfilePage } from "@keybr/page-profile";
import { PrivacyPolicyPage, TermsOfServicePage } from "@keybr/page-static";
import { TypingTestPage } from "@keybr/page-typing-test";
import { WordCountPage } from "@keybr/page-word-count";
import { View } from "@keybr/pages-server";
import {
  type NamedUser,
  type PageData,
  PageDataContext,
  type PageDataExtra,
} from "@keybr/pages-shared";
import { SettingsDatabase } from "@keybr/settings-database";
import { type ReactElement } from "react";
import { type IntlShape, RawIntlProvider } from "react-intl";
import { type AuthState, pProfileOwner } from "../auth/index.ts";
import { localePattern, pIntl, preferredLocale } from "./intl.ts";

@injectable()
@controller()
@use(CanonicalHandler)
export class Controller {
  constructor(
    @inject("canonicalUrl") readonly canonicalUrl: string,
    readonly view: View,
    readonly highScores: HighScoresFactory,
    readonly database: SettingsDatabase,
  ) {}

  @http.GET("/")
  async ["index"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <PracticePage />);
  }

  @http.GET(`/{locale:${localePattern}}/index`)
  async ["index-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <PracticePage />);
  }

  @http.GET("/account")
  async ["account"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <AccountPage />);
  }

  @http.GET(`/{locale:${localePattern}}/account`)
  async ["account-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <AccountPage />);
  }

  @http.GET("/profile")
  async ["profile"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <ProfilePage />);
  }

  @http.GET(`/{locale:${localePattern}}/profile`)
  async ["profile-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <ProfilePage />);
  }

  @http.GET("/profile/{publicId:[a-zA-Z0-9]+}")
  async ["public-profile"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("publicId", pProfileOwner) profileOwner: NamedUser,
  ) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl, { profileOwner });
    return this.renderPage(ctx, intl, pageData, <PublicProfilePage />);
  }

  @http.GET(`/{locale:${localePattern}}/profile/{publicId:[a-zA-Z0-9]+}`)
  async ["public-profile-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("publicId", pProfileOwner) profileOwner: NamedUser,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl, { profileOwner });
    return this.renderPage(ctx, intl, pageData, <PublicProfilePage />);
  }

  @http.GET("/help")
  async ["help"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <HelpPage />);
  }

  @http.GET(`/{locale:${localePattern}}/help`)
  async ["help-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <HelpPage />);
  }

  @http.GET("/high-scores")
  async ["high-scores"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    const highScores = await this.highScores.load();
    const entries = await mapHighScoresEntries([...highScores]);
    const element = <HighScoresPage entries={entries} />;
    return this.renderPage(ctx, intl, pageData, element);
  }

  @http.GET(`/{locale:${localePattern}}/high-scores`)
  async ["high-scores-18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    const highScores = await this.highScores.load();
    const entries = await mapHighScoresEntries([...highScores]);
    const element = <HighScoresPage entries={entries} />;
    return this.renderPage(ctx, intl, pageData, element);
  }

  @http.GET("/layouts")
  async ["layouts"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <LayoutsPage />);
  }

  @http.GET(`/{locale:${localePattern}}/layouts`)
  async ["layouts-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <LayoutsPage />);
  }

  @http.GET("/typing-test")
  async ["typing-test"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <TypingTestPage />);
  }

  @http.GET(`/{locale:${localePattern}}/typing-test`)
  async ["typing-test-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <TypingTestPage />);
  }

  @http.GET("/multiplayer")
  async ["multiplayer"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <MultiplayerPage />);
  }

  @http.GET(`/{locale:${localePattern}}/multiplayer`)
  async ["multiplayer-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <MultiplayerPage />);
  }

  @http.GET("/word-count")
  async ["word-count"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <WordCountPage />);
  }

  @http.GET(`/{locale:${localePattern}}/word-count`)
  async ["word-count-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <WordCountPage />);
  }

  @http.GET("/terms-of-service")
  async ["terms-of-service"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <TermsOfServicePage />);
  }

  @http.GET(`/{locale:${localePattern}}/terms-of-service`)
  async ["terms-of-service-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <TermsOfServicePage />);
  }

  @http.GET("/privacy-policy")
  async ["privacy-policy"](ctx: Context<RouterState & AuthState>) {
    const intl = await loadIntl(defaultLocale);
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <PrivacyPolicyPage />);
  }

  @http.GET(`/{locale:${localePattern}}/privacy-policy`)
  async ["privacy-policy-i18n"](
    ctx: Context<RouterState & AuthState>,
    @pathParam("locale", pIntl) intl: IntlShape,
  ) {
    const pageData = await this.pageData(ctx, intl);
    return this.renderPage(ctx, intl, pageData, <PrivacyPolicyPage />);
  }

  async pageData(
    ctx: Context<RouterState & AuthState>,
    { locale }: IntlShape,
    extra: PageDataExtra = {},
  ): Promise<PageData> {
    const { user, publicUser } = ctx.state;
    const settings = user != null ? await this.database.get(user.id!) : null;
    return {
      base: this.canonicalUrl,
      locale: locale as LocaleId,
      user: user?.toDetails() ?? null,
      publicUser,
      settings: settings?.toJSON() ?? null,
      prefs: themePrefs(ctx),
      extra,
    };
  }

  async renderPage(
    ctx: Context<RouterState & AuthState>,
    intl: IntlShape,
    pageData: PageData,
    element: ReactElement,
  ): Promise<string> {
    ctx.response.type = "text/html";

    for (const preloadLink of preloadLinks) {
      ctx.response.headers.append("Link", this.view.preloadHeader(preloadLink));
    }

    return this.view.renderPage(
      <RawIntlProvider value={intl}>
        <PreferredLocaleContext.Provider value={preferredLocale(ctx)}>
          <PageDataContext.Provider value={pageData}>
            <ThemeContext.Provider
              value={themeControl(new ThemePrefs(pageData.prefs))}
            >
              {element}
            </ThemeContext.Provider>
          </PageDataContext.Provider>
        </PreferredLocaleContext.Provider>
      </RawIntlProvider>,
    );
  }
}

function themePrefs(ctx: Context<RouterState & AuthState>): ThemePrefs {
  let cookie = ctx.cookies.get(ThemePrefs.cookieKey) || null;
  if (cookie) {
    try {
      cookie = decodeURIComponent(cookie);
    } catch {
      cookie = null;
    }
  }
  return ThemePrefs.deserialize(cookie);
}

function themeControl({ color, font }: ThemePrefs): ThemeControl {
  return {
    fullscreenState: null,
    color,
    font,
    toggleFullscreen: (): void => {},
    switchColor: (): void => {},
    switchFont: (): void => {},
  };
}
