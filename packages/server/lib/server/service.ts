import { type IncomingMessage, Server, ServerResponse } from "node:http";
import { type Socket } from "node:net";
import { userInfo } from "node:os";
import { type Application } from "@fastr/core";
import { injectable } from "@fastr/invert";
import { Logger } from "@keybr/logger";
import { WebSocketServer } from "ws";
import { type Closer, createCloser } from "./closer.ts";

const { pid } = process;
const { username } = userInfo();

@injectable({ singleton: true })
export class Service {
  readonly #server: Server;
  readonly #webSocketServer: WebSocketServer;
  readonly #closer: Closer;

  constructor(server: Server, webSocketServer: WebSocketServer) {
    this.#server = server;
    this.#webSocketServer = webSocketServer;
    this.#closer = createCloser(this.#server, this.#webSocketServer);
  }

  start({ app, port }: { app: Application; port: number }): void {
    const callback = app.callback();
    this.#server.on("request", callback);
    this.#server.on(
      "upgrade",
      (req: IncomingMessage, socket: Socket, head: Buffer) => {
        if (head.length > 0) {
          // Unread head back to the request stream.
          socket.unshift(head);
        }
        const res = new ServerResponse(req);
        res.shouldKeepAlive = false;
        callback(req, res);
      },
    );
    this.#server.listen(port);
    process.on("SIGINT", () => {
      this.stop();
    });
    process.on("SIGTERM", () => {
      this.stop();
    });
    Logger.info("Server started", { pid, port, username });
  }

  stop(): void {
    const graceful = (): void => {
      Logger.info("Server stopped gracefully", { pid });
      process.exit(0);
    };

    const forceful = (): void => {
      Logger.info("Server stopped forcefully", { pid });
      process.exit(0);
    };

    Logger.info("Stopping server...", { pid });

    // Stop accepting new connections.
    this.#closer(false, graceful);

    // There may be open keep-alive connections, force shutdown.
    setTimeout(forceful, 1000);
  }
}
