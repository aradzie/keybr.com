import { type Binder, type Module, provides } from "@fastr/invert";
import { type SessionOptions } from "@fastr/middleware-session";
import { FileStore } from "@fastr/middleware-session-file-store";
import { DataDir, Env } from "@keybr/config";

export class SessionModule implements Module {
  configure(binder: Binder): void {}

  @provides({ id: "sessionOptions", singleton: true })
  provideSessionOptions(dataDir: DataDir): SessionOptions {
    return {
      store: new FileStore({
        directory: dataDir.dataPath("sessions"),
      }),
      rolling: true,
      key: Env.getString("COOKIE_NAME", "session"),
      maxAge: Env.getNumber("COOKIE_MAX_AGE", 1209600), // 14 days in seconds
      domain: Env.getString("COOKIE_DOMAIN", ".www.keybr.com"),
      path: Env.getString("COOKIE_PATH", "/"),
      httpOnly: Env.getBoolean("COOKIE_HTTP_ONLY", true),
      secure: Env.getBoolean("COOKIE_SECURE", true),
      sameSite: "Lax",
    } as SessionOptions;
  }
}
