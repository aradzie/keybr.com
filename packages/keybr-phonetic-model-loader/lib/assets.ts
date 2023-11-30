import { Language } from "@keybr/layout";
import langBeData from "@keybr/phonetic-model/assets/lang-be.data";
import langCsData from "@keybr/phonetic-model/assets/lang-cs.data";
import langDeData from "@keybr/phonetic-model/assets/lang-de.data";
import langEnData from "@keybr/phonetic-model/assets/lang-en.data";
import langEsData from "@keybr/phonetic-model/assets/lang-es.data";
import langFrData from "@keybr/phonetic-model/assets/lang-fr.data";
import langItData from "@keybr/phonetic-model/assets/lang-it.data";
import langPlData from "@keybr/phonetic-model/assets/lang-pl.data";
import langPtData from "@keybr/phonetic-model/assets/lang-pt.data";
import langRuData from "@keybr/phonetic-model/assets/lang-ru.data";
import langSlData from "@keybr/phonetic-model/assets/lang-sl.data";
import langSvData from "@keybr/phonetic-model/assets/lang-sv.data";
import langUkData from "@keybr/phonetic-model/assets/lang-uk.data";

export function modelAssetPath(language: Language): string {
  switch (language) {
    case Language.BE:
      return langBeData;
    case Language.CS:
      return langCsData;
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
    case Language.SL:
      return langSlData;
    case Language.SV:
      return langSvData;
    case Language.UK:
      return langUkData;
    default:
      throw new Error();
  }
}
