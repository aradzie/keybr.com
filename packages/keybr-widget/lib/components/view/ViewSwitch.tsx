import {
  createContext,
  type FunctionComponent,
  useContext,
  useState,
} from "react";

export type ViewName = string;
export type ViewProps = Record<string, any>;
export type ViewMap = { readonly [name: ViewName]: FunctionComponent<any> };

export const ViewContext = createContext<{
  readonly setView: (name: ViewName, props?: ViewProps) => void;
}>({
  setView: (name) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Switch view to [${name}]`);
    }
  },
});

export function useView<T extends ViewMap>(views: T) {
  return useContext(ViewContext) as {
    readonly setView: (name: keyof T, props?: ViewProps) => void;
  };
}

export function ViewSwitch({ views }: { readonly views: ViewMap }) {
  const [[name, props], setView] = useState(
    () => [Object.keys(views)[0], {}] as [ViewName, ViewProps],
  );
  const View = views[name];
  if (View == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? `Unknown view [${name}]`
        : undefined,
    );
  }
  return (
    <ViewContext.Provider
      value={{
        setView: (name, props = {}) => {
          setView([name, props]);
        },
      }}
    >
      <View {...props} />
    </ViewContext.Provider>
  );
}
