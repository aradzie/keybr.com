import { type IntlShape } from "react-intl";

export const intlMemo = <T>(key: symbol, factory: (intl: IntlShape) => T) => {
  return (intl: IntlShape): T => {
    let v = (intl as any)[key];
    if (v == null) {
      (intl as any)[key] = v = factory(intl);
    }
    return v;
  };
};
