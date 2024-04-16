import { type Codec } from "@keybr/multiplayer-shared";
import { type Transport } from "./transport.ts";

export class WebSocketTransport<ServerMessage, ClientMessage>
  implements Transport<ServerMessage, ClientMessage>
{
  readonly #listeners = new Set<{
    (event: MessageEvent): void;
    receiver: (...args: any) => void;
  }>();
  readonly #webSocket: WebSocket;
  readonly #codec: Codec<ServerMessage, ClientMessage>;

  constructor(
    webSocket: WebSocket,
    codec: Codec<ServerMessage, ClientMessage>,
  ) {
    this.#webSocket = webSocket;
    this.#codec = codec;
    this.#webSocket.binaryType = "arraybuffer";
  }

  addReceiver(receiver: (message: ServerMessage) => void): void {
    const listener = (event: MessageEvent): void => {
      let message;
      try {
        message = this.#codec.decode(new Uint8Array(event.data));
      } catch (err: any) {
        this.close(4000, err.message);
        throw err;
      }
      receiver(message);
    };
    listener.receiver = receiver;
    this.#webSocket.addEventListener("message", listener);
    this.#listeners.add(listener);
  }

  removeReceiver(receiver: (message: ServerMessage) => void): void {
    for (const listener of this.#listeners) {
      if (listener.receiver === receiver) {
        this.#webSocket.removeEventListener("message", listener);
        this.#listeners.delete(listener);
      }
    }
  }

  send(message: ClientMessage): void {
    let data;
    try {
      data = this.#codec.encode(message);
    } catch (err: any) {
      this.close(4000, err.message);
      throw err;
    }
    this.#webSocket.send(data);
  }

  close(code?: number, reason?: string): void {
    this.#webSocket.close(code, reason);
  }
}
