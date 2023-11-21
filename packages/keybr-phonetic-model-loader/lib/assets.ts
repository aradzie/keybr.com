import { Language } from "@keybr/layout";
import langDeData from "@keybr/phonetic-model/assets/lang-de.data";
import langEnData from "@keybr/phonetic-model/assets/lang-en.data";
import langEsData from "@keybr/phonetic-model/assets/lang-es.data";
import langFrData from "@keybr/phonetic-model/assets/lang-fr.data";
import langItData from "@keybr/phonetic-model/assets/lang-it.data";
import langPlData from "@keybr/phonetic-model/assets/lang-pl.data";
import langPtData from "@keybr/phonetic-model/assets/lang-pt.data";
import langRuData from "@keybr/phonetic-model/assets/lang-ru.data";
import langUkData from "@keybr/phonetic-model/assets/lang-uk.data";

export function modelAssetPath(language: Language): string {
  switch (language) {
    case Language.DE:
      return langDeData;
    case Language.EN:
      return langEnData;
    case Language.ES:
      return langEsData;
    case Language.FR:
      return langFrData;
    case Language.IT:
      return langItData;
    case Language.PL:
      return langPlData;
    case Language.PT:
      return langPtData;
    case Language.RU:
      return langRuData;
    case Language.UK:
      return langUkData;
    default:
      throw new Error();
  }
}
