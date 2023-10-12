import { type Codec } from "@keybr/multiplayer-shared";
import { type Transport } from "./transport.ts";

export class WebSocketTransport<ServerMessage, ClientMessage>
  implements Transport<ServerMessage, ClientMessage>
{
  private readonly _listeners = new Set<{
    (event: MessageEvent): void;
    receiver: (...args: any) => void;
  }>();

  constructor(
    private readonly _webSocket: WebSocket,
    private readonly _codec: Codec<ServerMessage, ClientMessage>,
  ) {
    this._webSocket.binaryType = "arraybuffer";
  }

  addReceiver(receiver: (message: ServerMessage) => void): void {
    const listener = (event: MessageEvent): void => {
      let message;
      try {
        message = this._codec.decode(new Uint8Array(event.data));
      } catch (err: any) {
        this.close(4000, err.message);
        throw err;
      }
      receiver(message);
    };
    listener.receiver = receiver;
    this._webSocket.addEventListener("message", listener);
    this._listeners.add(listener);
  }

  removeReceiver(receiver: (message: ServerMessage) => void): void {
    for (const listener of this._listeners) {
      if (listener.receiver === receiver) {
        this._webSocket.removeEventListener("message", listener);
        this._listeners.delete(listener);
      }
    }
  }

  send(message: ClientMessage): void {
    let data;
    try {
      data = this._codec.encode(message);
    } catch (err: any) {
      this.close(4000, err.message);
      throw err;
    }
    this._webSocket.send(data);
  }

  close(code?: number, reason?: string): void {
    this._webSocket.close(code, reason);
  }
}
