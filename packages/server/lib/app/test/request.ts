import { createServer } from "node:http";
import { after } from "node:test";
import { type BuildableRequest, request } from "@fastr/client";
import { cookies, start } from "@fastr/client-testlib";
import { type Application, type Context, type Middleware } from "@fastr/core";
import { expectJson, type JsonBodyState } from "@fastr/middleware-body";
import { Router } from "@fastr/middleware-router";
import { type SessionState } from "@fastr/middleware-session";
import { User } from "@keybr/database";
import { findUser } from "./sql.ts";

export type TestRequest = {
  /**
   * Sets the currently logged-in user.
   * @param id Either email or numeric user id
   *           or null to log out the current user.
   */
  become(id: number | string | null): Promise<void>;

  /**
   * Returns the currently logged-in user.
   * @return The email of the current user or null if anonymous.
   */
  who(): Promise<string | null>;
} & BuildableRequest;

export function startApp(app: Application): TestRequest {
  const kBecomePath = "/__tests_only_become__";
  const kWhoPath = "/__tests_only_who__";

  app.use(
    new Router()
      .POST(
        kBecomePath,
        expectJson() as Middleware<any>,
        ((ctx: Context<JsonBodyState & SessionState>) => {
          const { id = null } = ctx.state.body;
          if (id != null) {
            ctx.state.session.start();
            ctx.state.session.set("userId", id);
          } else {
            ctx.state.session.destroy();
          }
          ctx.response.body = {};
        }) as Middleware<any>,
      )
      .GET(kWhoPath, ((ctx: Context<SessionState>) => {
        ctx.response.body = {
          id: ctx.state.session.get("userId"),
        };
      }) as Middleware<any>)
      .middleware(),
  );

  const req = request
    .use(start(createTestServer(app.callback())))
    .use(cookies()) as TestRequest;

  req.become = async (id) => {
    const user = id ? await findUser(id) : null;
    const { status } = await req.POST(kBecomePath).send({
      id: user?.id ?? null,
    });
    if (status !== 200) {
      throw new Error();
    }
  };

  req.who = async () => {
    const { status, body } = await req.GET(kWhoPath).send();
    if (status !== 200) {
      throw new Error();
    }
    const json = await body.json<{ id: number }>();
    if (json.id != null) {
      const user = await User.findById(json.id);
      if (user != null) {
        return user.email!;
      }
    }
    return null;
  };

  return req;
}

export function createTestServer(callback: any) {
  const server = createServer(callback);
  after(() => {
    server.close();
  });
  return server;
}
