import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
} from "react";

export const DynamicStylesContext = createContext({
  getStyledElement: (): HTMLElement => document.body,
});

export const DynamicStylesProvider = ({
  children,
  elementRef,
}: {
  readonly children: ReactNode;
  readonly elementRef: RefObject<HTMLElement>;
}) => {
  return (
    <DynamicStylesContext.Provider
      value={{
        getStyledElement: () => elementRef.current ?? document.body,
      }}
    >
      {children}
    </DynamicStylesContext.Provider>
  );
};

export const useDynamicStyles = () => {
  return useContext(DynamicStylesContext);
};
