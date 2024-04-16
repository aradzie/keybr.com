import { body, controller, http, pathParam } from "@fastr/controller";
import { Context } from "@fastr/core";
import { BadRequestError } from "@fastr/errors";
import { injectable } from "@fastr/invert";
import { type RouterState } from "@fastr/middleware-router";
import { HighScoresFactory } from "@keybr/highscores";
import { type NamedUser } from "@keybr/pages-shared";
import { PublicId } from "@keybr/publicid";
import { type Result } from "@keybr/result";
import { parseMessage } from "@keybr/result-io";
import { UserDataFactory } from "@keybr/result-userdata";
import { type AuthState, pProfileOwner } from "../auth/index.ts";

@injectable()
@controller()
export class Controller {
  constructor(
    readonly highScores: HighScoresFactory,
    readonly userData: UserDataFactory,
  ) {}

  @http.GET("/_/sync/data/{publicId:[a-zA-Z0-9]+}")
  async getPublicData(
    ctx: Context<RouterState & AuthState>,
    @pathParam("publicId", pProfileOwner) profileOwner: NamedUser,
  ) {
    const { id } = profileOwner;
    await this.userData.load(PublicId.of(id)).serve(ctx);
  }

  @http.GET("/_/sync/data")
  async getData(ctx: Context<RouterState & AuthState>) {
    const { id } = ctx.state.requireUser();
    await this.userData.load(new PublicId(id!)).serve(ctx);
  }

  @http.POST("/_/sync/data")
  async postData(
    ctx: Context<RouterState & AuthState>,
    @body.binary(null, { maxLength: 1048576 }) value: Buffer,
  ) {
    const { id } = ctx.state.requireUser();
    const results = await parseResults(value);
    await this.userData.load(new PublicId(id!)).append(results);
    await this.highScores.append(id!, results);
    ctx.response.status = 204;
  }

  @http.DELETE("/_/sync/data")
  async deleteData(ctx: Context<RouterState & AuthState>) {
    const { id } = ctx.state.requireUser();
    await this.userData.load(new PublicId(id!)).delete();
    ctx.response.status = 204;
  }
}

// TODO Parse asynchronously in batches.
// TODO Convert to middleware.
async function parseResults(buffer: Buffer): Promise<Result[]> {
  const results = [];
  try {
    for (const result of parseMessage(buffer)) {
      if (result.validate()) {
        results.push(result);
      }
    }
  } catch (err: any) {
    throw new BadRequestError(err.message);
  }
  return results;
}
