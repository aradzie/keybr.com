import { Server } from "node:http";
import { type Binder, type Module } from "@fastr/invert";
import { WebSocketServer } from "ws";

export class ServerModule implements Module {
  configure({ bind }: Binder): void {
    bind(Server).toValue(new Server());
    bind(WebSocketServer).toValue(new WebSocketServer({ noServer: true }));
  }
}
