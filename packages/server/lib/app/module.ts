import { Application } from "@fastr/core";
import {
  type Binder,
  Container,
  inject,
  type Module,
  provides,
} from "@fastr/invert";
import { compress } from "@fastr/middleware-compress";
import { conditional } from "@fastr/middleware-conditional";
import { SessionHandler } from "@fastr/middleware-session";
import { staticFiles } from "@fastr/middleware-static-files";
import { ManifestModule } from "./assets.ts";
import { AuthModule, loadUser } from "./auth/index.ts";
import { cacheControl } from "./cachecontrol.ts";
import { ErrorHandler } from "./error/index.ts";
import { MailModule } from "./mail/index.ts";
import { gameRoutes, mainRoutes } from "./routes.ts";
import { SessionModule } from "./session.ts";

export const kMain = Symbol();
export const kGame = Symbol();

export class ApplicationModule implements Module {
  configure({ load }: Binder) {
    load(new AuthModule());
    load(new MailModule());
    load(new ManifestModule());
    load(new SessionModule());
  }

  @provides({ id: Application, name: kMain, singleton: true })
  provideMain(
    container: Container,
    @inject("publicDir") publicDir: string,
  ): Application {
    return new Application(container, { behindProxy: true })
      .use(ErrorHandler)
      .use(conditional())
      .use(compress())
      .use(staticFiles(publicDir, { cacheControl }))
      .use(SessionHandler)
      .use(loadUser())
      .use(mainRoutes());
  }

  @provides({ id: Application, name: kGame, singleton: true })
  provideGame(container: Container): Application {
    return new Application(container, { behindProxy: true })
      .use(ErrorHandler)
      .use(SessionHandler)
      .use(loadUser())
      .use(gameRoutes());
  }
}
