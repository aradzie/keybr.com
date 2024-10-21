import { type Context, type HandlerObject, type Next } from "@fastr/core";
import { ApplicationError, type ErrorBody } from "@fastr/errors";
import { injectable } from "@fastr/invert";
import {
  isClientError,
  isServerError,
  statusMessage as statusMessageOf,
} from "@fastr/status";
import { Logger } from "@keybr/logger";
import {
  type ErrorDetails,
  ErrorPage,
  inspectError,
  View,
} from "@keybr/pages-server";

@injectable()
export class ErrorHandler implements HandlerObject {
  constructor(readonly view: View) {}

  async handle(ctx: Context, next: Next): Promise<void> {
    try {
      await next();
    } catch (err: any) {
      if (
        "code" in err &&
        (err.code === "ECONNRESET" || err.code === "EPIPE")
      ) {
        ctx.request.req.destroy();
        ctx.response.res.destroy();
      } else {
        this.handleError(ctx, err);
      }
      return;
    }

    if (ctx.response.body == null) {
      const { statusCode, statusMessage = statusMessageOf(statusCode) } =
        ctx.response.res;
      if (isClientError(statusCode) || isServerError(statusCode)) {
        this.report(ctx, {
          expose: true,
          status: statusCode,
          message: statusMessage,
        });
      }
    }
  }

  handleError(ctx: Context, err: Error): void {
    const { method, url, headers } = ctx.request.req;
    const req = { method, url, headers };
    if (err instanceof ApplicationError) {
      Logger.debug(err, "Application error", req);
      const { status, body } = err;
      ctx.response.status = status;
      ctx.response.body = body;
      ctx.response.type = ApplicationError.MIME_TYPE;
    } else {
      const details = inspectError(err);
      if (details == null) {
        Logger.error(err, "Unknown error", req);
      } else {
        if (isServerError(details.status)) {
          Logger.error(err, "Server error", req);
        }
        if (isClientError(details.status)) {
          Logger.debug(err, "Client error", req);
        }
        if (details.expose) {
          this.report(ctx, details);
        } else {
          this.report(ctx, {
            expose: true,
            status: 500,
            message: "Internal Server Error",
          });
        }
      }
    }
  }

  report(ctx: Context, details: ErrorDetails): void {
    const { status, message } = details;
    ctx.response.status = status;
    ctx.response.statusText = message;
    switch (ctx.request.negotiateType("text/html", "application/json")) {
      case "text/html":
        ctx.response.body = this.view.renderPage(<ErrorPage error={details} />);
        ctx.response.type = "text/html";
        break;
      case "application/json":
        ctx.response.body = { error: { message } } satisfies ErrorBody;
        ctx.response.type = ApplicationError.MIME_TYPE;
        break;
      default:
        ctx.response.body = message;
        ctx.response.type = "text/plain";
        break;
    }
  }
}
