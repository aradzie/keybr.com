import { ApplicationError } from "@fastr/errors";
import {
  type Adapter,
  handleErrors,
  type HttpRequest,
  type HttpResponse,
  type Middleware,
  request as request0,
} from "@fastr/fetch";
import { ContentType } from "@fastr/headers";

/**
 * Rejects a request if the result has a JSON error response.
 */
export function checkStatus(): Middleware {
  return async (
    request: HttpRequest,
    adapter: Adapter,
  ): Promise<HttpResponse> => {
    const response = await adapter(request);
    if (
      ContentType.tryGet(response.headers)?.type.essence ===
      ApplicationError.MIME_TYPE
    ) {
      const body = await response.json();
      throw (
        ApplicationError.fromErrorBody(body, {
          status: response.status,
        }) ??
        new ApplicationError("Unknown error", {
          status: response.status,
        })
      );
    }
    return response;
  };
}

/**
 * A pre-configure request instance which already uses
 * the most important middleware for error handling.
 */
export const request = request0.use(checkStatus()).use(handleErrors());
