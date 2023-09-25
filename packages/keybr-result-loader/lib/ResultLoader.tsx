import { LoadingProgress, usePageData } from "@keybr/pages-shared";
import { type ReactNode, useMemo } from "react";
import { useLoader } from "./internal/loader.ts";
import { ResultProvider } from "./internal/ResultProvider.tsx";
import { openResultStorage } from "./internal/storage.ts";
import { type ResultStorage } from "./internal/types.ts";

export function ResultLoader({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const storage = useResultStorage();
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

function useResultStorage(): ResultStorage {
  const pageData = usePageData();
  return useMemo(() => {
    const { publicUser } = pageData;
    return openResultStorage({
      type: "private",
      userId: publicUser.id,
    });
  }, [pageData]);
}
