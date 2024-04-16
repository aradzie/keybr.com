import { body, controller, http } from "@fastr/controller";
import { Context } from "@fastr/core";
import { injectable } from "@fastr/invert";
import { type RouterState } from "@fastr/middleware-router";
import { Settings } from "@keybr/settings";
import { SettingsDatabase } from "@keybr/settings-database";
import { type AuthState } from "../auth/index.ts";

@injectable()
@controller()
export class Controller {
  constructor(readonly database: SettingsDatabase) {}

  @http.GET("/_/sync/settings")
  async getSettings(ctx: Context<RouterState & AuthState>) {
    const user = ctx.state.requireUser();
    ctx.response.body = (await this.database.get(user.id!))?.toJSON() ?? {};
    ctx.response.headers.set("Cache-Control", "private, no-cache");
  }

  @http.PUT("/_/sync/settings")
  async putSettings(
    ctx: Context<RouterState & AuthState>,
    @body.json(null, { maxLength: 65536 }) value: unknown,
  ) {
    const user = ctx.state.requireUser();
    await this.database.set(user.id!, new Settings(value as any));
    ctx.response.status = 204;
  }

  @http.DELETE("/_/sync/settings")
  async deleteSettings(ctx: Context<RouterState & AuthState>) {
    const user = ctx.state.requireUser();
    await this.database.set(user.id!, null);
    ctx.response.status = 204;
  }
}
