import { Cookie, SetCookie } from "@fastr/headers";
import {
  TEXT_SIZES,
  type TextSize,
  ThemeContext,
  type ThemeName,
  ThemePrefs,
  THEMES,
} from "@keybr/lnf";
import { Component, type ReactNode } from "react";
import { installPolyfills } from "./fullscreen-polyfill.ts";

const ON_FULLSCREEN_CHANGE = "fullscreenchange";
const ON_FULLSCREEN_ERROR = "fullscreenerror";

type Props = {
  readonly children?: ReactNode;
};

type State = {
  readonly fullscreenState: boolean | null;
  readonly themeName: ThemeName;
  readonly textSize: TextSize;
};

export class ThemeProvider extends Component<Props, State> {
  override state: State = {
    fullscreenState: false,
    themeName: "light",
    textSize: "normal",
  };

  override componentDidMount(): void {
    installPolyfills();
    this.setState(getInitialState());
    document.addEventListener(
      ON_FULLSCREEN_CHANGE, //
      this.handleFullscreenChange,
    );
    document.addEventListener(
      ON_FULLSCREEN_ERROR, //
      this.handleFullscreenError,
    );
  }

  override componentWillUnmount(): void {
    document.removeEventListener(
      ON_FULLSCREEN_CHANGE, //
      this.handleFullscreenChange,
    );
    document.removeEventListener(
      ON_FULLSCREEN_ERROR, //
      this.handleFullscreenError,
    );
  }

  override render(): ReactNode {
    const { fullscreenState, themeName, textSize } = this.state;
    return (
      <ThemeContext.Provider
        value={{
          fullscreenState,
          themeName,
          textSize,
          toggleFullscreen: this.toggleFullscreen,
          switchTheme: this.switchTheme,
          switchTextSize: this.switchTextSize,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }

  private readonly handleFullscreenChange = (): void => {
    this.setState({ fullscreenState: document.fullscreenElement != null });
  };

  private readonly handleFullscreenError = (): void => {
    this.setState({ fullscreenState: null });
  };

  readonly toggleFullscreen = (): void => {
    if (document.fullscreenElement == null) {
      document.documentElement.requestFullscreen().catch(() => {
        this.setState({ fullscreenState: null });
      });
    } else {
      document.exitFullscreen().catch(() => {
        this.setState({ fullscreenState: null });
      });
    }
  };

  readonly switchTheme = (themeName: ThemeName): void => {
    this.setState({ themeName }, () => {
      const { state } = this;
      const { id } = THEMES.findOption(state.themeName);
      document.documentElement.setAttribute("data-theme", id);
      storePrefs(new ThemePrefs(state));
    });
  };

  readonly switchTextSize = (textSize: TextSize): void => {
    this.setState({ textSize }, () => {
      const { state } = this;
      const { id } = TEXT_SIZES.findOption(state.textSize);
      document.documentElement.setAttribute("data-text", id);
      storePrefs(new ThemePrefs(state));
    });
  };
}

function getInitialState(): State {
  try {
    let fullscreenState = null;
    if (document.fullscreenEnabled) {
      fullscreenState = document.fullscreenElement != null;
    }
    const { themeName, textSize } = ThemePrefs.deserialize(
      Cookie.parse(document.cookie).get(ThemePrefs.cookieKey),
    );
    return { fullscreenState, themeName, textSize };
  } catch {
    return { fullscreenState: null, themeName: "light", textSize: "normal" };
  }
}

function storePrefs(prefs: ThemePrefs): void {
  document.cookie = String(
    new SetCookie(ThemePrefs.cookieKey, ThemePrefs.serialize(prefs), {
      maxAge: 100 * 24 * 60 * 60,
      sameSite: "Lax",
    }),
  );
}
