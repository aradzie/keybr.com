import { controller, http } from "@fastr/controller";
import { Context } from "@fastr/core";
import { injectable } from "@fastr/invert";
import { type RouterState } from "@fastr/middleware-router";
import { websocket } from "@fastr/middleware-websocket";
import { WebSocketServer } from "ws";
import { type AuthState } from "../auth/index.ts";
import { SessionFactory } from "./session.ts";

@injectable()
@controller()
export class Controller {
  constructor(
    readonly server: WebSocketServer,
    readonly sessions: SessionFactory,
  ) {}

  @http.GET("/_/game/server")
  async connect(ctx: Context<RouterState & AuthState>) {
    const { sessionId, publicUser } = ctx.state;
    websocket(this.server, {
      callback: (webSocket) => {
        this.sessions.connect(webSocket, { id: sessionId, user: publicUser });
      },
    })(ctx, () => Promise.reject());
  }

  @http.GET("/_/game/stats")
  async stats(ctx: Context<RouterState & AuthState>) {
    ctx.response.body = this.sessions.collectStats();
  }
}
