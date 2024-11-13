import { Keyboard, KeyModifier, Layout, loadKeyboard } from "@keybr/keyboard";
import { LayoutBuilder } from "@keybr/keyboard-io";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const CustomLayoutContext = createContext<{
  readonly keyboard: Keyboard;
  readonly layout: LayoutBuilder;
  readonly setLayout: (layout: LayoutBuilder) => void;
}>(null!);

export function useCustomLayout() {
  const value = useContext(CustomLayoutContext);
  if (value == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? "CustomLayoutContext is missing"
        : undefined,
    );
  }
  return value;
}

export function CustomLayoutProvider({
  children,
  layout = Layout.EN_US,
}: {
  readonly children: ReactNode;
  readonly layout?: Layout;
}) {
  const [customLayout, setCustomLayout] = useState(() =>
    fix(new LayoutBuilder()),
  );
  const [keyboard, setKeyboard] = useState(() => loadKeyboard(layout));
  useEffect(() => {
    const { geometry, geometryDict } = loadKeyboard(layout);
    setKeyboard(
      new Keyboard(
        Layout.custom(layout.language),
        geometry,
        customLayout.dict(),
        geometryDict,
      ),
    );
  }, [layout, customLayout]);
  return (
    <CustomLayoutContext.Provider
      value={{
        keyboard,
        layout: customLayout,
        setLayout: (layout) => {
          setCustomLayout(fix(new LayoutBuilder(layout)));
        },
      }}
    >
      {children}
    </CustomLayoutContext.Provider>
  );
}

function fix(layout: LayoutBuilder) {
  return layout.setOne("Space", KeyModifier.None, 0x0020);
}
