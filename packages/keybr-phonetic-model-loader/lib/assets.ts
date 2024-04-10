import { Language } from "@keybr/keyboard";
import BE from "@keybr/phonetic-model/assets/lang-be.data";
import CS from "@keybr/phonetic-model/assets/lang-cs.data";
import DE from "@keybr/phonetic-model/assets/lang-de.data";
import EL from "@keybr/phonetic-model/assets/lang-el.data";
import EN from "@keybr/phonetic-model/assets/lang-en.data";
import ES from "@keybr/phonetic-model/assets/lang-es.data";
import FR from "@keybr/phonetic-model/assets/lang-fr.data";
import HE from "@keybr/phonetic-model/assets/lang-he.data";
import HU from "@keybr/phonetic-model/assets/lang-hu.data";
import IT from "@keybr/phonetic-model/assets/lang-it.data";
import NB from "@keybr/phonetic-model/assets/lang-nb.data";
import NL from "@keybr/phonetic-model/assets/lang-nl.data";
import PL from "@keybr/phonetic-model/assets/lang-pl.data";
import PT from "@keybr/phonetic-model/assets/lang-pt.data";
import RU from "@keybr/phonetic-model/assets/lang-ru.data";
import SL from "@keybr/phonetic-model/assets/lang-sl.data";
import SV from "@keybr/phonetic-model/assets/lang-sv.data";
import TR from "@keybr/phonetic-model/assets/lang-tr.data";
import UK from "@keybr/phonetic-model/assets/lang-uk.data";

export function modelAssetPath(language: Language): string {
  switch (language) {
    case Language.BE:
      return BE;
    case Language.CS:
      return CS;
    case Language.DE:
      return DE;
    case Language.EL:
      return EL;
    case Language.EN:
      return EN;
    case Language.ES:
      return ES;
    case Language.FR:
      return FR;
    case Language.HE:
      return HE;
    case Language.HU:
      return HU;
    case Language.IT:
      return IT;
    case Language.NB:
      return NB;
    case Language.NL:
      return NL;
    case Language.PL:
      return PL;
    case Language.PT:
      return PT;
    case Language.RU:
      return RU;
    case Language.SL:
      return SL;
    case Language.SV:
      return SV;
    case Language.TR:
      return TR;
    case Language.UK:
      return UK;
    default:
      throw new Error();
  }
}
