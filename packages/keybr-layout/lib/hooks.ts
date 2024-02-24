import { useIntlDisplayNames } from "@keybr/intl";
import { type Language } from "./language.ts";
import { type Layout } from "./layout.ts";

export const useFormattedNames = () => {
  const dn = useIntlDisplayNames();
  const formatLanguageName = (language: Language): string => {
    return dn.formatLanguageName(language.id);
  };
  const formatLayoutName = (layout: Layout): string => {
    return layout.name.replaceAll(/\{([-A-Z]+)\}/g, (regionId) => {
      return dn.formatRegionName(regionId.substring(1, regionId.length - 1));
    });
  };
  const formatFullLayoutName = (layout: Layout): string => {
    return `${formatLanguageName(layout.language)}/${formatLayoutName(layout)}`;
  };
  return {
    formatLanguageName,
    formatLayoutName,
    formatFullLayoutName,
  };
};
