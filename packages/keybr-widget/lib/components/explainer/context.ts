import { createContext, useContext } from "react";

export type ExplainerStateType = {
  readonly explainersVisible: boolean;
  readonly toggleExplainers: (visible?: boolean) => void;
};

export const ExplainerStateContext = createContext<ExplainerStateType>({
  explainersVisible: true,
  toggleExplainers: () => {},
});

export function useExplainerState(): ExplainerStateType {
  return useContext(ExplainerStateContext);
}
