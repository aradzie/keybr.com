import { createHash } from "node:crypto";
import { type Context } from "@fastr/core";
import { type PublicId } from "@keybr/publicid";
import { type Result } from "@keybr/result";
import { fileChunk, fileHeader, parseFile } from "@keybr/result-io";
import { rename, type Stats } from "@sosimple/fsx";
import { File } from "@sosimple/fsx-file";

export class UserData {
  constructor(
    readonly id: PublicId,
    readonly file: File,
  ) {}

  async serve(ctx: Context): Promise<void> {
    try {
      const stats = await this.file.stat();
      const content = this.file.readStream();
      const etag = this.etag(stats);
      ctx.response.length = stats.size;
      ctx.response.body = content;
      ctx.response.etag = etag;
      ctx.state.compress = false;
    } catch (err: any) {
      if (err.code === "ENOENT") {
        ctx.response.body = Buffer.alloc(0);
        ctx.response.etag = this.etag(null);
      } else {
        throw err;
      }
    }
    // The order of statements is important here.
    // Calling `attachment(...)` will overwrite type,
    // so `type = ...` must come last.
    ctx.response.type = "application/octet-stream";
    ctx.response.headers.set(
      "Content-Disposition",
      `attachment; filename="stats.data"`,
    );
    ctx.response.headers.set("Cache-Control", "private, no-cache");
  }

  async exists(): Promise<boolean> {
    return await this.file.exists();
  }

  async *read(): AsyncIterable<Result> {
    if (await this.exists()) {
      const buffer = await this.file.read();
      for (const result of parseFile(buffer)) {
        yield result;
      }
    }
  }

  async append(results: readonly Result[]): Promise<void> {
    if (results.length > 0) {
      await this.file.append(fileHeader(), { flag: "ax" });
      for (const chunk of partition(results)) {
        await this.file.append(fileChunk(chunk), { flag: "a" });
      }
    }
  }

  async delete(): Promise<void> {
    if (await this.file.exists()) {
      let count = 1;
      while (true) {
        const candidate = new File(this.file.name + "~" + count);
        if (await candidate.exists()) {
          count += 1;
        } else {
          await rename(this.file.name, candidate.name);
          break;
        }
      }
    }
  }

  etag(stats: Stats | null): string {
    const hash = createHash("md5");
    hash.update(String(this.id));
    if (stats != null) {
      hash.update(String(stats.size));
      hash.update(String(stats.mtime));
    } else {
      hash.update("empty");
    }
    return hash.digest("hex");
  }
}

function* partition<T>(
  results: readonly T[],
  size: number = 100,
): Iterable<T[]> {
  let offset = 0;
  while (offset < results.length) {
    yield results.slice(offset, offset + size);
    offset += size;
  }
}
