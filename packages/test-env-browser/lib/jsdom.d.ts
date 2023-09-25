declare module "jsdom" {
  class JSDOM {
    constructor(
      html?: string | Buffer | ArrayBufferLike | NodeJS.ArrayBufferView,
      options?: Options,
    );

    readonly window: DOMWindow;
  }

  type Options = {
    url?: string;
    contentType?: string;
    pretendToBeVisual?: boolean;
  };

  type DOMWindow = {
    [key: string]: any;

    indexedDB: any;

    Window: typeof Window;
    readonly top: DOMWindow;
    readonly self: DOMWindow;
    readonly window: DOMWindow;

    /* ECMAScript Globals */
    globalThis: DOMWindow;
  } & Omit<Window, "top" | "self" | "window">;
}
