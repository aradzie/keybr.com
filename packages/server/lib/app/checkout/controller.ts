import { body, controller, http } from "@fastr/controller";
import { Context } from "@fastr/core";
import { injectable } from "@fastr/invert";
import { type RouterState } from "@fastr/middleware-router";
import { User } from "@keybr/database";
import { Logger } from "@keybr/logger";
import { PublicId } from "@keybr/publicid";
import { EventName, TransactionCompletedEvent } from "@paddle/paddle-node-sdk";
import { type AuthState } from "../auth/index.ts";
import { PaddleConfig } from "./config.ts";

@injectable()
@controller()
export class Controller {
  constructor(readonly config: PaddleConfig) {}

  @http.POST("/_/checkout")
  async checkout(
    ctx: Context<RouterState & AuthState>,
    @body.text(null, { expectType: "application/json" }) payload: string,
  ): Promise<void> {
    const paddle = this.config.makePaddle();

    // Parse.

    let event = null;
    const signature = ctx.request.headers.get("paddle-signature");
    if (payload && signature) {
      try {
        event = await paddle.webhooks.unmarshal(
          payload,
          this.config.secretKey,
          signature,
        );
      } catch (err: any) {
        Logger.error(err, "Paddle notification parse error");
      }
    }
    if (!event) {
      ctx.response.status = 400;
      ctx.response.body = "Invalid notification";
      ctx.response.type = "text/plain";
      return;
    }

    // Process.

    try {
      switch (event.eventType) {
        case EventName.TransactionCompleted:
          await this.handleTransactionCompleted(event);
          break;
      }
    } catch (err: any) {
      Logger.error(err, "Paddle notification processing error");
      ctx.response.status = 500;
      ctx.response.body = String(err);
      ctx.response.type = "text/plain";
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = "OK";
    ctx.response.type = "text/plain";
  }

  async handleTransactionCompleted(
    event: TransactionCompletedEvent,
  ): Promise<void> {
    Logger.info(`Transaction [${event.data.id}] was completed`);

    const id = userIdOf(event.data);
    if (id == null) {
      throw new Error("Invalid user id");
    }

    const user = await User.findById(id);
    if (user == null) {
      throw new Error("Unknown user id");
    }

    await user.$relatedQuery("order").delete();
    await user.$relatedQuery("order").insert({
      provider: "paddle",
      id: event.data.id,
      createdAt: new Date(event.data.createdAt),
      name: null,
      email: null,
    });
  }
}

function userIdOf({
  customData,
}: {
  readonly customData: Record<string, any> | null;
}): number | null {
  const id = customData?.id;
  if (typeof id === "string" && id) {
    try {
      return PublicId.of(id).id;
    } catch {
      // Ignore.
    }
  }
  return null;
}
