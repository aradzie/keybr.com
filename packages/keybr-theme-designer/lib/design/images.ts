export const fileTypes = {
  "image/svg+xml": [".svg"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
} as const;

export const acceptFileTypes = Object.keys(fileTypes).join(",");

export function acceptsFileType(type: string): boolean {
  return Object.keys(fileTypes).some((key) => type.startsWith(key));
}
