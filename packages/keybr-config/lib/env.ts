import { createPrivateKey, createPublicKey, type KeyObject } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { Logger } from "@keybr/logger";
import { parse } from "dotenv";

export class Env {
  static getFiles(): string[] {
    const env = process.env.NODE_ENV || "development";
    return [
      // First definition wins, so list files in the reversed order.
      join(process.cwd(), `.env.${env}`),
      join(process.cwd(), `.env`),
      `/etc/keybr/env.${env}`,
      `/etc/keybr/env`,
    ];
  }

  static probeFilesSync(paths: readonly string[] = Env.getFiles()): void {
    for (const path of paths) {
      Logger.debug(`Probe dotenv file '${path}'`);
      try {
        if (Env.loadFileSync(path)) {
          Logger.info(`Loaded dotenv file '${path}'`);
        }
      } catch (err: any) {
        Logger.error(err, `Cannot load dotenv file '${path}'`);
      }
    }
  }

  static loadFileSync(path: string): boolean {
    try {
      copyToProcessEnv(parse(readFileSync(path, "utf-8")));
    } catch (err: any) {
      if (err.code === "ENOENT") {
        return false;
      } else {
        throw err;
      }
    }
    return true;
  }

  static getString(name: string, defaultValue?: string): string {
    return Env.getValue(name, defaultValue, String);
  }

  static getNumber(name: string, defaultValue?: number): number {
    return Env.getValue(name, defaultValue, Env.asNumber);
  }

  static getInteger(name: string, defaultValue?: number): number {
    return Env.getValue(name, defaultValue, Env.asInteger);
  }

  static getBoolean(name: string, defaultValue?: boolean): boolean {
    return Env.getValue(name, defaultValue, Env.asBoolean);
  }

  static getPort(name: string, defaultValue?: number): number {
    return Env.getValue(name, defaultValue, Env.asPortNumber);
  }

  static getPath(name: string, defaultValue?: string): string {
    return Env.getValue(name, defaultValue, Env.asPath);
  }

  static getPrivateKey(name: string): KeyObject {
    return Env.getValue(name, undefined, Env.asPrivateKey);
  }

  static getPublicKey(name: string): KeyObject {
    return Env.getValue(name, undefined, Env.asPublicKey);
  }

  static getValue<T>(
    name: string,
    defaultValue: T | undefined,
    parse: (value: string) => T,
  ): T {
    const value = process.env[name];
    if (value == null) {
      if (defaultValue == null) {
        throw new TypeError(`Missing env property '${name}'`);
      }
      return defaultValue;
    }
    try {
      return parse(value);
    } catch (err: any) {
      throw new TypeError(`Invalid env property '${name}': ${err.message}`);
    }
  }

  static asNumber(value: string): number {
    const result = Number(value);
    if (!Number.isFinite(result)) {
      throw new TypeError(`Invalid numeric value '${value}'`);
    }
    return result;
  }

  static asInteger(value: string): number {
    const result = Env.asNumber(value);
    if (!Number.isSafeInteger(result)) {
      throw new TypeError(`Invalid integer value '${value}'`);
    }
    return result;
  }

  static asBoolean(value: string): boolean {
    switch (value) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        throw new TypeError(`Invalid boolean value '${value}'`);
    }
  }

  static asPortNumber(value: string): number {
    const result = Env.asInteger(value);
    if (result < 1 || result > 65535) {
      throw new TypeError(`Invalid port number '${value}'`);
    }
    return result;
  }

  static asPath(value: string): string {
    if (value === "") {
      throw new TypeError(`Empty path string`);
    }
    let path = value;
    if (path === "~") {
      path = homedir();
    } else if (path.startsWith("~/")) {
      path = join(homedir(), path.substring(2));
    }
    return resolve(path);
  }

  static asPrivateKey(value: string | Buffer): KeyObject {
    try {
      return createPrivateKey(value);
    } catch (cause) {
      throw new TypeError(`Cannot parse as a private key`, { cause });
    }
  }

  static asPublicKey(value: string | Buffer): KeyObject {
    try {
      return createPublicKey(value);
    } catch (cause) {
      throw new TypeError(`Cannot parse as a public key`, { cause });
    }
  }
}

function copyToProcessEnv(entries: Record<string, string>): void {
  for (const [key, value] of Object.entries(entries)) {
    if (typeof process.env[key] === "undefined") {
      process.env[key] = value;
    }
  }
}
