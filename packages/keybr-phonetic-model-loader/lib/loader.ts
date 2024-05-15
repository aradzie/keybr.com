import { type Language } from "@keybr/keyboard";
import {
  censor,
  makePhoneticModel,
  type PhoneticModel,
} from "@keybr/phonetic-model";
import { expectType, request } from "@keybr/request";
import { modelAssetPath } from "./assets.ts";

export const loaderImpl: PhoneticModel.Loader = async (
  language: Language,
): Promise<PhoneticModel> => {
  const response = await request
    .use(expectType("application/octet-stream"))
    .GET(modelAssetPath(language))
    .send();
  const body = await response.arrayBuffer();
  const model = makePhoneticModel(language, new Uint8Array(body));
  return censor(model);
};
