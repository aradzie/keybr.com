import { controller, http } from "@fastr/controller";
import { Context } from "@fastr/core";
import { injectable } from "@fastr/invert";
import { HighScoresFactory } from "@keybr/highscores";
import { mapEntries } from "./model.ts";

@injectable()
@controller()
export class Controller {
  constructor(readonly highScores: HighScoresFactory) {}

  @http.GET("/_/high-scores")
  async getHighScores(ctx: Context) {
    ctx.response.body = await mapEntries([...(await this.highScores.load())]);
  }
}
