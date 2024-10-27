import { transform } from "@formatjs/ts-transformer";
import { messageIdHash } from "./lib/intl.js";

export function intlTransformer() {
  return transform({
    removeDefaultMessage: true,
    overrideIdFn: (id) => messageIdHash(id),
  });
}
