import {
  type IncomingMessage,
  type OutgoingMessage,
  type Server,
} from "node:http";
import { type Socket } from "node:net";
import { type WebSocketServer } from "ws";

export type Closer = (force: boolean, cb?: (err?: Error) => void) => void;

const kIdle = Symbol();

declare module "net" {
  // eslint-disable-next-line
  interface Socket {
    [kIdle]?: boolean;
  }
}

export function createCloser(
  server: Server,
  webSocketServer: WebSocketServer,
): Closer {
  const sockets = new Set<Socket>();
  let isShuttingDown = false;

  const destroy = (socket: Socket, force: boolean = false): void => {
    if (force || (socket[kIdle] && isShuttingDown)) {
      socket.destroy();
      sockets.delete(socket);
    }
  };

  const closeWebSocketServer = (cb?: (err?: Error) => void): void => {
    for (const client of webSocketServer.clients) {
      client.close(1012);
    }
    webSocketServer.close(cb);
  };

  const onConnection = (socket: Socket): void => {
    socket[kIdle] = true;
    sockets.add(socket);
    socket.on("close", () => {
      sockets.delete(socket);
    });
  };

  const onRequest = (req: IncomingMessage, res: OutgoingMessage): void => {
    const { socket } = req;
    socket[kIdle] = false;
    res.on("finish", () => {
      socket[kIdle] = true;
      destroy(socket);
    });
  };

  const onUpgrade = (req: IncomingMessage, socket: Socket): void => {
    socket[kIdle] = false;
  };

  server.on("connection", onConnection);
  server.on("secureConnection", onConnection);
  server.on("request", onRequest);
  server.on("upgrade", onUpgrade);

  return (force: boolean, cb?: (err?: Error) => void): void => {
    isShuttingDown = true;
    server.close((err) => {
      if (err) {
        if (cb) {
          cb(err);
        }
        return;
      }
      closeWebSocketServer((err) => {
        if (err) {
          if (cb) {
            cb(err);
          }
          return;
        }
        for (const socket of sockets) {
          destroy(socket, force);
        }
        if (cb) {
          cb();
        }
      });
    });
  };
}
