export abstract class Asset {
  static async parse(value: string): Promise<Asset> {
    if (value.startsWith("data:")) {
      return new DataUrlAsset(await dataUrlToBlob(value));
    } else {
      return new UrlAsset(value);
    }
  }

  abstract get url(): string;

  abstract format(): Promise<string>;
}

export class UrlAsset extends Asset {
  readonly #url: string;

  constructor(url: string) {
    super();
    this.#url = url;
  }

  override get url() {
    return this.#url;
  }

  override async format() {
    return this.#url;
  }
}

export class DataUrlAsset extends Asset {
  readonly #blob: Blob;
  #url: string | null = null;
  #dataUrl: string | null = null;

  constructor(blob: Blob) {
    super();
    this.#blob = blob;
  }

  get blob() {
    return this.#blob;
  }

  override get url() {
    return (this.#url ??= URL.createObjectURL(this.#blob));
  }

  override async format() {
    return (this.#dataUrl ??= await blobToDataUrl(this.#blob));
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      resolve(String(reader.result));
    });
    reader.addEventListener("error", (ev) => {
      reject(new Error());
    });
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(url: string): Promise<Blob> {
  return fetch(url).then((r) => r.blob());
}
