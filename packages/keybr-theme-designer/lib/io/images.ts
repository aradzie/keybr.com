export const imageTypes = {
  "image/svg+xml": [".svg"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
} as const;

export const imageExt = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
} as const;

export const acceptImageTypes = Object.keys(imageTypes).join(",");

export function acceptsImageType(type: string): boolean {
  return Object.keys(imageTypes).some((key) => type.startsWith(key));
}
