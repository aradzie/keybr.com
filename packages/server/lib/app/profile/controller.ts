import { controller, http, pathParam } from "@fastr/controller";
import { Context } from "@fastr/core";
import { injectable } from "@fastr/invert";
import { type NamedUser } from "@keybr/pages-shared";
import { pProfileOwner } from "../auth/index.ts";

@injectable()
@controller()
export class Controller {
  constructor() {}

  @http.GET("/_/profile/{id:[a-zA-Z0-9]+}")
  async getProfile(
    ctx: Context,
    @pathParam("id", pProfileOwner) profileOwner: NamedUser,
  ) {
    ctx.response.body = profileOwner;
  }
}
