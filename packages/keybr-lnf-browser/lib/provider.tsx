import { Cookie, SetCookie } from "@fastr/headers";
import {
  type ColorName,
  COLORS,
  type FontName,
  FONTS,
  ThemeContext,
  ThemePrefs,
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
  readonly color: ColorName;
  readonly font: FontName;
};

export class ThemeProvider extends Component<Props, State> {
  override state: State = {
    fullscreenState: false,
    color: "light",
    font: "opensans",
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
    const { fullscreenState, color, font } = this.state;
    return (
      <ThemeContext.Provider
        value={{
          fullscreenState,
          color,
          font,
          toggleFullscreen: this.toggleFullscreen,
          switchColor: this.switchColor,
          switchFont: this.switchFont,
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

  readonly switchColor = (color: ColorName): void => {
    this.setState({ color }, () => {
      const { state } = this;
      const { id } = COLORS.findOption(state.color);
      document.documentElement.setAttribute("data-color", id);
      storePrefs(new ThemePrefs(state));
    });
  };

  readonly switchFont = (font: FontName): void => {
    this.setState({ font }, () => {
      const { state } = this;
      const { id } = FONTS.findOption(state.font);
      document.documentElement.setAttribute("data-font", id);
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
    const { color, font } = ThemePrefs.deserialize(
      Cookie.parse(document.cookie).get(ThemePrefs.cookieKey),
    );
    return { fullscreenState, color: color, font: font };
  } catch {
    return { fullscreenState: null, color: "light", font: "opensans" };
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
