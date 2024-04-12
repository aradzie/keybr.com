import { Language } from "@keybr/keyboard";
import AR from "@keybr/phonetic-model/assets/model-ar.data";
import BE from "@keybr/phonetic-model/assets/model-be.data";
import CS from "@keybr/phonetic-model/assets/model-cs.data";
import DE from "@keybr/phonetic-model/assets/model-de.data";
import EL from "@keybr/phonetic-model/assets/model-el.data";
import EN from "@keybr/phonetic-model/assets/model-en.data";
import ES from "@keybr/phonetic-model/assets/model-es.data";
import FA from "@keybr/phonetic-model/assets/model-fa.data";
import FR from "@keybr/phonetic-model/assets/model-fr.data";
import HE from "@keybr/phonetic-model/assets/model-he.data";
import HU from "@keybr/phonetic-model/assets/model-hu.data";
import IT from "@keybr/phonetic-model/assets/model-it.data";
import NB from "@keybr/phonetic-model/assets/model-nb.data";
import NL from "@keybr/phonetic-model/assets/model-nl.data";
import PL from "@keybr/phonetic-model/assets/model-pl.data";
import PT from "@keybr/phonetic-model/assets/model-pt.data";
import RU from "@keybr/phonetic-model/assets/model-ru.data";
import SL from "@keybr/phonetic-model/assets/model-sl.data";
import SV from "@keybr/phonetic-model/assets/model-sv.data";
import TR from "@keybr/phonetic-model/assets/model-tr.data";
import UK from "@keybr/phonetic-model/assets/model-uk.data";

export function modelAssetPath(language: Language): string {
  switch (language) {
    case Language.AR:
      return AR;
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
    case Language.FA:
      return FA;
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
