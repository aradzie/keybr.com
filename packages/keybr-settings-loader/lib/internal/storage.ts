import { request } from "@keybr/request";
import { Settings, type SettingsStorage } from "@keybr/settings";
import { ObjectStorage } from "./objectstore.ts";

export const STORAGE_KEY = "settings";

export function openSettingsStorage(
  userId: string | null,
  json: unknown | null,
): SettingsStorage {
  const storage = new ObjectStorage();
  if (userId != null) {
    return new (class implements SettingsStorage {
      async load(): Promise<Settings> {
        if (json != null) {
          return new Settings(json as any);
        } else {
          const value = storage.get(STORAGE_KEY);
          if (value != null) {
            storage.set(STORAGE_KEY, null);
            const settings = new Settings(value as any);
            await this.send(settings);
            return settings;
          } else {
            return new Settings();
          }
        }
      }

      async store(settings: Settings): Promise<Settings> {
        await this.send(settings);
        return settings;
      }

      async send(settings: Settings): Promise<void> {
        const response = await request
          .PUT("/_/sync/settings")
          .send(settings.toJSON());
        await response.blob(); // Ignore.
      }
    })();
  } else {
    return new (class implements SettingsStorage {
      async load(): Promise<Settings> {
        const value = storage.get(STORAGE_KEY);
        if (value != null) {
          return new Settings(value as any);
        } else {
          const settings = new Settings(undefined, true);
          storage.set(STORAGE_KEY, settings.toJSON());
          return settings;
        }
      }

      async store(settings: Settings): Promise<Settings> {
        storage.set(STORAGE_KEY, settings.toJSON());
        return settings;
      }
    })();
  }
}
