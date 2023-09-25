export type Entrypoint = {
  readonly scripts: readonly Script[];
  readonly stylesheets: readonly StylesheetLink[];
  readonly preload: readonly Link[];
  readonly prefetch: readonly Link[];
};

export type Script = {
  readonly id?: string;
  readonly src: string;
  readonly type?: "module";
  readonly noModule?: boolean;
  readonly async?: boolean;
  readonly defer?: boolean;
  readonly integrity?: string;
  readonly crossOrigin?: "anonymous" | "use-credentials";
};

export type Link = {
  readonly id?: string;
  readonly href: string;
  readonly rel: string;
  readonly type?: string;
  readonly title?: string;
  readonly sizes?: string;
  readonly as?: string;
  readonly integrity?: string;
  readonly crossOrigin?: "anonymous" | "use-credentials";
};

export type StylesheetLink = Link & {
  readonly rel: "stylesheet";
  readonly title?: string;
};

export type AlternateStylesheetLink = Link & {
  readonly rel: "alternate stylesheet";
  readonly title?: string;
};

export type FavIconLink = Link & {
  readonly rel: "icon" | "apple-touch-icon";
  readonly sizes: string;
};

export type PreloadLink = Link & {
  readonly rel: "preload";
  readonly as:
    | "audio"
    | "document"
    | "fetch"
    | "font"
    | "image"
    | "script"
    | "style"
    | "track"
    | "video";
};
