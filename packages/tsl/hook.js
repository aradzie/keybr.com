import { fileURLToPath } from "node:url";
import { isTs, isTsx, transpile } from "./transpile.js";

export async function load(url, context, nextLoad) {
  if (url.startsWith("file:")) {
    const fileName = fileURLToPath(url);

    if (isTs(fileName) || isTsx(fileName)) {
      const { source } = await nextLoad(url, {
        ...context,
        format: "module",
      });

      const ts = source.toString();
      const js = await transpile(ts, fileName);

      return {
        format: "module",
        shortCircuit: true,
        source: js,
      };
    }
  }

  return nextLoad(url, context);
}
