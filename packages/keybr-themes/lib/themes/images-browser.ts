import chocolateSvg from "../../assets/bg-chocolate.svg";
import coffeeSvg from "../../assets/bg-coffee.svg";
import gardenSvg from "../../assets/bg-garden.svg";
import { UrlAsset } from "./asset.ts";

export const images = {
  chocolate: new UrlAsset(chocolateSvg),
  coffee: new UrlAsset(coffeeSvg),
  garden: new UrlAsset(gardenSvg),
} as const;
