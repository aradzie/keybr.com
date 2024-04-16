import { injectable } from "@fastr/invert";
import { Game } from "@keybr/multiplayer-server";
import { ServerCodec, type ServerMessage } from "@keybr/multiplayer-shared";
import { type AnyUser } from "@keybr/pages-shared";
import WebSocket from "ws";

export type ClientInfo = {
  readonly id: string;
  readonly user: AnyUser;
};

@injectable({ singleton: true })
export class SessionFactory {
  constructor(readonly game: Game) {}

  connect(webSocket: WebSocket, { id, user }: ClientInfo): void {
    const onError = (error: Error): void => {
      webSocket.close(1011);
    };

    try {
      webSocket.binaryType = "arraybuffer";

      const codec = new ServerCodec();

      const callback = (error?: Error): void => {
        if (error != null) {
          onError(error);
        }
      };

      const ping = (data?: unknown, mask?: boolean): void => {
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.ping(data, mask, callback);
        }
      };

      const pong = (data?: unknown, mask?: boolean): void => {
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.pong(data, mask, callback);
        }
      };

      const send = (message: ServerMessage): void => {
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(codec.encode(message), callback);
        }
      };

      const close = (code?: number, data?: string): void => {
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.close(code, data);
        }
      };

      const terminate = (): void => {
        webSocket.terminate();
      };

      const client = this.game.joinPlayer({
        id,
        user,
        ping,
        pong,
        send,
        close,
        terminate,
      });

      const onClose = (code: number, reason: string): void => {
        try {
          client.onClose(code, reason);
        } catch (err) {
          onError(err as Error);
        }
      };

      const onPing = (data: ArrayBuffer): void => {
        try {
          client.onPing(data);
        } catch (err) {
          onError(err as Error);
        }
      };

      const onPong = (data: ArrayBuffer): void => {
        try {
          client.onPong(data);
        } catch (err) {
          onError(err as Error);
        }
      };

      const onMessage = (data: ArrayBuffer): void => {
        try {
          client.onMessage(codec.decode(new Uint8Array(data)));
        } catch (err) {
          onError(err as Error);
        }
      };

      webSocket.on("error", onError);
      webSocket.on("close", onClose);
      webSocket.on("ping", onPing);
      webSocket.on("pong", onPong);
      webSocket.on("message", onMessage);
    } catch (err) {
      onError(err as Error);
    }
  }

  collectStats() {
    return this.game.collectStats();
  }
}
