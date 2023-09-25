import { type BuildableRequest, request } from "@fastr/client";
import { cookies, start } from "@fastr/client-testlib";
import { type Application, type Context, type Middleware } from "@fastr/core";
import { expectJson, type JsonBodyState } from "@fastr/middleware-body";
import { Router } from "@fastr/middleware-router";
import { type SessionState } from "@fastr/middleware-session";
import { User } from "@keybr/database";
import { type AuthState } from "../auth/index.ts";
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
  // Augment application with extra debugging routes.

  // Helper route.
  const becomeRoute: Middleware<any> = (
    ctx: Context<JsonBodyState & SessionState & AuthState>, //
  ): void => {
    const { id = null } = ctx.state.body;
    if (id != null) {
      ctx.state.session.start();
      ctx.state.session.set("userId", id);
    } else {
      ctx.state.session.destroy();
    }
    ctx.response.body = {};
  };

  // Helper route.
  const whoRoute: Middleware<any> = (
    ctx: Context<SessionState & AuthState>, //
  ): void => {
    ctx.response.body = {
      id: ctx.state.session.get("userId"),
    };
  };

  app.use(
    new Router()
      .POST("/__tests_only_become__", expectJson() as any, becomeRoute)
      .GET("/__tests_only_who__", whoRoute)
      .middleware(),
  );

  // Augment request with extra debug methods.

  const req = request.use(start(app.callback())).use(cookies()) as TestRequest;

  // Helper function.
  const become = async (id: number | string | null): Promise<void> => {
    const user = id ? await findUser(id) : null;
    const { status } = await req.POST("/__tests_only_become__").send({
      id: user?.id ?? null,
    });
    if (status !== 200) {
      throw new Error();
    }
  };

  // Helper function.
  const who = async (): Promise<string | null> => {
    const { status, body } = await req.GET("/__tests_only_who__").send();
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

  req.become = become;
  req.who = who;

  return req;
}
