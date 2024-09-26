import { LoadingProgress, type NamedUser } from "@keybr/pages-shared";
import { type ReactNode, useMemo } from "react";
import { useLoader } from "./internal/loader.ts";
import { ResultProvider } from "./internal/ResultProvider.tsx";
import { openResultStorage } from "./internal/storage.ts";
import { type ResultStorage } from "./internal/types.ts";

export function PublicResultLoader({
  user,
  children,
}: {
  readonly user: NamedUser;
  readonly children: ReactNode;
}): ReactNode {
  const storage = useResultStorage(user.id);
  const state = useLoader(storage);
  if (state.type === "loading") {
    return <LoadingProgress total={state.total} current={state.current} />;
  } else {
    return (
      <ResultProvider storage={storage} initialResults={state.results}>
        {children}
      </ResultProvider>
    );
  }
}

function useResultStorage(userId: string): ResultStorage {
  return useMemo(() => openResultStorage({ type: "public", userId }), [userId]);
}
