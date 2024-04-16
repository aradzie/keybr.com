import { type Transport } from "./transport.ts";

export class FakeTransport<ServerMessage, ClientMessage>
  implements Transport<ServerMessage, ClientMessage>
{
  closed: boolean = false;
  incoming: Array<ServerMessage> = [];
  outgoing: Array<ClientMessage> = [];
  receivers: ((message: ServerMessage) => void)[] = [];

  transmit(message: ServerMessage): void {
    this.#checkClosed();
    this.incoming.push(message);
    for (const receiver of this.receivers) {
      receiver(message);
    }
  }

  addReceiver(receiver: (message: ServerMessage) => void): void {
    this.receivers.push(receiver);
  }

  removeReceiver(receiver: (message: ServerMessage) => void): void {
    for (let i = 0; i < this.receivers.length; i++) {
      if (this.receivers[i] === receiver) {
        this.receivers.splice(i, 1);
      }
    }
  }

  send(message: ClientMessage): void {
    this.#checkClosed();
    this.outgoing.push(message);
  }

  close(code?: number, reason?: string): void {
    this.closed = true;
  }

  #checkClosed(): void {
    if (this.closed) {
      throw new Error("Closed");
    }
  }
}
