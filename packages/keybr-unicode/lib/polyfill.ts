// Intl.Segmenter was added to Firefox 125.
// Remove this polyfill a few Firefox versions later.

declare const window: any;

if (typeof window === "object") {
  import("@formatjs/intl-segmenter/polyfill").catch((err) => {
    console.error(err);
  });
}
