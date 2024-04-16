import { PublicId } from "@keybr/publicid";
import { expectType, request } from "@keybr/request";
import { type Result } from "@keybr/result";
import { formatMessage, parseFile } from "@keybr/result-io";
import example1Url from "../../assets/example1.stats";
import example2Url from "../../assets/example2.stats";
import example3Url from "../../assets/example3.stats";
import example4Url from "../../assets/example4.stats";
import example5Url from "../../assets/example5.stats";
import { type ProgressListener, type RemoteResultSync } from "./types.ts";

const url = "/_/sync/data";

export class ResultSyncNamedUser implements RemoteResultSync {
  receive(progressListener: ProgressListener): Promise<Result[]> {
    return receive(url, progressListener);
  }

  send(
    results: readonly Result[],
    progressListener: ProgressListener,
  ): Promise<void> {
    return send(url, results, progressListener);
  }

  clear(): Promise<void> {
    return clear(url);
  }
}

export class ResultSyncPublicUser implements RemoteResultSync {
  readonly #userId: string;

  constructor(userId: string) {
    this.#userId = userId;
  }

  receive(progressListener: ProgressListener): Promise<Result[]> {
    return receive(publicUserDataUrl(this.#userId), progressListener);
  }

  async send(
    results: readonly Result[],
    progressListener: ProgressListener,
  ): Promise<void> {
    throw new Error("Disabled");
  }

  async clear(): Promise<void> {
    throw new Error("Disabled");
  }
}

export class ResultSyncAnonymousUser implements RemoteResultSync {
  async receive(progressListener: ProgressListener): Promise<Result[]> {
    throw new Error("Disabled");
  }

  async send(
    results: readonly Result[],
    progressListener: ProgressListener,
  ): Promise<void> {
    throw new Error("Disabled");
  }

  async clear(): Promise<void> {
    throw new Error("Disabled");
  }
}

async function receive(
  path: string,
  progressListener: ProgressListener,
): Promise<Result[]> {
  const response = await request
    .use(expectType("application/octet-stream"))
    .GET(path)
    .on("download-progress", (ev) => {
      progressListener(ev.total ?? 0, ev.loaded);
    })
    .send();
  return [...parseFile(new Uint8Array(await response.arrayBuffer()))];
}

async function send(
  path: string,
  results: readonly Result[],
  progressListener: ProgressListener,
): Promise<void> {
  const buffer = formatMessage(results);
  const response = await request
    .POST(path)
    .on("upload-progress", (ev) => {
      progressListener(ev.total ?? 0, ev.loaded);
    })
    .send(buffer, "application/octet-stream");
  await response.blob(); // Ignore.
}

async function clear(path: string): Promise<void> {
  const response = await request.DELETE(path).send();
  await response.blob(); // Ignore.
}

function publicUserDataUrl(userId: string): string {
  switch (userId) {
    case PublicId.example1.publicId:
      return example1Url;
    case PublicId.example2.publicId:
      return example2Url;
    case PublicId.example3.publicId:
      return example3Url;
    case PublicId.example4.publicId:
      return example4Url;
    case PublicId.example5.publicId:
      return example5Url;
    default:
      return `${url}/${encodeURIComponent(userId)}`;
  }
}
