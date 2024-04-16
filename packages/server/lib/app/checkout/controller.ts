import {
  type PaddleSdkPaymentRefundedEvent,
  type PaddleSdkPaymentSucceededEvent,
  PaddleSdkWebhookEventType,
} from "@devoxa/paddle-sdk";
import { body, controller, http } from "@fastr/controller";
import { Context } from "@fastr/core";
import { injectable } from "@fastr/invert";
import { type RouterState } from "@fastr/middleware-router";
import { User } from "@keybr/database";
import { Logger } from "@keybr/logger";
import { PublicId } from "@keybr/publicid";
import { type AuthState } from "../auth/index.ts";
import { type Metadata, PaddleConfig } from "./config.ts";

/**
 * Paddle sends:
 *
 * - *Fulfillment Webhooks* – generated during order processing for one-time
 *   products or subscription plans.
 * - *Alert Webhooks* – triggered by events in the Paddle platform, for example
 *   a successful payment or a balance transfer to your bank account.
 *
 * Alert webhooks are all sent to the same endpoint, defined in Alert Settings.
 * The fulfillment webhook endpoint is set individually for each product with
 * webhook fulfillment enabled.
 *
 * @see https://developer.paddle.com/webhook-reference/intro
 */
@injectable()
@controller()
export class Controller {
  constructor(readonly config: PaddleConfig) {}

  /**
   * The fulfillment webhook is triggered when an order is processed for a
   * product or plan with webhook fulfillment enabled.
   */
  @http.POST("/_/checkout/paddle-fulfillment")
  async paddleFulfillmentWebhook(
    ctx: Context<RouterState & AuthState>,
    @body.form() value: unknown,
  ): Promise<void> {
    ctx.response.status = 200;
    ctx.response.body = "OK";
    ctx.response.type = "text/plain";
  }

  /**
   * The alert webhook is triggered by events in the Paddle platform, for
   * example a successful payment.
   */
  @http.POST("/_/checkout/paddle-alert")
  async paddleAlertsWebhook(
    ctx: Context<RouterState & AuthState>,
    @body.form() value: unknown,
  ): Promise<void> {
    const paddle = this.config.newPaddle();

    // Parse.

    let event;
    try {
      event = paddle.parseWebhookEvent(value);
    } catch (err: any) {
      Logger.error(err, "Paddle event parse error");
      ctx.response.status = 403;
      ctx.response.body = String(err);
      ctx.response.type = "text/plain";
      return;
    }

    // Process.

    try {
      if (event != null) {
        switch (event.eventType) {
          case PaddleSdkWebhookEventType.PAYMENT_SUCCEEDED:
            await this.handlePaymentSucceededEvent(event);
            break;
          case PaddleSdkWebhookEventType.PAYMENT_REFUNDED:
            await this.handlePaymentRefundedEvent(event);
            break;
          default:
            Logger.warn("Unsupported Paddle event", event);
            break;
        }
      } else {
        Logger.warn("Unsupported Paddle event");
      }
    } catch (err: any) {
      Logger.error(err, "Paddle event processing error");
      ctx.response.status = 500;
      ctx.response.body = String(err);
      ctx.response.type = "text/plain";
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = "OK";
    ctx.response.type = "text/plain";
  }

  async handlePaymentSucceededEvent(
    event: PaddleSdkPaymentSucceededEvent<Metadata>,
  ): Promise<void> {
    const id = userIdOf(event);
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
      id: event.checkoutId,
      createdAt: event.eventTime,
      name: event.customerName || null,
      email: event.customerEmail || null,
    });
  }

  async handlePaymentRefundedEvent(
    event: PaddleSdkPaymentRefundedEvent<Metadata>,
  ): Promise<void> {
    // Do nothing.
  }
}

function userIdOf({
  metadata: { id },
}: {
  readonly metadata: Metadata;
}): number | null {
  try {
    return PublicId.of(id).id;
  } catch {
    return null;
  }
}
